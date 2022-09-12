import MDBox from "components/bases/MDBox";
import React, { useCallback, useEffect, useState } from "react";
import { Autocomplete, Checkbox, TextField } from "@mui/material";
import { useAuthenController } from "context/authenContext";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { getAllAreaRestrictionApi } from "../api";
import { AreaRestriction } from "../../../../models/area-restriction/areaRestriction";
import ListBox from "../../../../components/customizes/AutoComponent/ListBox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

type FieldType = {
  defaultData?: Array<AreaRestriction> | null;
  label: string;
  type: "autocomplete" | "autocomplete-multiple";
  handleChoose: (areaRestrictions: Array<AreaRestriction>) => void;
  PopperComponent?: any;
  wrapperTextFieldClassName?: string;
  minWidth?: number;
};

export default function AreaRestrictionAutocomplete({
  label,
  handleChoose,
  defaultData,
  type,
  PopperComponent,
  wrapperTextFieldClassName,
  minWidth = 250,
}: FieldType) {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [searchState, setSearchState] = useState("");
  const [options, setOptions] = useState<Array<string>>([]);
  const [areaRestrictions, setAreaRestrictions] = useState<Array<AreaRestriction>>([]);

  // @ts-ignore
  const [authController] = useAuthenController();

  // @ts-ignore
  const fetchData = useCallback(
    async ({ page, size, search, isLoadMore }) => {
      if (authController.token !== null) {
        const getAllAreaRestrictionsResponse = await getAllAreaRestrictionApi({
          token: authController.token,
          page,
          size,
          search,
        });

        if (getAllAreaRestrictionsResponse.data !== null) {
          setTotalPage(getAllAreaRestrictionsResponse.data.pageCount);
          if (isLoadMore) {
            setAreaRestrictions((prevState) => [
              ...prevState,
              ...getAllAreaRestrictionsResponse.data.data,
            ]);
          } else {
            setAreaRestrictions(getAllAreaRestrictionsResponse.data.data);
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
    setOptions(areaRestrictions.map((item: AreaRestriction) => item.areaName));
  }, [areaRestrictions]);

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
    const areaRestrictionChooses: Array<AreaRestriction> = [];
    areaRestrictions.forEach((item: AreaRestriction) => {
      if (newOption.includes(item.areaName)) {
        areaRestrictionChooses.push(item);
      }
    });
    handleChoose(areaRestrictionChooses);
  };

  return (
    <MDBox mb={2} key={label}>
      {type === "autocomplete" ? (
        <Autocomplete
          PopperComponent={PopperComponent}
          sx={{ minWidth: `${minWidth}px` }}
          key="field_areaRestriction"
          onChange={(event, newOption) => {
            handleOnChange(event, newOption ? Array.of(newOption) : []);
          }}
          value={defaultData && defaultData.length > 0 ? defaultData[0].areaName : undefined}
          disablePortal
          noOptionsText="Không tìm thấy KVHC phù hợp"
          id="areaRestriction-autocomplete"
          options={options}
          renderInput={(params) => (
            <TextField
              className={wrapperTextFieldClassName}
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
          value={defaultData ? defaultData.map((item) => item.areaName) : undefined}
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
