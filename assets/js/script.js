const addListInput = document.querySelector('#add-list-input')
const addTaskInput = document.querySelector('#add-task-input')
const showListContainer = document.querySelector('#show-lists-container')
const showTaskContainer = document.querySelector('#show-tasks-container')

const ls = window.localStorage
let lists = ls.getItem('todos') ? JSON.parse(ls.getItem('todos')) : []
let selectedList = []

const addNewList = listName => {
  if (!listName) return
  const newList = createList(listName)
  lists.push(newList)
  ls.setItem('todos', JSON.stringify(lists))
}

const updateList = (id, value) => {
  // console.log(id, value)
  if (!value) return
  // console.log(id, value)
  const list = lists.filter(list => list.id === String(id))[0]
  list.name = value
  // console.log(list, 'vinet')
  ls.setItem('todos', JSON.stringify(lists))
  // console.log('vineet')
}

const deleteList = id => {
  const list = lists.filter(list => list.id !== String(id))
  lists = list
  // console.log(list)
  ls.setItem('todos', JSON.stringify(lists))
}

const renderLists = lists => {
  lists.forEach(list => {
    const divElement = document.createElement('div')
    const span = document.createElement('span')
    span.textContent = list.name
    divElement.appendChild(span)
    const span1 = document.createElement('span')
    const span2 = document.createElement('span')
    span1.innerHTML = '<i style="float:right; padding-right:10px" class="fa fa-pencil-square-o" aria-hidden="true"></i>'
    span2.innerHTML = '<i style="float:right" class="fa fa-trash" aria-hidden="true"></i>'
    divElement.appendChild(span2)
    divElement.appendChild(span1)

    // console.log(span1.previousElementSibling)
    span.setAttribute('onclick', 'renderSelectedListTasksOnClick(event)')
    span1.setAttribute('onclick', 'editSelectedListOnClick(event)')
    span2.setAttribute('onclick', 'deleteSelectedListOnClick(event)')

    divElement.id = list.id
    divElement.style.padding = '5px'
    showListContainer.appendChild(divElement)
  })
}

addListInput.addEventListener('keyup', function (event) {
  searchList(event)
  if (event.keyCode === 13) {
    event.preventDefault()
    addNewList(this.value)
    this.value = ''
    // console.log(addListInput.nextSibling.innerHTML)
    reset(addListInput.nextElementSibling)
    renderLists(lists)
  }
})

const searchList = event => {
  const searchedList = lists.filter(list => list.name.toLowerCase().startsWith(event.target.value.toLowerCase()))
  reset(addListInput.nextElementSibling)
  renderLists(searchedList)
}

const renderSelectedListTasksOnClick = event => {
  // console.log(event.target.parentNode.parentNode.parentNode)
  document.getElementById('container').removeChild(event.target.parentNode.parentNode.parentNode)
  // reset(document.getElementById('lists-container'))
  selectedList = lists.filter(list => list.id === String(event.target.parentNode.id))[0]
  renderTasks(selectedList)
}

const editSelectedListOnClick = (event) => {
  const parentDiv = event.target.parentNode.parentNode
  // console.log(parentDiv)
  parentDiv.childNodes[1].classList.add('hide')
  parentDiv.childNodes[2].classList.add('hide')
  const input = document.createElement('input')
  input.type = 'text'
  input.value = parentDiv.firstChild.textContent
  parentDiv.replaceChild(input, parentDiv.firstChild)
  input.focus()
  input.addEventListener('keyup', function (event) {
    if (event.keyCode === 13) {
      // console.log(parentDiv.id)
      // console.log(this.value)
      updateList(parentDiv.id, this.value)
      // console.log(event.target.parentNode.parentNode)
      // reset(event.target.parentNode.parentNode)
      // renderLists(lists)
      const span = document.createElement('span')
      span.textContent = this.value
      parentDiv.replaceChild(span, parentDiv.firstChild)
      span.setAttribute('onclick', 'renderSelectedListTasksOnClick(event)')
      parentDiv.childNodes[1].classList.remove('hide')
      parentDiv.childNodes[2].classList.remove('hide')
    }
  })
}

