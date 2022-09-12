import MDBox from "components/bases/MDBox";
import React, { useCallback, useEffect, useState } from "react";
import { Autocomplete, Checkbox, TextField } from "@mui/material";
import { useAuthenController } from "context/authenContext";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ListBox from "../../../../components/customizes/AutoComponent/ListBox";
import { User } from "models/base/user";
import { getAllUserApi } from "../api";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

type FieldType = {
  defaultData?: Array<User> | null;
  label: string;
  type: "autocomplete" | "autocomplete-multiple";
  handleChoose: (users: Array<User>) => void;
};

export default function UserAutocomplete({
  label,
  handleChoose,
  defaultData,
  type,
}: FieldType) {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [searchState, setSearchState] = useState("");
  const [options, setOptions] = useState<Array<string>>([]);
  const [users, setUsers] = useState<Array<User>>([]);

  // @ts-ignore
  const [authController] = useAuthenController();

  // @ts-ignore
  const fetchData = useCallback(
    async ({ isLoadMore }) => {
      if (authController.token !== null) {
        const getAllUserResponse = await getAllUserApi(authController.token);
        if (getAllUserResponse.data !== null) {
          setTotalPage(getAllUserResponse.data.pageCount);
          if (isLoadMore) {
            setUsers((prevState) => [...prevState, ...getAllUserResponse.data]);
          } else {
            setUsers(getAllUserResponse.data);
          }
        }
      }
    },
    [authController.token]
  );

  // @ts-ignore
  useEffect(() => {
    if (authController.token) {
      fetchData({ page: 0, size: 10, isLoadMore: false }).catch(console.error);
    }
  }, [authController.token]);

  const loadMoreResults = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchData({ page: nextPage, size: 10, isLoadMore: true }).catch(console.error);
  };

  useEffect(() => {
    setOptions([
      ...users.map((item: User) => `${item.id}-${item.username}`),
      `${authController.currentUser.id}-${authController.currentUser.username}`,
    ]);
  }, [users, authController.currentUser]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      await fetchData({ page: 0, size: 10, search: searchState, isLoadMore: false });
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
    const userChooses: Array<User> = [];
    users.push(authController.currentUser);
    users.forEach((item: User) => {
      if (newOption.includes(`${item.id}-${item.username}`)) {
        userChooses.push(item);
      }
    });
    handleChoose(userChooses);
  };

  const getColor = (option: string) => {
    const tmp = users.filter((item: User) => `${item.id}-${item.username}` == option);
    if (tmp.length > 0) {
      if( tmp[0].status === "deleted"){
        return "red"
      };
      if( tmp[0].status === "pending"){
        return "success"
      };
    }
    return "inherit"
  }

  return (
    <MDBox mb={2} key={label}>
      {type === "autocomplete" ? (
        <Autocomplete
          sx={{ minWidth: "250px" }}
          key="field_user"
          onChange={(event, newOption) => {
            handleOnChange(event, newOption ? Array.of(newOption) : []);
          }}
          value={
            defaultData && defaultData.length > 0
              ? `${defaultData[0].id}-${defaultData[0].username}`
              : undefined
          }
          disablePortal
          noOptionsText="Không tìm thấy tài khoản phù hợp"
          id="user-autocomplete"
          options={options}
          renderOption={(props, option, { selected }) => (
            <li {...props} style={{ marginBottom: "5px", color: getColor(option) }}>
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
          ListboxProps={{ style: { maxHeight: "15rem" }, onScroll: handleScroll }}
          ListboxComponent={ListBox}
        />
      ) : (
        <Autocomplete
          value={defaultData ? defaultData.map((item) => `${item.id}-${item.username}`) : undefined}
          key={`fields_${label}`}
          onChange={handleOnChange}
          multiple
          disablePortal
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
          ListboxProps={{ style: { maxHeight: "15rem" }, onScroll: handleScroll }}
          ListboxComponent={ListBox}
        />
      )}
    </MDBox>
  );
}
