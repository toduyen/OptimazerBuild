import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import MDTypography from "components/bases/MDTypography";
import { InputAdornment, OutlinedInput } from "@mui/material";
import ItemTitle from "./TitleItem";

export default function WarningNumberLateItem({
  title,
  value,
  adornment,
  isSecondary,
  handleChange,
}: {
  title: string;
  value: number;
  adornment: string;
  isSecondary: boolean;
  handleChange: (newValue: number) => void;
}) {
  const [inputValue, setInputValue] = useState<number>(value);

  const handleChangeInputValue = (
    val: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    try {
      let newValue = parseInt(val.target.value, 10);
      // eslint-disable-next-line no-restricted-globals
      if (isNaN(newValue)) {
        newValue = 0;
      }
      setInputValue(newValue);
      handleChange(newValue);
    } catch (e) {
      console.log(e);
    }
  };

  // Update value when reload
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <Grid container mb={1}>
      {isSecondary ? (
        <>
          <Grid item xs={1} md={1} lg={1} />
          <Grid item xs={8} md={8} lg={8}>
            <MDTypography fontSize={14}>{title}</MDTypography>
          </Grid>
        </>
      ) : (
        <Grid item xs={9} md={9} lg={9}>
          <ItemTitle title={title} />
        </Grid>
      )}
      <Grid item xs={3} md={3} lg={3}>
        <OutlinedInput
          id="outlined-adornment"
          value={inputValue}
          onChange={(val) => handleChangeInputValue(val)}
          endAdornment={
            <InputAdornment position="end">
              <MDTypography fontSize={14}>{adornment}</MDTypography>
            </InputAdornment>
          }
        />
      </Grid>
    </Grid>
  );
}
