const trello = document.querySelector('.trello')
//const boards = document.querySelectorAll('.board')
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
		console.log('hidden')
		formAddListItemButton.style.visibility = 'hidden'
	} else {
		console.log('visibly')
		formAddListItemButton.style.visibility = 'visible'
	}
})

//Add card to board
formAddListItemButton.addEventListener('click', event => {
	const listItem = document.createElement('div')
	listItem.classList.add('list-item')
	listItem.setAttribute('draggable', 'true')
	listItem.textContent = formTextArea.value
	lists[0].appendChild(listItem)

	formTextArea.value = ''
	form.style.display = 'none'
	addListItemBtn.style.display = 'block'

})


//delete card by right click 
trello.addEventListener('contextmenu', event => {
	event.preventDefault()
	if (event.target.closest('.list-item')){
		event.target.remove()
	}
})

//create new board on add_board_btn click
function createBoard() {
	const board = document.createElement('div')
	board.classList.add('board')

	const h3 = document.createElement('h3')
	h3.classList.add('board-item', 'title')	
	h3.textContent = 'Enter boards name'
	h3.setAttribute('contenteditable', 'true')
	board.appendChild(h3)

	const list = document.createElement('div')
	list.classList.add('board-item', 'list')
	board.appendChild(list)


	trello.appendChild(board)
	console.log(board)
}
addBoardBtn.addEventListener('click', createBoard)

//clear board title on click
trello.addEventListener('click', event => {

	if (event.target.closest('.title')){
		let title = event.target
		title.textContent = ''
	}
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

	
}

document.addEventListener('dragend', event => {
	if (dragItem){
		dragItem = null
		console.log('dragEnd')
	}
})