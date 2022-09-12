import { Icon, Popper } from "@mui/material";
import MDBox from "components/bases/MDBox";
import MDButton from "components/bases/MDButton";
import FilterItem from "components/customizes/FilterItem";
import { updateLocationChoosed, useCameraController } from "context/cameraContext";
import LocationAutocomplete from "layouts/base/location/components/LocationAutocomplete";
import { Location } from "models/base/location";
import React, { useState } from "react";

export function FilterFormCameraTimeKeeping() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [locationChooses, setLocationChooses] = useState<Array<Location>>([]);
  const [locationConfirm, setLocationConfirm] = useState<Location | null>(null);

  // @ts-ignore
  const [, cameraDispatch] = useCameraController();

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const submitChangeLocation = (newLocationChooses: Array<Location>) => {
    if (newLocationChooses.length > 0) {
      updateLocationChoosed(cameraDispatch, newLocationChooses[0]);
      setLocationConfirm(newLocationChooses[0]);
    } else {
      updateLocationChoosed(cameraDispatch, null);
      setLocationConfirm(null);
    }
    handleCloseMenu();
  };

  const renderChangeLocationForm = (): React.ReactElement => (
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
      <MDBox display="flex" style={{ marginTop: "16px" }}>
        <LocationAutocomplete
          type="autocomplete"
          label="Danh sách chi nhánh"
          handleChoose={(newLocationChooses) => {
            setLocationChooses(newLocationChooses);
          }}
        />
        <MDButton
          variant="gradient"
          color="info"
          fullWidth
          onClick={(event: any) => {
            event.stopPropagation();
            submitChangeLocation(locationChooses);
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
      {locationConfirm && (
        <FilterItem
          value={`${locationConfirm.code}-${locationConfirm.name}`}
          handleClose={() => {
            submitChangeLocation([]);
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
      {renderChangeLocationForm()}
    </MDBox>
  );
}
