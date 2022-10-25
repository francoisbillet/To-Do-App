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

let todos: Todo[] = [];

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!input?.value) return;

  const newTodo = {
    id: guid(),
    title: input.value,
    completed: false,
  };
  todos.push(newTodo);

  displayTodos(todos);
  input.value = "";

  handleDelete();
  handleModify();
  handleCompletion();
});

const displayTodos = (todos: Todo[]): void => {
  if (list) list.innerHTML = "";
  console.log("todos : ", todos);

  todos.forEach((todo) => {
    const item: HTMLLIElement = document.createElement("li");
    item.setAttribute("data-id", todo.id);
    const label: HTMLLabelElement = document.createElement("label");
    label.textContent = todo.title;
    const checkbox: HTMLInputElement = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    const deleteButton: HTMLButtonElement = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.textContent = "Delete";
    const modifyButton: HTMLButtonElement = document.createElement("button");
    modifyButton.classList.add("modify-button");
    modifyButton.textContent = "Modify";

    item.append(label, checkbox, deleteButton, modifyButton);
    list?.appendChild(item);
  });
};

const handleDelete = (): void => {
  const deleteButtons = document.getElementsByClassName(
    "delete-button"
  ) as HTMLCollectionOf<HTMLButtonElement> | null;

  if (deleteButtons) {
    Array.from(deleteButtons).forEach((deleteButton) => {
      deleteButton.addEventListener("click", (e) => {
        // How to handle these things ?
        const target = e.target as HTMLButtonElement;
        const item = target.parentNode as HTMLLIElement;
        const id = item.getAttribute("data-id");

        todos.splice(
          todos.findIndex((todo) => todo.id === id),
          1
        );

        item.remove();
      });
    });
  }
};

const handleModify = (): void => {
  const modifyButtons = document.getElementsByClassName(
    "modify-button"
  ) as HTMLCollectionOf<HTMLButtonElement> | null;

  if (modifyButtons) {
    Array.from(modifyButtons).forEach((modifyButton) => {
      modifyButton.addEventListener("click", (e) => {
        const target = e.target as HTMLButtonElement;
        const item = target.parentNode as HTMLLIElement;
        const id = item.getAttribute("data-id");

        const todoToModify = todos.filter((todo) => todo.id === id);
        // input Object is possibly null !
        if (!input) return;
        input.value = todoToModify[0].title;
        input?.focus();

        item.remove();
        todos = todos.filter((todo) => todo.id !== id);
      });
    });
  }
};

const handleCompletion = (): void => {
  const checkboxes: NodeListOf<HTMLInputElement> =
    document.querySelectorAll<HTMLInputElement>("input[type=checkbox]");

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", (e) => {
      const target = e.target as HTMLButtonElement;
      const item = target.parentNode as HTMLLIElement;
      const id = item.getAttribute("data-id");

      const todo = todos.find((todo) => todo.id === id);
      if (todo) todo.completed = !todo.completed;
    });
  });
};

const guid = () => {
  const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  //return id of format 'aaaa'-'aaaa'
  return s4() + "-" + s4();
};
