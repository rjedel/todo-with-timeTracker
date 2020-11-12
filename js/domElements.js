class DomElements {
  constructor() {
    this.appEl = document.querySelector(".todo-app");
    this.apiService = new ApiService();

    this.loadAll();
  }

  loadAll() {
    this.apiService.getTasks(
        (tasks) => {
          tasks.map((task) => {
            this.createTaskElement(task);
          });
        },
        (error) => {
          console.log(error);
        }
    );
  }

  createTaskElement(task) {
    let taskSectionEl = document.createElement("section");
    taskSectionEl.classList.add("task");

    let taskHeaderEl = document.createElement("h2");
    taskHeaderEl.innerText = task.title;
    taskSectionEl.appendChild(taskHeaderEl);

    let listEl = document.createElement("ul");
    listEl.classList.add("list-group", "todo");
    taskSectionEl.appendChild(listEl);

    let listFirstEl = document.createElement("li");
    listFirstEl.classList.add("list-group-item", "active", "task-description");
    listFirstEl.innerText = task.description;
    listEl.appendChild(listFirstEl);

    if (task.status === "open") {
      let finishButton = document.createElement("a");
      finishButton.classList.add(
          "btn",
          "btn-secondary",
          "float-right",
          "close-task"
      );
      finishButton.innerText = "Finish";
      listFirstEl.appendChild(finishButton);

      let addOperationButton = document.createElement("a");
      addOperationButton.classList.add(
          "btn",
          "btn-secondary",
          "float-right",
          "add-operation"
      );
      addOperationButton.innerText = "Add operation";
      listFirstEl.appendChild(addOperationButton);
    }

    this.appEl.appendChild(taskSectionEl);
  }
}
