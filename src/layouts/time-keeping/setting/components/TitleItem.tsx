import Grid from "@mui/material/Grid";
import React from "react";
import MDTypography from "components/bases/MDTypography";

export default function ItemTitle({ title }: { title: string }) {
  return (
    <Grid item>
      <MDTypography fontSize={16} fontWeight="medium">
        {title}
      </MDTypography>
    </Grid>
  );
}
