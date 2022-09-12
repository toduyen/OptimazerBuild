import ReportComponent from "components/customizes/ReportComponent";
import { GET_ALL_IN_OUT_HISTORY_AREA_RESTRICTION_API } from "constants/api";
import { useAuthenController } from "context/authenContext";
import { AreaRestriction } from "models/area-restriction/areaRestriction";
import { Camera } from "models/base/camera";
import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import MDTypography from "../../../../components/bases/MDTypography";
import MDBox from "../../../../components/bases/MDBox";
import CameraAutocomplete from "../../../base/camera/components/CameraAutocomplete";
import AreaRestrictionAutocomplete from "../../areaRestriction/components/AreaRestrictionAutocomplete";
import { getReport } from "../api";

export default function AreaRestrictionReport() {
  const [baseReportLink, setBaseReportLink] = useState("");
  const [reportLink, setReportLink] = useState("");
  const [areaRestrictionListArray, setAreaRestrictionListArray] = useState<Array<AreaRestriction>>(
    []
  );
  const [cameraListArray, setCameraListArray] = useState<Array<Camera>>([]);

  // @ts-ignore
  const [authController] = useAuthenController();

  // @ts-ignore
  useEffect(async () => {
    if (authController.token) {
      if (authController.currentUser.location !== null) {
        const newReportLink = `${GET_ALL_IN_OUT_HISTORY_AREA_RESTRICTION_API}?location_id=${authController.currentUser.location.id}`;
        setBaseReportLink(newReportLink);
        setReportLink(newReportLink);
      }
    }
  }, [authController.token]);

  // @ts-ignore
  useEffect(() => {
    let newReportLink = baseReportLink;
    if (areaRestrictionListArray.length > 0) {
      const result: Array<number> = areaRestrictionListArray.map(
        (optionChoosed: AreaRestriction) => optionChoosed.id
      );
      newReportLink += `&area_restriction_ids=${result}`;
    }
    if (cameraListArray.length > 0) {
      const result: Array<number> = cameraListArray.map(
        (optionChoosed: Camera) => optionChoosed.id
      );
      newReportLink += `&camera_ids=${result}`;
    }

    setReportLink(newReportLink);
  }, [areaRestrictionListArray, cameraListArray, baseReportLink]);

  const actionReport = async (link: string) => {
    await getReport(authController.token, link);
  };

  return (
    <ReportComponent
      title="Báo cáo vào ra KVHC"
      fields={[]}
      baseReportLink={reportLink}
      actionReport={actionReport}
    >
      <>
        <Grid container spacing={3} key="area_restriction">
          <Grid item xs={3} md={3} lg={3}>
            <MDTypography fontSize={16} fontWeight="medium">
              Khu vực hạn chế
            </MDTypography>
          </Grid>
          <Grid item xs={9} md={9} lg={9}>
            <MDBox mb={2}>
              <AreaRestrictionAutocomplete
                type="autocomplete-multiple"
                label="Khu vực hạn chế"
                handleChoose={(areaRestrictions) => {
                  setAreaRestrictionListArray(areaRestrictions);
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <Grid container spacing={4} key="camera">
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
                handleChoose={(cameras) => {
                  setCameraListArray(cameras);
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
      </>
    </ReportComponent>
  );
}
