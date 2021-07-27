const React = require('react');
import { useTable, useSortBy, usePagination } from 'react-table';

const styles = {
  CELL: {
    flex: '1',
    width: '100px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },

  ROW: { display: 'inline-flex', flexGrow: '1' },

  PAGINATION: {
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    padding: '3px',
    boxSizing: 'border-box',
    boxShadow: '0 0 15px 0 rgb(0 0 0 / 10%)',
    borderTop: '2px solid rgba(0,0,0,0.1)'
  },

  BUTTON_ENABLED: {
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
  },

  BUTTON_DISABLED: {
    boxSizing: 'border-box',
    margin: 0,
    border: 0,
    borderRadius: '3px',
    padding: '6px',
    fontSize: '1em',
    color: 'rgba(0, 0, 0, 0.6)',
    background: 'rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    width: '100%',
    opacity: 0.5,
    cursor: 'default'
  },

  PAGINATION_CONTROL: {
    display: 'flex',
    flex: 1,
    textAlign: 'center'
  },

  PAGINATION_CENTER: {
    display: 'flex',
    flex: 1.5,
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-around'
  },

  NO_ROWS_CONTAINER: {
    textAlign: 'center',
    opacity: '0.5',
    borderBottom: '1px solid #000',
    lineHeight: '0.1em',
    margin: '10px 0 20px'
  },

  NO_ROWS_CONTENT: {
    background: 'white',
    padding: '0 10px'
  }
};

/**
 * Given a new table page number and the table's page
 * count, returns the correct page number within
 * the page count bounds
 * @param {number} newPageNumber the new page number
 * @param {number} pageCount the table's page count
 * @returns a page number within the page count bounds
 */
const getPageNumber = (newPageNumber, pageCount) => {
  if (newPageNumber <= 0) {
    return 1;
  } else if (newPageNumber > pageCount) {
    return pageCount;
  } else {
    return newPageNumber;
  }
};

const TableComponent = props => {
  const [pageJumpValue, setPageJumpValue] = React.useState(1);

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
    if (value != '') {
      value = getPageNumber(Number(value), pageCount);
    }

    gotoPage(value === '' ? pageIndex : Number(value) - 1);
    setPageJumpValue(value);
  };

  const onInputBlur = () => {
    if (pageJumpValue === '') {
      // prevent page from jumping to 0
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

    // page jump handling
    gotoPage(0);
    setPageJumpValue(1);
  };

  return (
    <div className={'table-container'}>
      {data.length === 0 ? (
        <div style={styles.NO_ROWS_CONTAINER}>
          <span style={styles.NO_ROWS_CONTENT}>No Rows Found</span>
        </div>
      ) : (
        // Table
        <div>
          <div className={`table ${props.className || ''}`}>
            <table {...getTableProps()} style={{ marginBottom: '0' }}>
              <TableHeader
                columns={columns}
                headerGroups={headerGroups}
                onSortClick={onSortClick}
              />
              <TableBody
                columns={columns}
                getTableBodyProps={getTableBodyProps}
                prepareRow={prepareRow}
                page={page}
              />
            </table>
          </div>

          {/* Pagination Controls */}
          <div
            className={'table-pagination'}
            style={{
              ...styles.PAGINATION,
              display:
                props.data.length > props.defaultPageSize &&
                props.showPagination
                  ? 'flex'
                  : 'none'
            }}
          >
            <PaginationButton
              className="table-pagination-previous"
              onButtonClick={onButtonClick}
              buttonText={'Previous'}
              pageTurnFunction={previousPage}
              pageTurnIncrement={-1}
              enabled={canPreviousPage}
            />

            <div
              className="table-pagination-center"
              style={styles.PAGINATION_CENTER}
            >
              <span style={{ display: 'flex', alignItems: 'baseline' }}>
                Page{' '}
                {props.showPageJump ? (
                  <PaginationJumpInput
                    pageCount={pageCount}
                    pageJumpValue={pageJumpValue}
                    onPageJump={onPageJump}
                    onInputBlur={onInputBlur}
                  />
                ) : (
                  pageIndex + 1
                )}{' '}
                of {pageCount}
              </span>

              {props.showPageSizeOptions ? (
                <PaginationRowSelect
                  rowOptionValue={pageSize}
                  updateDefaultPageSize={updateDefaultPageSize}
                  rowSizes={rowSizes}
                />
              ) : null}
            </div>

            <PaginationButton
              className="table-pagination-next"
              onButtonClick={onButtonClick}
              buttonText={'Next'}
              pageTurnFunction={nextPage}
              pageTurnIncrement={1}
              enabled={canNextPage}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const TableHeader = props => {
  const { columns, headerGroups, onSortClick } = props;

  return (
    <thead
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minWidth: `${columns.length * 100}px`
      }}
    >
      {headerGroups.map(headerGroup => (
        <tr {...headerGroup.getHeaderGroupProps()} style={styles.ROW}>
          {headerGroup.headers.map((column, i) => {
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
                key={`${column.id}-${i}`}
                style={{
                  ...sortStyle,
                  ...styles.CELL,
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
  );
};

const TableBody = props => {
  const { columns, page, prepareRow, getTableBodyProps } = props;

  return (
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
          <tr
            key={`${row.id}-${row.cells[0].column.Header}-${i}`}
            {...row.getRowProps()}
            style={styles.ROW}
          >
            {row.cells.map((cell, j) => {
              return (
                <td
                  key={`${cell.value}-${j}`}
                  style={styles.CELL}
                  {...cell.getCellProps()}
                >
                  {cell.render('Cell')}
                </td>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  );
};

const PaginationButton = props => {
  const {
    onButtonClick,
    enabled,
    buttonText,
    pageTurnFunction,
    pageTurnIncrement,
    ...rest
  } = props;

  return (
    <div {...rest} style={styles.PAGINATION_CONTROL}>
      <button
        onClick={() =>
          onButtonClick(pageTurnFunction, pageTurnIncrement, enabled)
        }
        disabled={!enabled}
        style={enabled ? styles.BUTTON_ENABLED : styles.BUTTON_DISABLED}
      >
        {buttonText}
      </button>
    </div>
  );
};

const PaginationJumpInput = props => {
  const { pageCount, pageJumpValue, onPageJump, onInputBlur } = props;

  return (
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
  );
};

const PaginationRowSelect = props => {
  const { rowOptionValue, updateDefaultPageSize, rowSizes } = props;

  return (
    <span>
      <select value={rowOptionValue} onChange={updateDefaultPageSize}>
        {rowSizes.map(size => (
          <option
            key={`table-row-size-${size}`}
            value={size}
          >{`${size} rows`}</option>
        ))}
      </select>
    </span>
  );
};

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
