const addListInput = document.querySelector('#add-list-input')
const addTaskInput = document.querySelector('#add-task-input')
const showListContainer = document.querySelector('#show-lists-container')
const showTaskContainer = document.querySelector('#show-tasks-container')

const localStorage = window.localStorage
let lists = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : []
let selectedList = []

const addNewList = listName => {
  if (!listName) return false
  const newList = createList(listName)
  lists.push(newList)
  localStorage.setItem('todos', JSON.stringify(lists))
  return true
}

const updateList = (id, value) => {
  if (!value) return false
  const list = lists.filter(list => list.id === String(id))[0]
  list.name = value
  localStorage.setItem('todos', JSON.stringify(lists))
  return true
}

const deleteList = id => {
  const filteredList = lists.filter(list => list.id !== String(id))
  lists = filteredList
  localStorage.setItem('todos', JSON.stringify(lists))
}

const renderLists = lists => {
  lists.forEach(list => {
    const divElement = document.createElement('div')
    const span = document.createElement('span')
    span.textContent = list.name
    span.id = 'list-item'
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
    // console.log(event.target.value)
    if (!addNewList(this.value)) {
      addListInput.placeholder = ' Can\'t add empty list'
      return
    }

    this.value = ''
    addListInput.placeholder = ' Search | Add Lists'
    // console.log(addListInput.nextSibling.innerHTML)
    reset(addListInput.nextElementSibling)
    renderLists(lists)
    // console.log(addListInput.nextElementSibling.children[addListInput.nextElementSibling.children.length - 2])
  }
})

const searchList = event => {
  const searchedList = lists.filter(list => list.name.toLowerCase().includes(event.target.value.toLowerCase()))
  reset(addListInput.nextElementSibling)
  renderLists(searchedList)
}

const renderSelectedListTasksOnClick = event => {
  // console.log(event.target.parentNode.parentNode.parentNode)
  // document.getElementById('container').removeChild(event.target.parentNode.parentNode.parentNode)
  // reset(document.getElementById('lists-container'))
  event.target.parentNode.parentNode.parentNode.classList.add('hide')
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
      if (!updateList(parentDiv.id, this.value)) {
        input.placeholder = 'Can\'t set empty name'
        return
      }
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
  if (!taskName) return false
  const newTask = createTask(taskName)
  selectedList.tasks.push(newTask)
  localStorage.setItem('todos', JSON.stringify(lists))
  return true
}

