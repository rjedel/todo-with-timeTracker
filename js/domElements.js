class DomElements {
  constructor() {
    this.appEl = document.querySelector(".todo-app");
    this.apiService = new ApiService();

    this.loadAll();
    this.addEventToNewTaskForm();
  }

  loadAll() {
    this.apiService.getTasks(
        (tasks) => {
          tasks.map(task => {
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

    taskSectionEl.dataset.id = task.id;
    taskSectionEl.dataset.title = task.title;
    taskSectionEl.dataset.description = task.description;
    taskSectionEl.dataset.status = task.status;

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
      finishButton.classList.add("btn", "btn-secondary", "float-right", "close-task");
      finishButton.innerText = "Finish";
      listFirstEl.appendChild(finishButton);

      let addOperationButton = document.createElement("a");
      addOperationButton.classList.add("btn", "btn-secondary", "float-right", "add-operation");
      addOperationButton.innerText = "Add operation";
      listFirstEl.appendChild(addOperationButton);
    }

    this.appEl.appendChild(taskSectionEl);

    this.addEventToLoadOperations(taskSectionEl);

  }

  addEventToNewTaskForm() {
    let formEl = document.querySelector("form.new-task");
    formEl.addEventListener("submit", (event) => {
      event.preventDefault();
      let titleEl = event.currentTarget.querySelector("input[name=title]");
      let descriptionEl = event.currentTarget.querySelector("input[name=description]");

      let task = new Task(titleEl.value, descriptionEl.value, "open");
      this.apiService.saveTask(
          task,
          (savedTask) => {
            this.createTaskElement(savedTask);
            titleEl.value = "";
            descriptionEl.value = "";
          },
          (error) => console.log(error)
      );
    });
  }

  addEventToLoadOperations(taskOperationsElement) {
    const h2Elem = taskOperationsElement.firstElementChild;

    const taskId = taskOperationsElement.dataset.id;

    h2Elem.addEventListener('click', (event) => {
      const clickedElem = event.target;

      if (clickedElem.parentElement.dataset.loaded) {
        return;
      }

      this.apiService.getOperationsForTask(
          taskId,
          operations => {
            operations.forEach(operation => {
              this.createOperationElement(operation, taskOperationsElement);
            });

            clickedElem.parentElement.dataset.loaded = true;
          },
          error => console.log(error));
    });
  }

  createOperationElement(operation, taskOperationsElement) {
    let operationEl = document.createElement("div");
    operationEl.classList.add("list-group-item", "task-operation");
    operationEl.dataset.id = operation.id;
    operationEl.innerText = operation.description;
    taskOperationsElement.appendChild(operationEl);
  }
}

