import React from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MDBox from "components/bases/MDBox";
import MDTypography from "components/bases/MDTypography";
import MDButton from "components/bases/MDButton";

type Props = {
  title: string;
  handleClose?: Function;
  children?: React.ReactElement;
  handleSaveData?: Function;
};
function FormUpdateCameraAreaRestriction({ title, handleClose, children, handleSaveData }: Props) {
  return (
    <MDBox px={1} width="100%" height="100vh" mx="auto" display="flex">
      <Grid container justifyContent="center" alignItems="center" height="100%">
        <Grid item xs={11} sm={12} md={10} lg={10} xl={10}>
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
              <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
                {title}
              </MDTypography>
            </MDBox>
            <MDBox pt={4} pb={3} px={3}>
              <MDBox component="form" role="form">
                {children}
                <MDBox mt={4} mb={1} display="flex" style={{justifyContent:"center"}}>
                  <MDButton variant="gradient" color="info" onClick={handleSaveData}>
                    Save
                  </MDButton>
                  <MDBox sx={{ width: "30px" }} />
                  <MDButton variant="gradient" color="error" onClick={handleClose}>
                    Cancel
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

FormUpdateCameraAreaRestriction.defaultProps = {
  children: <div />,
  handleClose: () => {},
};
export default FormUpdateCameraAreaRestriction;
