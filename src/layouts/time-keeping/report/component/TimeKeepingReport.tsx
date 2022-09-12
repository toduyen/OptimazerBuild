import { Camera } from "models/base/camera";
import React, { useEffect, useState } from "react";
import { GET_ALL_IN_OUT_HISTORY_REPORT_API } from "constants/api";
import { useAuthenController } from "../../../../context/authenContext";
import ReportComponent from "../../../../components/customizes/ReportComponent";
import { Grid } from "@mui/material";
import MDTypography from "../../../../components/bases/MDTypography";
import MDBox from "../../../../components/bases/MDBox";
import CameraAutocomplete from "../../../base/camera/components/CameraAutocomplete";
import { getReport } from "../api";

export default function TimeKeepingReport() {
  const [baseReportLink, setBaseReportLink] = useState("");
  const [reportLink, setReportLink] = useState("");
  const [cameraListArray, setCameraListArray] = useState<Array<Camera>>([]);

  // @ts-ignore
  const [authController] = useAuthenController();

  // @ts-ignore
  useEffect(async () => {
    if (authController.token) {
      if (authController.currentUser.location !== null) {
        const newReportLink = `${GET_ALL_IN_OUT_HISTORY_REPORT_API}?location_id=${authController.currentUser.location.id}`;
        setBaseReportLink(newReportLink);
        setReportLink(newReportLink);
      }
    }
  }, [authController.token]);

  useEffect(() => {
    let newReportLink = baseReportLink;
    if (cameraListArray.length > 0) {
      const result: Array<number> = cameraListArray.map(
        (cameraChoosed: Camera) => cameraChoosed.id
      );
      newReportLink += `&camera_ids=${result}`;
    }

    setReportLink(newReportLink);
  }, [cameraListArray, baseReportLink]);

  const actionReport = async (link: string) => {
    await getReport(authController.token, link);
  };

  return (
    <ReportComponent
      title="Báo cáo chấm công"
      fields={[]}
      baseReportLink={reportLink}
      actionReport={actionReport}
    >
      <Grid container spacing={4} key="employee">
        <Grid item xs={3} md={3} lg={3}>
          <MDTypography fontSize={16} fontWeight="medium">
            Camera
          </MDTypography>
        </Grid>
        <Grid item xs={9} md={9} lg={9}>
          <MDBox mb={2}>
            <CameraAutocomplete
              type="autocomplete-multiple"
              label="Camera"
              location={authController.currentUser?.location}
              handleChoose={(cameras) => {
                setCameraListArray(cameras);
              }}
            />
          </MDBox>
        </Grid>
      </Grid>
    </ReportComponent>
  );
}
