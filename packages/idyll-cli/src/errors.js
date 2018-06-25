class ExtendableError extends Error {
  constructor(msg) {
    super(msg)
    this.name = this.constructor.name
    this.message = msg
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor)
    } else {
      this.stack = (new Error(msg)).stack
    }
  }
}

exports.OutOfDateError = class OutOfDateError extends ExtendableError {
  constructor(name) {
    super(`
      Could not find component ${name}.

      This error can occur if you are using an out of date version of the Idyll
      components with a newer version of the Idyll build tool. To install the
      latest idyll-component, run \`npm install idyll-components@latest\`.

      If you are reading the components from a local folder (e.g. ./components/default),
      you can refresh components in that folder by copying from ./node_modules/idyll-components/src/
      to your local directory.
    `)
  }
}

exports.OutsideOfProjectError = class OutsideOfProjectError extends ExtendableError {
  constructor(name) {
    super(`\n\nThis directory doesn't appear to be an Idyll project.\nTo create a new project, run \`idyll create\`.\n\n\n`)
  }
}

exports.InvalidComponentError = class InvalidComponentError extends ExtendableError {
  constructor(name) {
    super(`Component named ${name} could not be found.`)
  }
}

exports.UnknownDataError = class UnknownDataError extends ExtendableError {
  constructor(source) {
    super(`Unknown data file type: ${source}`)
  }
}

exports.UnsupportedDataTypeError = class UnsupportedDataTypeError extends ExtendableError {
  constructor(type) {
    super(`The data tag type: ${type} is currently unsupported. Please use 'value'.`);
  }
}
