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
import { Checkbox, IconButton, Popper, TableCell, TextField, Tooltip } from "@mui/material";
import { Employee } from "../../../../models/base/employee";

import MDButton from "../../../../components/bases/MDButton";
import { getEmployeeFromName } from "../util";
import {
  hideLoading,
  showLoading,
  showSnackbar,
  useSnackbarController,
} from "../../../../context/snackbarContext";
import { DELETED_TYPE, ERROR_TYPE, SUCCESS_TYPE, UPDATE_SUCCESS } from "../../../../constants/app";
import { changeManagerApi, getAllEmployeesApi, updateEmployeeApi } from "../api";
import { Shift } from "../../../../models/time-keeping/shift";
import { useAuthenController } from "../../../../context/authenContext";
import {
  getAllEmployeeSuccess,
  updateEmployeeSuccess,
  useEmployeeController,
} from "../../../../context/employeeContext";
import { convertStatusToString } from "../../../../utils/helpers";

function StyleTextComponent({ field }: { field: any }) {
  return (
    <MDBox
      display="inline-block"
      width="max-content"
      color="text"
      sx={{ verticalAlign: "middle", fontSize: "0.875rem" }}
    >
      {field}
    </MDBox>
  );
}

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

function DataTableEmployee({
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
  const [employeeRows, setEmployeeRows] = useState(data);

  const manualPagination = !!controlledPageCount;

  useEffect(() => {
    setEmployeeRows(table.rows);
  }, [table]);
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
    state: { pageIndex, pageSize },
  }: any = tableInstance;

  // Set the default value for the entries per page when component mounts
  useEffect(() => setPageSize(defaultValue || 10), [defaultValue]);

  // Set the entries per page value based on the select value
  const setEntriesPerPage = (value: any) => {
    setPageSize(value);
    setEmployeeRows(data.slice(0, value));
  };

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
  const [search, setSearch] = useState<string>("");

  // Search input state handle
  // const onSearchChange = (value: string) => {
  // setEmployeeRows(
  //   data.filter(
  //     (employeeRow: any) =>
  //       employeeRow.manager.toLowerCase().includes(value.toLowerCase()) ||
  //       employeeRow.employees.filter((employee: any) =>
  //         employee.name.toLowerCase().includes(value.toLowerCase())
  //       ).length > 0
  //   )
  // );
  // };

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

  const [openItem, setOpenItem] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  // @ts-ignore
  const [authController, authDispatch] = useAuthenController();
  // @ts-ignore
  const [employeeController, employeeDispatch] = useEmployeeController();
  // @ts-ignore
  const [snackbarController, snackbarDispatch] = useSnackbarController();
  const [newManagerName, setNewManager] = useState<any>(null);

  const handleCloseMenu = () => {
    setOpenItem(null);
    setAnchorEl(null);
  };
  const handleChangeManager = (
    event: React.MouseEvent<HTMLButtonElement>,
    manager: { manager: string; employees: Array<any> }
  ) => {
    event.stopPropagation();
    if (manager.manager !== "") {
      if (manager.manager === openItem) {
        setOpenItem(null);
      } else {
        setOpenItem(manager.manager);
      }
    } else if (manager.employees[0].code === openItem) {
      setOpenItem(null);
    } else {
      setOpenItem(manager.employees[0].code);
    }
    setAnchorEl(event.currentTarget);
  };

  const submitChangeManager = async (manager: { manager: string; employees: Array<any> }) => {
    if (manager.manager === undefined || manager.manager.trim() === "") {
      const newManager = getEmployeeFromName(employeeController.employees, newManagerName);
      const employee = getEmployeeFromName(
        employeeController.employees,
        `${manager.employees[0].code}-${manager.employees[0].name}`
      );
      if (employee !== null) {
        const changeManagerResponse = await updateEmployeeApi({
          token: authController.token,
          employeeId: employee.id,
          avatar: null,
          name: employee.name,
          code: employee.code,
          phone: employee.phone,
          email: employee.email,
          managerId: newManager!.id,
          shifts: `[${employee.shifts.map((shift: Shift) => shift.id).join(",")}]`,
          areaEmployee: "",
        });
        if (changeManagerResponse.data !== null) {
          updateEmployeeSuccess(employeeDispatch, changeManagerResponse.data);
          showSnackbar(snackbarDispatch, {
            typeSnackbar: SUCCESS_TYPE,
            messageSnackbar: UPDATE_SUCCESS,
          });
          setAnchorEl(null);
        } else {
          showSnackbar(snackbarDispatch, {
            typeSnackbar: ERROR_TYPE,
            messageSnackbar: changeManagerResponse.messageError,
          });
        }
      }
    } else {
      const oldManager = getEmployeeFromName(employeeController.employees, manager.manager);
      const newManager = getEmployeeFromName(employeeController.employees, newManagerName);
      if (oldManager !== null && newManager !== null) {
        const changeManagerResponse = await changeManagerApi({
          token: authController.token,
          oldManagerId: oldManager.id,
          newManagerId: newManager.id,
        });
        if (changeManagerResponse.data !== null) {
          const getAllEmployeesResponse = await getAllEmployeesApi({
            token: authController.token,
            page: 0,
            size: parseInt(pageSize, 10),
          });
          if (getAllEmployeesResponse.data !== null) {
            getAllEmployeeSuccess(employeeDispatch, getAllEmployeesResponse.data.data);
          }

          showSnackbar(snackbarDispatch, {
            typeSnackbar: SUCCESS_TYPE,
            messageSnackbar: UPDATE_SUCCESS,
          });
          setAnchorEl(null);
        } else {
          showSnackbar(snackbarDispatch, {
            typeSnackbar: ERROR_TYPE,
            messageSnackbar: changeManagerResponse.messageError,
          });
        }
      }
    }
  };
  const getOptions = (manager: { manager: string; employees: Array<any> }) => {
    const managerChoosed =
      manager.manager !== ""
        ? employeeController.employees.filter(
            (employee: Employee) =>
              employee.name === openItem?.split("-")[1] && employee.code === openItem?.split("-")[0]
          )[0]
        : null;

    if (managerChoosed === null) {
      const employee = getEmployeeFromName(
        employeeController.employees,
        `${manager.employees[0].code}-${manager.employees[0].name}`
      );

      if (employee !== null) {
        const minusIdList = employee.employees.map((item) => item.id);
        minusIdList.push(employee.id);
        const matchList = employeeController.employees.filter(
          (item: Employee) => minusIdList.indexOf(item.id) < 0
        );
        return matchList.map((item: Employee) => `${item.code}-${item.name}`);
      }
    } else {
      const minusIdList = managerChoosed.employees.map((item: Employee) => item.id);
      minusIdList.push(managerChoosed.id);
      managerChoosed.employees.forEach((item: Employee) => {
        minusIdList.concat(item.employees.map((item2: Employee) => item2.id));
      });
      const matchList = employeeController.employees.filter(
        (item: Employee) => minusIdList.indexOf(item.id) < 0
      );
      return matchList.map((employee: Employee) => `${employee.code}-${employee.name}`);
    }
    return [];
  };
  // Render the notifications menu
  const renderChangeManagerForm = (manager: {
    manager: string;
    employees: Array<any>;
  }): React.ReactElement => {
    // @ts-ignore
    let options = [];
    if (
      manager.manager === openItem ||
      (manager.manager === "" && manager.employees[0].code === openItem)
    ) {
      options = getOptions(manager);
    }

    return (
      <Popper
        // @ts-ignore
        anchorEl={anchorEl}
        // @ts-ignore
        anchorReference={null}
        placement="bottom-start"
        open={Boolean(
          manager.manager === openItem ||
            (manager.manager === "" && manager.employees[0].code === openItem)
        )}
        onClose={handleCloseMenu}
        style={{
          backgroundColor: "white",
          boxShadow: "0px 0px 12px 0px #000000",
          padding: "8px",
          borderRadius: "8px",
        }}
      >
        <MDBox display="flex" style={{ marginTop: "16px" }}>
          <Autocomplete
            sx={{ minWidth: "250px" }}
            key="field_change_manager"
            onChange={(event, newOption) => {
              event.stopPropagation();
              setNewManager(newOption);
            }}
            disablePortal
            noOptionsText="Không tìm thấy nhân sự phù hợp"
            id="autocomplete"
            options={options}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Danh sách nhân sự"
                placeholder="Search..."
                onClick={(event) => {
                  event.stopPropagation();
                }}
              />
            )}
            ListboxProps={{ style: { maxHeight: "15rem" } }}
          />
          <MDButton
            variant="gradient"
            color="info"
            fullWidth
            onClick={async (event: any) => {
              event.stopPropagation();
              showLoading(snackbarDispatch);
              await submitChangeManager(manager);
              hideLoading(snackbarDispatch);
            }}
            sx={{ marginLeft: "8px" }}
          >
            Xác nhận
          </MDButton>
        </MDBox>
      </Popper>
    );
  };
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
                  setSearch(currentTarget.value);
                  // onSearchChange(currentTarget.value);
                }}
              />
            </MDBox>
          )}
          {formFilter && formFilter()}
        </MDBox>
      ) : null}
      <TableContainer sx={{ boxShadow: "none" }} onClick={handleCloseMenu}>
        <Table {...getTableProps()}>
          <MDBox component="thead">
            {headerGroups.map((headerGroup: any, index: number) => (
              <TableRow {...headerGroup.getHeaderGroupProps()} key={`headerGroup_${index}`}>
                {headerGroup.headers.map((column: any, indexHeader: number) => (
                  <DataTableHeadCell
                    key={`header_${indexHeader}`}
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
            {employeeRows.map((manager: any, key: number) => (
              <React.Fragment key={`row_${key}`}>
                <TableRow>
                  <TableCell rowSpan={manager.employees.length + 1}>
                    {manager.manager === "" &&
                    manager.employees.length === 1 &&
                    manager.employees[0].status.props.children === DELETED_TYPE ? (
                      <div />
                    ) : (
                      <MDBox
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <StyleTextComponent field={manager.manager} />
                        <IconButton
                          size="small"
                          disableRipple
                          color="inherit"
                          onClick={(event) => handleChangeManager(event, manager)}
                        >
                          <Icon sx={{ color: "green" }} fontSize="small">
                            change_circle_outlined
                          </Icon>
                          <MDTypography sx={{ color: "green", fontSize: "0.8rem" }}>
                            Thay đổi
                          </MDTypography>
                        </IconButton>
                        {renderChangeManagerForm(manager)}
                      </MDBox>
                    )}
                  </TableCell>
                </TableRow>
                {manager.employees.map((employee: any, i: number) => (
                  <TableRow key={`row_${i}`}>
                    {Object.keys(employee)
                      .slice(1) // Dont show id
                      .map((attr, j: number) => (
                        <TableCell key={`cell_${j}`}>
                          <StyleTextComponent field={employee[attr]} />
                        </TableCell>
                      ))}
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
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
                <Tooltip title="Click đúp để sửa giá trị">
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
DataTableEmployee.defaultProps = {
  entriesPerPage: { defaultValue: 10, entries: [5, 10, 15, 20, 25] },
  canSearch: false,
  showTotalEntries: true,
  pagination: { variant: "gradient", color: "info" },
  isSorted: true,
  noEndBorder: false,
};

// Typechecking props for the DataTable
DataTableEmployee.propTypes = {
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

export default DataTableEmployee;
