const React = require('react');
const { mapChildren } = require('idyll-component-children');

class Loop extends React.Component {
  render() {
    const { children, value } = this.props;

    if (children) {
      return value.map(val => {
        return mapChildren(children, child => {
          if (typeof child !== 'object') {
            return child;
          }
          let newProps = Object.assign({}, child.props);
          newProps = Object.keys(child.props).reduce((props, elm) => {
            if (props[elm] === '_iterator') {
              props[elm] = val;
              return props;
            }
            return props;
          }, newProps);
          return React.cloneElement(child, { ...newProps });
        });
      });
    }
    return null;
  }
}

Loop._idyll = {
  name: 'Loop',
  tagType: 'open',
  children: ['Item [Display value:"_iterator" /] [br/]'],
  props: [
    {
      name: 'value',
      type: 'array',
      example: "`['one', 'two', 'three']`",
      description: 'Array of values to map.'
    }
  ]
};
module.exports = Loop;
