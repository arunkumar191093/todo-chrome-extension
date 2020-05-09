let addTask = document.getElementById('addTask'),
  form = document.getElementById('todo-form'),
  inputbox = document.getElementById('task-inputbox'),
  taskList = document.getElementById('task-list'),
  clear = document.getElementById('clear-all'),
  taskArr = [];

form.addEventListener('submit', addItem);
clear.addEventListener('click', () => {
  taskList.innerHTML = "";
  chrome.storage.sync.set({ 'tasks': [] }, function (value) {
  });
})

function setTask(task) {
  let taskObj = {
    id: taskArr.length,
    name: task,
    isChecked: false
  }
  taskArr.push(taskObj);
  insertInList(taskObj);
  taskList.scrollIntoView({
    top: false,
    behavior: 'smooth',
    block: 'end'
  })
  setStorage();
}

function insertInList(task) {
  let item = document.createElement('li');
  item.classList.add('task-item');

  let input = document.createElement('input');
  input.setAttribute('type', 'checkbox');
  input.checked = task.isChecked;
  input.addEventListener('click', toggleItem);

  let label = document.createElement('label');
  label.setAttribute('id', task.id);

  let div = document.createElement('div');
  div.setAttribute('title', task.name);
  div.innerHTML = `${task.name}`;
  label.appendChild(input);
  label.appendChild(div);

  let removeIcon = document.createElement('div');
  removeIcon.classList.add('remove');
  removeIcon.setAttribute('id', task.id);
  removeIcon.innerHTML = "X";
  removeIcon.addEventListener('click', removeItem);
  item.appendChild(label);
  item.appendChild(removeIcon);

  taskList.appendChild(item);
}

function addItem(e) {
  e.preventDefault();
  let task = inputbox.value;
  if (task) {
    setTask(task);
  }
  inputbox.value = "";
}

function removeItem(item) {
  let index = parseInt(item.target.id);
  taskArr.splice(index, 1);
  taskList.innerHTML = "";
  taskArr.map((t) => {
    insertInList(t);
  })
  setStorage();
}

function getTask() {
  chrome.storage.sync.get('tasks', function (data) {
    taskArr = data['tasks'];
    if (taskArr.length) {
      taskArr.map((t) => {
        insertInList(t);
      })
    }
  });
}

function toggleItem(e) {
  let index = parseInt(e.target.parentElement.id);
  let selectedItem = taskArr.filter((t) => {
    return t.id == index;
  });
  selectedItem[0].isChecked = e.target.checked;
  setStorage();
}

function setStorage() {
  chrome.storage.sync.set({ 'tasks': taskArr }, function (value) {
  });
}

getTask();