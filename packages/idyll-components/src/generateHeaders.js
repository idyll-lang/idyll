import React from 'react';

const generateId = (headerText = '') => {
  return headerText
    .toString()
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase();
};

const GenerateHeaders = props => {
  const {
    idyll,
    hasError,
    updateProps,
    size,
    children = [],
    ...attributeProps
  } = props;

  const headerText = children.join('');
  const HeaderTag = `h${size}`;

  if (!attributeProps.id) {
    attributeProps.id = generateId(headerText);
  }

  return <HeaderTag {...attributeProps}>{children}</HeaderTag>;
};

export default GenerateHeaders;
