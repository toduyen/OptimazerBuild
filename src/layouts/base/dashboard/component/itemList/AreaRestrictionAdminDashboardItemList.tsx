import Grid from "@mui/material/Grid";
import MDBox from "../../../../../components/bases/MDBox";
import ComplexStatisticsCard from "../../../../../components/customizes/Cards/StatisticsCards/ComplexStatisticsCard";
import React, { useEffect, useState } from "react";
import { useAuthenController } from "../../../../../context/authenContext";
import { getAccountNumberApi } from "../../../users/api";
import { getAllLocationApi } from "../../../location/api";
import { getAllCameraApi } from "../../../camera/api";

export default function AreaRestrictionAdminDashboardItemList() {
  // @ts-ignore
  const [controller, dispatch] = useAuthenController();
  const [numberAccount, setNumberAccount] = useState(0);
  const [numberLocation, setNumberLocation] = useState(0);
  const [numberCamera, setNumberCamera] = useState(0);

  // @ts-ignore
  useEffect(async () => {
    if (controller.currentUser) {
      const [getAccountNumberResponse, getAllLocationResponse, getAllCameraResponse] =
        await Promise.all([
          getAccountNumberApi(controller.token),
          getAllLocationApi({ token: controller.token, page: 0, size: 1 }),
          getAllCameraApi({ token: controller.token, page: 0, size: 1, status: "active" }),
        ]);
      if (getAllLocationResponse.data !== null) {
        setNumberLocation(getAllLocationResponse.data.itemCount);
      }
      if (getAccountNumberResponse.data !== null) {
        setNumberAccount(getAccountNumberResponse.data);
      }
      if (getAllCameraResponse.data !== null) {
        setNumberCamera(getAllCameraResponse.data.itemCount);
      }
    }
  }, [controller.currentUser]);

  return (
    <MDBox py={3}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <MDBox mb={1.5}>
            <ComplexStatisticsCard
              color="dark"
              icon="weekend"
              title="Tổng số chi nhánh"
              count={numberLocation}
            />
          </MDBox>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <MDBox mb={1.5}>
            <ComplexStatisticsCard
              color="success"
              icon="store"
              title="Tổng số camera"
              count={numberCamera}
            />
          </MDBox>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <MDBox mb={1.5}>
            <ComplexStatisticsCard
              icon="leaderboard"
              title="Tổng số tài khoản"
              count={numberAccount}
            />
          </MDBox>
        </Grid>
      </Grid>
    </MDBox>
  );
}
