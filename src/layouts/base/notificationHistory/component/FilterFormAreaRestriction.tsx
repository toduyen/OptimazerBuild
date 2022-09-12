import { Autocomplete, Icon, Popper, TextField } from "@mui/material";
import MDBox from "components/bases/MDBox";
import MDButton from "components/bases/MDButton";
import FilterItem from "components/customizes/FilterItem";
import {
  updateFilterNotificationHistory,
  useNotificationHistoryController,
} from "context/notificationHistoryContext";
import { showLoading, hideLoading, useSnackbarController } from "context/snackbarContext";
import AreaRestrictionAutocomplete from "layouts/area-restriction/areaRestriction/components/AreaRestrictionAutocomplete";
import { AreaRestriction } from "models/area-restriction/areaRestriction";
import React, { useState } from "react";

export function FilterFormAreaRestriction() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [areaRestrictionChooses, setAreaRestrictionChooses] = useState<Array<AreaRestriction>>([]);
  const [areaRestrictionConfirm, setAreaRestrictionConfirm] = useState<AreaRestriction | null>(
    null
  );
  const [areaRestrictionStatusChooses, setAreaRestrictionStatusChooses] = useState<string | null>(
    null
  );

  // @ts-ignore
  const [notificationController, notificationHistoryDispatch] = useNotificationHistoryController();

  // @ts-ignore
  const [, snackbarDispatch] = useSnackbarController();

  const [areaRestrictionStatusConfirm, setAreaRestrictionStatusConfirm] = useState<string | null>(
    notificationController.filter.status
  );
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const getOptionTypeStatus = () => ["Đã xử lý", "Chưa xử lý"];

  const submitChange = (
    newAreaRestrictionChooses: Array<AreaRestriction | null>,
    areaRestrictionStatusChoosed: string | null
  ) => {
    let filter: {
      areaRestriction: AreaRestriction | null;
      status: string | null;
    } = {
      areaRestriction: null,
      status: null,
    };
    if (newAreaRestrictionChooses.length > 0) {
      setAreaRestrictionConfirm(newAreaRestrictionChooses[0]);
      filter.areaRestriction = newAreaRestrictionChooses[0];
    } else {
      setAreaRestrictionConfirm(null);
    }
    if (areaRestrictionStatusChoosed) {
      setAreaRestrictionStatusConfirm(areaRestrictionStatusChoosed);
      filter.status = areaRestrictionStatusChoosed;
    } else {
      setAreaRestrictionStatusConfirm(null);
    }
    updateFilterNotificationHistory(notificationHistoryDispatch, filter);
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
      onClose={handleCloseMenu}
      style={{
        backgroundColor: "white",
        boxShadow: "0px 0px 12px 0px #000000",
        padding: "8px",
        borderRadius: "8px",
      }}
    >
      <MDBox display="block" style={{ marginTop: "16px" }}>
        <AreaRestrictionAutocomplete
          type="autocomplete"
          label="Danh sách khu vực hạn chế"
          handleChoose={(newAreaRestrictionChooses) => {
            setAreaRestrictionChooses(newAreaRestrictionChooses);
          }}
        />
        <Autocomplete
          value={areaRestrictionStatusChooses}
          key="fields_status"
          onChange={(event, newOptions) => setAreaRestrictionStatusChooses(newOptions)}
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
            submitChange(areaRestrictionChooses, areaRestrictionStatusChooses);
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
  return (
    <MDBox display="flex" gap="10px" style={{ marginLeft: "10px", alignItems: "center" }}>
      {areaRestrictionConfirm && (
        <FilterItem
          value={`${areaRestrictionConfirm.areaCode}-${areaRestrictionConfirm.areaName}`}
          handleClose={() => {
            submitChange([], areaRestrictionStatusConfirm);
          }}
        />
      )}
      {areaRestrictionStatusConfirm && (
        <FilterItem
          value={`${areaRestrictionStatusConfirm}`}
          handleClose={() => {
            submitChange(Array.of(areaRestrictionConfirm), null);
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
