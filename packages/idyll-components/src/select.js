const React = require('react');
const IdyllComponent = require('idyll-component');

class Select extends IdyllComponent {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.updateProps({ value: e.target.value });
  }

  render() {
    return (
      <select onChange={this.onChange} {...this.props}>
        {this.props.options.map((d) => {
          if (typeof d === 'string') {
            return <option value={d}>{d}</option>;
          }
          return <option value={d.value}>{d.label || d.value}</option>;
        })}
      </select>
    );
  }
}

module.exports = Select;
