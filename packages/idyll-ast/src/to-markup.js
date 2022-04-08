import htmlTags from 'html-tags';
import {
  VALUE,
  EXPRESSION,
  VARIABLE,
  getChildren,
  hasChildren,
  isComponentNode
} from './ast';

/**
 * Convert an AST to valid Idyll markup.
 * @param {object} node The AST node.
 * @return {string} The markup string.
 */
function toMarkup(node, options = { insertFullWidth: false }) {
  const markup = childrenToMarkup(
    node,
    0,
    node.name === 'p' ? ' ' : '\n',
    options.insertFullWidth || false
  ).trim();

  const cleanedMarkup = markup.replace(/([\]\*\_]) ([,\.\!\?\:\[])/g, '$1$2');

  return cleanedMarkup;
}

function childrenToMarkup(
  node,
  depth,
  separator = '\n',
  insertFullWidth = false
) {
  let markup = '';
  for (const child of getChildren(node)) {
    markup +=
      separator + nodeToMarkup(child, depth, separator, insertFullWidth);
  }
  return markup.replace(/\n\n+/g, '\n\n');
}

function nodeToMarkup(node, depth, separator = '\n', insertFullWidth = false) {
  let name = (node.name && node.name.toLowerCase()) || null;

  if (name === 'idylleditordroptarget') {
    return '';
  }

  const markupNodes = [
    'strong',
    'em',
    'i',
    'b',
    'code',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'a'
  ];

  // normalize component names
  if (name && !htmlTags.includes(name)) {
    node.name = node.name
      .split('-')
      .map(s => s.charAt(0).toUpperCase() + s.slice(1))
      .join('');
    name = node.name.toLowerCase();
  }

  switch (node.type) {
    case 'textnode':
      return `${'  '.repeat(depth)}${node.value.trim()}`;
    case 'component':
      if (name === 'textcontainer') {
        return `\n${childrenToMarkup(node, depth, '\n', false)}`;
      } else if (name === 'p' && depth < 1) {
        return `\n${childrenToMarkup(node, depth, '\n', false).trim()}\n`;
      } else if (markupNodes.includes(name)) {
        switch (name) {
          case 'strong':
          case 'b':
            return `**${childrenToMarkup(node, 0, ' ', false).trim()}**`;
          case 'em':
          case 'i':
            return `*${childrenToMarkup(node, 0, ' ', false).trim()}*`;
          case 'code':
            return `\`${childrenToMarkup(node, 0, ' ', false).trim()}\``;
          case 'h1':
          case 'h2':
          case 'h3':
          case 'h4':
          case 'h5':
            if (
              node.children &&
              node.children.length === 1 &&
              node.children[0].type === 'textnode'
            ) {
              return `${'#'.repeat(+node.name[1])} ${childrenToMarkup(
                node,
                0,
                ' ',
                false
              ).trim()}`;
            }
        }
      }

      if (
        name === 'pre' &&
        node.children &&
        node.children.length === 1 &&
        node.children[0].name &&
        node.children[0].name.toLowerCase() === 'code'
      ) {
        return `
\`\`\`
${childrenToMarkup(node.children[0], 0, ' ', false).trim()}
\`\`\`
        `;
      } else if (
        name === 'pre' &&
        node.children &&
        node.children.length === 1 &&
        node.children[0].type === 'textnode'
      ) {
        return `
\`\`\`
${childrenToMarkup(node, 0, ' ', false).trim()}
\`\`\``;
      }

      const propString = propertiesToString(node, depth, insertFullWidth);
      if (hasChildren(node)) {
        if (name === 'a') {
          return `${'  '.repeat(depth)}[${node.name}${
            propString ? `${propString}` : ''
          }]${childrenToMarkup(node, depth + 1, ' ', false).trim()}[/${
            node.name
          }]`;
        }
        return `${'  '.repeat(depth)}[${node.name}${
          propString ? `${propString}` : ''
        }]${childrenToMarkup(node, depth + 1, separator, false)}\n${'  '.repeat(
          depth
        )}[/${node.name}]`;
      }
      return `${'  '.repeat(depth)}[${node.name}${
        propString ? `${propString}` : ''
      } /]`;
    case 'var':
    case 'derived':
    case 'data':
    case 'meta':
      return `${'  '.repeat(depth)}[${node.type}${propertiesToString(
        node,
        depth,
        insertFullWidth
      )} /]`;
  }
}

function propertiesToString(node, depth, insertFullWidth) {
  const props = { ...node.properties };
  if (
    insertFullWidth &&
    isComponentNode(node) &&
    node.name.toLowerCase() !== 'textcontainer'
  ) {
    props.fullWidth = { type: 'value', value: true };
  }

  let flatString = Object.keys(props || {}).reduce(
    (memo, key) => memo + ` ${key}:${propertyToString(props[key])}`,
    ''
  );

  if (flatString.length < 60) {
    return flatString;
  }

  return Object.keys(props || {}).reduce(
    (memo, key) =>
      memo +
      `\n${'  '.repeat(depth + 1)}${key}:${propertyToString(props[key])}`,
    ''
  );
}

function propertyToString(property) {
  switch (property.type) {
    case VALUE:
      return JSON.stringify(property.value);
    case EXPRESSION:
      return `\`${property.value}\``;
    case VARIABLE:
      return property.value;
  }
}

export { toMarkup };
