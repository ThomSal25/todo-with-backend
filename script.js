const inputField = document.querySelector("#new-todo");
const btnAddTodo = document.querySelector("#btn-new-todo");
const btnDelDoneTodo = document.querySelector("#delete-all-done");
const todoList = document.querySelector("#todo-list");
const formElement = document.querySelector("form");


let stateArr = [];

loadTodos();

function loadTodos() {
  fetch("http://localhost:4730/todos")
    .then((response) => response.json())
    .then((todosFromApi) => {
      stateArr = todosFromApi;
      renderTodos();
    });
}

function renderTodos() {
  todoList.innerHTML = "";

  stateArr.forEach((todo) => {
    const newLi = document.createElement("li");
    const text = document.createTextNode(todo.description);
    const check = document.createElement("input");
    check.type = "checkbox";
    check.id = todo.id;

    newLi.appendChild(check);
    newLi.appendChild(text);

    todoList.appendChild(newLi);

    // console.log(todo.done, check.checked);

    if (todo.done === true) {
      check.checked = true;
      newLi.classList.add("is-done")
    }

    check.addEventListener("change", changeDone);
  });
}

function changeDone(event) {
  const liElement = event.target.parentNode;
  liElement.classList.toggle("is-done");
  // console.log(event.target, event.target.id);

  //fetch Put
  updateTodo(event.target.id);
}

function updateTodo(num) {
  // für jedes Child mit passender ID soll "done" getauscht werden true/false
  const liElements = document.querySelectorAll("#todo-list li");
  for (let i = 0; i < liElements.length; i++) {
    if (num === stateArr[i].id.toString()) {
      const updatedTodo = {
        description: `${stateArr[i].description}`,
        done: !stateArr[i].done,
      };

      fetch(`http://localhost:4730/todos/${num}`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(updatedTodo),
      })
        .then((res) => res.json())
        .then((updatedTodoFromApi) => {
          loadTodos();
        });
    }
  }
}

const allOpen = document.querySelector("#all-todos");
const openTodos = document.querySelector("#open-todos");
const doneTodos = document.querySelector("#done-todos");
const todoListElement = document.querySelector("#todo-list");

allOpen.addEventListener("change", showListElement);
openTodos.addEventListener("change", showListElement);
doneTodos.addEventListener("change", showListElement);

function showListElement() {
  //filtern mit CSS
  todoListElement.classList.remove("show-open");
  todoListElement.classList.remove("show-done");
  if (openTodos.checked === true) {
    //add class .show-open --> ul
    todoListElement.classList.add("show-open");
  } else if (doneTodos.checked === true) {
    todoListElement.classList.add("show-done");
  }
}

function hideShow() {
  console.log("👍")
}

btnAddTodo.addEventListener("click", postTodo);

function postTodo() {
  const newTodoText = inputField.value;
  const newTodo = {
    description: newTodoText,
    done: false,
  };

  fetch("http://localhost:4730/todos", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(newTodo),
  })
    .then((response) => response.json())
    .then((newTodoFromApi) => {
      stateArr.push(newTodo);
      renderTodos();
    });
}

btnDelDoneTodo.addEventListener("click", deleteTodo);

function deleteTodo() {
  for (let i = 0; i < stateArr.length; i++) {
    if (stateArr[i].done === true) {
      fetch(`http://localhost:4730/todos/${stateArr[i].id}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then(() => {
          loadTodos();
        });
    }
  }
}
