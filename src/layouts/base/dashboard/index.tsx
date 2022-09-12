import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "components/bases/MDBox";
import DashboardLayout from "components/customizes/DashboardLayout";
import { Button, Icon, Modal, Tooltip } from "@mui/material";
import FormCamera from "./component/cameraList/CameraListView";
import { Camera } from "models/base/camera";
import { CAMERA_ORDER_CONFIG_LOCAL_STORAGE, VIEW_TYPE } from "constants/app";
import {
  isAreaRestrictionAdmin,
  isAreaRestrictionUser,
  isBehaviorAdmin,
  isBehaviorUser,
  isSuperAdmin,
  isSuperAdminOrganization,
  isTimeKeepingAdmin,
  isTimeKeepingUser,
} from "../../../utils/checkRoles";
import SuperAdminDashboardItemList from "./component/itemList/SuperAdminDashboardItemList";
import CameraViewItem from "./component/cameraList/CameraViewItem";
import SuperAdminOrganizationDashboardItemList from "./component/itemList/SuperAdminOrganizationDashboardItemList";
import TimeKeepingAdminDashboardItemList from "./component/itemList/TimeKeepingAdminDashboardItemList";
import TimeKeepingUserDashboardItemList from "./component/itemList/TimeKeepingUserDashboardItemList";

import UserAttendance from "./component/userAttendance";
import AreaRestrictionAdminDashboardItemList from "./component/itemList/AreaRestrictionAdminDashboardItemList";
import AreaRestrictionUserDashboardItemList from "./component/itemList/AreaRestrictionUserDashboardItemList";
import { signInSuccess, useAuthenController } from "../../../context/authenContext";
import { getAllCameraApi } from "../camera/api";
import BehaviorAdminDashboardItemList from "./component/itemList/BehaviorAdminDashboardItemList";
import BehaviorUserDashboardItemList from "./component/itemList/BehaviorUserDashboardItemList";

