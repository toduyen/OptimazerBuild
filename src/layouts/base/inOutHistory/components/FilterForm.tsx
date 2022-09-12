import MDBox from "components/bases/MDBox";
import Icon from "@mui/material/Icon";
import React, { useState } from "react";
import { Popper } from "@mui/material";
import MDButton from "components/bases/MDButton";
import { Employee } from "models/base/employee";
import { updateEmployeeChoosed, useInOutHistoryController } from "context/inOutHistoryContext";
import EmployeeAutocomplete from "../../employees/components/EmployeeAutocomplete";
import FilterItem from "../../../../components/customizes/FilterItem";
import { showLoading, hideLoading, useSnackbarController } from "context/snackbarContext";

export default function FilterForm() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [employeeChooses, setEmployeeChooses] = useState<Array<Employee>>([]);
  const [employeeConfirm, setEmployeeConfirm] = useState<Employee | null>(null);

  // @ts-ignore
  const [, inOutHistoryDispatch] = useInOutHistoryController();

  // @ts-ignore
  const [, snackbarDispatch] = useSnackbarController();

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const submitChangeManager = (newEmployeeChooses: Array<Employee>) => {
    if (newEmployeeChooses.length > 0) {
      updateEmployeeChoosed(inOutHistoryDispatch, newEmployeeChooses[0]);
      setEmployeeConfirm(newEmployeeChooses[0]);
    } else {
      updateEmployeeChoosed(inOutHistoryDispatch, null);
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