const deleteSelectedListOnClick = (event) => {
  const parentDiv = event.target.parentNode.parentNode.parentNode
  const childDiv = event.target.parentNode.parentNode
  // console.log(childDiv.id)
  deleteList(childDiv.id)
  parentDiv.removeChild(childDiv)
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
  document.getElementById('listName').textContent = selectedList.name
  selectedList.tasks.forEach(task => {
    // console.log('for each task')
    const divElement = document.createElement('div')
    // divElement.appendChild(document.createTextNode(task.name))
    // divElement.id = task.id
    // showTaskContainer.appendChild(divElement)
    const input = document.createElement('input')
    input.type = 'checkbox'
    input.checked = task.completed
    divElement.appendChild(input)
    const span = document.createElement('span')
    span.textContent = task.name
    divElement.appendChild(span)

    const span1 = document.createElement('span')
    const span2 = document.createElement('span')
    const span3 = document.createElement('span')
    span1.innerHTML = '<i style="float:right; padding-right:10px" class="fa fa-pencil-square-o" aria-hidden="true"></i>'
    span2.innerHTML = '<i style="float:right; padding-right:10px" class="fa fa-trash" aria-hidden="true"></i>'
    span3.innerHTML = '<i style="float:right" class="fa fa-arrow-circle-down" aria-hidden="true"></i>'
    divElement.appendChild(span3)
    divElement.appendChild(span2)
    divElement.appendChild(span1)

    input.setAttribute('onclick', 'updateTask(' + selectedList.id + ',event.target.parentNode.id' + ', {completed:' + !input.checked + '})')
    span1.setAttribute('onclick', 'editSelectedTaskOnClick(event, ' + selectedList.id + ')')
    span2.setAttribute('onclick', 'deleteSelectedTaskOnClick(event, ' + selectedList.id + ')')
    // span3.setAttribute('onclick', 'expandTask(event, ' + selectedList.id + ',"task")')
    span3.onclick = event => { expandTask(event, selectedList.id, task) }
    divElement.id = task.id
    divElement.style.padding = '5px'
    showTaskContainer.appendChild(divElement)
  })
}

const expandTask = (event, listId, task) => {
  // console.log(task)
  const parentDiv = event.target.parentNode.parentNode

  if (parentDiv.querySelector('#task-details')) {
    parentDiv.removeChild(parentDiv.lastChild)
    return
  }

  const taskDetailsContainer = document.createElement('div')
  taskDetailsContainer.id = 'task-details'
  taskDetailsContainer.name = 'taskDetails'
  // const taskDetailContainer = document.getElementById('task-details')
  // reset(taskDetailContainer)
  const span = document.createElement('span')
  span.id = 'label'
  span.textContent = 'Notes:'
  // console.log(event.target.parentNode)
  parentDiv.appendChild(taskDetailsContainer)
  taskDetailsContainer.classList.toggle('hide')

  const textArea = document.createElement('textarea')
  textArea.id = 'textArea'
  textArea.textContent = task.note

  const input = document.createElement('input')
  input.id = 'scheduling'
  input.type = 'date'
  input.value = task.scheduled

  const selectList = document.createElement('select')
  selectList.id = 'priority'
  const priorityArr = ['None', 'Low', 'Medium', 'High']

  for (let i = 0; i < priorityArr.length; i++) {
    const option = document.createElement('option')
    option.value = i
    option.text = priorityArr[i]
    selectList.appendChild(option)
  }
  selectList.value = task.priority

  taskDetailsContainer.append(span)
  taskDetailsContainer.appendChild(textArea)
  taskDetailsContainer.appendChild(input)
  taskDetailsContainer.appendChild(selectList)

  textArea.onchange = (event) => { updateTask(listId, parentDiv.id, { note: event.target.value }) }
  input.onchange = (event) => { updateTask(listId, parentDiv.id, { scheduled: event.target.value }) }
  selectList.onchange = (event) => { updateTask(listId, parentDiv.id, { priority: event.target.value }) }
  // textArea.setAttribute('onchange', 'updateTask(' + listId + ',' + 'event.target.parentNode.parentNode.id' + ',{ note:' + event.currentTarget.value + '})')
  // textArea.oninput = function tamp (event) {
  //   console.log(event)
  //   updateTask(listId, parentDiv.id, { note: event.target.value })
  // }
  // updateTask(listId, parentDiv.id, { note: event.target.value })
  // const option = document.createElement('option')

  // taskDetailsContainer.classList.toggle('hide')
}

