const expect = require('expect.js');
const { validateNode, validateProperties } = require('../src');
const { astTestVar } = require('./test-data');

describe('validateNode', function() {
  it('should validate a valid AST', function() {
    validateNode({ type: 'textnode', value: 'foo' });
    validateNode(astTestVar());
  });

  it('should throw on an invalid AST', function() {
    expect(() => validateNode({})).to.throwError();
    expect(() => validateNode({ type: 'foo' })).to.throwError();
  });
});

describe('validateProperties', function() {
  it('should validate valid AST node properties', function() {
    validateProperties({});
    validateProperties({ prop: { type: 'value', value: 2 } });
    validateProperties({ prop: { type: 'variable', value: 'foo' } });
    validateProperties({ prop: { type: 'expression', value: 'foo + 1' } });
  });

  it('should throw on invalid AST node properties', function() {
    expect(() => validateProperties(2)).to.throwError();
    expect(() => validateProperties({ prop: 'foo' })).to.throwError();
    expect(() =>
      validateProperties({ type: 'value', value: 2 })
    ).to.throwError();
    expect(() =>
      validateProperties({
        prop: { type: 'foo', value: 2 }
      })
    ).to.throwError();
    expect(() =>
      validateProperties({
        prop: { type: 'value', value: 2, extra: 3 }
      })
    ).to.throwError();
  });
});
