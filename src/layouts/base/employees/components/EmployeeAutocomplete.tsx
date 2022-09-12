import MDBox from "components/bases/MDBox";
import React, { useCallback, useEffect, useState } from "react";
import { Autocomplete, Checkbox, TextField } from "@mui/material";
import { getAllEmployeesApi } from "layouts/base/employees/api";
import { useAuthenController } from "context/authenContext";
import { Employee } from "models/base/employee";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ListBox from "../../../../components/customizes/AutoComponent/ListBox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

type FieldType = {
  defaultData?: Array<Employee> | null;
  label: string;
  type: "autocomplete" | "autocomplete-multiple";
  PopperComponent?: any;
  handleChoose: (employees: Array<Employee>) => void;
  status?: string;
  minWidth?: number;
};

export default function EmployeeAutocomplete({
  label,
  handleChoose,
  defaultData,
  PopperComponent,
  type,
  status,
  minWidth = 250,
}: FieldType) {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [searchState, setSearchState] = useState("");
  const [options, setOptions] = useState<Array<string>>([]);
  const [employees, setEmployees] = useState<Array<Employee>>([]);

  // @ts-ignore
  const [authController] = useAuthenController();

  // @ts-ignore
  const fetchData = useCallback(
    async ({ page, size, search, isLoadMore, status }) => {
      if (authController.token !== null) {
        const getAllEmployeesResponse = await getAllEmployeesApi({
          token: authController.token,
          page,
          size,
          search,
          status,
        });
        if (getAllEmployeesResponse.data !== null) {
          setTotalPage(getAllEmployeesResponse.data.pageCount);
          if (isLoadMore) {
            setEmployees((prevState) => [...prevState, ...getAllEmployeesResponse.data.data]);
          } else {
            setEmployees(getAllEmployeesResponse.data.data);
          }
        }
      }
    },
    [authController.token]
  );

  // @ts-ignore
  useEffect(() => {
    if (authController.token) {
      fetchData({ page: 0, size: 10, isLoadMore: false, status }).catch(console.error);
    }
  }, [authController.token]);

  const loadMoreResults = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchData({ page: nextPage, size: 10, isLoadMore: true, status }).catch(console.error);
  };

  useEffect(() => {
    setOptions(employees.map((item: Employee) => `${item.code}-${item.name}`));
  }, [employees]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      await fetchData({ page: 0, size: 10, search: searchState, isLoadMore: false, status });
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchState]);

  const handleScroll = (event: any) => {
    const currentNode = event.currentTarget;
    const x = currentNode.scrollTop + currentNode.clientHeight;
    if (currentNode.scrollHeight - x <= 1) {
      if (currentPage < totalPage - 1) {
        loadMoreResults();
      }
    }
  };

  const handleOnChange = (event: any, newOption: Array<string>) => {
    event.stopPropagation();
    const employeeChooses: Array<Employee> = [];
    employees.forEach((item: Employee) => {
      if (newOption.includes(`${item.code}-${item.name}`)) {
        employeeChooses.push(item);
      }
    });
    handleChoose(employeeChooses);
  };

  return (
    <MDBox mb={2} key={label}>
      {type === "autocomplete" ? (
        <Autocomplete
          sx={{ minWidth: `${minWidth}px` }}
          key="field_employee"
          onChange={(event, newOption) => {
            handleOnChange(event, newOption ? Array.of(newOption) : []);
          }}
          value={
            defaultData && defaultData.length > 0
              ? `${defaultData[0].code}-${defaultData[0].name}`
              : undefined
          }
          disablePortal
          noOptionsText="Không tìm thấy nhân sự phù hợp"
          id="employee-autocomplete"
          options={options}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              placeholder="Search..."
              onChange={({ currentTarget }: any) => {
                setSearchState(currentTarget.value);
              }}
              onClick={() => {
                setSearchState("");
              }}
            />
          )}
          ListboxProps={{ style: { maxHeight: "15rem" }, onScroll: handleScroll }}
          ListboxComponent={ListBox}
        />
      ) : (
        <Autocomplete
          value={defaultData ? defaultData.map((item) => `${item.code}-${item.name}`) : undefined}
          key={`fields_${label}`}
          onChange={handleOnChange}
          multiple
          disableCloseOnSelect
          id="tags-filled"
          options={options}
          renderOption={(props, option, { selected }) => (
            <li {...props} style={{ marginBottom: "5px" }}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option}
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              placeholder="Search..."
              onChange={({ currentTarget }: any) => {
                setSearchState(currentTarget.value);
              }}
              onClick={() => {
                setSearchState("");
              }}
            />
          )}
          PopperComponent={PopperComponent}
          ListboxProps={{ style: { maxHeight: "15rem" }, onScroll: handleScroll }}
          ListboxComponent={ListBox}
        />
      )}
    </MDBox>
  );
}
