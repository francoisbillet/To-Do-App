const form = document.querySelector<HTMLFormElement>("#todo-form");
const input = document.getElementById(
  "new-todo-input"
) as HTMLInputElement | null;
const list = document.querySelector<HTMLUListElement>("#list");

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface TodoElement {
  id: string;
  element: HTMLLIElement;
}

let todos: Todo[] = [];
let todoElements: TodoElement[] = [];

form?.addEventListener("submit", (event: SubmitEvent) => {
  event.preventDefault();

  if (!input?.value) return;

  const newTodo: Todo = {
    id: guid(),
    title: input.value,
    completed: false,
  };

  const todoElement: HTMLLIElement = createTodoElement(newTodo);

  // Logic
  todos.push(newTodo);
  todoElements.push({ id: newTodo.id, element: todoElement });
  // End of Logic

  input.value = "";
});

const createTodoElement = (newTodo: Todo): HTMLLIElement => {
  const item: HTMLLIElement = document.createElement("li");
  item.setAttribute("data-id", newTodo.id);
  const label: HTMLLabelElement = document.createElement("label");
  label.textContent = newTodo.title;

  const checkbox: HTMLInputElement = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = newTodo.completed;
  checkbox.addEventListener("change", () => {
    const item = checkbox.parentNode as HTMLLIElement;
    const id = item.getAttribute("data-id");

    // Logic
    const todo = todos.find((todo) => todo.id === id);
    if (todo) todo.completed = !todo.completed;
    // End of Logic
  });

  const deleteButton: HTMLButtonElement = document.createElement("button");
  deleteButton.classList.add("delete-button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", (e: MouseEvent) => {
    const target = e.target as HTMLButtonElement;
    const item = target.parentNode as HTMLLIElement;
    const id = item.getAttribute("data-id");

    item.remove();

    // Delete todo from todos and todoElements
    // Logic
    todos.splice(
      todos.findIndex((todo) => todo.id === id),
      1
    );
    todoElements.splice(
      todoElements.findIndex((todo) => todo.id === id),
      1
    );
    // End of Logic
  });

  const modifyButton: HTMLButtonElement = document.createElement("button");
  modifyButton.classList.add("modify-button");
  modifyButton.textContent = "Modify";
  modifyButton.addEventListener("click", () => {
    const item = modifyButton.parentNode as HTMLLIElement;
    const id = item.getAttribute("data-id");

    const inputModify: HTMLInputElement = document.createElement("input");
    inputModify.setAttribute("type", "text");
    const buttonModify: HTMLButtonElement = document.createElement("button");
    buttonModify.textContent = "Done";

    item.append(inputModify, buttonModify);
    inputModify.focus();

    buttonModify.addEventListener("click", () => {
      label.textContent = inputModify.value;
      inputModify.remove();
      buttonModify.remove();

      // Logic
      const todoToModify = todos.filter((todo) => todo.id === id);
      if (todoToModify) todoToModify[0].title = inputModify.value;
      // End of Logic
    });
  });

  item.append(label, checkbox, deleteButton, modifyButton);
  list?.appendChild(item);
  return item;
};

const guid = (): string => {
  const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  //return id of format 'aaaa'-'aaaa'
  return s4() + "-" + s4();
};