const renderTasks = (selectedList) => {
  document.getElementById('todo-heading').classList.add('hide')
  document.querySelector('#tasks-container').classList.remove('hide')
  document.getElementById('listName').innerHTML = '<span style="float:left;" id="back-button"><i class="fa fa-arrow-circle-left" aria-hidden="true"></i></span>' +
  selectedList.name + '<i style="float:right; color:gray; pointer-Events:none;" id="clear-task-button" class="fa fa-times" aria-hidden="true"></i>'

  // console.log(document.querySelector('#tasks-container').firstElementChild.firstElementChild.firstElementChild)
  // document.querySelector('#tasks-container').firstElementChild.firstElementChild.firstElementChild.onclick = (event) => {
  //   reset(document.getElementById('tasks-container'))
  //   console.log('v')
  //   renderLists(lists)
  // }

  document.getElementById('back-button').onclick = (event) => {
    document.querySelector('#tasks-container').classList.add('hide')
    document.getElementById('todo-heading').classList.remove('hide')
    reset(addListInput.nextElementSibling)
    reset(addTaskInput.nextElementSibling)
    // console.log(document.getElementById('container').children[1])
    document.getElementById('container').children[1].classList.remove('hide')
    renderLists(lists)
  }

  // console.log(document.getElementsByClassName('fa fa-times'))
  document.getElementById('clear-task-button').onclick = event => clearCompletedTask(event, selectedList)

  selectedList.tasks.forEach(task => {
    const divElement = document.createElement('div')

    const input = document.createElement('input')
    input.type = 'checkbox'
    input.checked = task.completed
    divElement.appendChild(input)

    const span = document.createElement('span')
    span.textContent = task.name
    span.id = 'text-item'
    divElement.appendChild(span)

    const span1 = document.createElement('span')
    const span2 = document.createElement('span')
    const span3 = document.createElement('span')
    span1.innerHTML = '<i style="float:right; padding-right:10px" class="fa fa-pencil-square-o" aria-hidden="true"></i>'
    span2.innerHTML = '<i style="float:right; padding-right:10px" class="fa fa-trash" aria-hidden="true"></i>'
    span3.innerHTML = '<i style="float:right;" class="fa fa-arrow-circle-down" aria-hidden="true"></i>'

    divElement.appendChild(span3)
    divElement.appendChild(span2)
    divElement.appendChild(span1)

    if (task.priority === '3') span3.style.color = 'red'
    if (task.priority === '2') span3.style.color = 'orange'
    if (task.priority === '1') span3.style.color = 'green'

    if (input.checked) {
      span.style.textDecoration = 'line-through'
      // for (let i = 1; i < 4; i++) {
      //   span`${i}`.style.pointerEvents = 'none'
      //   span`${i}`.style.color = 'grey'
      // }
      document.getElementById('clear-task-button').style.pointerEvents = 'auto'
      document.getElementById('clear-task-button').style.color = 'black'

      span.classList.add('completed-task')
      span1.classList.add('completed-task')
      span2.classList.add('completed-task')
      span3.classList.add('completed-task')
    }

    input.onclick = (event) => {
      updateTask(selectedList.id, event.target.parentNode.id, { completed: input.checked })
    }

    span1.setAttribute('onclick', 'editSelectedTaskOnClick(event, ' + selectedList.id + ')')
    span2.setAttribute('onclick', 'deleteSelectedTaskOnClick(event, ' + selectedList.id + ')')
    span3.onclick = event => { expandTask(event, selectedList.id, task) }

    divElement.id = task.id
    divElement.style.padding = '5px'
    showTaskContainer.appendChild(divElement)
  })
}

const clearCompletedTask = (event, selectedList) => {
  // let tasks = selectedList.tasks
  // tasks = updatedTasksList
  // console.log(tasks)
  // event.target.parentNode.parentNode.parentNode.classList.add('hide')
  // reset(addTaskInput.nextElementSibling)
  // document.querySelector('#tasks-container').classList.add('hide')
  // reset(addTaskInput.nextElementSibling)
  // console.log(selectedList)
  // console.log(lists)

  selectedList.tasks = selectedList.tasks.filter(task => !task.completed)
  localStorage.setItem('todos', JSON.stringify(lists))
  reset(event.target.parentNode.nextElementSibling.nextElementSibling)
  renderTasks(selectedList)
}

const expandTask = (event, listId, task) => {
  const parentDiv = event.target.parentNode.parentNode

  if (parentDiv.querySelector('#task-details')) {
    parentDiv.removeChild(parentDiv.lastChild)
    return
  }

  const taskDetailsContainer = document.createElement('div')
  taskDetailsContainer.id = 'task-details'
  taskDetailsContainer.name = 'taskDetails'

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
  // console.log(new Date(1584856403195).getFullYear() + '-' + (0 + String(new Date(1584856403195).getMonth() + 1)) + '-' + new Date(1584856403195).getDate())
  // console.log(typeof (new Date(task.scheduled).getFullYear() + '-' + (new Date(task.scheduled).getMonth() + 1) + '-' + new Date(task.scheduled).getDate()))

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

  taskDetailsContainer.appendChild(span)
  taskDetailsContainer.appendChild(textArea)
  taskDetailsContainer.appendChild(input)
  taskDetailsContainer.appendChild(selectList)

  textArea.onchange = (event) => updateTask(listId, parentDiv.id, { note: event.target.value })

  input.onchange = (event) => {
    if (event.target.value === '') {
      updateTask(listId, parentDiv.id, { scheduled: '9999-99-99' })
    } else {
      updateTask(listId, parentDiv.id, { scheduled: event.target.value })
    }
  }

  selectList.onchange = (event) => updateTask(listId, parentDiv.id, { priority: event.target.value })

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
  const task = lists.filter(list => list.id === String(listId))[0].tasks.filter(task => task.id === taskId)[0]
  Object.assign(task, taskObj)
  localStorage.setItem('todos', JSON.stringify(lists))
  if (Object.keys(taskObj)[0] === 'scheduled' || Object.keys(taskObj)[0] === 'priority' || Object.keys(taskObj)[0] === 'completed') {
    updateOrderOfTasks(listId)
  }
}

