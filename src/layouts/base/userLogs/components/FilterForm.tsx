import MDBox from "components/bases/MDBox";
import Icon from "@mui/material/Icon";
import React, { useState } from "react";
import { Popper } from "@mui/material";
import MDButton from "components/bases/MDButton";
import FilterItem from "components/customizes/FilterItem";
import { User } from "models/base/user";
import { updateAccountChoosed, useUserLogController } from "context/userLogContext";
import UserAutoComplete from "layouts/base/users/components/UserAutoComplete";
import { hideLoading, showLoading, useSnackbarController } from "context/snackbarContext";

export default function FilterFormLogList() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [accountChooses, setAccountChooses] = useState<Array<User>>([]);
  const [accountConfirm, setAccountConfirm] = useState<User | null>(null);

  // @ts-ignore
  const [, userLogDispatch] = useUserLogController();

  // @ts-ignore
  const [, snackbarDispatch] = useSnackbarController();

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const submitChangeManager = (newEmployeeChooses: Array<User>) => {
    if (newEmployeeChooses.length > 0) {
      updateAccountChoosed(userLogDispatch, newEmployeeChooses[0]);
      setAccountConfirm(newEmployeeChooses[0]);
    } else {
      updateAccountChoosed(userLogDispatch, null);
      setAccountConfirm(null);
    }
    handleCloseMenu();
  };

  const renderChangeAccountForm = (): React.ReactElement => (
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
        <UserAutoComplete
          type="autocomplete"
          label="Danh sách tài khoản"
          handleChoose={(newEmployeeChooses) => {
            setAccountChooses(newEmployeeChooses);
          }}
        />
        <MDButton
          variant="gradient"
          color="info"
          fullWidth
          onClick={(event: any) => {
            event.stopPropagation();
            showLoading(snackbarDispatch);
            submitChangeManager(accountChooses);
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
      {accountConfirm && (
        <FilterItem
          value={`${accountConfirm.id}-${accountConfirm.username}`}
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
      {renderChangeAccountForm()}
    </MDBox>
  );
}
