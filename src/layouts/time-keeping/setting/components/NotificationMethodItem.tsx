import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "components/bases/MDBox";
import { Checkbox } from "@mui/material";
import MDTypography from "components/bases/MDTypography";

export default function NotificationMethodItem({
  label,
  checked,
  handleAfterChangeChecked,
}: {
  label: string;
  checked: boolean;
  handleAfterChangeChecked: (isChecked: boolean) => void;
}) {
  const [isChecked, setIsChecked] = useState<boolean>(checked);
  const handleChecked = (val: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(val.target.checked);
    handleAfterChangeChecked(val.target.checked);
  };

  // Update is checked when reload
  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  return (
    <Grid item>
      <MDBox display="flex" alignItems="center">
        <Checkbox checked={isChecked} onChange={(val) => handleChecked(val)} />
        <MDTypography fontSize={14}>{label}</MDTypography>
      </MDBox>
    </Grid>
  );
}
