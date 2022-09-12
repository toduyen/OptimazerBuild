import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { Shift } from "models/time-keeping/shift";
import MDBox from "components/bases/MDBox";
import MDTypography from "components/bases/MDTypography";
import ShiftItem from "./ShiftItem";

export default function ShiftListComponent({
  shifts,
  handleChange,
}: {
  shifts: Array<Shift>;
  handleChange: (newShift: Array<Shift>) => void;
}) {
  const [currentShifts, setCurrentShift] = useState<Array<Shift>>(shifts);

  const handleChangeShiftItem = (newShift: Shift) => {
    const newShifts = shifts.map((item) => {
      if (item.id === newShift.id) {
        return newShift;
      }
      return item;
    });
    handleChange(newShifts);
  };

  // Update shifts when reload
  useEffect(() => {
    setCurrentShift(shifts);
  }, [shifts]);

  return (
    <Grid item xs={12} md={6} lg={6}>
      <Card>
        <MDBox
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          padding={2}
        >
          <MDTypography fontWeight="bold" fontSize={24} mt={2} mb={4} style={{ color: "black" }}>
            Ca làm việc
          </MDTypography>
          {currentShifts.map((shift, index: number) => (
            <React.Fragment key={`${shift.name}_${index}`}>
              <ShiftItem
                shift={shift}
                handleChange={(newShift) => handleChangeShiftItem(newShift)}
              />
            </React.Fragment>
          ))}
        </MDBox>
      </Card>
    </Grid>
  );
}
