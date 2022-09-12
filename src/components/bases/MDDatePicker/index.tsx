import * as React from "react";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

function MDDatePicker({
  label,
  date,
  handleChooseDate,
}: {
  label: string;
  date: Date | null;
  handleChooseDate: (value: Date | null) => void;
}) {
  const [value, setValue] = React.useState<Date | null>(date);

  React.useEffect(() => {
    setValue(date);
  }, [date]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        inputFormat="dd/MM/yyyy"
        mask="__/__/____"
        label={label}
        renderInput={(params) => <TextField {...params} />}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          handleChooseDate(newValue);
        }}
      />
    </LocalizationProvider>
  );
}

export default MDDatePicker;
