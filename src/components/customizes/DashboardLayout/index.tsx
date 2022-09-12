import React, { useEffect, useState } from "react";

// react-router-dom components
import { useLocation, useNavigate } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// Material Dashboard 2 React components
import MDBox from "components/bases/MDBox";

// Material Dashboard 2 React context
// tuanpk 29/0/2022 fixed bug:  imported multiple times do eslint bắt
import { setLayout, setMiniSidenav, useMaterialUIController , setOpenConfigurator } from "context/materialContext";
import { useAuthenController, signInSuccess } from "context/authenContext";
import DashboardNavbar from "../DashboardNavbar";
import AudioActionButton from "layouts/base/dashboard/component/userAttendance/AudioActionButton";
import {
  addUserAttendanceItemSuccess,
  updateConfirmAudio,
  updateStatusAudio,
  updateToggleNotificationHistory,
  updateUserAttendanceItemSuccess,
  useNotificationHistoryController,
} from "context/notificationHistoryContext";
import Configurator from "layouts/base/dashboard/component/userAttendance/RequireAudioPermission";
import UserAttendance from "layouts/base/dashboard/component/userAttendance";

import { WEB_SOCKET_IN_OUT_URL } from "constants/api";
import ReconnectingWebSocket from "reconnecting-websocket";
import { UserAttendanceItemType } from "types/userAttendanceItemType";
import {
  isAreaRestrictionAdmin,
  isAreaRestrictionUser,
  isBehaviorAdmin,
  isBehaviorUser,
  isSuperAdmin,
  isSuperAdminOrganization,
  isTimeKeepingAdmin,
  isTimeKeepingUser,
} from "utils/checkRoles";
import { w3cwebsocket, w3cwebsocket as W3CWebSocket } from "websocket";
import { Action, Fab } from "react-tiny-fab";
import { Maximize, Minimize } from "@mui/icons-material";
import FormUserAttendance from "layouts/base/dashboard/component/userAttendance/FormUserAttendance";
import { USER_ATTENDANCE_TYPE , ERROR_TYPE } from "constants/app";
import { Modal } from "@mui/material";
import { showSnackbar, useSnackbarController } from "context/snackbarContext";
import { SIGN_IN_ROUTE } from "constants/route";

