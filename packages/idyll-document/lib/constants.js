'use strict';

var COMPONENTS = {
  Variable: 'var',
  Derived: 'derived',
  Dataset: 'data'
};

var PROPERTIES = {
  Expression: 'expression',
  Variable: 'variable',
  Value: 'value',
  Function: 'function'
};

var VARIABLE = {
  Name: 'name',
  Value: 'value'
};

var DATASET = {
  Name: 'name',
  Source: 'source'
};

var DERIVED = {
  Name: 'name',
  Value: 'value'
};

module.exports = {
  COMPONENTS: COMPONENTS,
  PROPERTIES: PROPERTIES,
  VARIABLE: VARIABLE,
  DERIVED: DERIVED,
  DATASET: DATASET
};