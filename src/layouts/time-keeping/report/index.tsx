import { Grid } from "@mui/material";
import DashboardLayout from "components/customizes/DashboardLayout";
import TimeKeepingReport from "./component/TimeKeepingReport";
import WarningReport from "./component/WarningReport";

function Report() {
  return (
    <DashboardLayout>
      <Grid container spacing={3}>
        <TimeKeepingReport />
        <WarningReport />
      </Grid>
    </DashboardLayout>
  );
}

export default Report;
