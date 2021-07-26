const React = require('react');
import { useTable, useSortBy } from 'react-table';

/**
 * Props: data (arr of objects), defaultPageSize (num), showPagination (bool),
 *        showPageSizeOptions (bool), showPageJump (bool), className, value
 *
 *  display
 *  sorting
 *  pagination
 */
const TableComponent = props => {
  if (!props.data && props.value) {
    props.data = props.value;
  }

  // create data and columns
  const data = React.useMemo(() => props.data, [props.data]);
  const columns = React.useMemo(
    () => {
      if ((props.data || []).length) {
        return Object.keys(props.data[0])
          .filter(d => d !== '')
          .map(d => {
            return {
              Header: d,
              accessor: d
            };
          });
      }
      return [];
    },
    [props.data]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({ columns, data }, useSortBy);

  return (
    <table {...getTableProps()} className={`table ${props.className || ''}`}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => {
              const sortStyle = column.isSorted
                ? !column.isSortedDesc
                  ? {
                      borderTop: '2px solid black'
                    }
                  : { borderBottom: '2px solid black' }
                : {};
              return (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  style={{ ...sortStyle, cursor: 'pointer' }}
                >
                  {column.render('Header')}
                </th>
              );
            })}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          // must call this every render
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
// class TableComponent extends React.PureComponent {
// getColumns() {
//   if (this.props.columns) {
//     if (
//       this.props.columns.length &&
//       typeof this.props.columns[0] === 'string'
//     ) {
//       return this.props.columns.map(d => {
//         return {
//           Header: d,
//           accessor: d
//         };
//       });
//     }

//     return this.props.columns;
//   }
// if ((this.props.value || this.props.data || []).length) {
//   return Object.keys((this.props.value || this.props.data)[0])
//     .filter(d => d !== '')
//     .map(d => {
//       return {
//         Header: d,
//         accessor: d
//       };
//     });
//   }

//   return [];
// }
//   render() {
//     let { idyll, hasError, updateProps, ...props } = this.props;
//     if (!props.data && props.value) {
//       props.data = props.value;
//     }
//     return (
//       <Table
//         className={`table ${props.className || ''}`}
//         showPagination={props.data.length > props.defaultPageSize}
//         minRows={
//           props.data.length <= props.defaultPageSize
//             ? props.data.length
//             : undefined
//         }
//         {...props}
//         children={undefined}
//         columns={this.getColumns()}
//       />
//     );
//   }
// }

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
        'The data to be shown in a table. Should be an array of objects. Alias: data',
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
