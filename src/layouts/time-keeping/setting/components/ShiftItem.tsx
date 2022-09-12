import React from "react";
import Grid from "@mui/material/Grid";
import { Shift } from "models/time-keeping/shift";
import MDTypography from "components/bases/MDTypography";
import MDBox from "components/bases/MDBox";
import MDTimePicker from "components/bases/MDTimePicker";
import { convertTimeFromDateTime, convertTimeStringToDate } from "utils/helpers";

export default function ShiftItem({
  shift,
  handleChange,
}: {
  shift: Shift;
  handleChange: (newShift: Shift) => void;
}) {
  const handleChangeStartTime = (time: Date | null) => {
    if (time != null) {
      handleChange({
        ...shift,
        timeStart: convertTimeFromDateTime(time),
      });
    }
  };
  const handleChangeEndTime = (time: Date | null) => {
    if (time != null) {
      handleChange({
        ...shift,
        timeEnd: convertTimeFromDateTime(time),
      });
    }
  };
  return (
    <Grid container mb={3} spacing={4}>
      <Grid item xs={3} md={3} lg={3}>
        <MDTypography fontSize={16} fontWeight="medium">
          {shift.name}
        </MDTypography>
      </Grid>
      <Grid item xs={9} md={9} lg={9}>
        <MDBox display="flex" flexDirection="row" justifyContent="space-between" gap={2}>
          <MDTimePicker
            label="Thời gian bắt đầu"
            time={convertTimeStringToDate(shift.timeStart)}
            handleChooseTime={(time) => handleChangeStartTime(time)}
          />
          <MDTimePicker
            label="Thời gian kết thúc"
            time={convertTimeStringToDate(shift.timeEnd)}
            handleChooseTime={(time) => handleChangeEndTime(time)}
          />
        </MDBox>
      </Grid>
    </Grid>
  );
}
