import React from 'react';

class Inline extends React.PureComponent {
  render() {
    return (
      <div style={{ display: 'inline-block', ...this.props.style }}>
        {this.props.children}
      </div>
    );
  }
}

Inline._idyll = {
  name: 'Inline',
  tagType: 'open',
  children: [
    `[div style:\`{width: 100, height: 100, background: red}\` /][div style:\`{width: 100, height: 100, background: blue}\` /][div style:\`{width: 100, height: 100, background: green}\` /]`
  ]
};

export default Inline;
