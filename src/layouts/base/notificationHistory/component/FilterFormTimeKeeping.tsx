import MDBox from "components/bases/MDBox";
import Icon from "@mui/material/Icon";
import React, { useState } from "react";
import { Popper } from "@mui/material";
import MDButton from "components/bases/MDButton";
import { Employee } from "models/base/employee";
import {
  updateEmployeeChoosed,
  useNotificationHistoryController,
} from "context/notificationHistoryContext";
import EmployeeAutocomplete from "layouts/base/employees/components/EmployeeAutocomplete";
import FilterItem from "components/customizes/FilterItem";
import { hideLoading, showLoading, useSnackbarController } from "context/snackbarContext";

export default function FilterFormTimeKeeping() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [employeeChooses, setEmployeeChooses] = useState<Array<Employee>>([]);
  const [employeeConfirm, setEmployeeConfirm] = useState<Employee | null>(null);

  // @ts-ignore
  const [, notificationHistoryDispatch] = useNotificationHistoryController();

  // @ts-ignore
  const [, snackbarDispatch] = useSnackbarController();

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const submitChangeManager = (newEmployeeChooses: Array<Employee>) => {
    if (newEmployeeChooses.length > 0) {
      updateEmployeeChoosed(notificationHistoryDispatch, newEmployeeChooses[0]);
      setEmployeeConfirm(newEmployeeChooses[0]);
    } else {
      updateEmployeeChoosed(notificationHistoryDispatch, null);
      setEmployeeConfirm(null);
    }
    handleCloseMenu();
  };

  const renderChangeManagerForm = (): React.ReactElement => (
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
      <MDBox display="flex" style={{ marginTop: "16px" }}>
        <EmployeeAutocomplete
          type="autocomplete"
          label="Danh sách nhân sự"
          handleChoose={(newEmployeeChooses) => {
            setEmployeeChooses(newEmployeeChooses);
          }}
        />
        <MDButton
          variant="gradient"
          color="info"
          fullWidth
          onClick={(event: any) => {
            event.stopPropagation();
            showLoading(snackbarDispatch);
            submitChangeManager(employeeChooses);
            hideLoading(snackbarDispatch);
          }}
          sx={{ marginLeft: "8px", marginBottom: "16px" }}
        >
          Xác nhận
        </MDButton>
      </MDBox>
    </Popper>
  );

  return (
    <MDBox display="flex" gap="10px" style={{ marginLeft: "10px", alignItems: "center" }}>
      {employeeConfirm && (
        <FilterItem
          value={`${employeeConfirm.code}-${employeeConfirm.name}`}
          handleClose={() => {
            submitChangeManager([]);
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
      {renderChangeManagerForm()}
    </MDBox>
  );
}
