import { Grid } from "@mui/material";
import DashboardLayout from "components/customizes/DashboardLayout";
import AreaRestrictionReport from "./component/AreaRestrictionReport";
import WarningReport from "./component/WarningReport";

function Report() {
  return (
    <DashboardLayout>
      <Grid container spacing={3}>
        <AreaRestrictionReport />
        <WarningReport />
      </Grid>
    </DashboardLayout>
  );
}

export default Report;
