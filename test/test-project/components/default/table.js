const React = require('react');
const IdyllComponent = require('idyll-component');
const Reactable = require('reactable');
const Table = Reactable.Table;
const Tr = Reactable.Tr;
const Td = Reactable.Td;

class TableComponent extends IdyllComponent {
  render() {
    return (
      <Table className={`table ${this.props.className || ''}`} data={this.props.data} />
    );
  }
}

module.exports = TableComponent;
