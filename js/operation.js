class Operation {
  constructor(description, timeSpent) {
    this.id = null;
    this.description = description;
    this.timeSpent = timeSpent === undefined ? 0 : timeSpent;
  }
}
