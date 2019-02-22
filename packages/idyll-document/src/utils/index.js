const values = require('object.values');
const entries = require('object.entries');
const falafel = require('falafel');

const isPropertyAccess = node => {
  const index = node.parent.source().indexOf(`.${node.name}`);
  if (index === -1) {
    return false;
  }
  const proxyString = '__idyllStateProxy';
  if (index >= proxyString.length) {
    if (
      node.parent
        .source()
        .substr(index - proxyString.length, proxyString.length) === proxyString
    ) {
      return false;
    }
  }
  return true;
};

export const buildExpression = (acc, expr, isEventHandler) => {
  let identifiers = [];
  let modifiedExpression = '';

  try {
    modifiedExpression = falafel(
      isEventHandler ? expr : `var __idyllReturnValue = ${expr || 'undefined'}`,
      node => {
        switch (node.type) {
          case 'Identifier':
            const propertyAcess = isPropertyAccess(node);
            if (!propertyAcess && Object.keys(acc).indexOf(node.name) > -1) {
              identifiers.push(node.name);
              node.update('__idyllStateProxy.' + node.source());
            }
            break;
        }
      }
    );
  } catch (e) {
    console.error(e);
  }

  if (!isEventHandler) {
    return `
    ((context) => {
      var __idyllStateProxy = new Proxy({}, {
        get: (_, prop) => {
          return context[prop];
        },
        set: (_, prop, value) => {
          console.warn('Warning, trying to set a value in a property expression.');
        }
      });
      ${modifiedExpression};
      return __idyllReturnValue;
    })(this)`;
  }

  return `
    ((context) => {
        var __idyllExpressionExecuted = false;
        var __idyllStateProxy = new Proxy({
          ${identifiers
            .map(key => {
              return `${key}: ${
                key !== 'refs'
                  ? `context.__idyllCopy(context['${key}'])`
                  : `context['${key}']`
              }`;
            })
            .join(', ')}
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
        ${modifiedExpression};
        context.__idyllUpdate({
          ${identifiers
            .filter(key => key !== 'refs')
            .map(key => {
              return `${key}: __idyllStateProxy['${key}']`;
            })
            .join(', ')}
        });
        __idyllExpressionExecuted = true;
    })(this)
  `;
};

export const evalExpression = (acc, expr, key, context) => {
  const isEventHandler =
    key && (key.match(/^on[A-Z].*/) || key.match(/^handle[A-Z].*/));
  let e = buildExpression(acc, expr, isEventHandler);
  if (isEventHandler) {
    return function() {
      eval(e);
    }.bind(
      Object.assign({}, acc, context || {}, {
        __idyllCopy: function copy(o) {
          if (typeof o !== 'object') return o;
          var output, v, key;
          output = Array.isArray(o) ? [] : {};
          for (key in o) {
            v = o[key];
            output[key] = typeof v === 'object' ? copy(v) : v;
          }
          return output;
        }
      })
    );
  }

  try {
    return function(evalString) {
      try {
        return eval('(' + evalString + ')');
      } catch (err) {
        console.warn('Error occurred in Idyll expression');
        console.error(err);
      }
    }.call(Object.assign({}, acc), e);
  } catch (err) {}
};

export const getVars = (arr, context = {}) => {
  const formatAccumulatedValues = acc => {
    const ret = {};
    Object.keys(acc).forEach(key => {
      const accVal = acc[key];
      if (
        typeof accVal.update !== 'undefined' &&
        typeof accVal.value !== 'undefined'
      ) {
        ret[key] = accVal.value;
      } else {
        ret[key] = accVal;
      }
    });
    return ret;
  };

  const pluck = (acc, val) => {
    const [variableType, attrs = []] = val;

    const [nameArr, valueArr] = attrs;
    if (!nameArr || !valueArr) return acc;

    const [, [, nameValue]] = nameArr;
    const [, [valueType, valueValue]] = valueArr;

    switch (valueType) {
      case 'value':
        acc[nameValue] = valueValue;
        break;
      case 'variable':
        if (context.hasOwnProperty(valueValue)) {
          acc[nameValue] = context[valueValue];
        } else {
          acc[nameValue] = evalExpression(context, expr);
        }
        break;
      case 'expression':
        const expr = valueValue;
        if (variableType === 'var') {
          acc[nameValue] = evalExpression(
            Object.assign({}, context, formatAccumulatedValues(acc)),
            expr
          );
        } else {
          acc[nameValue] = {
            value: evalExpression(
              Object.assign({}, context, formatAccumulatedValues(acc)),
              expr
            ),
            update: (newState, oldState, context = {}) => {
              return evalExpression(
                Object.assign({}, oldState, newState, context),
                expr
              );
            }
          };
        }
    }

    return acc;
  };

  return arr.reduce(pluck, {});
};

