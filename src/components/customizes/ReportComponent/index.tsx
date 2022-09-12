import { Autocomplete, Card, Checkbox, Grid, Icon, TextField } from "@mui/material";
import MDBox from "components/bases/MDBox";
import MDButton from "components/bases/MDButton";
import MDTypography from "components/bases/MDTypography";
import React, { useEffect, useState } from "react";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import MDDateTimePicker from "components/bases/MDDateTimePicker";
import {
  convertStringFromDateTime,
  convertStringToDate,
  getEndCurrentDateString,
  getStartCurrentDateString,
} from "utils/helpers";
import { ReportType } from "../../../types/reportType";
import MDInput from "../../bases/MDInput";
import axios from "axios";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function ReportComponent({
  title,
  fields,
  baseReportLink,
  actionReport,
  children,
}: ReportType) {
  const [reportLink, setReportLink] = useState("");
  const [timeStart, setTimeStart] = useState<string>(getStartCurrentDateString());
  const [timeEnd, setTimeEnd] = useState<string>(getEndCurrentDateString());

  // @ts-ignore
  useEffect(() => {
    let newReportLink = baseReportLink;
    if (timeStart && timeStart !== "") {
      newReportLink += `&time_start=${timeStart}`;
    }
    if (timeEnd && timeEnd !== "") {
      newReportLink += `&time_end=${timeEnd}`;
    }
    setReportLink(newReportLink);
  }, [timeEnd, timeStart, baseReportLink]);

  const handleChangeStartTime = (time: Date | null) => {
    if (time !== null && time.toLocaleString() !== "Invalid Date") {
      setTimeStart(convertStringFromDateTime(time));
    } else {
      setTimeStart("");
    }
  };

  const handleChangeEndTime = (time: Date | null) => {
    if (time !== null && time.toLocaleString() !== "Invalid Date") {
      setTimeEnd(convertStringFromDateTime(time));
    } else {
      setTimeEnd("");
    }
  };
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
            {title}
          </MDTypography>
          <MDBox>
            {children}
            {fields.map((field, index) => (
              <Grid container spacing={4} key={`${field.title}`}>
                <Grid item xs={3} md={3} lg={3}>
                  <MDTypography fontSize={16} fontWeight="medium">
                    {field.title}
                  </MDTypography>
                </Grid>
                <Grid item xs={9} md={9} lg={9}>
                  {field.type === "autocomplete-multiple" ? (
                    <MDBox mb={2}>
                      <Autocomplete
                        value={field.checked}
                        key={`fields_${field.label}`}
                        onChange={(event, newOptions) => {
                          field.action(newOptions);
                        }}
                        multiple
                        disablePortal
                        disableCloseOnSelect
                        id="tags-filled"
                        options={field.data}
                        renderOption={(props, option, { selected }) => (
                          <li {...props} style={{ marginBottom: "5px" }}>
                            <Checkbox
                              icon={icon}
                              checkedIcon={checkedIcon}
                              style={{ marginRight: 8 }}
                              checked={selected}
                            />
                            {option}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField {...params} label={field.label} placeholder="Search..." />
                        )}
                        ListboxProps={{ style: { maxHeight: "15rem" } }}
                      />
                    </MDBox>
                  ) : field.type === "autocomplete" ? (
                    <MDBox mb={2}>
                      <Autocomplete
                        value={field.choosedValue}
                        key={`fields_${field.label}`}
                        onChange={(event, newOptions) => {
                          field.action(newOptions);
                        }}
                        disablePortal
                        id="autocomplete"
                        options={field.data}
                        renderInput={(params) => (
                          <TextField {...params} label={field.label} placeholder="Search..." />
                        )}
                        ListboxProps={{ style: { maxHeight: "15rem" } }}
                      />
                    </MDBox>
                  ) : (
                    <MDBox mb={2}>
                      <MDInput
                        value={field.data}
                        type={field.type}
                        label={field.label}
                        fullWidth
                        onChange={(e: any) => field.action(e.target.value)}
                      />
                    </MDBox>
                  )}
                </Grid>
              </Grid>
            ))}

            <Grid container mb={3} spacing={4}>
              <Grid item xs={3} md={3} lg={3}>
                <MDTypography fontSize={16} fontWeight="medium">
                  Thời gian
                </MDTypography>
              </Grid>
              <Grid item xs={9} md={9} lg={9}>
                <MDBox display="flex" flexDirection="row" justifyContent="space-between" gap={2}>
                  <MDDateTimePicker
                    label="Thời gian bắt đầu"
                    datetime={convertStringToDate(timeStart)}
                    handleChooseDateTime={(time: any) => handleChangeStartTime(time)}
                  />

                  <MDDateTimePicker
                    label="Thời gian kết thúc"
                    datetime={convertStringToDate(timeEnd)}
                    handleChooseDateTime={(time: any) => {
                      handleChangeEndTime(time);
                    }}
                  />
                </MDBox>
              </Grid>
            </Grid>
          </MDBox>
          <MDButton
            style={{
              background: "#63B967",
              color: "#FFFFFF",
              marginTop: "10px",
              marginBottom: "10px",
            }}
            onClick={() => {
              actionReport(reportLink === "" ? baseReportLink : reportLink);
            }}
          >
            <Icon>file_download</Icon>
            Xuất báo cáo
          </MDButton>
        </MDBox>
      </Card>
    </Grid>
  );
}
