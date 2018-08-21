import React from 'react';

class AuthorTool extends React.PureComponent {
  render() {
    const { idyll, updateProps, hasError, ...props } = this.props;
    return (
      <div className="author-tool" {...props} />
    );
  }
}

module.exports = AuthorTool;