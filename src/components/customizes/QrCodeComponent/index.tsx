import { Box, Checkbox, Divider, Grid, Popper, styled } from "@mui/material";
import MDBox from "components/bases/MDBox";
import MDButton from "components/bases/MDButton";
import ImageCard from "components/customizes/Cards/SimpleBlogCard/ImageCard";
import React, { useState } from "react";
import { shareQrCodeApi } from "../../../layouts/time-keeping/setting/api";
import { useAuthenController } from "context/authenContext";
import { showSnackbar, useSnackbarController } from "context/snackbarContext";

import EmployeeAutocomplete from "layouts/base/employees/components/EmployeeAutocomplete";
import { Employee } from "models/base/employee";
import { ERROR_TYPE, QR_CODE_IMAGE_URL, SUCCESS_TYPE } from "constants/app";
import { SHARE_QR_CODE_SUCCESS } from "constants/validate";

function QrCodeComponent({ handleClose }: { handleClose: any }) {
  const [personnelInCharges, setPersonnelInCharges] = useState<Array<Employee>>([]);
  const [checkAll, setCheckAll] = React.useState(true);
  // @ts-ignore
  const [authController] = useAuthenController();
  // @ts-ignore
  const [, snackbarDispatch] = useSnackbarController();

  const handleShare = async () => {
    const employeeIds = personnelInCharges.map((item) => item.id);
    const postShareQrCodeResponse = await shareQrCodeApi(
      authController.token,
      checkAll ? null : employeeIds,
      checkAll
    );
    if (postShareQrCodeResponse.data !== null) {
      showSnackbar(snackbarDispatch, {
        typeSnackbar: SUCCESS_TYPE,
        messageSnackbar: SHARE_QR_CODE_SUCCESS,
      });
    } else {
      showSnackbar(snackbarDispatch, {
        typeSnackbar: ERROR_TYPE,
        messageSnackbar: postShareQrCodeResponse.messageError,
      });
    }
    handleClose();
  };

  const PopperStyledComponent = styled(Popper)(({ theme }) => ({
    border: `1px solid ${
      theme.palette.mode === "light" ? "rgba(149, 157, 165, 0.2)" : "rgb(1, 4, 9)"
    }`,
  }));

  // check all value
  const checkAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckAll(event.target.checked);
  };

  return (
    <MDBox px={1} width="100%" height="100vh" mx="auto">
      <Grid container justifyContent="center" alignItems="center" height="100%" width="100%">
        <Grid
          item
          xs={11}
          sm={9}
          md={9}
          lg={6}
          xl={6}
          style={{ backgroundColor: "white", padding: "20px", borderRadius: "10px" }}
        >
          <MDBox mt={5}>
            <ImageCard image={QR_CODE_IMAGE_URL} width={50} />
          </MDBox>
          <Grid container justifyContent="center" spacing={2} mt={3}>
            <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
              <MDBox>Chia sẻ cho </MDBox>
            </Grid>

            <Grid item xs={7} sm={7} md={7} lg={7} xl={7}>
              {checkAll ? (
                <Box
                  sx={{
                    backgroundColor: "white",
                    height: "45px",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Checkbox
                    defaultChecked
                    onChange={() => {
                      setCheckAll(false);
                    }}
                    id="check-all"
                    sx={{ marginRight: "8px" }}
                    onMouseDown={(e) => e.preventDefault()}
                  />
                  Tất cả nhân sự
                </Box>
              ) : (
                <EmployeeAutocomplete
                  label="Danh sách nhân viên"
                  type="autocomplete-multiple"
                  handleChoose={(employees) => {
                    if (employees.length > 0) {
                      setPersonnelInCharges(employees);
                    }
                  }}
                  status="active"
                  PopperComponent={(param: any) => (
                    <PopperStyledComponent {...param}>
                      <Box {...param} />
                      <Divider />
                      <Box
                        sx={{
                          backgroundColor: "white",
                          height: "45px",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <Checkbox
                          checked={checkAll}
                          onChange={checkAllChange}
                          id="check-all"
                          sx={{ marginRight: "8px" }}
                          onMouseDown={(e) => e.preventDefault()}
                        />
                        Tất cả nhân sự
                      </Box>
                    </PopperStyledComponent>
                  )}
                />
              )}
            </Grid>
          </Grid>
          <MDBox mt={4} mb={1} display="flex">
            <MDButton variant="gradient" color="info" fullWidth onClick={handleShare}>
              Chia sẻ
            </MDButton>
            <MDBox sx={{ width: "30px" }} />
            <MDButton
              variant="gradient"
              color="error"
              fullWidth
              onClick={(e: any) => {
                e.stopPropagation();
                handleClose();
              }}
            >
              Hủy bỏ
            </MDButton>
          </MDBox>
        </Grid>
      </Grid>
    </MDBox>
  );
}

export default QrCodeComponent;
