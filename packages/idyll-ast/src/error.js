class ExtendableError extends Error {
  constructor(msg) {
    super(msg);
    this.name = this.constructor.name;
    this.message = msg;
    this.stack = new Error(msg).stack;
  }
}

export class InvalidParameterError extends ExtendableError {
  constructor(msg) {
    super(msg);
  }
}

export class MalformedAstError extends ExtendableError {
  constructor(msg) {
    super(msg);
  }
}
