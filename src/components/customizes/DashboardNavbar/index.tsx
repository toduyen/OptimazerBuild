import React, { useEffect, useState } from "react";

// react-router components
import { useLocation } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/bases/MDBox";
import MDInput from "components/bases/MDInput";

// Material Dashboard 2 React example components
import Breadcrumbs from "components/customizes/Breadcrumbs";

// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarIconButton,
  navbarMobileMenu,
  navbarRow,
} from "components/customizes/DashboardNavbar/styles";

// Material Dashboard 2 React context
import {
  setMiniSidenav,
  setTransparentNavbar,
  useMaterialUIController,
} from "context/materialContext";
import { User } from "../../../models/base/user";
import { useAuthenController } from "../../../context/authenContext";
import { getRouteNameFromPath } from "../../../routes";
import ProfileMenu from "./ProfileMenu";

function DashboardNavbar({
  absolute,
  light,
  isMini,
}: {
  absolute: boolean;
  light: boolean;
  isMini: boolean;
}) {
  const [navbarType, setNavbarType] = useState<any>();
  // @ts-ignore
  const [controller, dispatch] = useMaterialUIController();
  // @ts-ignore
  const [authController] = useAuthenController();

  const { miniSidenav, transparentNavbar, fixedNavbar, darkMode } = controller;
  const route = useLocation().pathname.split("/").slice(1);
  const routeTitle = getRouteNameFromPath(useLocation().pathname);

  const [currentUser, setCurrentUser] = useState<User>();
  useEffect(() => {
    if (authController.currentUser != null) {
      setCurrentUser(authController.currentUser);
    }
  }, [authController]);

  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    /**
     The event listener that's calling the handleTransparentNavbar function when
     scrolling the window.
     */
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);

  // Styles for the navbar icons
  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }: any) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
  });

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox
          color="inherit"
          mb={{ xs: 1, md: 0 }}
          sx={(theme: any) => navbarRow(theme, { isMini })}
        >
          <Breadcrumbs icon="home" title={routeTitle} route={route} light={light} />
        </MDBox>
        {isMini ? null : (
          <MDBox sx={(theme: any) => navbarRow(theme, { isMini })}>
            <MDBox pr={1}>
              <MDInput label="Tìm kiếm" />
            </MDBox>
            <MDBox color={light ? "white" : "inherit"}>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon sx={iconsStyle} fontSize="medium">
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>
              {/* @ts-ignore */}
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                variant="contained"
                onClick={() => {}}
              >
                <Icon sx={iconsStyle}>notifications</Icon>
              </IconButton>
            </MDBox>
            <ProfileMenu />
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
