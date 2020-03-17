const addListInput = document.querySelector('#add-list-input')

const ls = window.localStorage
const lists = ls.getItem('todos') ? JSON.parse(ls.getItem('todos')) : []

function createList (listName) {
  return { id: Date.now().toString(), name: listName, todos: [] }
}

const addNewList = listName => {
  if (listName === '' || listName == null) return
  const newList = createList(listName)
  lists.push(newList)
  ls.setItem('todos', JSON.stringify(lists))
}

const renderLists = lists => {
  const showListContainer = document.querySelector('#show-list-container')
  lists.forEach(list => {
    const divElement = document.createElement('div')
    divElement.appendChild(document.createTextNode(list.name))
    showListContainer.appendChild(divElement)
  })
}

const resetLists = element => {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}

addListInput.addEventListener('keyup', function (event) {
  if (event.keyCode === 13) {
    event.preventDefault()
    addNewList(this.value)
    this.value = null
    // console.log(addListInput.nextSibling.innerHTML)
    resetLists(addListInput.nextElementSibling)
    renderLists(lists)
  }
})

const load = () => renderLists(lists)

load()
