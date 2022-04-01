import { visitNodes } from 'idyll-ast';

function injectIds(ast) {
  let id = -1;
  visitNodes(ast, node => (node.id = ++id));
  return ast;
}

export default injectIds;
