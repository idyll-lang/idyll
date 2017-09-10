const React = require('react');
const Reactable = require('reactable');
const Table = Reactable.Table;
const Tr = Reactable.Tr;
const Td = Reactable.Td;

class TableComponent extends React.PureComponent {
  render() {
    return (
      <Table className={`table ${this.props.className || ''}`} data={this.props.data} />
    );
  }
}

module.exports = TableComponent;
