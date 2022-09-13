import { Autocomplete, Icon, Popper, TextField } from "@mui/material";
import MDBox from "components/bases/MDBox";
import MDButton from "components/bases/MDButton";
import FilterItem from "components/customizes/FilterItem";
import { updateFilterEmployee, useEmployeeController } from "context/employeeContext";
import { hideLoading, showLoading, useSnackbarController } from "context/snackbarContext";
import React,{ useEffect, useState } from "react";

export function FilterForm() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [employeeStatusChooses, setEmployeeStatusChooses] = useState<string | null>(null);

  // @ts-ignore
  const [employeeController, employeeDispatch] = useEmployeeController();

  // @ts-ignore
  const [, snackbarDispatch] = useSnackbarController();

  const [employeeStatusConfirm, setEmployeeStatusConfirm] = useState<string | null>(
    employeeController.filter.status
  );

  const getOptionTypeStatus = () => ["Đang hoạt động", "Đã xóa"];

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const submitChange = (areaRestrictionStatusChoosed: string | null) => {
    let filter: {
      status: string | null;
    } = {
      status: null,
    };
    if (areaRestrictionStatusChoosed) {
      setEmployeeStatusConfirm(areaRestrictionStatusChoosed);
      filter.status = areaRestrictionStatusChoosed;
    } else {
      setEmployeeStatusConfirm(null);
    }
    updateFilterEmployee(employeeDispatch, filter);
    handleCloseMenu();
  };

  const renderChangeStatusEmployeeForm = (): React.ReactElement => (
    <Popper
      // @ts-ignore
      anchorEl={anchorEl}
      // @ts-ignore
      anchorReference={null}
      placement="bottom-start"
      open={Boolean(anchorEl)}
      onClose={handleCloseMenu}
      style={{
        backgroundColor: "white",
        boxShadow: "0px 0px 12px 0px #000000",
        padding: "8px",
        borderRadius: "8px",
      }}
    >
      <MDBox display="block" style={{ marginTop: "16px" }}>
        <Autocomplete
          value={employeeStatusChooses}
          key="fields_status"
          onChange={(event, newOptions) => setEmployeeStatusChooses(newOptions)}
          disablePortal
          id="autocomplete_status"
          options={getOptionTypeStatus()}
          renderInput={(params) => <TextField {...params} label="Trạng thái" />}
          ListboxProps={{ style: { maxHeight: "15rem" } }}
        />
      </MDBox>
      <MDBox mt={1} mb={1} display="flex">
        <MDButton
          variant="gradient"
          color="info"
          fullWidth
          onClick={(event: any) => {
            event.stopPropagation();
            showLoading(snackbarDispatch);
            submitChange(employeeStatusChooses);
            hideLoading(snackbarDispatch);
          }}
        >
          Xác nhận
        </MDButton>
        <MDBox sx={{ width: "30px" }} />
        <MDButton variant="gradient" color="error" fullWidth onClick={handleCloseMenu}>
          Hủy bỏ
        </MDButton>
      </MDBox>
    </Popper>
  );

  useEffect(() => {
    if (employeeController.filter.status === null) {
      setEmployeeStatusConfirm("");
    } else {
      setEmployeeStatusConfirm(employeeController.filter.status);
    }
  }, [employeeController.filter.status]);

  return (
    <MDBox display="flex" gap="10px" style={{ marginLeft: "10px", alignItems: "center" }}>
      {employeeStatusConfirm && (
        <FilterItem
          value={`${employeeStatusConfirm}`}
          handleClose={() => {
            submitChange(null);
          }}
        />
      )}
      <Icon
        fontSize="small"
        style={{ cursor: "pointer" }}
        onClick={(event: React.MouseEvent<HTMLElement>) => {
          setAnchorEl(anchorEl ? null : event.currentTarget);
        }}
      >
        filter_list
      </Icon>
      {renderChangeStatusEmployeeForm()}
    </MDBox>
  );
}
