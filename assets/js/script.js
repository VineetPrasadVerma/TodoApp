const addListContainer = document.querySelector('#add-list-container')
const addListInput = document.querySelector('#add-list-input')

const ls = window.localStorage
const lists = ls.getItem('todos') ? JSON.parse(ls.getItem('todos')) : []

function createList (listName) {
  return { id: Date.now().toString(), name: listName, todos: [] }
}

const addNewList = listName => {
  if (listName === '' || listName == null) return console.log(-1)
  const newList = createList(listName)
  lists.push(newList)
  ls.setItem('todos', JSON.stringify(lists))
}

const renderLists = lists => {
  clearLists(addListContainer)
  lists.forEach(list => {
    const listElement = document.createElement('li')
    listElement.appendChild(document.createTextNode(list.name))
    addListContainer.appendChild(listElement)

    listElement.addEventListener('click', function (event) {
      console.log(`${this}`)
    })
  })
}

const clearLists = listContainer => {
  while (listContainer.firstChild) {
    listContainer.removeChild(listContainer.firstChild)
  }
}

addListInput.addEventListener('keyup', function (event) {
  if (event.keyCode === 13) {
    event.preventDefault()
    addNewList(this.value)
    this.value = null
    renderLists(lists)
  }
})

const load = () => renderLists(lists)

load()
