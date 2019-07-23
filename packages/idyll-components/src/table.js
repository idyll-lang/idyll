const React = require('react');
const Table = require('react-table').default;

class TableComponent extends React.PureComponent {
  getColumns() {
    if (this.props.columns) {
      if (
        this.props.columns.length &&
        typeof this.props.columns[0] === 'string'
      ) {
        return this.props.columns.map(d => {
          return {
            Header: d,
            accessor: d
          };
        });
      }

      return this.props.columns;
    }
    if ((this.props.data || []).length) {
      return Object.keys(this.props.data[0])
        .filter(d => d !== '')
        .map(d => {
          return {
            Header: d,
            accessor: d
          };
        });
    }

    return [];
  }
  render() {
    let { idyll, hasError, updateProps, ...props } = this.props;
    if (!props.data && props.value) {
      props.data = props.value;
    }
    return (
      <Table
        className={`table ${props.className || ''}`}
        showPagination={props.data.length > props.defaultPageSize}
        minRows={
          props.data.length <= props.defaultPageSize
            ? props.data.length
            : undefined
        }
        {...props}
        children={undefined}
        columns={this.getColumns()}
      />
    );
  }
}

TableComponent.defaultProps = {
  data: [],
  showPageSizeOptions: false,
  showPageJump: false,
  defaultPageSize: 20
};

TableComponent._idyll = {
  name: 'Table',
  tagType: 'closed',
  props: [
    {
      name: 'data',
      type: 'array',
      description:
        'The data to be shown in a table. Should be an array of object.',
      example: '`[{name: "A", value: 0}, {name: "B", value: 5}]`'
    },
    {
      name: 'defaultPageSize',
      type: 'number',
      example: '10',
      description: 'The number of datapoints to be shown on a page.',
      defaultValue: '20'
    },
    {
      name: 'showPagination',
      type: 'boolean',
      example: 'false',
      description: 'Show next and previous page buttons.',
      defaultValue: 'true'
    },
    {
      name: 'showPageSizeOptions',
      type: 'boolean',
      example: 'false',
      description: 'Show options to configure page size.',
      defaultValue: 'false'
    },
    {
      name: 'showPageJump',
      type: 'boolean',
      example: 'false',
      description: 'Show page jump option.',
      defaultValue: 'false'
    }
  ]
};

export default TableComponent;
