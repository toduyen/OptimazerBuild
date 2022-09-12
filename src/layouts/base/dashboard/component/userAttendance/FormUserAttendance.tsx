import Grid from "@mui/material/Grid";
import MDBox from "components/bases/MDBox";
import StaffComponent from "./StaffComponent";
import MDButton from "components/bases/MDButton";
import {
  updateUserAttendanceChoosed,
  useNotificationHistoryController,
} from "context/notificationHistoryContext";
import { Modal } from "@mui/material";
import { useState } from "react";
import { FormAddGuest } from "./FormAddGuest";

export default function FormUserAttendance({
  handleClose,
  updateStatusNotificationHistory,
}: {
  handleClose: Function;
  updateStatusNotificationHistory: Function;
}) {
  const [open, setOpen] = useState(false);
  const handleCloseForm = () => {
    setOpen(false);
  };

  // @ts-ignore
  const [notificationHistoryController, notificationHistoryDispatch] =
    useNotificationHistoryController();

  const handleControl = (event: any) => {
    event.stopPropagation();
    // Update notification history
    const { notificationHistoryId } = notificationHistoryController.userAttendanceChoosed;
    updateStatusNotificationHistory(notificationHistoryId);

    // Update state
    handleClose();
    updateUserAttendanceChoosed(notificationHistoryDispatch, null);
  };

  const openFormAddGuest = (closeView: Function) => <FormAddGuest handleClose={closeView} />;

  return (
    <>
      <MDBox
        px={1}
        width="100%"
        height="100vh"
        mx="auto"
        onClick={() => {
          handleClose();
          updateUserAttendanceChoosed(notificationHistoryDispatch, null);
        }}
      >
        <Grid container justifyContent="center" alignItems="center" height="100%">
          <MDBox style={{ width: "33%" }}>
            <StaffComponent item={notificationHistoryController.userAttendanceChoosed}>
              {!notificationHistoryController.userAttendanceChoosed.isControlled ? (
                <MDBox mt={4} mb={1} display="flex">
                  <MDButton
                    variant="gradient"
                    color="error"
                    fullWidth
                    onClick={(e: any) => {
                      e.stopPropagation();
                      setOpen(true);
                    }}
                  >
                    Thêm khách
                  </MDButton>
                  <MDBox sx={{ width: "30px" }} />
                  <MDButton variant="gradient" color="info" fullWidth onClick={handleControl}>
                    Đã xử lý
                  </MDButton>
                </MDBox>
              ) : (
                <div />
              )}
            </StaffComponent>
          </MDBox>
        </Grid>
      </MDBox>
      <Modal
        open={open}
        onClose={handleCloseForm}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <>{openFormAddGuest(handleCloseForm)}</>
      </Modal>
    </>
  );
}
