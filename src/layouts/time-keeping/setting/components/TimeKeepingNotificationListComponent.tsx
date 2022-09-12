import { TimeKeepingNotification } from "models/time-keeping/timeKeepingNotification";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDTypography from "components/bases/MDTypography";
import React, { useEffect, useState } from "react";
import WarningNumberLateItem from "./WarningNumberLateItem";
import NotificationMethodItem from "./NotificationMethodItem";
import ItemTitle from "./TitleItem";
import { Autocomplete, TextField, Tooltip } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

const dayOfWeek = ["Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy", "Chủ nhật"];

export default function TimeKeepingNotificationListComponent({
  timeKeepingNotification,
  handleChange,
}: {
  timeKeepingNotification: TimeKeepingNotification;
  handleChange: (newTimeKeepingNotification: TimeKeepingNotification) => void;
}) {
  const [tkNotification, setTKNotification] = useState(timeKeepingNotification);

  const handleChangeLateTime = (newValue: number) => {
    handleChange({
      ...tkNotification,
      lateTime: newValue,
    });
  };
  const handleChangeLateInWeek = (newValue: number) => {
    handleChange({
      ...tkNotification,
      lateInWeek: newValue,
    });
  };
  const handleChangeLateInMonth = (newValue: number) => {
    handleChange({
      ...tkNotification,
      lateInMonth: newValue,
    });
  };
  const handleChangeLateInQuarter = (newValue: number) => {
    handleChange({
      ...tkNotification,
      lateInQuarter: newValue,
    });
  };

  const handleChangeUseOTT = (isChecked: boolean) => {
    handleChange({
      ...tkNotification,
      notificationMethod: {
        ...tkNotification.notificationMethod,
        useOTT: isChecked,
      },
    });
  };

  const handleChangeUseEmail = (isChecked: boolean) => {
    handleChange({
      ...tkNotification,
      notificationMethod: {
        ...tkNotification.notificationMethod,
        useEmail: isChecked,
      },
    });
  };

  const handleChangeStartDayOfWeek = (value: string | null) => {
    if (value != null) {
      const temp = dayOfWeek.indexOf(value) + 1;
      const startDayOfWeek = temp === 7 ? 0 : temp;
      return handleChange({
        ...tkNotification,
        startDayOfWeek,
      });
    }
    return null;
  };

  const handleChangeEndDayOfWeek = (value: string | null) => {
    if (value != null) {
      const temp = dayOfWeek.indexOf(value) + 1;
      const endDayOfWeek = temp === 7 ? 0 : temp;
      return handleChange({
        ...tkNotification,
        endDayOfWeek,
      });
    }
    return null;
  };

  const getDayByNumber = (value: number) => {
    const tmp = value === 0 ? 6 : value - 1;
    return dayOfWeek[tmp];
  };
  // Update time keeping notification when reload
  useEffect(() => {
    setTKNotification(timeKeepingNotification);
  }, [timeKeepingNotification]);

  return (
    <Grid item xs={12} md={6} lg={6}>
      <Card>
        <Grid
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          padding={2}
        >
          <MDTypography fontWeight="bold" fontSize={24} mt={2} mb={4} style={{ color: "black" }}>
            Cảnh báo
          </MDTypography>
          <Grid container mb={3} spacing={4}>
            <Grid item xs={3} md={3} lg={3}>
              <MDTypography fontSize={16} fontWeight="medium">
                Ngày làm việc:
              </MDTypography>
            </Grid>
            <Grid item xs={9} md={9} lg={9}>
              <Grid container spacing={2}>
                <Grid item xs={6} md={6} lg={6}>
                  <Autocomplete
                    value={getDayByNumber(timeKeepingNotification.startDayOfWeek)}
                    key="fields_start_day_of_week"
                    onChange={(event, newOptions) => handleChangeStartDayOfWeek(newOptions)}
                    disablePortal
                    id="autocomplete_start_day"
                    className="time-keeping-noti-autocomplete"
                    options={dayOfWeek}
                    renderInput={(params) => (
                      <TextField {...params} label="Chọn ngày bắt đầu tuần" />
                    )}
                    ListboxProps={{ style: { maxHeight: "15rem" } }}
                  />
                </Grid>
                <Grid item xs={6} md={6} lg={6}>
                  <Autocomplete
                    value={getDayByNumber(timeKeepingNotification.endDayOfWeek)}
                    key="fields_end_day_of_week"
                    onChange={(event, newOptions) => handleChangeEndDayOfWeek(newOptions)}
                    disablePortal
                    id="autocomplete_end_day"
                    className="time-keeping-noti-autocomplete"
                    options={dayOfWeek}
                    renderInput={(params) => (
                      <TextField {...params} label="Chọn ngày kết thúc tuần" />
                    )}
                    ListboxProps={{ style: { maxHeight: "15rem" } }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <WarningNumberLateItem
            title="Thời gian cho phép đi muộn:"
            value={tkNotification.lateTime}
            adornment="phút"
            isSecondary={false}
            handleChange={(newValue) => handleChangeLateTime(newValue)}
          />

          <Grid container mb={1}>
            <ItemTitle title="Số lần đi muộn cần nhắc nhở:" />
            <Tooltip title="Nếu nhân viên đi muộn quá số lần trong tuần, tháng, quý thì sẽ nhận được cảnh báo qua các hình thức cảnh báo">
              <InfoIcon color="info" />
            </Tooltip>
          </Grid>

          <WarningNumberLateItem
            title="Theo tuần:"
            value={tkNotification.lateInWeek}
            adornment="lần"
            isSecondary
            handleChange={(newValue) => handleChangeLateInWeek(newValue)}
          />
          <WarningNumberLateItem
            title="Theo tháng:"
            value={tkNotification.lateInMonth}
            adornment="lần"
            isSecondary
            handleChange={(newValue) => handleChangeLateInMonth(newValue)}
          />
          <WarningNumberLateItem
            title="Theo quý:"
            value={tkNotification.lateInQuarter}
            adornment="lần"
            isSecondary
            handleChange={(newValue) => handleChangeLateInQuarter(newValue)}
          />
          <Grid container mb={1}>
            <ItemTitle title="Hình thức cảnh báo:" />
          </Grid>
          <Grid container mb={3} spacing={10}>
            <NotificationMethodItem
              label="Tin nhắn OTT"
              checked={tkNotification.notificationMethod.useOTT}
              handleAfterChangeChecked={(isChecked) => handleChangeUseOTT(isChecked)}
            />
            <NotificationMethodItem
              label="Email"
              checked={tkNotification.notificationMethod.useEmail}
              handleAfterChangeChecked={(isChecked) => handleChangeUseEmail(isChecked)}
            />
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
}
