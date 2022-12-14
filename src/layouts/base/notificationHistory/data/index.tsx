import { useCallback, useEffect, useState } from "react";
import { getAllNotificationHistoryApi } from "../api";
import { NotificationHistory } from "models/base/notificationHistory";
import { convertStringTime } from "utils/helpers";
import { useAuthenController } from "../../../../context/authenContext";
import {
  getAllNotificationHistoriesSuccess,
  updateUserAttendanceChoosed,
  useNotificationHistoryController,
} from "../../../../context/notificationHistoryContext";
import { isAreaRestrictionModule, isTimeKeepingModule } from "utils/checkRoles";
import { CardMedia } from "@mui/material";
import MDBox from "components/bases/MDBox";
import MDButton from "components/bases/MDButton";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import {
  convertNotificationHistoryToUserAttendanceItem,
  UserAttendanceItemType,
} from "types/userAttendanceItemType";

export default function data() {
  const [pageCount, setPageCount] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [notificationHistoryData, setNotificationHistoryData] = useState([]);

  // @ts-ignore
  const [authController] = useAuthenController();

  // @ts-ignore
  const [notificationHistoryController, notificationHistoryDispatch] =
    useNotificationHistoryController();

  const [token, setToken] = useState(null);

  useEffect(() => {
    if (token !== authController.token) {
      setToken(authController.token);
    }
  }, [authController.token]);

  const fetchData = useCallback(
    async ({ page, size }) => {
      if (token) {
        const getAllNotificationHistoryResponse = await getAllNotificationHistoryApi({
          token,
          page,
          size,
          areaRestrictionId: notificationHistoryController.filter.areaRestriction
            ? notificationHistoryController.filter.areaRestriction.id
            : "",
          employeeId: notificationHistoryController.employeeChoosed
            ? notificationHistoryController.employeeChoosed.id
            : "",
          status: isAreaRestrictionModule()
            ? notificationHistoryController.filter.status
              ? notificationHistoryController.filter.status
              : ""
            : "",
        });
        if (getAllNotificationHistoryResponse.data !== null) {
          getAllNotificationHistoriesSuccess(
            notificationHistoryDispatch,
            getAllNotificationHistoryResponse.data.data
          );
          setPageCount(getAllNotificationHistoryResponse.data.pageCount);
          setItemCount(getAllNotificationHistoryResponse.data.itemCount);
        }
      }
    },
    [token, notificationHistoryController.filter, notificationHistoryController.employeeChoosed]
  );

  const convertDataToRow = (history: NotificationHistory) => {
    let temp = {
      notificationType: history.type ? history.type : "",
      employee: (
        <MDBox style={{ textAlignLast: "left" }}>
          {history.employee?.name ? <MDBox>T??n nh??n vi??n: {history.employee?.name}</MDBox> : ""}
          {history.employee?.code ? <MDBox>M?? nh??n vi??n: {history.employee?.code}</MDBox> : ""}
          {history.employee?.manager ? (
            <MDBox>
              Qu???n l??: {history.employee?.manager?.code}-{history.employee?.manager?.name}
            </MDBox>
          ) : (
            ""
          )}
        </MDBox>
      ),
      time: convertStringTime(history.time),
    };

    if (isAreaRestrictionModule()) {
      temp = {
        ...temp,
        // @ts-ignore

        camera: history.camera ? history.camera.name : "",
        areaRestriction:
          history.camera && history.camera.areaRestriction
            ? history.camera.areaRestriction.areaName
            : "",
        status: history.status,
        image:
          history.image !== null ? (
            <CardMedia component="img" height="80" image={history.image?.path} alt="" />
          ) : (
            <div />
          ),
        action:
          history.status === "Ch??a x??? l??" ? (
            <MDBox
              display="flex"
              alignItems="center"
              mt={{ xs: 2, sm: 0 }}
              ml={{ xs: -1.5, sm: 0 }}
            >
              <MDButton
                variant="text"
                color="info"
                onClick={() => {
                  const userAttendance: UserAttendanceItemType =
                    convertNotificationHistoryToUserAttendanceItem(
                      history,
                      authController.currentUser.location.id
                    );
                  updateUserAttendanceChoosed(notificationHistoryDispatch, userAttendance);
                }}
              >
                <RemoveRedEyeIcon />
                &nbsp;Xem chi ti???t
              </MDButton>
            </MDBox>
          ) : (
            <div />
          ),
      };
    }
    return temp;
  };
  useEffect(() => {
    if (notificationHistoryController.notificationHistories) {
      setNotificationHistoryData(
        notificationHistoryController.notificationHistories.map((history: NotificationHistory) =>
          convertDataToRow(history)
        )
      );
    }
  }, [
    notificationHistoryController.notificationHistories,
    notificationHistoryController.userAttendanceChoosed,
  ]);

  return {
    columns: isTimeKeepingModule()
      ? [
          { Header: "Lo???i c???nh b??o", accessor: "notificationType", align: "center" },
          { Header: "Nh??n vi??n", accessor: "employee", align: "left" },
          { Header: "Th???i gian", accessor: "time", align: "left" },
        ]
      : [
          { Header: "Camera", accessor: "camera", align: "center" },
          { Header: "Khu v???c h???n ch???", accessor: "areaRestriction", align: "center" },
          { Header: "Lo???i c???nh b??o", accessor: "notificationType", align: "center" },
          { Header: "Nh??n vi??n", accessor: "employee", align: "center" },
          { Header: "Th???i gian", accessor: "time", align: "center" },
          { Header: "Tr???ng th??i", accessor: "status", align: "center" },
          { Header: "H??nh ???nh", accessor: "image", align: "center" },
          { Header: "Thao t??c", accessor: "action", align: "center" },
        ],

    rows: notificationHistoryData,
    fetchData,
    pageCount,
    itemCount,
  };
}
