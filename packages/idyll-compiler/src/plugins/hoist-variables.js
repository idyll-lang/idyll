import {
  VAR,
  DERIVED,
  DATA,
  isVariableNode,
  prependChildren,
  queryNodes,
  removeNodes
} from 'idyll-ast';

const rank = {
  [VAR]: 0,
  [DERIVED]: 1,
  [DATA]: 2
};

function hoistVariables(ast) {
  const variableNodes = queryNodes(ast, isVariableNode);
  variableNodes.sort((a, b) => rank[a.type] - rank[b.type]);

  removeNodes(ast, isVariableNode);
  prependChildren(ast, variableNodes);

  return ast;
}

export default hoistVariables;
