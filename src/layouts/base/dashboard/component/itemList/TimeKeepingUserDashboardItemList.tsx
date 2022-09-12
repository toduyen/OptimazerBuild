import Grid from "@mui/material/Grid";
import MDBox from "../../../../../components/bases/MDBox";
import ComplexStatisticsCard from "../../../../../components/customizes/Cards/StatisticsCards/ComplexStatisticsCard";
import React, { useEffect, useState } from "react";
import { useAuthenController } from "../../../../../context/authenContext";
import { getTimeKeepingNotificationCountApi } from "../../api";

export default function TimeKeepingUserDashboardItemList() {
  // @ts-ignore
  const [authController] = useAuthenController();
  const [numberCheckIn, setNumberCheckIn] = useState(0);
  const [numberLateTime, setNumberLateTime] = useState(0);
  const [numberLateIn, setNumberLateIn] = useState(0);

  // @ts-ignore
  useEffect(async () => {
    if (authController.token) {
      const getTimeKeepingNotificationCountResponse = await getTimeKeepingNotificationCountApi({
        token: authController.token,
      });
      if (getTimeKeepingNotificationCountResponse.data !== null) {
        setNumberCheckIn(getTimeKeepingNotificationCountResponse.data.numberCheckIn);
        setNumberLateTime(getTimeKeepingNotificationCountResponse.data.numberLateTime);
        setNumberLateIn(getTimeKeepingNotificationCountResponse.data.numberLateIn);
      }
    }
  }, [authController.token]);

  return (
    <MDBox py={3}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <MDBox mb={1.5}>
            <ComplexStatisticsCard
              color="dark"
              icon="weekend"
              title="Số người đã check in"
              count={numberCheckIn}
            />
          </MDBox>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <MDBox mb={1.5}>
            <ComplexStatisticsCard
              color="success"
              icon="store"
              title="Số người bị cảnh báo trong ngày"
              count={numberLateTime}
            />
          </MDBox>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <MDBox mb={1.5}>
            <ComplexStatisticsCard
              icon="leaderboard"
              title="Số người vượt quá số lần trong tháng"
              count={numberLateIn}
            />
          </MDBox>
        </Grid>
      </Grid>
    </MDBox>
  );
}