function Dashboard(): React.ReactElement {
  // @ts-ignore
  const [authController, authDispatch] = useAuthenController();
  const [actionType, setActionType] = useState("");
  const [cameraList, setCameraList] = useState<Array<Camera | null>>([]);
  const [isShowCameraList, setIsShowCameraList] = useState(false);
  const [isHasRightComponent, setIsHasRightComponent] = useState(false);
  const [token, setToken] = useState(null);
  const [open, setOpen] = useState(false);
  const [showTooltipCamera, setShowTooltipCamera] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleView = () => {
    setOpen(true);
    setActionType(VIEW_TYPE);
  };

  function refreshPage(hours: any, minutes: any, seconds: any) {
    const now = new Date();
    if (now.getHours() == hours && now.getMinutes() == minutes) {
      window.location.reload();
    }
  }

  useEffect(() => {
    setToken(authController.token);
  }, [authController.token]);

  useEffect(() => {
    if (token) {
      if (
        isTimeKeepingAdmin(authController.currentUser) ||
        isTimeKeepingUser(authController.currentUser) ||
        isAreaRestrictionAdmin(authController.currentUser) ||
        isAreaRestrictionUser(authController.currentUser) ||
        isBehaviorAdmin(authController.currentUser) ||
        isBehaviorUser(authController.currentUser)
      ) {
        setIsShowCameraList(true);
      }
      setIsHasRightComponent(
        isAreaRestrictionUser(authController.currentUser) ||
          isBehaviorUser(authController.currentUser)
      );
    }
  }, [token]);

  // @ts-ignore
  useEffect(async () => {
    const listCamera = localStorage.getItem(CAMERA_ORDER_CONFIG_LOCAL_STORAGE);
    if (listCamera !== null && token) {
      const listCameraArray = JSON.parse(listCamera);
      let result: Array<Camera | null> = [];
      const cameraIds = listCameraArray.map((item: any) => item.camera);
      if (cameraIds.length > 0) {
        const getAllCameraByCameraIdsResponse = await getAllCameraApi({
          token,
          page: 0,
          size: cameraIds.length,
          cameraIds,
          status: "active",
        });
        if (getAllCameraByCameraIdsResponse.data != null) {
          const cameras = getAllCameraByCameraIdsResponse.data.data;
          result = cameraIds.map((item: number) => {
            const tmps = cameras.filter((element: Camera) => element.id === item);
            if (tmps.length > 0) {
              return tmps[0];
            }
            return null;
          });
        }
        setCameraList(result);
      } else {
        setCameraList([]);
      }
    }
  }, [localStorage.getItem(CAMERA_ORDER_CONFIG_LOCAL_STORAGE), token]);


  useEffect(() => {
    const interval = setInterval(() => {
      refreshPage(0, 0, 0);
    }, 1000*60);
    return () => clearInterval(interval);
  }, []);

  const renderDashboardItems = () => {
    if (authController.token) {
      if (isSuperAdmin(authController.currentUser)) {
        return <SuperAdminDashboardItemList />;
      }
      if (isSuperAdminOrganization(authController.currentUser)) {
        return <SuperAdminOrganizationDashboardItemList />;
      }
      if (isTimeKeepingAdmin(authController.currentUser)) {
        return <TimeKeepingAdminDashboardItemList />;
      }
      if (isTimeKeepingUser(authController.currentUser)) {
        return <TimeKeepingUserDashboardItemList />;
      }
      if (isAreaRestrictionAdmin(authController.currentUser)) {
        return <AreaRestrictionAdminDashboardItemList />;
      }
      if (isAreaRestrictionUser(authController.currentUser)) {
        return <AreaRestrictionUserDashboardItemList />;
      }
      if (isBehaviorAdmin(authController.currentUser)) {
        return <BehaviorAdminDashboardItemList />;
      }
      if (isBehaviorUser(authController.currentUser)) {
        return <BehaviorUserDashboardItemList />;
      }
    }
    return <div />;
  };

  const formView = (closeView: Function) => <FormCamera handleClose={closeView} />;

  const showModalContent = () => {
    if (actionType === VIEW_TYPE) return formView(handleClose);
    return <div />;
  };

  useEffect(() => {
    setShowTooltipCamera(true);
  }, [token]);

  return (
    <>
      <DashboardLayout>
        {renderDashboardItems()}
        <Grid container mt={-1} spacing={2}>
          <Grid
            item
            xs={isHasRightComponent ? 8.5 : 12}
            md={isHasRightComponent ? 8.5 : 12}
            lg={isHasRightComponent ? 8.5 : 12}
          >
            {isShowCameraList ? (
              <MDBox display="flex" flexDirection="row-reverse">
                <MDBox>
                  <Tooltip
                    title="Click để hiển thị camera"
                    open={showTooltipCamera}
                    onOpen={() => {
                      setShowTooltipCamera(true);
                    }}
                    onClose={() => {
                      setShowTooltipCamera(false);
                    }}
                    style={{ width: "100%" }}
                  >
                    <Button
                      size="large"
                      style={{ color: "#7b809a", padding: 0 }}
                      onClick={() => handleView()}
                      sx={{ background: "none" }}
                    >
                      <Icon fontSize="large">dashboard</Icon>
                    </Button>
                  </Tooltip>
                </MDBox>
                <Grid container spacing={2} style={{ maxHeight: "68vh", overflowY: "auto" }}>
                  {cameraList.map((camera, index) => (
                    <CameraViewItem camera={camera} numberInRow={isHasRightComponent ? 2 : 3} />
                  ))}
                </Grid>
              </MDBox>
            ) : (
              <div />
            )}
          </Grid>
          {isHasRightComponent ? (
            <Grid item xs={3.5} md={3.5} lg={3.5}>
              <UserAttendance />
            </Grid>
          ) : (
            <div />
          )}
        </Grid>
      </DashboardLayout>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <>{showModalContent()}</>
      </Modal>
    </>
  );
}

export default Dashboard;
