class ApiService {
  constructor() {
    this.apikey = "elephant";
    this.url = "https://todo-api.coderslab.pl";
  }

  createTaskFromResponseData(data) {
    const task = new Task(data.title, data.description, data.status);
    if (data.id) {
      task.id = data.id;
    }
    return task;
  }

  getTasks(successCallbackFn, errorCallbackFn) {
    fetch(this.url + "/api/tasks", {
      headers: {
        Authorization: this.apikey,
      },
      method: "GET",
    })
        .then(function (response) {
          return response.json();
        })
        .then(responseData => {
          if (typeof successCallbackFn === "function") {
            const tasksToProcess = responseData.data;
            const tasks = tasksToProcess.map((element) => {
              return this.createTaskFromResponseData(element);
            });
            successCallbackFn(tasks);
          }
        })
        .catch(error => {
          if (typeof errorCallbackFn === "function") {
            errorCallbackFn(error);
          }
        });
  }

  saveTask(task, successCallbackFn, errorCallbackFn) {
    fetch(this.url + "/api/tasks", {
      headers: {
        Authorization: this.apikey,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(task),
    })
        .then(response => {
          return response.json();
        })
        .then(responseData => {
          if (typeof successCallbackFn === "function") {
            const newTask = this.createTaskFromResponseData(responseData.data);
            successCallbackFn(newTask);
          }
        })
        .catch(error => {
          if (typeof errorCallbackFn === "function") {
            errorCallbackFn(error);
          }
        });
  }

  createOperationFromResponseData(data) {
    const operation = new Operation(data.description, data.timeSpent);
    if (data.id) operation.id = data.id;
    return operation;
  }

  getOperationsForTask(taskId, successCallbackFn, errorCallbackFn) {
    fetch(this.url + `/api/tasks/${taskId}/operations`, {
      headers: {
        Authorization: this.apikey,
      },
      method: "GET",
    })
        .then(response => {
          return response.json();
        })
        .then(responseData => {
          if (typeof successCallbackFn === "function") {
            const operations = responseData.data.map(element => {
              return this.createOperationFromResponseData(element);
            });
            successCallbackFn(operations);
          }
        })
        .catch(error => {
          if (typeof errorCallbackFn === "function") {
            errorCallbackFn(error);
          }
        });
  }

  addOperationForTask(taskId, operation, successCallbackFn, errorCallbackFn) {
    fetch(this.url + `/api/tasks/${taskId}/operations`, {
      headers: {
        "Authorization": this.apikey,
        "Content-Type": 'application/json',
      },
      method: "POST",
      body: JSON.stringify(operation)
    })
        .then(response => {
          return response.json();
        })
        .then(responseData => {
          if (typeof successCallbackFn === 'function') {
            const operation = this.createOperationFromResponseData(responseData.data);
            successCallbackFn(operation);
          }
        })
        .catch(error => {
          if (typeof errorCallbackFn === 'function') {
            errorCallbackFn(error);
          }
        });
  }
}
