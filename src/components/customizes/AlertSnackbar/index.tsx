import React from "react";

import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";
import { hideSnackbar, useSnackbarController } from "../../../context/snackbarContext";

export default function AlertSnackbar() {
  // @ts-ignore
  const [controller, dispatch] = useSnackbarController();

  return (
    <Snackbar
      open={controller.openSnackbar}
      autoHideDuration={controller.timeSnackbar}
      onClose={() => hideSnackbar(dispatch)}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={() => hideSnackbar(dispatch)}
        severity={controller.typeSnackbar}
        sx={{ width: "100%", border: "1px solid grey", borderRadius: 2 }}
      >
        {controller.messageSnackbar}
      </Alert>
    </Snackbar>
  );
}
