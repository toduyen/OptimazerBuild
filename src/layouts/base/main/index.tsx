import BasicLayout from "../authentication/components/BasicLayout";
// @ts-ignore
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import DefaultNavbar from "../../../components/customizes/DefaultNavbar";
import { Container, Grid } from "@mui/material";
import ImageCard from "../../../components/customizes/Cards/SimpleBlogCard/ImageCard";
import MDBox from "../../../components/bases/MDBox";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DASHBOARD_ROUTE } from "../../../constants/route";
import {
  MODULE_AREA_RESTRICTION_TYPE,
  MODULE_BEHAVIOR_TYPE,
  MODULE_TIME_KEEPING_TYPE,
} from "../../../constants/app";
import {
  hasMultiRole,
  hasRoleModule,
  isSuperAdmin,
  isSuperAdminOrganization,
} from "../../../utils/checkRoles";
import { useAuthenController } from "../../../context/authenContext";
// @ts-ignore
import moduleBackground from "assets/images/module_bg.jpg";

function ModuleItem({ title, handleClick }: { title: string; handleClick: Function }) {
  return (
    <Grid item xs={12} sm={6} md={6} lg={4} xl={4} style={{ padding: "16px" }}>
      <MDBox position="relative" height="100%" onClick={handleClick} style={{ cursor: "pointer" }}>
        <ImageCard image={moduleBackground} width={100} />
        <MDBox
          style={{
            position: "absolute",
            top: "0",
            bottom: "10px",
            left: "0",
            right: "0",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 500,
          }}
        />
        <MDBox
          style={{
            position: "absolute",
            fontWeight: "700",
            top: "40%",
            bottom: "0",
            left: "0",
            right: "0",
            color: "#ffffff",
            fontSize: "26px",
            height: "fit-content",
            textAlign: "center",
            zIndex: 1000,
            textShadow: "1px 0px 1px #CCCCCC, 0px 1px 1px #EEEEEE, 0px 0px 100px rgba(0,0,0,0.5)",
          }}
        >
          {title}
        </MDBox>
      </MDBox>
    </Grid>
  );
}

function Main() {
  // @ts-ignore
  const [authController] = useAuthenController();
  const navigate = useNavigate();

  const setModule = (module: string) => {
    localStorage.setItem("module", module);
  };
  useEffect(() => {
    if (localStorage.getItem("module")) {
      navigate(DASHBOARD_ROUTE);
      navigate(0);
    } else if (authController.currentUser != null) {
      if (
        isSuperAdmin(authController.currentUser) ||
        isSuperAdminOrganization(authController.currentUser)
      ) {
        navigate(DASHBOARD_ROUTE);
        navigate(0);
      } else if (
        hasRoleModule(authController.currentUser, MODULE_TIME_KEEPING_TYPE) &&
        !hasMultiRole(authController.currentUser)
      ) {
        localStorage.setItem("module", MODULE_TIME_KEEPING_TYPE);
        navigate(DASHBOARD_ROUTE);
        navigate(0);
      } else if (
        hasRoleModule(authController.currentUser, MODULE_AREA_RESTRICTION_TYPE) &&
        !hasMultiRole(authController.currentUser)
      ) {
        localStorage.setItem("module", MODULE_AREA_RESTRICTION_TYPE);
        navigate(DASHBOARD_ROUTE);
        navigate(0);
      } else if (
        hasRoleModule(authController.currentUser, MODULE_BEHAVIOR_TYPE) &&
        !hasMultiRole(authController.currentUser)
      ) {
        localStorage.setItem("module", MODULE_BEHAVIOR_TYPE);
        navigate(DASHBOARD_ROUTE);
        navigate(0);
      }
    }
  }, [authController.token]);
  return (
    <BasicLayout image={bgImage}>
      <MDBox>
        <DefaultNavbar />
        <Container>
          <Grid
            container
            spacing={3}
            justifyContent="left"
            alignItems="center"
            py={1}
            px={{ xs: 4, sm: 2, lg: 0 }}
            my={3}
            mx={3}
            width="calc(100% - 48px)"
            height="100%"
          >
            {hasRoleModule(authController.currentUser, MODULE_TIME_KEEPING_TYPE) && (
              <ModuleItem
                title="Chấm công"
                handleClick={() => {
                  setModule(MODULE_TIME_KEEPING_TYPE);
                  navigate(DASHBOARD_ROUTE);
                }}
              />
            )}
            {hasRoleModule(authController.currentUser, MODULE_AREA_RESTRICTION_TYPE) && (
              <ModuleItem
                title="Kiểm soát khu vực hạn chế"
                handleClick={() => {
                  setModule(MODULE_AREA_RESTRICTION_TYPE);
                  navigate(DASHBOARD_ROUTE);
                }}
              />
            )}
            {hasRoleModule(authController.currentUser, MODULE_BEHAVIOR_TYPE) && (
              <ModuleItem
                title="Kiểm soát hành vi"
                handleClick={() => {
                  setModule(MODULE_BEHAVIOR_TYPE);
                  navigate(DASHBOARD_ROUTE);
                }}
              />
            )}
          </Grid>
        </Container>
      </MDBox>
    </BasicLayout>
  );
}

export default Main;
