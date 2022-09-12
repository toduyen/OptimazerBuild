import React, { useEffect, useMemo, useState } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// react-table components
import { useGlobalFilter, usePagination, useRowSelect, useSortBy, useTable } from "react-table";

// @mui material components
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Icon from "@mui/material/Icon";
import Autocomplete from "@mui/material/Autocomplete";

// Material Dashboard 2 React components
import MDBox from "components/bases/MDBox";
import MDTypography from "components/bases/MDTypography";
import MDInput from "components/bases/MDInput";
import MDPagination from "components/bases/MDPagination";

// Material Dashboard 2 React example components
import DataTableHeadCell from "components/customizes/Tables/DataTable/DataTableHeadCell";
import DataTableBodyCell from "components/customizes/Tables/DataTable/DataTableBodyCell";
import { Checkbox, Tooltip } from "@mui/material";
import {
  hideLoading,
  showLoading,
  useSnackbarController,
} from "../../../../context/snackbarContext";

// eslint-disable-next-line react/prop-types
const IndeterminateCheckbox = React.forwardRef(({ indeterminate, ...rest }: any, ref) => {
  const defaultRef = React.useRef();
  const resolvedRef = ref || defaultRef;

  React.useEffect(() => {
    // @ts-ignore
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return <Checkbox ref={resolvedRef} {...rest} />;
});

type Props = {
  entriesPerPage: any;
  canSearch: boolean;
  showTotalEntries: boolean;
  table: { columns: any; rows: any };
  pagination: any;
  isSorted: boolean;
  noEndBorder: boolean;
  showCheckAll: boolean;
  fetchData?: ({
    page,
    size,
    search,
  }: {
    page: number;
    size: number;
    search: string;
  }) => Promise<void>;
  pageCount?: number;
  itemCount?: number;
  formFilter?: () => React.ReactElement;
};

function DataTable({
  entriesPerPage,
  canSearch,
  showTotalEntries,
  table,
  pagination,
  isSorted,
  noEndBorder,
  showCheckAll,
  fetchData,
  pageCount: controlledPageCount,
  itemCount,
  formFilter,
}: Props) {
  const defaultValue = entriesPerPage.defaultValue ? entriesPerPage.defaultValue : 10;
  const entries = entriesPerPage.entries
    ? entriesPerPage.entries.map((el: any) => el.toString())
    : ["5", "10", "15", "20", "25"];
  const columns = useMemo(() => table.columns, [table]);
  const data = useMemo(() => table.rows, [table]);
  const manualPagination = !!controlledPageCount;

  // @ts-ignore
  const [, snackbarDispatch] = useSnackbarController();

  const tableInstance = useTable(
    {
      columns,
      data,
      // @ts-ignore
      initialState: { pageIndex: 0 },
      manualPagination,
      manualSortBy: true,
      autoResetPage: false,
      pageCount: controlledPageCount,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      // eslint-disable-next-line no-shadow
      hooks.visibleColumns.push((columns) =>
        showCheckAll
          ? [
              // Let's make a column for selection
              {
                id: "selection",
                // eslint-disable-next-line react/prop-types,react/no-unstable-nested-components
                Header: ({ getToggleAllRowsSelectedProps }: any) => (
                  <div>
                    <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
                  </div>
                ),
                // eslint-disable-next-line react/prop-types,react/no-unstable-nested-components
                Cell: ({ row }: any) => (
                  <div>
                    {/* eslint-disable-next-line react/prop-types */}
                    <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                  </div>
                ),
                width: "50px",
              },
              ...columns,
            ]
          : columns
      );
    }
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    page,
    pageOptions,
    canPreviousPage,
    canNextPage,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter,
    selectedFlatRows,
    state: { pageIndex, pageSize, globalFilter, selectedRowIds },
  }: any = tableInstance;

  // Set the default value for the entries per page when component mounts
  useEffect(() => setPageSize(defaultValue || 10), [defaultValue]);
  // Set the entries per page value based on the select value
  const setEntriesPerPage = (value: any) => setPageSize(value);

  // Render the paginations
  const renderPagination = pageOptions.map((option: any) => (
    <MDPagination
      item
      key={option}
      onClick={() => gotoPage(Number(option))}
      active={pageIndex === option}
    >
      {option + 1}
    </MDPagination>
  ));

  // Handler for the input to set the pagination index
  const handleInputPagination = ({ target: { value } }: { target: { value: number } }) =>
    value > pageOptions.length || value < 0 ? gotoPage(0) : gotoPage(Number(value));

  // Customized page options starting from 1
  const customizedPageOptions = pageOptions.map((option: number) => option + 1);

  // Setting value for the pagination input
  const handleInputPaginationValue = ({ target: value }: { target: { value: number } }) =>
    gotoPage(Number(value.value - 1));

  // Search input value state
  const [search, setSearch] = useState(globalFilter || "");

  // Search input state handle
  const onSearchChange = (value: string) => {
    setSearch(value);
    if (!itemCount) {
      setGlobalFilter(value || undefined);
    }
  };

  // A function that sets the sorted value for the table
  const setSortedValue = (column: any) => {
    let sortedValue;

    if (isSorted && column.isSorted) {
      sortedValue = column.isSortedDesc ? "desc" : "asce";
    } else if (isSorted) {
      sortedValue = "none";
    } else {
      sortedValue = false;
    }

    return sortedValue;
  };

  // Setting the entries starting point
  const entriesStart = pageIndex === 0 ? pageIndex + 1 : pageIndex * pageSize + 1;

  // Setting the entries ending point
  let entriesEnd;

  if (pageIndex === 0) {
    entriesEnd = pageSize;
  } else if (pageIndex === pageOptions.length - 1) {
    entriesEnd = itemCount || rows.length;
  } else {
    entriesEnd = pageSize * (pageIndex + 1);
  }

  // @ts-ignore
  useEffect(async () => {
    // eslint-disable-next-line no-unused-expressions
    if (fetchData) {
      showLoading(snackbarDispatch);
      await fetchData({ page: pageIndex, size: pageSize, search });
      hideLoading(snackbarDispatch);
    }
  }, [fetchData, pageIndex, pageSize]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (fetchData) {
      const delayDebounceFn = setTimeout(async () => {
        showLoading(snackbarDispatch);
        await fetchData({ page: pageIndex, size: pageSize, search });
        hideLoading(snackbarDispatch);
      }, 1000);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [search]);

  return (
    <>
      {entriesPerPage || canSearch ? (
        <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
          {entriesPerPage && (
            <MDBox display="flex" alignItems="center">
              <Autocomplete
                disableClearable
                value={pageSize.toString()}
                options={entries}
                onChange={(event, newValue) => {
                  setEntriesPerPage(parseInt(newValue, 10));
                }}
                size="small"
                sx={{ width: "5rem" }}
                renderInput={(params) => <MDInput {...params} />}
                ListboxProps={{ style: { maxHeight: "15rem" } }}
              />
              <MDTypography variant="caption" color="secondary">
                &nbsp;&nbsp;entries per page
              </MDTypography>
            </MDBox>
          )}
          {canSearch && (
            <MDBox width="12rem" ml="auto">
              <MDInput
                placeholder="Tìm kiếm..."
                value={search}
                size="small"
                fullWidth
                onChange={({ currentTarget }: any) => {
                  onSearchChange(currentTarget.value);
                }}
              />
            </MDBox>
          )}
          {formFilter && formFilter()}
        </MDBox>
      ) : null}
      <TableContainer sx={{ boxShadow: "none" }}>
        <Table {...getTableProps()}>
          <MDBox component="thead">
            {headerGroups.map((headerGroup: any, index: number) => (
              <TableRow {...headerGroup.getHeaderGroupProps()} key={`headerGroup_${index}`}>
                {headerGroup.headers.map((column: any, i: number) => (
                  <DataTableHeadCell
                    key={`header_${i}`}
                    {...column.getHeaderProps(isSorted && column.getSortByToggleProps())}
                    width={column.width ? column.width : "auto"}
                    align={column.align ? column.align : "left"}
                    sorted={setSortedValue(column)}
                  >
                    {column.render("Header")}
                  </DataTableHeadCell>
                ))}
              </TableRow>
            ))}
          </MDBox>
          <TableBody {...getTableBodyProps()}>
            {page.map((row: any, key: number) => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()} key={`row_${key}`}>
                  {row.cells.map((cell: any, i: number) => (
                    <DataTableBodyCell
                      key={`cell_${i}`}
                      noBorder={noEndBorder && rows.length - 1 === key}
                      align={cell.column.align ? cell.column.align : "left"}
                      {...cell.getCellProps()}
                    >
                      {cell.render("Cell")}
                    </DataTableBodyCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <MDBox
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        p={!showTotalEntries && pageOptions.length === 1 ? 0 : 3}
      >
        {showTotalEntries && (
          <MDBox mb={{ xs: 3, sm: 0 }}>
            <MDTypography variant="button" color="secondary" fontWeight="regular">
              Showing {entriesStart} to {entriesEnd} of {itemCount || rows.length} entries
            </MDTypography>
          </MDBox>
        )}
        {pageOptions.length > 1 && (
          <MDPagination
            variant={pagination.variant ? pagination.variant : "gradient"}
            color={pagination.color ? pagination.color : "info"}
          >
            {canPreviousPage && (
              <MDPagination item onClick={() => previousPage()}>
                <Icon sx={{ fontWeight: "bold" }}>chevron_left</Icon>
              </MDPagination>
            )}
            {renderPagination.length > 6 ? (
              <MDBox width="5rem" mx={1}>
                <Tooltip title="Click đúp để sửa giá trị" style={{ width: "100%" }}>
                  <MDInput
                    inputProps={{ type: "number", min: 1, max: customizedPageOptions.length }}
                    value={customizedPageOptions[pageIndex]}
                    // @ts-ignore
                    onChange={(handleInputPagination, handleInputPaginationValue)}
                  />
                </Tooltip>
              </MDBox>
            ) : (
              renderPagination
            )}
            {canNextPage && (
              <MDPagination item onClick={() => nextPage()}>
                <Icon sx={{ fontWeight: "bold" }}>chevron_right</Icon>
              </MDPagination>
            )}
          </MDPagination>
        )}
      </MDBox>
    </>
  );
}

// Setting default values for the props of DataTable
DataTable.defaultProps = {
  entriesPerPage: { defaultValue: 10, entries: [5, 10, 15, 20, 25] },
  canSearch: false,
  showTotalEntries: true,
  pagination: { variant: "gradient", color: "info" },
  isSorted: true,
  noEndBorder: false,
};

// Typechecking props for the DataTable
DataTable.propTypes = {
  entriesPerPage: PropTypes.oneOfType([
    PropTypes.shape({
      defaultValue: PropTypes.number,
      entries: PropTypes.arrayOf(PropTypes.number),
    }),
    PropTypes.bool,
  ]),
  canSearch: PropTypes.bool,
  showTotalEntries: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  table: PropTypes.objectOf(PropTypes.array).isRequired,
  pagination: PropTypes.shape({
    variant: PropTypes.oneOf(["contained", "gradient"]),
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "dark",
      "light",
    ]),
  }),
  isSorted: PropTypes.bool,
  noEndBorder: PropTypes.bool,
};

export default DataTable;
