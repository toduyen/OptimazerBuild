import React from 'react';
import { CircularProgress, Grid, Modal } from "@mui/material";
import { hideLoading, useSnackbarController } from "../../../context/snackbarContext";
import MDBox from "../../bases/MDBox";

export default function Loading() {
  // @ts-ignore
  const [controller, dispatch] = useSnackbarController();

  return (
    <Modal
      open={controller.showLoading}
      onClose={() => hideLoading(dispatch)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <MDBox px={1} width="100%" height="100vh" mx="auto" key="loading">
        <Grid container spacing={1} justifyContent="center" alignItems="center" height="100%">
          <CircularProgress style={{ color: "white" }} />
        </Grid>
      </MDBox>
    </Modal>
  );
}