const updateOrderOfTasks = listId => {
  const taskList = lists.filter(list => list.id === String(listId))[0].tasks
  // console.log(taskList)
  // const nonScheduledLists = taskList.filter(task => task.scheduled === '9999-99-99')
  // console.log(nonScheduledLists, 1)
  // const scheduledLists = taskList.filter(task => task.scheduled !== '9999-99-99')
  // // taskList = scheduledLists.concat(nonScheduledLists)
  // console.log(scheduledLists, 2)

  taskList.sort((a, b) => a.createdAt - b.createdAt)

  taskList.sort((a, b) => {
    if (a.scheduled > b.scheduled) return 1
    if (b.scheduled > a.scheduled) return -1
    return 0
  })

  taskList.sort((a, b) => b.priority - a.priority)

  taskList.sort((a, b) => {
    if (String(a.completed) > String(b.completed)) return 1
    if (String(b.completed) > String(a.completed)) return -1
    return 0
  })

  reset(addTaskInput.nextElementSibling)
  localStorage.setItem('todos', JSON.stringify(lists))
  renderTasks(lists.filter(list => list.id === String(listId))[0])
}

const deleteTask = (listId, taskId) => {
  const list = lists.filter(list => list.id === String(listId))[0]
  const tasksList = list.tasks.filter(task => task.id !== taskId)
  list.tasks = tasksList
  localStorage.setItem('todos', JSON.stringify(lists))
}

const editSelectedTaskOnClick = (event, listId) => {
  const parentDiv = event.target.parentNode.parentNode

  for (let i = 0; i < 5; i++) {
    parentDiv.childNodes[i].classList.add('hide')
  }

  const input = document.createElement('input')
  input.type = 'text'
  input.value = parentDiv.childNodes[1].textContent
  parentDiv.childNodes[1].classList.add('hide')
  // parentDiv.replaceChild(input, parentDiv.childNodes[1])
  parentDiv.appendChild(input)
  input.focus()

  input.addEventListener('keyup', function (event) {
    if (event.keyCode === 13) {
      if (this.value === '') {
        input.placeholder = 'Can\'t add empty task'
        return
      }

      updateTask(listId, parentDiv.id, { name: this.value })
      // const span = document.createElement('span')
      // span.textContent = this.value
      // parentDiv.replaceChild(span, parentDiv.childNodes[1])
      parentDiv.removeChild(input)
      parentDiv.childNodes[1].textContent = this.value

      for (let i = 0; i < 5; i++) {
        parentDiv.childNodes[i].classList.remove('hide')
      }
    }
  })
}

const deleteSelectedTaskOnClick = (event, listId) => {
  const parentDiv = event.target.parentNode.parentNode.parentNode
  const childDiv = event.target.parentNode.parentNode
  deleteTask(listId, childDiv.id)
  parentDiv.removeChild(childDiv)
}

addTaskInput.addEventListener('keyup', function (event) {
  if (event.keyCode === 13) {
    // console.log(event.target)
    if (!addNewTask(this.value)) {
      addTaskInput.placeholder = 'Can\'t add empty task'
      return
    }
    this.value = ''
    addTaskInput.placeholder = 'Add Tasks'
    // console.log(addListInput.nextSibling.innerHTML)
    reset(addTaskInput.nextElementSibling)
    updateOrderOfTasks(selectedList.id)
  }
})

const reset = element => {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}

function createList (listName) {
  return { id: Date.now().toString(), name: listName, tasks: [] }
}

function createTask (taskName) {
  return { id: Date.now().toString(), name: taskName, createdAt: Date.now(), scheduled: '9999-99-99', completed: false, priority: 0, note: '' }
}

const load = () => {
  document.getElementById('lists-container').classList.remove('hide')
  renderLists(lists)
}
load()
