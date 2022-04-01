import {
  DERIVED,
  VAR,
  DATA,
  VALUE,
  VARIABLE,
  EXPRESSION,
  createComponentNode,
  getChildren,
  getNodeName,
  isTextNode,
  getProperty,
  hasProperty,
  setValueProperty,
  setExpressionProperty,
  removeProperty
} from 'idyll-ast';

const TEXT_CONTAINER = 'TextContainer';
const FULLWIDTH = 'fullwidth';
const SCROLLER = 'scroller';
const CLASS_NAME = 'className';

function makeFullWidth(ast) {
  let textNodes = [];
  const reduced = [];

  for (const child of getChildren(ast)) {
    try {
      const ist = isTextNode(child);
    } catch (err) {
      console.error(err);
      console.error('AST', JSON.stringify(ast, 0, 2));
    }
    if (isTextNode(child)) {
      textNodes.push(child);
      continue;
    }

    const childName = getNodeName(child).toLowerCase();

    if (
      [DERIVED, VAR, DATA, FULLWIDTH, SCROLLER].includes(childName) ||
      hasProperty(child, 'fullWidth')
    ) {
      if (childName === FULLWIDTH) {
        child.name = 'div';
        const className = getProperty(child, CLASS_NAME);
        if (className) {
          switch (className.type) {
            case VALUE:
              setValueProperty(
                child,
                CLASS_NAME,
                'fullWidth ' + className.value
              );
              break;
            case EXPRESSION:
            case VARIABLE:
              setExpressionProperty(
                child,
                CLASS_NAME,
                `"fullWidth " + (${className.value})`
              );
              break;
            default:
              setValueProperty(child, CLASS_NAME, 'fullWidth');
          }
        } else {
          setValueProperty(child, CLASS_NAME, 'fullWidth');
        }
      } else {
        removeProperty(child, 'fullWidth');
      }

      if (textNodes.length) {
        reduced.push(createComponentNode(TEXT_CONTAINER, null, textNodes));
        textNodes = [];
      }
      reduced.push(child);
    } else {
      textNodes.push(child);
    }
  }

  if (textNodes.length) {
    reduced.push(createComponentNode(TEXT_CONTAINER, null, textNodes));
  }

  ast.children = reduced;
  return ast;
}

export default makeFullWidth;
