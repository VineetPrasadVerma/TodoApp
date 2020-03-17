const addListInput = document.querySelector('#add-list-input')
const addTaskInput = document.querySelector('#add-task-input')
const showListContainer = document.querySelector('#show-list-container')
const showTaskContainer = document.querySelector('#show-tasks-container')

const ls = window.localStorage
const lists = ls.getItem('todos') ? JSON.parse(ls.getItem('todos')) : []
let selectedList = []

function createList (listName) {
  return { id: Date.now().toString(), name: listName, tasks: [] }
}

function createTask (taskName) {
  return { id: Date.now().toString(), name: taskName }
}

const addNewList = listName => {
  if (!listName) return
  const newList = createList(listName)
  lists.push(newList)
  ls.setItem('todos', JSON.stringify(lists))
}

const renderLists = lists => {
  lists.forEach(list => {
    const divElement = document.createElement('div')
    divElement.appendChild(document.createTextNode(list.name))
    // divElement.dataset.listId = list.id
    divElement.id = list.id
    showListContainer.appendChild(divElement)
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

showListContainer.addEventListener('click', function (event) {
  event.target.classList.toggle('active-list')
  // console.log(event.target.id)
  // console.log(event.target.getAttribute(['data-list-id']))
  reset(document.getElementById('lists-container'))

  selectedList = lists.filter(list => list.id === event.target.id)[0]
  // console.log(selectedList)
  renderTasks(selectedList)
})

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

const load = () => renderLists(lists)
load()
