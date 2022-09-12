import { Checkbox, Grid } from "@mui/material";
import MDBox from "components/bases/MDBox";
import MDInput from "components/bases/MDInput";
import MDTypography from "components/bases/MDTypography";
import { Camera } from "models/base/camera";
import React, { useEffect, useState } from "react";

export default function CameraOrderItems({
  camera,
  index,
  orderIndex,
  isDisableCheckbox,
  handleUpdateIndex,
}: {
  camera: Camera;
  index: number;
  orderIndex: number;
  isDisableCheckbox: boolean;
  handleUpdateIndex: (newIndex: number, newOrderIndex: number) => void;
}) {
  const [orderIndexState, setOrderIndexState] = useState<number>(orderIndex);
  const [disabledCheckbox, setDisabledCheckbox] = useState<boolean>(
    isDisableCheckbox && orderIndexState === 0
  );

  useEffect(() => {
    setOrderIndexState(orderIndex);
  }, [orderIndex]);

  useEffect(() => {
    setDisabledCheckbox(isDisableCheckbox && orderIndexState === 0);
  }, [isDisableCheckbox]);

  const handleCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newOrderIndexState = event.target.checked ? 1 : 0;
    setOrderIndexState(newOrderIndexState);
    handleUpdateIndex(index, newOrderIndexState);
  };

  const handleInput = (e: any) => {
    setOrderIndexState(e.target.value);

    handleUpdateIndex(index, parseInt(e.target.value, 10));
  };
  return (
    <MDBox display="flex" mb={2} md={2} lg={2} style={{ alignItems: "center" }}>
      <Grid item xs={2}>
        <Checkbox
          checked={orderIndexState > 0}
          onChange={(event) => handleCheckbox(event)}
          disabled={disabledCheckbox}
        />
      </Grid>
      <Grid item xs={5} md={5} lg={5}>
        <MDTypography style={{ fontSize: "18px" }}>{camera.name}</MDTypography>
      </Grid>
      <Grid item xs={5} md={5} lg={5} style={{ alignItems: "center" }}>
        <MDBox style={{ width: "50px", display: "flex" }}>
          <MDInput
            disabled={orderIndexState === 0}
            value={orderIndexState}
            onChange={handleInput}
          />
        </MDBox>
      </Grid>
    </MDBox>
  );
}
