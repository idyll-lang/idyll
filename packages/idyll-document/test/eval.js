import { buildExpression, evalExpression } from '../src/utils';

const whitespace = str => {
  return str.trim().replace(/[\s\n\t]+/g, ' ');
};

describe('Detect global variables', () => {
  it('Handles a basic variable', () => {
    const expression = buildExpression({ x: 10 }, `x`, false);

    expect(whitespace(expression)).toBe(
      whitespace(`
      ((context) => {
        var __idyllStateProxy = new Proxy({}, {
          get: (_, prop) => {
            return context[prop];
          },
          set: (_, prop, value) => {
            console.warn('Warning, trying to set a value in a property expression.');
          }
        });
        var __idyllReturnValue = __idyllStateProxy.x;
        return __idyllReturnValue;
      })(this)
    `)
    );
  });

  it('Handles an empty string', () => {
    const expression = buildExpression({ x: 10 }, '', false);

    expect(whitespace(expression)).toBe(
      whitespace(`
      ((context) => {
        var __idyllStateProxy = new Proxy({}, {
          get: (_, prop) => {
            return context[prop];
          },
          set: (_, prop, value) => {
            console.warn('Warning, trying to set a value in a property expression.');
          }
        });
        var __idyllReturnValue = undefined;
        return __idyllReturnValue;
      })(this)
    `)
    );
  });

  it('Evals a basic variable', () => {
    const output = evalExpression({ x: 10 }, `x`);
    expect(output).toBe(10);
  });

  it('Handles an assignment to a variable ', () => {
    const expression = buildExpression({ x: 10 }, `x = 20`, true);

    expect(whitespace(expression)).toBe(
      whitespace(`
      ((context) => {
        var __idyllExpressionExecuted = false;
        var __idyllStateProxy = new Proxy({
          x:  context.__idyllCopy(context['x'])
        }, {
          get: (target, prop) => {
            return target[prop];
          },
          set: (target, prop, value) => {
            if (__idyllExpressionExecuted) {
              var newState = {};
              newState[prop] = value;
              context.__idyllUpdate(newState);
            }
            target[prop] = value;
            return true;
          }
        });
        __idyllStateProxy.x = 20;
        context.__idyllUpdate({
          x: __idyllStateProxy['x']
        });
        __idyllExpressionExecuted = true;
      })(this)
    `)
    );
  });

  it('Handles incrementers', () => {
    const expression = buildExpression({ x: 10, y: 20 }, `x++; ++y`, true);

    expect(whitespace(expression)).toBe(
      whitespace(`
      ((context) => {
        var __idyllExpressionExecuted = false;
        var __idyllStateProxy = new Proxy({
          x:  context.__idyllCopy(context['x']),
          y:  context.__idyllCopy(context['y'])
        }, {
          get: (target, prop) => {
            return target[prop];
          },
          set: (target, prop, value) => {
            if (__idyllExpressionExecuted) {
              var newState = {};
              newState[prop] = value;
              context.__idyllUpdate(newState);
            }
            target[prop] = value;
            return true;
          }
        });
        __idyllStateProxy.x++; ++__idyllStateProxy.y;
        context.__idyllUpdate({
          x: __idyllStateProxy['x'],
          y: __idyllStateProxy['y']
        });
        __idyllExpressionExecuted = true;
      })(this)
    `)
    );
  });
});
