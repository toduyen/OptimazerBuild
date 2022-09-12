import { Autocomplete, Icon, Popper, TextField } from "@mui/material";
import MDBox from "components/bases/MDBox";
import MDButton from "components/bases/MDButton";
import FilterItem from "components/customizes/FilterItem";
import { showLoading, hideLoading, useSnackbarController } from "context/snackbarContext";
import { updateFilterUser, useUserController } from "context/userContext";
import { useEffect, useState } from "react";

export function FilterFormUser() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userStatusChooses, setUserStatusChooses] = useState<string | null>(null);

  // @ts-ignore
  const [userController, userDispatch] = useUserController();

  const [userStatusConfirm, setUserStatusConfirm] = useState<string | null>(
    userController.filter.status
  );

  const getOptionTypeStatus = () => ["Đang hoạt động", "Đã xóa", "Đang chờ xác nhận"];

  // @ts-ignore
  const [, snackbarDispatch] = useSnackbarController();

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const submitChange = (statusChoosed: string | null) => {
    let status = null;
    if (statusChoosed) {
      setUserStatusConfirm(statusChoosed);
      status = statusChoosed;
    } else {
      setUserStatusConfirm(null);
    }
    updateFilterUser(userDispatch, { status });

    handleCloseMenu();
  };

  const renderChangeAreaRestrictionForm = (): React.ReactElement => (
    <Popper
      // @ts-ignore
      anchorEl={anchorEl}
      // @ts-ignore
      anchorReference={null}
      placement="bottom-start"
      open={Boolean(anchorEl)}
      style={{
        backgroundColor: "white",
        boxShadow: "0px 0px 12px 0px #000000",
        padding: "8px",
        borderRadius: "8px",
      }}
    >
      <MDBox display="block" style={{ marginTop: "16px" }}>
        <Autocomplete
          value={userStatusChooses}
          key="fields_status"
          onChange={(event, newOptions) => setUserStatusChooses(newOptions)}
          disablePortal
          id="autocomplete_status"
          options={getOptionTypeStatus()}
          renderInput={(params) => <TextField {...params} label="Trạng thái" />}
          ListboxProps={{ style: { maxHeight: "15rem" } }}
        />
        <MDBox mt={1} mb={1} display="flex">
          <MDButton
            variant="gradient"
            color="info"
            fullWidth
            onClick={(event: any) => {
              event.stopPropagation();
              showLoading(snackbarDispatch);
              submitChange(userStatusChooses);
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
      </MDBox>
    </Popper>
  );

  return (
    <MDBox display="flex" gap="10px" style={{ marginLeft: "10px", alignItems: "center" }}>
      {userStatusConfirm && (
        <FilterItem
          value={`${userStatusConfirm}`}
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
      {renderChangeAreaRestrictionForm()}
    </MDBox>
  );
}