export const filterIdyllProps = (props, filterInjected) => {
  const {
    __vars__,
    __expr__,
    hasHook,
    initialState,
    isHTMLNode,
    refName,
    onEnterViewFully,
    onEnterView,
    onExitViewFully,
    onExitView,
    ...rest
  } = props;
  if (filterInjected) {
    const { idyll, hasError, updateProps, ...ret } = rest;
    return ret;
  }
  return rest;
};

export const getData = (arr, datasets = {}) => {
  const pluck = (acc, val) => {
    const [, attrs] = val;
    const [nameArr] = attrs;

    const [, [, nameValue]] = nameArr;

    acc[nameValue] = datasets[nameValue];

    return acc;
  };

  return arr.reduce(pluck, {});
};

export const splitAST = ast => {
  const state = {
    vars: [],
    derived: [],
    data: [],
    elements: []
  };

  const handleNode = storeElements => {
    return node => {
      const [name, props, children] = node;
      if (name === 'var') {
        state.vars.push(node);
      } else if (state[name]) {
        state[name].push(node);
      } else if (storeElements) {
        state.elements.push(node);
      }
      if (!children || typeof children === 'string') {
        return;
      }
      children.forEach(handleNode(false));
    };
  };

  ast.forEach(handleNode(true));
  return state;
};

export const hooks = [
  'onEnterView',
  'onEnterViewFully',
  'onExitView',
  'onExitViewFully'
];

export const scrollMonitorEvents = {
  onEnterView: 'enterViewport',
  onEnterViewFully: 'fullyEnterViewport',
  onExitView: 'partiallyExitViewport',
  onExitViewFully: 'exitViewport'
};

export const translate = arr => {
  const attrConvert = list => {
    return list.reduce((acc, [name, [type, val]]) => {
      if (type === 'variable') {
        acc.__vars__ = acc.__vars__ || {};
        acc.__vars__[name] = val;
      }
      // each node keeps a list of props that are expressions
      if (type === 'expression') {
        acc.__expr__ = acc.__expr__ || {};
        acc.__expr__[name] = val;
      }
      // flag nodes that define a hook function
      if (hooks.includes(name)) {
        acc.hasHook = true;
      }

      acc[name] = val;
      return acc;
    }, {});
  };

  const tNode = node => {
    if (typeof node === 'string') return node;

    if (node.length === 3) {
      const [name, attrs, children] = node;

      return {
        component: name,
        ...attrConvert(attrs),
        children: children.map(tNode)
      };
    }
  };

  return splitAST(arr).elements.map(tNode);
};

export const mapTree = (tree, mapFn, filterFn = () => true) => {
  const walkFn = (acc, node) => {
    if (typeof node !== 'string') {
      if (node.children) {
        // translated schema
        node.children = node.children.reduce(walkFn, []);
      } else {
        // compiler AST
        node[2] = node[2].reduce(walkFn, []);
      }
    }

    if (filterFn(node)) acc.push(mapFn(node));
    return acc;
  };

  return tree.reduce(walkFn, []);
};

export const filterASTForDocument = ast => {
  return mapTree(ast, n => n, ([name]) => name !== 'meta');
};

export const findWrapTargets = (schema, state) => {
  const targets = [];
  const stateKeys = Object.keys(state);

  // always return node so we can walk the whole tree
  // but collect and ultimately return just the nodes
  // we are interested in wrapping
  mapTree(schema, node => {
    if (typeof node === 'string') return node;

    if (node.hasHook) {
      targets.push(node);
      return node;
    }

    // wrap all custom components
    const startsWith = node.component.charAt(0);
    if (startsWith === startsWith.toUpperCase()) {
      targets.push(node);
      return node;
    }

    // pull off the props we don't need to check
    const { component, children, __vars__, __expr__, ...props } = node;
    const expressions = Object.keys(__expr__ || {});
    const variables = Object.keys(__vars__ || {});

    // iterate over the node's prop values
    entries(props).forEach(([key, val]) => {
      // avoid checking more props if we know it's a match
      if (targets.includes(node)) return;

      // Include nodes that reference a variable or expression.
      if (variables.includes(key) || expressions.includes(key)) {
        targets.push(node);
      }
    });

    return node;
  });

  return targets;
};
