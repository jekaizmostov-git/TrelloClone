const trello = document.querySelector('.trello')

const addBoardBtn = document.querySelector('.add_board_btn')

const addListItemBtn = document.querySelector('.add_listitem_btn')
const form = document.querySelector('.form')

const formCancelButton = form.querySelector('.cancel_btn')
const formAddListItemButton = form.querySelector('.add_list_item_btn')
const formTextArea = form.querySelector('.form-textarea')

const lists = document.querySelectorAll('.list')



//Form appearence on add_listitem_btn click
addListItemBtn.addEventListener('click', event => {
	form.style.display = 'flex'
	formTextArea.value = ''
	addListItemBtn.style.display = 'none'

})

//Form hide on cancel-btn click 
formCancelButton.addEventListener('click', event => {
	form.style.display = 'none'
	addListItemBtn.style.display = 'block'
})

//Show and hide add_btn by input state
formTextArea.addEventListener('input', event => {
	if (formTextArea.value === "") {
		formAddListItemButton.style.visibility = 'hidden'
	} else {
		formAddListItemButton.style.visibility = 'visible'
	}
})

//creagte list-item/card element
function createCard(parentNode,textContent){
	const listItem = document.createElement('div')
	listItem.classList.add('list-item')
	listItem.setAttribute('draggable', 'true')
	listItem.textContent = textContent
	parentNode.appendChild(listItem)	
}

//Add card to board
formAddListItemButton.addEventListener('click', function(e) {
	createCard(lists[0], formTextArea.value)
	formTextArea.value = ''
	form.style.display = 'none'
	addListItemBtn.style.display = 'block'

	loadBoardsToLocalStorage()
})


//delete card or block by right click 
trello.addEventListener('contextmenu', event => {
	event.preventDefault()
	if (event.target.closest('.list-item')){
		const board = event.target.parentNode.parentNode
		event.target.remove()
		boardIsEmpty(board)
		return 
	}
	const board = findValidDropTarget(event.target)
	if (board.querySelector('.delete-board')){
		
		board.remove()
	}
	loadBoardsToLocalStorage()
})

//create new board on add_board_btn click
function createBoard(title, listItems = []) {
	const board = document.createElement('div')
	board.classList.add('board')

	const h3 = document.createElement('h3')
	h3.classList.add('board-item', 'title')	
	h3.textContent = title
	h3.setAttribute('contenteditable', 'true')
	board.appendChild(h3)

	const list = document.createElement('div')
	list.classList.add('board-item', 'list')
	board.appendChild(list)

	if (listItems.length > 0){
		for (item of listItems){
			createCard(list, item)
		}
	}
	boardIsEmpty(board)
	trello.appendChild(board)
}


addBoardBtn.addEventListener('click', function(e){
	createBoard('Enter board name')
	loadBoardsToLocalStorage()
})

//clear board title on click
trello.addEventListener('click', event => {

	if (event.target.closest('.title')){
		let title = event.target
		title.textContent = ''
	}

	loadBoardsToLocalStorage()
})

//min implementation to drag and drop for dinamyc created cards and boards
trello.addEventListener('dragstart', handleDragStart)
trello.addEventListener('dragover', handleDragOver)
trello.addEventListener('drop', handleDrop)

let dragItem = null
function findValidDropTarget(element){
	while(element){
		if (element.classList.contains('board')){
			return element
		}
		if (element.classList.contains('trello')){
			return null
		}
		element = element.parentNode
	}
	return null
}

function handleDragStart(e){
	if (e.target.classList.contains('list-item')){
		dragItem = e.target
	}
}

function handleDragOver(e) {
	const dropZone = findValidDropTarget(e.target)
	if (dropZone){
		e.preventDefault()
	}
}

function handleDrop(e) {
	if (!dragItem) return;

	const dropZone = findValidDropTarget(e.target)
	if (dropZone && dragItem){
		e.preventDefault()
		if (dropZone !== dragItem.parentNode){
			dropZone.querySelector('.list').appendChild(dragItem)
		}
	}
	loadBoardsToLocalStorage()


	document.querySelectorAll('.board').forEach(board => {
		boardIsEmpty(board)
	})
	
}

document.addEventListener('dragend', event => {
	if (dragItem){
		dragItem = null
	}
})

//localStorage
const boardsToSerialize = []
function serializeBoard(board, isFirst = false){
	const title = board.querySelector('.title').textContent
	const listItemsTextContents = []
	board.querySelectorAll('.list-item').forEach( i => listItemsTextContents.push(i.textContent))
	
	return {
		boardTitle: title,
		listItems: listItemsTextContents,
		first: isFirst
	}
}

function loadBoardsToLocalStorage(){
	boardsToSerialize.length = 0

	document.querySelectorAll('.board').forEach(board => {
		if (board.matches(':first-child')){
			boardsToSerialize.push(serializeBoard(board, true))
		} else {
			boardsToSerialize.push(serializeBoard(board))
		}
	})
	localStorage.setItem('dragAndDropApplication', JSON.stringify(boardsToSerialize))
}

function loadBoardsFromLocalStorage(){
	const data = JSON.parse(localStorage.getItem('dragAndDropApplication'))
	if (!data){
		return
	}

	const firstBoard = document.querySelector('.board')
	const dataForFirstBoard = data.filter(board => board.first)[0]

	if (dataForFirstBoard) {
		firstBoard.querySelector('.title').textContent = dataForFirstBoard.boardTitle
		const firstBoardList = firstBoard.querySelector('.list')
		if (data.length > 1 || dataForFirstBoard.listItems.length > 1) {
			firstBoardList.innerHTML = ''
			for (item of dataForFirstBoard.listItems){
				createCard(firstBoardList, item)
			}
		}
	}

	for (let i = 1; i < data.length; i++){
		createBoard(data[i].boardTitle, data[i].listItems)
	}

}

//Add hint on empty board
function addDeleteHintToBoard() {
	const text = document.createElement('p')
	text.classList.add('board-item')
	text.classList.add('delete-board')
	text.setAttribute('draggable', 'false')
	text.textContent = 'Right click to del empty board'

	return text
}



function boardIsEmpty(board) {
	if (board.getAttribute('removable')) {
		return
	}
	if ((board.querySelector('.list').hasChildNodes() === false)){
		if (board.querySelector('.delete-board') === null){
			board.appendChild(addDeleteHintToBoard())
		}
	} else {
		if (board.querySelector('.delete-board')) {
			board.querySelector('.delete-board').remove()
		}
	}

}

window.addEventListener('DOMContentLoaded', loadBoardsFromLocalStorage)