const updateTask = (listId, taskId, taskObj) => {
  // console.log(listId, taskId, taskObj)
  // console.log(taskObj)
  const task = lists.filter(list => list.id === String(listId))[0].tasks.filter(task => task.id === taskId)[0]
  Object.assign(task, taskObj)
  // console.log(task)
  ls.setItem('todos', JSON.stringify(lists))
  if (Object.keys(taskObj)[0] === 'scheduled' || Object.keys(taskObj)[0] === 'priority') {
    updateOrderofTasks(listId)
  }
}

const updateOrderofTasks = listId => {
  // console.log(listId)
  const taskList = lists.filter(list => list.id === String(listId))[0].tasks
  // console.log(taskList)
  taskList.sort((a, b) => {
    if (a.scheduled > b.scheduled) return 1
    if (b.scheduled > a.scheduled) return -1
    return 0
  })
  taskList.sort((a, b) => b.priority - a.priority)
  console.log(lists)
  reset(addTaskInput.nextElementSibling)
  renderTasks(lists.filter(list => list.id === String(listId))[0])
}

const deleteTask = (listId, taskId) => {
  // console.log(listId, taskId, value)
  const list = lists.filter(list => list.id === String(listId))[0]
  const tasksList = list.tasks.filter(task => task.id !== taskId)
  list.tasks = tasksList
  ls.setItem('todos', JSON.stringify(lists))
}

const editSelectedTaskOnClick = (event, listId) => {
  const parentDiv = event.target.parentNode.parentNode

  for (let i = 0; i < 5; i++) {
    parentDiv.childNodes[i].classList.add('hide')
  }
  // parentDiv.childNodes[0].classList.add('hide')
  // parentDiv.childNodes[1].classList.add('hide')
  // parentDiv.childNodes[2].classList.add('hide')
  // parentDiv.childNodes[3].classList.add('hide')
  // parentDiv.childNodes[4].classList.add('hide')
  // parentDiv.classList.add('hide')

  const input = document.createElement('input')
  input.type = 'text'
  input.value = parentDiv.childNodes[1].textContent
  parentDiv.replaceChild(input, parentDiv.childNodes[1])
  input.focus()
  input.addEventListener('keyup', function (event) {
    if (event.keyCode === 13) {
      updateTask(listId, parentDiv.id, { name: this.value })
      const span = document.createElement('span')
      span.textContent = this.value
      parentDiv.replaceChild(span, parentDiv.childNodes[1])
      // parentDiv.childNodes[0].classList.remove('hide')
      // parentDiv.childNodes[1].classList.remove('hide')
      // parentDiv.childNodes[2].classList.remove('hide')
      // parentDiv.childNodes[3].classList.remove('hide')
      // parentDiv.childNodes[4].classList.remove('hide')
      // parentDiv.classList.remove('hide')
      for (let i = 0; i < 5; i++) {
        parentDiv.childNodes[i].classList.remove('hide')
      }
    }
  })
}

const deleteSelectedTaskOnClick = (event, listId) => {
  const parentDiv = event.target.parentNode.parentNode.parentNode
  const childDiv = event.target.parentNode.parentNode
  // console.log(childDiv.id)
  deleteTask(listId, childDiv.id)
  parentDiv.removeChild(childDiv)
}

addTaskInput.addEventListener('keyup', function (event) {
  if (event.keyCode === 13) {
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
  return { id: Date.now().toString(), name: taskName, scheduled: '32-32-3232', completed: false, priority: 0, note: '' }
}

const load = () => renderLists(lists)
load()
