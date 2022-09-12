import MDBox from "components/bases/MDBox";
import MDTypography from "components/bases/MDTypography";
import SimpleBlogCard from "components/customizes/Cards/SimpleBlogCard";
import React, { useEffect, useState } from "react";
import { UserAttendanceItemType } from "types/userAttendanceItemType";
import {
  updateUserAttendanceChoosed,
  useNotificationHistoryController,
} from "context/notificationHistoryContext";
import MDButton from "components/bases/MDButton";
import { Icon, Modal } from "@mui/material";
import OpenCamera from "./OpenCamera";

export default function StaffComponent({
  item,
  children,
}: {
  item: UserAttendanceItemType;
  children?: React.ReactElement;
}) {
  const [isControlled, setIsControlled] = useState(item.isControlled);
  const [open, setOpen] = useState(false);

  const handleCloseVideo = () => {
    setOpen(false);
  };

  // @ts-ignore
  const [notificationHistoryController, dispatch] = useNotificationHistoryController();

  useEffect(() => {
    if (item.isControlled !== isControlled) {
      setIsControlled(item.isControlled);
    }
  }, [item]);

  const openViewCamera = (closeView: Function) => (
    <OpenCamera
      handleClose={closeView}
      cameraName={notificationHistoryController.userAttendanceChoosed?.cameraName}
      cameraId={notificationHistoryController.userAttendanceChoosed?.cameraId}
      cameraTaken={notificationHistoryController.userAttendanceChoosed?.cameraTaken}
    />
  );

  return (
    <MDBox mt={2} mb={5}>
      <SimpleBlogCard
        image={item.image}
        image2={item.employeeImage}
        title={
          <MDTypography>
            {item.employeeName === "Unknown" ? "Người lạ" : `Họ và tên: ${item.employeeName}`}
          </MDTypography>
        }
        description={
          <>
            <MDTypography color="inherit" fontSize={14}>
              Thời gian: {item.time.split(" ")[1]}
            </MDTypography>
            <MDTypography color="inherit" fontSize={14}>
              Ngày: {item.time.split(" ")[0]}
            </MDTypography>
            <MDTypography color="inherit" fontSize={14}>
              Loại cảnh báo: {item.type}
            </MDTypography>
            <MDTypography color="inherit" fontSize={14}>
              Khu vực hạn chế: {item.areaRestrictionName}
            </MDTypography>
            <MDTypography color="inherit" fontSize={14}>
              Camera: {item.cameraName}
            </MDTypography>
            <MDTypography color="inherit" fontSize={14}>
            <MDButton
                variant="text"
                color="success"
                style={{padding:0}}
                onClick={(e: any) => {
                  e.stopPropagation();
                  setOpen(true);
                }}
              >
                <Icon>videocam</Icon> Xem camera
              </MDButton>
            </MDTypography>
            <MDTypography color="inherit" fontSize={14}>
              Tình trạng: {isControlled ? "Đã xử lý" : "Chưa xử lý"}
            </MDTypography>
          </>
        }
        handleClick={() => {
          updateUserAttendanceChoosed(dispatch, item);
        }}
        customeStyle={{ border: isControlled ? "none" : "2px solid red", margin: "8px" }}
      >
        {children}
      </SimpleBlogCard>

      <Modal
        open={open}
        onClose={handleCloseVideo}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <>{openViewCamera(handleCloseVideo)}</>
      </Modal>
    </MDBox>
  );
}