function DashboardLayout({
                           children,
                         }: {
  children: Array<React.ReactElement> | React.ReactElement;
}) {
  // @ts-ignore
  const [controller, dispatch] = useMaterialUIController();
  // @ts-ignore
  const [authController, authDispatch] = useAuthenController();
  // @ts-ignore
  const [materialController, materialDispatch] = useMaterialUIController();
  const { miniSidenav } = controller;
  const { pathname } = useLocation();
  const [showAudioAction, setShowAudioAction] = useState(false);
  const [minizime, setMinizime] = useState(true);
  const [open, setOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const locationPath = useLocation();
  const [ws, setWs] = useState<ReconnectingWebSocket | null>(null);
  const navigate = useNavigate();

  // @ts-ignore
  const [notificationHistoryController, notificationHistoryDispatch] =
      useNotificationHistoryController();

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, true);

  useEffect(() => {
    setMiniSidenav(materialDispatch, window.innerWidth < 1200);
  }, [materialController.miniSidenav]);

  useEffect(() => {
    if (
        notificationHistoryController.isConfirmAudio !== null &&
        notificationHistoryController.isConfirmAudio !== undefined
    ) {
      if (!notificationHistoryController.isConfirmAudio) {
        handleConfiguratorOpen();
      } else {
        setShowAudioAction(true);
      }
    }
  }, [notificationHistoryController.isConfirmAudio]);

  useEffect(() => {
    setLayout(dispatch, "dashboard");
  }, [pathname]);

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      signInSuccess(authDispatch, JSON.parse(user));
    }
  }, []);

  useEffect(() => {
    let client: ReconnectingWebSocket | null = null;
    if (
        authController.currentUser &&
        (isAreaRestrictionUser(authController.currentUser) ||
            isBehaviorUser(authController.currentUser))
    ) {
      client = WEB_SOCKET_IN_OUT_URL
          ? new ReconnectingWebSocket(WEB_SOCKET_IN_OUT_URL, [], {
            WebSocket: W3CWebSocket,
            connectionTimeout: 1000,
            maxRetries: 100,
          })
          : null;

      const { location } = authController.currentUser;

      if (client) {
        setWs(client);
        client.onopen = () => {
          console.log("WebSocket Area Restriction Connected");
        };
        client.onmessage = (message) => {
          if (typeof message.data === "string") {
            const jsonData: UserAttendanceItemType = JSON.parse(message.data);
            if (jsonData.locationId === location.id) {
              addUserAttendanceItemSuccess(notificationHistoryDispatch, jsonData);
              setMinizime(false);
              updateToggleNotificationHistory(notificationHistoryDispatch);
            }
          }
        };
      }
    }

    return () => {
      if (client) {
        console.log("WebSocket Area Restriction Disconnect");
        client.close();
      }
    };
  }, [authController.token]);

  const hasRoleToShowAudioConfirm = () => {
    if (authController.token) {
      if (isSuperAdmin(authController.currentUser)) {
        return false;
      }
      if (isSuperAdminOrganization(authController.currentUser)) {
        return false;
      }
      if (isTimeKeepingAdmin(authController.currentUser)) {
        return false;
      }
      if (isTimeKeepingUser(authController.currentUser)) {
        return false;
      }
      if (isAreaRestrictionAdmin(authController.currentUser)) {
        return false;
      }
      if (isAreaRestrictionUser(authController.currentUser)) {
        return true;
      }
      if (isBehaviorAdmin(authController.currentUser)) {
        return false;
      }
      if (isBehaviorUser(authController.currentUser)) {
        return true;
      }
    }
    return <div />;
  };

  const formUserAttendance = (closeForm: Function) => (
      <FormUserAttendance
          handleClose={closeForm}
          updateStatusNotificationHistory={updateStatusNotificationHistory}
      />
  );

  const handleViewUserAttendance = () => {
    setOpen(true);
    setActionType(USER_ATTENDANCE_TYPE);
  };

  useEffect(() => {
    if (notificationHistoryController.userAttendanceChoosed !== null) {
      handleViewUserAttendance();
    }
  }, [notificationHistoryController.userAttendanceChoosed]);

  const updateStatusNotificationHistory = (notificationHistoryId: number) => {
    updateUserAttendanceItemSuccess(notificationHistoryDispatch, notificationHistoryId);
    ws?.send(
        JSON.stringify({
          notificationHistoryId,
        })
    );
    updateToggleNotificationHistory(notificationHistoryDispatch);
  };

  // check time to line of local storage
  function getWithExpiry(key: any) {
    const itemStr = localStorage.getItem(key);

    // if the item doesn't exist, return null
    if (!itemStr) {
      return null;
    }

    const item = JSON.parse(itemStr);
    const now = new Date();

    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
      // If the item is expired, delete the item from storage
      // and return null
      localStorage.clear();
      navigate(SIGN_IN_ROUTE);
      return null;
    }
    return item.value;
  }
  useEffect(() => {
    const expiry = setInterval(() => {
      getWithExpiry("timeToLine");
    }, 1000 * 60);
    return () => clearInterval(expiry);
  }, [localStorage.getItem("timeToLine")]);

  const showModalContent = () => {
    if (actionType === USER_ATTENDANCE_TYPE) return formUserAttendance(handleClose);
    return <div />;
  };

  return (
      <MDBox
          // @ts-ignore
          sx={({ breakpoints, transitions, functions: { pxToRem } }) => ({
            p: 3,
            position: "relative",
            [breakpoints.up("xl")]: {
              marginLeft: miniSidenav ? pxToRem(120) : pxToRem(274),
              transition: transitions.create(["margin-left", "margin-right"], {
                easing: transitions.easing.easeInOut,
                duration: transitions.duration.standard,
              }),
            },
          })}
      >
        <DashboardNavbar />
        {children}

        {showAudioAction && hasRoleToShowAudioConfirm() && <AudioActionButton />}

        {hasRoleToShowAudioConfirm() && (
            <Configurator
                handleConfirm={() => {
                  setShowAudioAction(true);
                  updateConfirmAudio(notificationHistoryDispatch, true);
                  updateStatusAudio(notificationHistoryDispatch, true);
                }}
                handleReject={() => {
                  setShowAudioAction(true);
                  updateConfirmAudio(notificationHistoryDispatch, true);
                  updateStatusAudio(notificationHistoryDispatch, false);
                }}
            />
        )}

        {hasRoleToShowAudioConfirm() && locationPath.pathname !== "/dashboard" && (
            <MDBox
                md={3}
                xl={5}
                lg={3}
                style={{
                  width: "25%",
                  position: "fixed",
                  zIndex: 5,
                  bottom: 0,
                  right: "24px",
                  background: "whitesmoke",
                }}
            >
              <Fab
                  mainButtonStyles={{
                    backgroundColor: "#e74c3c",
                  }}
                  style={{
                    bottom: 0,
                    right: 0,
                  }}
                  icon={minizime ? <Minimize /> : <Maximize />}
                  event="click"
                  key={0}
                  alwaysShowTitle={false}
                  onClick={() => {
                    const newState = !minizime;
                    setMinizime(newState);
                  }}
                  text={minizime ? "Hiện" : "Ẩn"}
              />
              {!minizime && <UserAttendance />}
            </MDBox>
        )}
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
          <>{showModalContent()}</>
        </Modal>
      </MDBox>
  );
}

// Typechecking props for the DashboardLayout
DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;