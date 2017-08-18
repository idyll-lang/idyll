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
          .map(key => `var ${key} = ${acc[key]}`)
          .join('\n')
      }
      return ${expr}
    })()
  `)
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
      (acc, [name, [, val]]) => {
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

module.exports = {
  flattenObject,
  getData,
  getNodesByName,
  getVars,
  splitAST,
  translate,
};
