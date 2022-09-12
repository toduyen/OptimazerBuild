import MDBox from "components/bases/MDBox";
import React, { useCallback, useEffect, useState } from "react";
import { Autocomplete, Checkbox, TextField } from "@mui/material";
import { useAuthenController } from "context/authenContext";
import { Location } from "models/base/location";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { getAllLocationApi } from "../api";
import ListBox from "../../../../components/customizes/AutoComponent/ListBox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

type FieldType = {
  defaultData?: Array<Location> | null;
  label: string;
  type: "autocomplete" | "autocomplete-multiple";
  handleChoose: (locations: Array<Location>) => void;
};

export default function LocationAutocomplete({
  label,
  handleChoose,
  defaultData,
  type,
}: FieldType) {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [searchState, setSearchState] = useState("");
  const [options, setOptions] = useState<Array<string>>([]);
  const [locations, setLocations] = useState<Array<Location>>([]);

  // @ts-ignore
  const [authController] = useAuthenController();

  // @ts-ignore
  const fetchData = useCallback(
    async ({ page, size, search, isLoadMore }) => {
      if (authController.token !== null) {
        const getAllLocationsResponse = await getAllLocationApi({
          token: authController.token,
          page,
          size,
          search,
        });

        if (getAllLocationsResponse.data !== null) {
          setTotalPage(getAllLocationsResponse.data.pageCount);
          if (isLoadMore) {
            setLocations((prevState) => [...prevState, ...getAllLocationsResponse.data.data]);
          } else {
            setLocations(getAllLocationsResponse.data.data);
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
    setOptions(locations.map((item: Location) => item.name));
  }, [locations]);

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
    const locationChooses: Array<Location> = [];
    locations.forEach((item: Location) => {
      if (newOption.includes(item.name)) {
        locationChooses.push(item);
      }
    });
    handleChoose(locationChooses);
  };

  return (
    <MDBox mb={2} key={label}>
      {type === "autocomplete" ? (
        <Autocomplete
          sx={{ minWidth: "250px" }}
          key="field_location"
          onChange={(event, newOption) => {
            handleOnChange(event, newOption ? Array.of(newOption) : []);
          }}
          value={defaultData && defaultData.length > 0 ? defaultData[0].name : undefined}
          disablePortal
          noOptionsText="Không tìm thấy chi nhánh phù hợp"
          id="location-autocomplete"
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
          value={defaultData ? defaultData.map((item) => item.name) : undefined}
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
