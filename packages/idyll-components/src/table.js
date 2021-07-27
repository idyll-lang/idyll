const React = require('react');
import { useTable, useSortBy, usePagination } from 'react-table';

const CellStyle = {
  flex: '1',
  width: '100px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
};

const RowStyle = { display: 'inline-flex', flexGrow: '1' };

const PaginationStyle = {
  display: 'flex',
  alignItems: 'stretch',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  padding: '3px',
  boxSizing: 'border-box',
  boxShadow: '0 0 15px 0 rgb(0 0 0 / 10%)',
  borderTop: '2px solid rgba(0,0,0,0.1)'
};

const ButtonEnabledStyle = {
  boxSizing: 'border-box',
  margin: 0,
  border: 0,
  borderRadius: '3px',
  padding: '6px',
  fontSize: '1em',
  color: 'rgba(0, 0, 0, 0.6)',
  background: 'rgba(0, 0, 0, 0.1)',
  cursor: 'pointer',
  width: '100%'
};

const ButtonDisabledStyle = {
  ...ButtonEnabledStyle,
  opacity: 0.5,
  cursor: 'default'
};

const PaginationControlStyle = {
  display: 'flex',
  flex: 1,
  textAlign: 'center'
};

const PaginationCenterStyle = {
  display: 'flex',
  flex: 1.5,
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-around'
};

const getPageNumber = (newPageNumber, pageCount) => {
  if (newPageNumber <= 0) {
    return 1;
  } else if (newPageNumber > pageCount) {
    return pageCount;
  } else {
    return newPageNumber;
  }
};

/**
 * Props: data (arr of objects), defaultPageSize (num), showPagination (bool),
 *        showPageSizeOptions (bool), showPageJump (bool), className, value
 *
 *  display
 *  sorting
 *  pagination
 * No rows found
 */
const TableComponent = props => {
  const [pageJumpValue, setPageJumpValue] = React.useState(1);
  const [rowOptionValue, setRowOptionValue] = React.useState(0);

  React.useEffect(
    () => {
      setRowOptionValue(props.defaultPageSize);
    },
    [props.defaultPageSize]
  );

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
  const rowSizes = React.useMemo(
    () => {
      const sizes = [5, 10, 20, 25, 50, 100];
      if (!sizes.includes(props.defaultPageSize)) {
        sizes.unshift(props.defaultPageSize);
      }
      return sizes;
    },
    [props.defaultPageSize]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,

    // pagination
    page,
    canPreviousPage,
    canNextPage,
    pageCount,
    nextPage,
    previousPage,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: props.defaultPageSize }
    },
    useSortBy,
    usePagination
  );

  const onPageJump = e => {
    e.stopPropagation();
    let value = e.target.value;
    if (value !== '' && Number(value) <= 0) {
      value = 1;
    } else if (Number(value) >= pageCount) {
      value = pageCount;
    }

    gotoPage(value === '' ? pageIndex : Number(value) - 1);
    setPageJumpValue(value);
  };

  const onInputBlur = () => {
    if (pageJumpValue === '') {
      setPageJumpValue(pageIndex + 1);
    }
  };

  const onButtonClick = (callback, increment, canIncrement) => {
    if (canIncrement) {
      callback();

      const newPage = getPageNumber(pageIndex + 1 + increment, pageCount);
      setPageJumpValue(newPage);
    }
  };

  const onSortClick = (callback, e) => {
    e.stopPropagation();

    callback(e);
    setPageJumpValue(1);
  };

  const updateDefaultPageSize = e => {
    e.stopPropagation();

    const newPageSize = Number(e.target.value);
    setPageSize(newPageSize);
    setRowOptionValue(newPageSize);

    // page jump handling
    setPageJumpValue(1);
    gotoPage(0);
  };

  return (
    <div>
      <div className={`table ${props.className || ''}`}>
        <table {...getTableProps()} style={{ marginBottom: '0' }}>
          <thead
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              minWidth: `${columns.length * 100}px`
            }}
          >
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()} style={RowStyle}>
                {headerGroup.headers.map(column => {
                  const sortStyle = column.isSorted
                    ? !column.isSortedDesc
                      ? {
                          borderTop: '2px solid black'
                        }
                      : { borderBottom: '2px solid black' }
                    : {};

                  const onSort = column.getSortByToggleProps().onClick;
                  const sortProps = {
                    ...column.getSortByToggleProps,
                    onClick: e => onSortClick(onSort, e)
                  };
                  return (
                    <th
                      {...column.getHeaderProps(sortProps)}
                      style={{
                        ...sortStyle,
                        ...CellStyle,
                        cursor: 'pointer'
                      }}
                    >
                      {column.render('Header')}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody
            {...getTableBodyProps()}
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              minWidth: `${columns.length * 100}px`
            }}
          >
            {page.map((row, i) => {
              // must call this every render
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} style={RowStyle}>
                  {row.cells.map(cell => {
                    return (
                      <td style={CellStyle} {...cell.getCellProps()}>
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div
        className={'table-pagination'}
        style={{
          ...PaginationStyle,
          display:
            props.data.length > props.defaultPageSize && props.showPagination
              ? 'flex'
              : 'none'
        }}
      >
        <div
          className="table-pagination-previous"
          style={PaginationControlStyle}
        >
          <button
            onClick={() => onButtonClick(previousPage, -1, canPreviousPage)}
            disabled={!canPreviousPage}
            style={canPreviousPage ? ButtonEnabledStyle : ButtonDisabledStyle}
          >
            Previous
          </button>
        </div>
        <div className="table-pagination-center" style={PaginationCenterStyle}>
          <span style={{ display: 'flex', alignItems: 'baseline' }}>
            Page{' '}
            {props.showPageJump ? (
              <div className="table-pagination-jump">
                <input
                  type="number"
                  style={{ margin: '10px' }}
                  min={1}
                  max={pageCount}
                  value={pageJumpValue}
                  onChange={onPageJump}
                  onBlur={onInputBlur}
                />
              </div>
            ) : (
              pageIndex + 1
            )}{' '}
            of {pageCount}
          </span>

          {props.showPageSizeOptions ? (
            <span>
              <select value={rowOptionValue} onChange={updateDefaultPageSize}>
                {rowSizes.map(size => (
                  <option value={size}>{`${size} rows`}</option>
                ))}
              </select>
            </span>
          ) : null}
        </div>

        <div className="table-pagination-next" style={PaginationControlStyle}>
          <button
            onClick={() => onButtonClick(nextPage, 1, canNextPage)}
            disabled={!canNextPage}
            style={canNextPage ? ButtonEnabledStyle : ButtonDisabledStyle}
          >
            Next
          </button>
        </div>
      </div>
    </div>
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
  defaultPageSize: 20,
  showPagination: true
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
