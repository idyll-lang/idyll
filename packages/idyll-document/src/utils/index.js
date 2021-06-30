const falafel = require('falafel');
const parse = require('csv-parse/lib/es5/sync');

const {
  getChildren,
  getNodeName,
  getProperties,
  getType,
  removeNodesByName
} = require('idyll-ast');

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

const isObjectKey = node => {
  return node.parent.type === 'Property' && node.parent.key === node;
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
            const skip = isPropertyAccess(node) || isObjectKey(node);
            if (Object.keys(acc).indexOf(node.name) > -1) {
              identifiers.push(node.name);
              if (!skip) {
                node.update('__idyllStateProxy.' + node.source());
              }
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
    const variableType = getType(val);
    const attrs = getProperties(val) || [];

    if (!attrs.name || !attrs.value) return attrs;

    const nameValue = attrs.name.value;
    const valueType = attrs.value.type;
    const valueValue = attrs.value.value;

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
    idyllASTNode,
    hasHook,
    initialState,
    isHTMLNode,
    refName,
    onEnterViewFully,
    onEnterView,
    onExitViewFully,
    onExitView,
    fullWidth,
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
    const nameValue = getProperties(val).name.value;
    const sourceValue = getProperties(val).source.value;
    const async = getProperties(val).async
      ? getProperties(val).async.value
      : false;
    if (async) {
      const initialValue = getProperties(val).initialValue
        ? JSON.parse(getProperties(val).initialValue.value)
        : [];

      let dataPromise = new Promise(res => res(initialValue));

      if (typeof fetch !== 'undefined') {
        dataPromise = fetch(sourceValue)
          .then(res => {
            if (res.status >= 400) {
              throw new Error(
                `Error Status ${
                  res.status
                } occurred while fetching data from ${sourceValue}. If you are using a file to load the data and not a url, make sure async is not set to true.`
              );
            }
            if (sourceValue.endsWith('.csv')) {
              return res
                .text()
                .then(resString =>
                  parse(resString, {
                    cast: true,
                    columns: true,
                    skip_empty_lines: true,
                    ltrim: true,
                    rtrim: true
                  })
                )
                .catch(e => {
                  console.error(`Error while parsing csv: ${e}`);
                });
            }
            return res.json().catch(e => console.error(e));
          })
          .catch(e => {
            console.error(e);
          });
      } else if (typeof window !== 'undefined') {
        console.warn('Could not find fetch.');
      }
      acc.asyncData[nameValue] = {
        initialValue,
        dataPromise
      };
    } else {
      acc.syncData[nameValue] = datasets[nameValue];
    }

    return acc;
  };

  return arr.reduce(pluck, { syncData: {}, asyncData: {} });
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
      const type = getType(node);
      const props = getProperties(node);
      const children = getChildren(node);
      if (node.id != 0) {
        if (type === 'var') {
          state.vars.push(node);
        } else if (state[type]) {
          state[type].push(node);
        } else if (storeElements) {
          state.elements.push(node);
        }
        if (
          !children ||
          (children.length === 1 && getType(children[0]) === 'textnode')
        ) {
          return;
        }
        children.forEach(handleNode(false));
      }
    };
  };

  ast.forEach(handleNode(true));
  return state;
};

//Properties that add logic to components for callbacks.
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

export const translate = ast => {
  const attrConvert = (props, node) => {
    let reducedProps = {
      idyllASTNode: node
    };
    for (let propName in props) {
      const name = propName;
      const type = props[propName].type;
      const value = props[propName].value;
      if (type == 'variable') {
        if (!reducedProps.__vars__) {
          reducedProps.__vars__ = {};
        }
        reducedProps.__vars__[name] = value;
      }
      if (type == 'expression') {
        if (!reducedProps.__expr__) {
          reducedProps.__expr__ = {};
        }
        reducedProps.__expr__[name] = value;
      }

      if (hooks.includes(name)) {
        reducedProps.hasHook = true;
      }

      reducedProps[name] = value;
    }
    return reducedProps;
  };
  const tNode = node => {
    if (getType(node) === 'textnode') return node;

    let name = getNodeName(node);

    let attrs = getProperties(node);
    if (!attrs) {
      attrs = {};
    }
    const children = getChildren(node);
    return {
      component: name,
      ...attrConvert(attrs, node),
      children: children.map(tNode)
    };
  };

  return splitAST(getChildren(ast)).elements.map(tNode);
};

export const mapTree = (tree, mapFn, filterFn = () => true, depth = 0) => {
  const walkFn = depth => (acc, node) => {
    //To check for textnodes
    if (node.component) {
      //To check for childrens
      if (node.children) {
        node.children = node.children.reduce(walkFn(depth + 1), []);
      }
    }

    if (filterFn(node)) {
      acc.push(mapFn(node, depth));
    }
    return acc;
  };
  let value = tree.reduce(walkFn(depth), []);
  return value;
};

export const filterASTForDocument = ast => {
  return removeNodesByName(ast, 'meta');
};

export const findWrapTargets = (schema, state, components) => {
  //Custom components
  const targets = [];
  //Name of custom components
  const componentNames = Object.keys(components);

  componentNames.forEach((component, i) => {
    let words = component.split('-');
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].substring(1);
    }
    componentNames[i] = words.join('').toLowerCase();
  });

  //Array of keys for the runtime state passed.
  const stateKeys = Object.keys(state);

  //Populating target with the custom componenets
  //Walk the whole tree, collect and return the nodes
  //for wrapping
  mapTree(schema, node => {
    if (node.component === 'textnode') {
      return node;
    }

    //Custom components will have hooks attached to them
    if (node.hasHook) {
      targets.push(node);
      return node;
    }

    if (node.component) {
      const checkName = node.component
        .toLowerCase()
        .split('-')
        .join('');
      if (componentNames.includes(checkName)) {
        targets.push(node);
        return node;
      }
    }

    const { component, children, __vars__, __expr__, ...props } = node;

    const expressions = Object.keys(__expr__ || {});
    const variables = Object.keys(__vars__ || {});

    for (let prop in props) {
      if (variables.includes(prop) || expressions.includes(prop)) {
        targets.push(node);
        return node;
      }
    }
    return node;
  });

  return targets;
};
