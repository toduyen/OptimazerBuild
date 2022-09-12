import ReportComponent from "components/customizes/ReportComponent";
import { GET_ALL_NOTIFICATION_AREA_RESTRICTION_API } from "constants/api";
import { useAuthenController } from "context/authenContext";
import { AreaRestriction } from "models/area-restriction/areaRestriction";
import { useEffect, useState } from "react";
import { FieldType } from "../../../../types/reportType";
import { Grid } from "@mui/material";
import AreaRestrictionAutocomplete from "../../areaRestriction/components/AreaRestrictionAutocomplete";
import MDTypography from "../../../../components/bases/MDTypography";
import MDBox from "../../../../components/bases/MDBox";
import { getReport } from "../api";

export default function WarningReport() {
  const [baseReportLink, setBaseReportLink] = useState("");
  const [reportLink, setReportLink] = useState("");
  const [areaRestrictionListArray, setAreaRestrictionListArray] = useState<Array<AreaRestriction>>(
    []
  );
  const [typeReport, setTypeReport] = useState<Array<string>>([]);

  // @ts-ignore
  const [authController] = useAuthenController();

  // @ts-ignore
  useEffect(async () => {
    if (authController.token) {
      if (authController.currentUser.location !== null) {
        const newReportLink = `${GET_ALL_NOTIFICATION_AREA_RESTRICTION_API}?location_id=${authController.currentUser.location.id}`;
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

    if (typeReport.length > 0) {
      newReportLink += `&types=${typeReport}`;
    }

    setReportLink(newReportLink);
  }, [areaRestrictionListArray, typeReport, baseReportLink]);

  const getOptionTypeNotification = () => ["Đột nhập"];

  const fields: Array<FieldType> = [
    {
      title: "Loại cảnh báo",
      data: getOptionTypeNotification(),
      type: "autocomplete-multiple",
      label: "Loại cảnh báo",
      action: setTypeReport,
    },
  ];

  const actionReport = async (link: string) => {
    await getReport(authController.token, link);
  };

  return (
    <ReportComponent
      title="Báo cáo cảnh báo"
      fields={fields}
      baseReportLink={reportLink}
      actionReport={actionReport}
    >
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
    </ReportComponent>
  );
}
