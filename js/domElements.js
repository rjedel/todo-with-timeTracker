class DomElements {
  constructor() {
    this.appEl = document.querySelector(".todo-app");
    this.apiService = new ApiService();

    this.loadAll();
    this.addEventToNewTaskForm();
    this.addEventToShowNewOperationForm();
    this.addEventToSubmitOperationForm();
    this.addShowAddOperationTime();
    this.addFinishTaskEvent();
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
          savedTask => {
            this.createTaskElement(savedTask);
            titleEl.value = "";
            descriptionEl.value = "";
          },
          error => console.log(error)
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

  addEventToShowNewOperationForm() {
    document.querySelector("div.todo-app").addEventListener("click", event => {
      if (event.target.classList.contains("add-operation")) {
        event.preventDefault();
        let currentEl = event.target;

        let operationFormElParent = currentEl.parentElement.parentElement;
        this.addOperationFormVisibility(operationFormElParent);
      }
    });
  }

  addOperationFormVisibility(taskOperationsElement) {
    if (taskOperationsElement.dataset.operationForm) {
      taskOperationsElement.removeChild(taskOperationsElement.lastElementChild);
      taskOperationsElement.removeAttribute('data-operation-form');
      return;
    }

    taskOperationsElement.dataset.operationForm = true;

    let operationEl = document.createElement("li");
    operationEl.classList.add("list-group-item", "task-operation", "task-operation-form");
    taskOperationsElement.appendChild(operationEl);

    let inputDescription = document.createElement("input");
    inputDescription.setAttribute("type", "text");
    inputDescription.setAttribute("name", "description");
    inputDescription.setAttribute("placeholder", "Operation description");
    inputDescription.classList.add("form-control");
    operationEl.appendChild(inputDescription);

    let inputSubmit = document.createElement("input");
    inputSubmit.setAttribute("type", "submit");
    inputSubmit.setAttribute("value", "Add");
    inputSubmit.classList.add("btn", "btn-primary");
    operationEl.appendChild(inputSubmit);
  }

  addEventToSubmitOperationForm() {
    document.querySelector("div.todo-app").addEventListener("click", event => {
      if (event.target.parentElement.classList.contains("task-operation-form")
          && event.target.classList.contains("btn")) {
        event.preventDefault();
        let currentEl = event.target;
        let description = currentEl.previousElementSibling.value;

        let taskId = currentEl.parentElement.parentElement.parentElement.dataset.id;
        let operation = new Operation(description);

        console.log(operation, taskId);

        this.apiService.addOperationForTask(
            taskId,
            operation,
            savedOperation => {
              this.createOperationElement(operation, currentEl.parentElement.parentElement.parentElement);
              this.addOperationFormVisibility(currentEl.parentElement.parentElement);
            },
            error => console.log(error)
        );
      }
    });
  }

  createOperationElement(operation, taskOperationsElement) {
    let operationEl = document.createElement("div");
    operationEl.classList.add("list-group-item", "task-operation");
    operationEl.dataset.id = operation.id;
    operationEl.dataset.text = operation.description;
    operationEl.dataset.time = operation.timeSpent;
    operationEl.innerText = operation.description;
    taskOperationsElement.appendChild(operationEl);

    const taskStatus = operationEl.parentElement.dataset.status;

    if (taskStatus === "open") {

      let addTimeManualInput = document.createElement("input");
      addTimeManualInput.classList.add("float-right", "add-time-input", "d-none");
      addTimeManualInput.setAttribute("name", "time");
      addTimeManualInput.setAttribute("placeholder", "Type in spend minutes");
      operationEl.appendChild(addTimeManualInput);

      let manualTimeButton = document.createElement("a");
      manualTimeButton.classList.add("btn", "btn-primary", "float-right", "add-time");
      manualTimeButton.innerText = "Add time";
      operationEl.appendChild(manualTimeButton);

      let timeSpentEl = document.createElement("span");
      timeSpentEl.classList.add("badge", "badge-primary", "badge-pill");
      timeSpentEl.innerText = this.timeSpentToString(operation.timeSpent);
      operationEl.appendChild(timeSpentEl);
      if (operation.timeSpent <= 0) {
        timeSpentEl.classList.add("d-none");
      }
    }
  }

  timeSpentToString(timeSpent) {
    let hours = Math.floor(timeSpent / 3600);
    let minutes = Math.floor((timeSpent % 3600) / 60);
    let seconds = (timeSpent % 3600) % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  }

  addShowAddOperationTime() {
    document.querySelector("div.todo-app").addEventListener("click", event => {
      if (event.target.classList.contains("add-time")
          && !event.target.classList.contains("btn-success")) {
        event.preventDefault();
        let element = event.target;
        element.previousElementSibling.classList.remove("d-none");
        element.innerText = "Save";
        element.classList.add("btn-success");

      } else if (event.target.classList.contains("add-time")
          && event.target.classList.contains("btn-success")) {
        event.preventDefault();
        let element = event.target;

        const taskId = element.parentElement.parentElement.parentElement.dataset.id;
        const operationId = element.parentElement.dataset.id;
        const timeToAdd = parseInt(element.previousElementSibling.value) * 60;

        const description = element.parentElement.dataset.text;
        const currentTime = parseInt(element.parentElement.dataset.time);

        const operation = new Operation(description, (currentTime + timeToAdd));
        operation.id = operationId;

        this.apiService.updateOperation(
            operation,
            operationsUpdated => {
              console.log(operationsUpdated);
              element.parentElement.dataset.time = operationsUpdated.timeSpent;
              this.updateOperationTimer(operationsUpdated.timeSpent, element.parentElement);
            },
            error => console.log(error)
        );

        element.previousElementSibling.classList.add("d-none");
        element.previousElementSibling.value = "";
        element.innerText = "Add time";
        element.classList.remove("btn-success");
      }
    });
  }

  updateOperationTimer(time, operationElement) {
    if (time > 0) {
      operationElement.querySelector("span.badge").innerText = this.timeSpentToString(time);
      operationElement.querySelector("span.badge").classList.remove("d-none");
    } else {
      operationElement.querySelector("span.badge").innerText = 0;
      operationElement.querySelector("span.badge").classList.add("d-none");
    }
  }

  addFinishTaskEvent() {
    document.querySelector("div.todo-app").addEventListener("click", event => {
      if (event.target.classList.contains("close-task")) {
        event.preventDefault();
        let element = event.target;

        const taskElem = element.parentElement.parentElement.parentElement;
        const taskId = taskElem.dataset.id;
        const taskTitle = taskElem.dataset.title;
        const taskDescription = taskElem.dataset.description;

        const task = new Task(taskTitle, taskDescription);
        task.id = taskId;
        task.status = 'closed';

        this.apiService.updateTask(
            task,
            updatedTask => {
              element.nextElementSibling.classList.add("d-none");
              element.parentElement.parentElement.parentElement.querySelectorAll(".btn", "input").forEach(el => el.classList.add("d-none"));
            },
            error => console.log(error)
        );
      }
    });
  }
}
