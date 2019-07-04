import React from 'react';

const generateId = (headerText = '') => {
  return headerText
    .toString()
    .replace(/\s+/g, '-')
    .toLowerCase();
};

const GenerateHeaders = props => {
  const { size, children = [] } = props;
  const headerText = children.join('');
  const generatedId = generateId(headerText);
  const HeaderTag = `h${size}`;
  return <HeaderTag id={generatedId}>{headerText}</HeaderTag>;
};

export default GenerateHeaders;
