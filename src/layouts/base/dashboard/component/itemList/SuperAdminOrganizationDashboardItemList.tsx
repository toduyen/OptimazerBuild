import Grid from "@mui/material/Grid";
import MDBox from "../../../../../components/bases/MDBox";
import ComplexStatisticsCard from "../../../../../components/customizes/Cards/StatisticsCards/ComplexStatisticsCard";
import React, { useEffect, useState } from "react";
import { getAccountNumberApi } from "../../../users/api";
import { getAllFeaturesApi } from "../../../features/api";
import { useAuthenController } from "../../../../../context/authenContext";

export default function SuperAdminOrganizationDashboardItemList() {
  // @ts-ignore
  const [authController] = useAuthenController();
  const [numberAccount, setNumberAccount] = useState(0);
  const [numberFeature, setNumberFeature] = useState(0);

  // @ts-ignore
  useEffect(async () => {
    if (authController.token) {
      const [getAccountNumberResponse, getAllFeatureResponse] = await Promise.all([
        getAccountNumberApi(authController.token),
        getAllFeaturesApi(authController.token),
      ]);
      if (getAccountNumberResponse.data !== null) {
        setNumberAccount(getAccountNumberResponse.data);
      }
      if (getAllFeatureResponse.data !== null) {
        setNumberFeature(getAllFeatureResponse.data.length);
      }
    }
  }, [authController.token]);

  return (
    <MDBox py={3}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <MDBox mb={1.5}>
            <ComplexStatisticsCard
              icon="leaderboard"
              title="Tổng số tài khoản"
              count={numberAccount}
            />
          </MDBox>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <MDBox mb={1.5}>
            <ComplexStatisticsCard
              color="success"
              icon="store"
              title="Tổng số tính năng"
              count={numberFeature}
            />
          </MDBox>
        </Grid>
      </Grid>
    </MDBox>
  );
}
