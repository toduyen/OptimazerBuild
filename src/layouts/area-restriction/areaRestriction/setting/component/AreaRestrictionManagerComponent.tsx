import { Grid } from "@mui/material";
import MDBox from "components/bases/MDBox";
import MDTypography from "components/bases/MDTypography";
import { useEffect, useState } from "react";
import { AreaRestriction } from "models/area-restriction/areaRestriction";
import { Employee } from "../../../../../models/base/employee";
import ManagerTimeSkipItem from "./ManagerTimeSkipItem";
import { AreaSettingReportType } from "types/areaSetingReport";

export default function AreaRestrictionManagerComponent({
  areaRestriction,
  rowsData,
  handleUpdateReport,
}: {
  areaRestriction: AreaRestriction;
  rowsData: any;
  handleUpdateReport: (index: number, newValue: AreaSettingReportType | null) => void;
}) {
  const [areaRestrictionManage, setAreaRestrictionManage] = useState<Array<Employee>>([]);
  const [rowDataState, setRowDataState] = useState(rowsData);

  useEffect(() => {
    if (areaRestriction) {
      setAreaRestrictionManage(areaRestriction.personnelInCharge);
    }
  }, [areaRestriction]);

  useEffect(() => {
    setRowDataState(rowsData);
  }, [rowsData]);

  return (
    <MDBox>
      <Grid container mb={1}>
        <MDTypography fontSize={16} fontWeight="medium">
          Cảnh báo cho
        </MDTypography>
      </Grid>
      {areaRestrictionManage.map((item) => (
        <Grid container mb={3} style={{ fontSize: "13px" }}>
          <Grid item xs={6} md={6} lg={6}>
            {item.name}
          </Grid>
          <Grid item xs={6} md={6} lg={6}>
            Ngay lập tức
          </Grid>
        </Grid>
      ))}
      {rowDataState.map((item: AreaSettingReportType, index: number) => (
        <ManagerTimeSkipItem handleUpdateReport={handleUpdateReport} position={index} item={item} />
      ))}
    </MDBox>
  );
}
