const React = require('react');
const Table = require('react-table').default;

class TableComponent extends React.PureComponent {
  getColumns() {
    if (this.props.columns) {
      if (this.props.columns.length && typeof this.props.columns[0] === 'string') {
        return this.props.columns.map((d) => {
          return {
            Header: d,
            accessor: d
          };
        })
      }

      return this.props.columns;
    }
    if ((this.props.data || []).length) {
      return Object.keys(this.props.data[0]).map((d) => {
        return {
          Header: d,
          accessor: d
        }
      })
    }

    return [];
  }
  render() {
    return (
      <Table
        className={`table ${this.props.className || ''}`}
        minRows={(this.props.data || []).length}
        {...this.props}
        children={undefined}
        columns={this.getColumns()}
         />
    );
  }
}

TableComponent.defaultProps = {
  showPagination: false,
  showPageSizeOptions: false,
  showPageJump: false
}

module.exports = TableComponent;
