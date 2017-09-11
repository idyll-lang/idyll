const flattenObject = (name, obj) => {
  const output = {};
  if (obj === undefined || obj === null) {
    return output;
  }
  Object.keys(obj).forEach((key) => {
    const val = obj[key];
    if (typeof val === 'object') {
      const results = flattenObject(key, val);
      Object.keys(results).forEach((result) => {
        output[name + result] = results[result];
      });
    } else {
      output[name + key] = val;
    }
  });
  return output;
};

const getNodesByName = (name, tree) => {
  const predicate = typeof name === 'string' ? (s) => s === name : name;

  const byName = (acc, val) => {
    if (typeof val === 'string') return acc;

    const [ name, attrs, children ] = val;

    if (predicate(name)) acc.push(val)

    if (children.length > 0) children.reduce(byName, acc)

    return acc;
  }

  return tree.reduce(
    byName,
    []
  )
}

const evalExpression = (acc, expr) => {
  return eval(`
    (() => {
      ${
        Object.keys(acc)
          .filter(key => expr.includes(key))
          .map(key => {
            if (key === 'refs') {
              // delete each ref's domNode property
              // because it can't be serialized
              Object.values(acc[key]).forEach(v => {
                delete v.domNode;
              })
              // add `refs` const object graph to function scope
              return `const ${key} = JSON.parse('${JSON.stringify(acc[key])}')`;
            }
            return `const ${key} = ${acc[key]};`;
          })
          .join('\n')
      }
      return ${
        // IIFE since only expressions are allowed in template strings
        (() => {
          try {
            if (typeof eval(expr) !== 'function') return expr;

            // if the source expression is a function
            // it needs to be run inside a try...catch to avoid RTEs
            return (...rest) => {
              try {
                return eval(expr)(...rest);
              } catch (e) {
                console.warn('ERROR evaluating:', expr);
                console.warn(e);
                return null;
              }
            }
          } catch (e) {
            return expr;
          }
        })()
      };
    })()
  `);
}

const getVars = (arr, context) => {
  const pluck = (acc, val) => {
    const [ , attrs, ] = val
    const [nameArr, valueArr] = attrs;

    const [, [, nameValue]] = nameArr
    const [, [valueType, valueValue]] = valueArr;

    if (valueType === 'value') acc[nameValue] = valueValue;
    if (valueType === 'variable') acc[nameValue] = context[valueValue];
    if (valueType === 'expression') {
      const expr = valueValue;

      acc[nameValue] = {
        value: evalExpression(context, expr),
        update: (newState, oldState) => {
          return evalExpression(Object.assign({}, oldState, newState), expr)
        }
      }
    }

    return acc;
  }

  return arr.reduce(
    pluck,
    {}
  )
}

const getData = (arr, datasets = {}) => {
  const pluck = (acc, val) => {
    const [ , attrs, ] = val
    const [nameArr, ] = attrs;

    const [, [, nameValue]] = nameArr

    acc[nameValue] = datasets[nameValue];

    return acc;
  }

  return arr.reduce(
    pluck,
    {}
  )
}

const splitAST = (ast) => {
  const state = {
    vars: [],
    derived: [],
    data: [],
    elements: [],
  }

  ast.forEach(node => {
    const [ name ] = node;
    if (name === 'var') {
      state.vars.push(node);
    } else if (state[name]) {
      state[name].push(node);
    } else {
      state.elements.push(node);
    }
  })

  return state;
}

const translate = (arr) => {
  const attrConvert = (list) => {
    return list.reduce(
      (acc, [name, [type, val]]) => {
        if (type === 'variable') {
          acc.__vars__ = acc.__vars__ = {};
          acc.__vars__[name] = val;
        }
        // each node keeps a list of props that are expressions
        if (type === 'expression') {
          acc.__expr__ = acc.__expr__ || {};
          acc.__expr__[name] = val;
        }

        acc[name] = val
        return acc
      },
      {}
    )
  }

  const tNode = (node) => {
    if (typeof node === 'string') return node;

    if (node.length === 3) {
      const [ name, attrs, children ] = node

      return {
        component: name,
        ...attrConvert(attrs),
        children: children.map(tNode),
      }
    }
  }

  return splitAST(arr).elements.map(tNode)
}

const mapTree = (tree, mapFn) => {
  const walkFn = (acc, node) => {
    if (typeof node !== 'string') {
      node.children = node.children.reduce(walkFn, [])
    }

    acc.push(mapFn(node))
    return acc;
  }

  return tree.reduce(
    walkFn,
    []
  )
}

const findWrapTargets = (schema, state) => {
  const targets = [];
  const stateKeys = Object.keys(state);

  // always return node so we can walk the whole tree
  // but collect and ultimately return just the nodes
  // we are interested in wrapping
  mapTree(schema, (node) => {
    if (typeof node === 'string') return node;

    // pull off the props we don't care about
    const { component, children, __vars__, __expr__, ...props } = node;
    // iterate over the node's prop values
    Object.values(props).forEach(val => {
      // and include nodes whose prop value directly references a state var
      // like [Range value:x min:0 max:100 /]
      if (stateKeys.includes(val)) {
        if (!targets.includes(node)) targets.push(node);
        return;
      }
      // and nodes whose prop values include a state var ref
      // like [derived name:"xSquared" value:`x * x` /]
      stateKeys.forEach((key) => {
        if (
          val.includes &&
          val.includes(key) &&
          !targets.includes(node)
        ) {
          targets.push(node);
        }
      })
      // and nodes that track refs
      if (
        val.includes &&
        val.includes('refs.') &&
        !targets.includes(node)
      ) {
        targets.push(node);
      }
    });

    return node;
  })

  return targets;
}

module.exports = {
  flattenObject,
  getData,
  getNodesByName,
  getVars,
  splitAST,
  translate,
  findWrapTargets,
  mapTree,
  evalExpression,
};
