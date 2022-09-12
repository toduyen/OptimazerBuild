import MDBox from "../../../../components/bases/MDBox";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDTypography from "../../../../components/bases/MDTypography";
import MDButton from "../../../../components/bases/MDButton";
import React from "react";
import { hideLoading, showLoading, useSnackbarController } from "context/snackbarContext";

export default function ConfirmUpdateForm({
  title,
  children,
  handleConfirmUpdate,
  handleClose,
}: {
  title: string;
  children?: React.ReactElement;
  handleConfirmUpdate: () => void;
  handleClose: () => void;
}) {
  // @ts-ignore
  const [, snackbarDispatch] = useSnackbarController();
  return (
    <MDBox px={1} width="100%" height="100vh" mx="auto">
      <Grid container spacing={1} justifyContent="center" alignItems="center" height="100%">
        <Grid item xs={11} sm={9} md={5} lg={4} xl={3}>
          <Card>
            <MDBox
              variant="gradient"
              bgColor="info"
              borderRadius="lg"
              coloredShadow="info"
              mx={2}
              mt={-3}
              p={2}
              mb={1}
              textAlign="center"
            >
              <MDTypography variant="h4" fontWeight="medium" color="white">
                {title}
              </MDTypography>
            </MDBox>
            <MDBox pt={4} pb={3} px={3}>
              <MDBox component="form" role="form">
                {children}
                <MDBox mt={4} mb={1} display="flex">
                  <MDButton
                    variant="gradient"
                    color="info"
                    fullWidth
                    onClick={() => {
                      showLoading(snackbarDispatch);
                      handleConfirmUpdate();
                      hideLoading(snackbarDispatch);
                    }}
                  >
                    Xác nhận
                  </MDButton>
                  <MDBox sx={{ width: "30px" }} />
                  <MDButton variant="gradient" color="error" fullWidth onClick={handleClose}>
                    Hủy bỏ
                  </MDButton>
                </MDBox>
              </MDBox>
            </MDBox>
          </Card>
        </Grid>
      </Grid>
    </MDBox>
  );
}
