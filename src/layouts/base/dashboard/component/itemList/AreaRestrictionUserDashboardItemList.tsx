import Grid from "@mui/material/Grid";
import MDBox from "../../../../../components/bases/MDBox";
import ComplexStatisticsCard from "../../../../../components/customizes/Cards/StatisticsCards/ComplexStatisticsCard";
import React, { useEffect, useState } from "react";
import { useAuthenController } from "../../../../../context/authenContext";
import { getAreaRestrictionNotificationCountApi } from "../../api";
import {
  updateHasNotificationAudio,
  useNotificationHistoryController,
} from "../../../../../context/notificationHistoryContext";

export default function AreaRestrictionUserDashboardItemList() {
  // @ts-ignore
  const [controller] = useAuthenController();
  const [numberAreaRestrictionWarning, setNumberAreaRestrictionWarning] = useState(0);
  const [numberNotificationInDay, setNumberNotificationInDay] = useState(0);
  const [numberNotificationNotResolve, setNumberNotificationNotResolve] = useState(0);

  // @ts-ignore
  const [notificationHistoryController, notificationHistoryDispatch] =
    useNotificationHistoryController();

  // @ts-ignore
  useEffect(async () => {
    let isMounted = true;
    if (controller.token) {
      const getAreaRestrictionNotificationCountResponse =
        await getAreaRestrictionNotificationCountApi({ token: controller.token });
      if (getAreaRestrictionNotificationCountResponse.data !== null && isMounted) {
        setNumberAreaRestrictionWarning(
          getAreaRestrictionNotificationCountResponse.data.numberAreaRestrictionWarning
        );
        setNumberNotificationInDay(
          getAreaRestrictionNotificationCountResponse.data.numberNotificationInDay
        );
        setNumberNotificationNotResolve(
          getAreaRestrictionNotificationCountResponse.data.numberNotificationNotResolve
        );

        updateHasNotificationAudio(
          notificationHistoryDispatch,
          getAreaRestrictionNotificationCountResponse.data.numberNotificationNotResolveUsingRing > 0
        );
      }
    }
    return () => {
      isMounted = false;
    };
  }, [controller.token, notificationHistoryController.toggle]);

  return (
    <MDBox py={3}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <MDBox mb={1.5}>
            <ComplexStatisticsCard
              color="dark"
              icon="weekend"
              title="Số khu vực có cảnh báo"
              count={numberAreaRestrictionWarning}
            />
          </MDBox>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <MDBox mb={1.5}>
            <ComplexStatisticsCard
              color="success"
              icon="store"
              title="Số cảnh báo trong ngày"
              count={numberNotificationInDay}
            />
          </MDBox>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <MDBox mb={1.5}>
            <ComplexStatisticsCard
              icon="leaderboard"
              title="Số cảnh báo chưa được xử lý"
              count={numberNotificationNotResolve}
            />
          </MDBox>
        </Grid>
      </Grid>
    </MDBox>
  );
}
