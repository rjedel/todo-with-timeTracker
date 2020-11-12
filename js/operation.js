class Operation {
  constructor(description, timeSpent, task) {
    this.id = null;
    this.task = task;
    this.description = description;
    this.timeSpent = timeSpent === undefined ? 0 : timeSpent;
  }
}
