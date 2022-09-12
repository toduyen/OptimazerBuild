import React, { useEffect, useState , Suspense  } from "react";

// react-router components
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Material Dashboard 2 React components
// Material Dashboard 2 React example components
import Sidenav from "components/customizes/Sidenav";

// Material Dashboard 2 React themes
import theme from "assets/theme";

// Material Dashboard 2 React routes
import { routes } from "routes";

// Material Dashboard 2 React contexts
import { setMiniSidenav, useMaterialUIController } from "context/materialContext";

// Images
// @ts-ignore
import avatarDefault from "assets/images/avatar_default.png";
import AlertSnackbar from "components/customizes/AlertSnackbar";
import { User } from "./models/base/user";
import { hasRole } from "./utils/checkRoles";
import { CHANGE_PASSWORD_ROUTE, MAIN_ROUTE, SIGN_IN_ROUTE } from "./constants/route";
import "./App.css";
import { signInSuccess, useAuthenController } from "./context/authenContext";
import Loading from "./components/customizes/Loading";
import LoadingPage from "./components/customizes/Loading/LoadingPage";

export default function App() {
  // @ts-ignore
  const [controller, dispatch] = useMaterialUIController();
  // @ts-ignore
  const [, authDispatch] = useAuthenController();
  const { miniSidenav, direction, sidenavColor, layout } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();
  const [currentUser, setCurrentUser] = useState<User>();
  const navigate = useNavigate();

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  // how to make me richer?
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    // @ts-ignore
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user === null && pathname === CHANGE_PASSWORD_ROUTE) {
      return;
    }
    if (user) {
      signInSuccess(authDispatch, JSON.parse(user));
      setCurrentUser(JSON.parse(user).user);
    } else {
      navigate(SIGN_IN_ROUTE);
    }
  }, []);

  const getRoutes = (allRoutes: any[]): any =>
    allRoutes.map((route) => {
      // Prevent access to route that current user don't have role
      if (currentUser && route.roles && !hasRole(currentUser, route.roles)) {
        return null;
      }

      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });

  return (
      <Suspense fallback={<LoadingPage/>}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {layout === "dashboard" && (
            <Sidenav
              color={sidenavColor}
              brandName="Hệ thống GSTTAN"
              routes={routes}
              // @ts-ignore
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
          )}

          <AlertSnackbar />
          <Loading />
                <Routes>
                    {getRoutes(routes)}
                    <Route path="/" element={<Navigate to={MAIN_ROUTE} />} />;
                    <Route path="*" element={<Navigate to={SIGN_IN_ROUTE} />} />;
                </Routes>
        </ThemeProvider>
      </Suspense>
  );
}
