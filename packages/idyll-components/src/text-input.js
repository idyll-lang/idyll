import React, { Fragment } from 'react';
class TextInput extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.state = { error: { msg: '', isError: false } };
  }

  onChange(e) {
    const value = e.target.value || '';
    const pattern = this.props.pattern;

    this.props.updateProps({ value: value });

    if (pattern) {
      try {
        if (!value.match(pattern)) {
          throw new Error(`Input value doesn't match pattern`);
        }

        eval(value); //check if there's JS syntax errors
        this.setState({ error: { msg: '', isError: false } });
      } catch (err) {
        this.setState({
          error: {
            msg: err.message || 'Input value is not valid',
            isError: true
          }
        });
      }
    }
  }

  render() {
    const { error } = this.state;
    const { idyll, hasError, updateProps, ...props } = this.props;
    return (
      <Fragment>
        <input
          className={error.isError ? 'idyll-input-error' : ''}
          onClick={this.props.onClick || (e => e.stopPropagation())}
          type="text"
          onChange={this.onChange}
          {...props}
        />
        {error.isError && (
          <span className="idyll-input-error">{error.msg}</span>
        )}
      </Fragment>
    );
  }
}

TextInput._idyll = {
  name: 'TextInput',
  tagType: 'closed',
  props: [
    {
      name: 'value',
      type: 'string',
      example: 'x',
      description: 'The current value of the text entry box.'
    },
    {
      name: 'pattern',
      type: 'object',
      example: '/w+/',
      description: 'A regex pattern to validate input field'
    }
  ]
};

export default TextInput;
