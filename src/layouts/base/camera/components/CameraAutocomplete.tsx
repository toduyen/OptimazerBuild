import MDBox from "components/bases/MDBox";
import React, { useCallback, useEffect, useState } from "react";
import { Autocomplete, Checkbox, TextField } from "@mui/material";
import { useAuthenController } from "context/authenContext";
import { Camera } from "models/base/camera";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { getAllCameraApi } from "../api";
import { Location } from "../../../../models/base/location";
import ListBox from "../../../../components/customizes/AutoComponent/ListBox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

type FieldType = {
  defaultData?: Array<Camera> | null;
  label: string;
  type: "autocomplete" | "autocomplete-multiple";
  handleChoose: (cameras: Array<Camera>) => void;
  location?: Location;
};

export default function CameraAutocomplete({
  label,
  handleChoose,
  defaultData,
  type,
  location,
}: FieldType) {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [searchState, setSearchState] = useState("");
  const [options, setOptions] = useState<Array<string>>([]);
  const [cameras, setCameras] = useState<Array<Camera>>([]);

  // @ts-ignore
  const [authController] = useAuthenController();

  // @ts-ignore
  const fetchData = useCallback(
    async ({ page, size, search, isLoadMore }) => {
      if (authController.token !== null) {
        const getAllCamerasResponse: { data: any; messageError?: string } = await getAllCameraApi({
          token: authController.token,
          locationId: location ? location.id : undefined,
          page,
          size,
          search,
        });

        if (getAllCamerasResponse.data !== null) {
          setTotalPage(getAllCamerasResponse.data.pageCount);
          if (isLoadMore) {
            setCameras((prevState) => [...prevState, ...getAllCamerasResponse.data.data]);
          } else {
            setCameras(getAllCamerasResponse.data.data);
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
    setOptions(cameras.map((item: Camera) => item.name));
  }, [cameras]);

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
    const cameraChooses: Array<Camera> = [];
    cameras.forEach((item: Camera) => {
      if (newOption.includes(item.name)) {
        cameraChooses.push(item);
      }
    });
    handleChoose(cameraChooses);
  };

  return (
    <MDBox mb={2} key={label}>
      {type === "autocomplete" ? (
        <Autocomplete
          sx={{ minWidth: "250px" }}
          key="field_camera"
          onChange={(event, newOption) => {
            handleOnChange(event, newOption ? Array.of(newOption) : []);
          }}
          value={defaultData && defaultData.length > 0 ? defaultData[0].name : undefined}
          disablePortal
          noOptionsText="Không tìm thấy camera phù hợp"
          id="camera-autocomplete"
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
