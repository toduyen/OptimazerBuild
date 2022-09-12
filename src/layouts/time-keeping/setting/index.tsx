import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import DashboardLayout from "components/customizes/DashboardLayout";
import MDBox from "components/bases/MDBox";
import { TimeKeepingNotification } from "models/time-keeping/timeKeepingNotification";
import {
  getTimeKeepingNotificationSuccess,
  updateTimeKeepingNotificationSuccess,
  useTimeKeepingNotificationController,
} from "context/timeKeepingNotificationContext";
import MDButton from "components/bases/MDButton";
import { Shift } from "models/time-keeping/shift";
import { showSnackbar, useSnackbarController } from "context/snackbarContext";
import { ERROR_TYPE, SUCCESS_TYPE } from "constants/app";
import {
  getTimeKeepingNotificationApi,
  getTimeKeepingShiftApi,
  updateTimeKeepingNotificationApi,
  updateTimeKeepingShiftApi,
} from "./api";
import ShiftListComponent from "./components/ShiftListComponent";
import TimeKeepingNotificationListComponent from "./components/TimeKeepingNotificationListComponent";
import { useAuthenController } from "../../../context/authenContext";
import {
  getAllShiftSuccess,
  updateShiftSuccess,
  useShiftController,
} from "../../../context/shiftContext";
import { Modal, Tooltip } from "@mui/material";
import QrCodeComponent from "components/customizes/QrCodeComponent";

function Setting(): React.ReactElement {
  const [shifts, setShifts] = useState<Array<Shift>>([]);
  const [timeKeepingNotification, setTimeKeepingNotification] =
    useState<TimeKeepingNotification | null>(null);

  const [open, setOpen] = useState(false);

  // @ts-ignore
  const [authController] = useAuthenController();
  // @ts-ignore
  const [, snackbarDispatch] = useSnackbarController();
  // @ts-ignore
  const [shiftController, shiftDispatch] = useShiftController();
  // @ts-ignore
  const [timeKeepingNotificationController, timeKeepingNotificationDispatch] =
    useTimeKeepingNotificationController();

  // @ts-ignore
  useEffect(async () => {
    if (authController.token) {
      const [getAllShiftResponse, getTimeKeepingNotificationResponse] = await Promise.all([
        getTimeKeepingShiftApi(authController.token),
        getTimeKeepingNotificationApi(authController.token),
      ]);
      if (getAllShiftResponse.data !== null) {
        getAllShiftSuccess(shiftDispatch, getAllShiftResponse.data);
      }
      if (getTimeKeepingNotificationResponse.data != null) {
        getTimeKeepingNotificationSuccess(
          timeKeepingNotificationDispatch,
          getTimeKeepingNotificationResponse.data
        );
      }
    }
  }, [authController.token]);

  useEffect(() => {
    setShifts(shiftController.shifts);
  }, [shiftController.shifts]);

  useEffect(() => {
    setTimeKeepingNotification(timeKeepingNotificationController.timeKeepingNotification);
  }, [timeKeepingNotificationController.timeKeepingNotification]);

  const handleChangeShifts = (newShifts: Array<Shift>) => {
    setShifts(newShifts);
  };
  const handleChangeTimeKeepingNotification = (
    newTimeKeepingNotification: TimeKeepingNotification
  ) => {
    setTimeKeepingNotification(newTimeKeepingNotification);
  };
  const handleSaveConfig = async () => {
    const promises = shifts.map(async (shift) => {
      const updateTimeKeepingShiftsResponse = await updateTimeKeepingShiftApi(
        authController.token,
        shift
      );
      if (updateTimeKeepingShiftsResponse.data !== null) {
        return updateTimeKeepingShiftsResponse.data;
      }
      return shift;
    });

    const updateTimeKeepingNotificationResponse = await updateTimeKeepingNotificationApi(
      authController.token,
      timeKeepingNotification!
    );
    const newShifts = await Promise.all(promises);
    if (newShifts !== null && updateTimeKeepingNotificationResponse !== null) {
      updateShiftSuccess(shiftDispatch, newShifts);
      updateTimeKeepingNotificationSuccess(
        timeKeepingNotificationDispatch,
        updateTimeKeepingNotificationResponse.data
      );
      showSnackbar(snackbarDispatch, {
        typeSnackbar: SUCCESS_TYPE,
        messageSnackbar: "Cập nhật thành công",
      });
    } else {
      showSnackbar(snackbarDispatch, {
        typeSnackbar: ERROR_TYPE,
        messageSnackbar: "Error",
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const formQrCode = (closeView: Function) => <QrCodeComponent handleClose={closeView} />;

  return (
    <DashboardLayout>
      <Grid container spacing={3}>
        <ShiftListComponent
          shifts={shifts}
          handleChange={(newShifts) => handleChangeShifts(newShifts)}
        />
        {timeKeepingNotification !== null && (
          <TimeKeepingNotificationListComponent
            timeKeepingNotification={timeKeepingNotification}
            handleChange={(newTimeKeepingNotification) =>
              handleChangeTimeKeepingNotification(newTimeKeepingNotification)
            }
          />
        )}
      </Grid>
      <MDBox mt={4} mb={1} display="flex" justifyContent="center" gap={3}>
        {timeKeepingNotification?.notificationMethod.useOTT && (
          <Tooltip title="Chia sẻ mã QR tới mail của các nhân sự, nhân sự có thể quét mã để sử dụng OTT">
            <MDButton variant="gradient" color="dark" onClick={() => setOpen(true)}>
              Chia sẻ mã QR OTT
            </MDButton>
          </Tooltip>
        )}
        <MDButton variant="gradient" color="info" onClick={handleSaveConfig}>
          Lưu lại
        </MDButton>
      </MDBox>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <>{formQrCode(handleClose)}</>
      </Modal>
    </DashboardLayout>
  );
}

export default Setting;
