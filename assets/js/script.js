const addListInput = document.querySelector('#add-list-input')
const addTaskInput = document.querySelector('#add-task-input')
const showListContainer = document.querySelector('#show-list-container')
const showTaskContainer = document.querySelector('#show-tasks-container')

const ls = window.localStorage
const lists = ls.getItem('todos') ? JSON.parse(ls.getItem('todos')) : []
let selectedList = []

const addNewList = listName => {
  if (!listName) return
  const newList = createList(listName)
  lists.push(newList)
  ls.setItem('todos', JSON.stringify(lists))
}

// const updateList = (element, id) => {
//   console.log(element, id)
//   console.log('vineet')
// }

const renderLists = lists => {
  lists.forEach(list => {
    const divElement = document.createElement('div')
    const span = document.createElement('span')
    span.textContent = list.name
    divElement.id = list.id
    divElement.appendChild(span)
    const span1 = document.createElement('span')
    const span2 = document.createElement('span')
    const editIcon = '<i style="float:right; padding-right:5px" class="fa fa-pencil-square-o" aria-hidden="true"></i>'
    const trashIcon = '<i style="float:right" class="fa fa-trash" aria-hidden="true"></i>'
    divElement.appendChild(span2)
    divElement.appendChild(span1)
    span1.innerHTML = editIcon
    span2.innerHTML = trashIcon
    // document.getElementById('editIcon').setAttribute('onclick', console.log('edit'))
    // document.getElementById('trashIcon').setAttribute('onclick', console.log('delete'))
    span.setAttribute('onclick', 'selectedListRenderOnClick(' + span.parentElement.id + ')')
    span1.setAttribute('onclick', 'selectedListEditOnClick(' + span.parentElement.id + ')')
    span2.setAttribute('onclick', 'selectedListDeleteOnClick(' + span.parentElement.id + ')')
    divElement.id = list.id
    showListContainer.appendChild(divElement)
    // divElement.setAttribute('ondblclik', updateList)
  })
}

addListInput.addEventListener('keyup', function (event) {
  if (event.keyCode === 13) {
    event.preventDefault()
    addNewList(this.value)
    this.value = ''
    // console.log(addListInput.nextSibling.innerHTML)
    reset(addListInput.nextElementSibling)
    renderLists(lists)
  }
})

const selectedListRenderOnClick = id => {
  reset(document.getElementById('lists-container'))
  selectedList = lists.filter(list => list.id === String(id))[0]
  renderTasks(selectedList)
}

const selectedListEditOnClick = id => {
  console.log(id)
  // reset(document.getElementById('lists-container'))
  selectedList = lists.filter(list => list.id === String(id))[0]
  const value = selectedList.value
  console.log(value)
  // renderTasks(selectedList)
}
// showListContainer.addEventListener('click', function (event) {
//   event.target.classList.toggle('active-list')
//   // console.log(event.target.id)
//   // console.log(event.target.getAttribute(['data-list-id']))
//   reset(document.getElementById('lists-container'))

//   selectedList = lists.filter(list => list.id === event.target.id)[0]
//   // console.log(selectedList)
//   renderTasks(selectedList)
// })

const addNewTask = taskName => {
  if (!taskName) return
  // console.log(taskList)
  const newTask = createTask(taskName)
  selectedList.tasks.push(newTask)
  // console.log(lists)
  ls.setItem('todos', JSON.stringify(lists))
}

const renderTasks = (selectedList) => {
  // console.log(selectedList)
  document.querySelector('#tasks-container').classList.remove('hide')
  selectedList.tasks.forEach(task => {
    console.log('for each task')
    const divElement = document.createElement('div')
    divElement.appendChild(document.createTextNode(task.name))
    divElement.id = task.id
    showTaskContainer.appendChild(divElement)
  })
}

addTaskInput.addEventListener('keyup', function (event) {
  if (event.keyCode === 13) {
    event.preventDefault()
    // console.log(event.target)
    addNewTask(this.value)
    this.value = ''
    // console.log(addListInput.nextSibling.innerHTML)
    reset(addTaskInput.nextElementSibling)
    renderTasks(selectedList)
  }
})

const reset = element => {
  // console.log(element, 'vinet')
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}

function createList (listName) {
  return { id: Date.now().toString(), name: listName, tasks: [] }
}

function createTask (taskName) {
  return { id: Date.now().toString(), name: taskName }
}

const load = () => renderLists(lists)
load()
