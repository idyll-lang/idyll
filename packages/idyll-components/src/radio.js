const React = require('react');
const IdyllComponent = require('idyll-component');
let id = 0;

class Radio extends IdyllComponent {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.id = id++;
  }

  onChange(e) {
    this.updateProps({ value: e.target.value });
  }

  render() {
    return (
      <div {...this.props}>
        {this.props.options.map((d) => {
          if (typeof d === 'string') {
            return <label><input type="radio" checked={d === this.props.value} onChange={this.onChange} value={d} name={this.id} />{d}</label>;
          }
          return <label><input type="radio" checked={d.value === this.props.value} onChange={this.onChange} value={d.value} name={this.id} />{d.label || d.value}</label>;
        })}
      </div>
    );
  }
}

module.exports = Radio;
