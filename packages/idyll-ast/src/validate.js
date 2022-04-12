import schema from './ast.schema.json';
import Ajv from 'ajv';
import metaSchema from 'ajv/lib/refs/json-schema-draft-06.json';

const ajv = new Ajv();
ajv.addMetaSchema(metaSchema);

let astValidator;
let propValidator;

class MalformedASTError extends Error {
  constructor(msg, errors) {
    super(msg);
    this.name = this.constructor.name;
    this.message = msg;
    this.stack = new Error(msg).stack;
  }
}

/**
 * Validates if an AST node conforms to the JSON schema.
 * @param {object} node The AST node.
 * @throws Error if AST validation fails.
 */
function validateNode(ast) {
  if (!astValidator) {
    astValidator = ajv.compile(schema);
  }
  if (!astValidator(ast)) {
    throw new MalformedASTError(
      'AST node does not match schema: ' + astValidator.errors[0].message
    );
  }
}

/**
 * Validates if AST node properties conform to the JSON schema.
 * @param {object} properties An AST node properties object.
 * @throws Error if AST validation fails.
 */
function validateProperties(properties) {
  if (!propValidator) {
    propValidator = ajv.compile(schema.properties.properties);
  }
  if (!propValidator(properties)) {
    throw new MalformedASTError(
      'AST properties do not match schema: ' + propValidator.errors[0].message
    );
  }
}

export { validateNode, validateProperties };
