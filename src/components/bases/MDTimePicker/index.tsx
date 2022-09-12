import * as React from "react";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

function MDTimePicker({
  label,
  time,
  handleChooseTime,
}: {
  label: string;
  time: Date | null;
  handleChooseTime: (value: Date | null) => void;
}) {
  const [value, setValue] = React.useState<Date | null>(time);

  React.useEffect(() => {
    setValue(time);
  }, [time]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <TimePicker
        ampm={false}
        inputFormat="HH:mm:ss"
        mask="__:__:__"
        label={label}
        renderInput={(params) => <TextField {...params} />}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          handleChooseTime(newValue);
        }}
      />
    </LocalizationProvider>
  );
}

export default MDTimePicker;
