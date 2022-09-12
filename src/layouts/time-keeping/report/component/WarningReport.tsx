import React, { useEffect, useState } from "react";
import { GET_ALL_NOTIFICATION_HISTORY_REPORT_API } from "constants/api";
import { Employee } from "models/base/employee";
import { useAuthenController } from "../../../../context/authenContext";
import { FieldType } from "../../../../types/reportType";
import ReportComponent from "../../../../components/customizes/ReportComponent";
import EmployeeAutocomplete from "../../../base/employees/components/EmployeeAutocomplete";
import { Grid } from "@mui/material";
import MDTypography from "../../../../components/bases/MDTypography";
import MDBox from "../../../../components/bases/MDBox";
import { getReport } from "../api";

export default function WarningReport() {
  const [baseReportLink, setBaseReportLink] = useState("");
  const [reportLink, setReportLink] = useState("");
  const [employeeListArray, setEmployeeListArray] = useState<Array<Employee>>([]);
  const [typeReport, setTypeReport] = useState<Array<string>>([]);
  // @ts-ignore
  const [authController] = useAuthenController();

  useEffect(() => {
    if (authController.token) {
      if (authController.currentUser.location !== null) {
        const newReportLink = `${GET_ALL_NOTIFICATION_HISTORY_REPORT_API}?location_id=${authController.currentUser.location.id}`;
        setBaseReportLink(newReportLink);
        setReportLink(newReportLink);
      }
    }
  }, [authController.token]);

  // @ts-ignore
  useEffect(() => {
    let newReportLink = baseReportLink;
    if (employeeListArray.length > 0) {
      const result: Array<number> = employeeListArray.map(
        (optionChoosed: Employee) => optionChoosed.id
      );
      newReportLink += `&employee_ids=${result}`;
    }

    if (typeReport.length > 0) {
      newReportLink += `&types=${typeReport}`;
    }

    setReportLink(newReportLink);
  }, [employeeListArray, typeReport, baseReportLink]);

  const getOptionTypeNotification = () => ["Theo ngày", "Theo tuần", "Theo tháng", "Theo quý"];

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
      <Grid container spacing={4} key="employee">
        <Grid item xs={3} md={3} lg={3}>
          <MDTypography fontSize={16} fontWeight="medium">
            Nhân viên
          </MDTypography>
        </Grid>
        <Grid item xs={9} md={9} lg={9}>
          <MDBox mb={2}>
            <EmployeeAutocomplete
              type="autocomplete-multiple"
              label="Nhân viên"
              handleChoose={(employees) => {
                setEmployeeListArray(employees);
              }}
            />
          </MDBox>
        </Grid>
      </Grid>
    </ReportComponent>
  );
}
