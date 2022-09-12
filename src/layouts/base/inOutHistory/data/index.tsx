import { useCallback, useEffect, useState } from "react";
import { getAllInOutHistoryApi } from "../api";
import { InOutHistory } from "models/base/inOutHistory";
import { convertStringTime } from "../../../../utils/helpers";
import { CardMedia } from "@mui/material";
import { useAuthenController } from "../../../../context/authenContext";
import {
  getAllInOutHistoriesSuccess,
  useInOutHistoryController,
} from "../../../../context/inOutHistoryContext";
import { isTimeKeepingModule } from "utils/checkRoles";

export default function data() {
  const [pageCount, setPageCount] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [historyData, setHistoryData] = useState([]);

  // @ts-ignore
  const [authController] = useAuthenController();

  // @ts-ignore
  const [inOutHistoryController, inOutHistoryDispatch] = useInOutHistoryController();

  const [token, setToken] = useState(null);

  useEffect(() => {
    if (token !== authController.token) {
      setToken(authController.token);
    }
  }, [authController.token]);

  const fetchData = useCallback(
    async ({ page, size }) => {
      if (token) {
        const getAllInOutHistoryResponse = await getAllInOutHistoryApi({
          token,
          page,
          size,
          employeeId: inOutHistoryController.employeeChoosed
            ? inOutHistoryController.employeeChoosed.id
            : undefined,
        });

        if (getAllInOutHistoryResponse.data !== null) {
          getAllInOutHistoriesSuccess(inOutHistoryDispatch, getAllInOutHistoryResponse.data.data);
          setPageCount(getAllInOutHistoryResponse.data.pageCount);
          setItemCount(getAllInOutHistoryResponse.data.itemCount);
        }
      }
    },
    [token, inOutHistoryController.employeeChoosed]
  );

  const convertDataToRow = (history: InOutHistory) => ({
    cameraName: history.camera.name,
    checked: history.type,
    inOutAreaRestriction: history.type,
    userName: history.employee.name,
    userCode: history.employee.code,
    manager:
      history.employee.manager !== null
        ? `${history.employee.manager.code}-${history.employee.manager.name}`
        : "",
    time: convertStringTime(history.time),
    image:
      history.image !== null ? (
        <CardMedia component="img" height="80" image={history.image.path} alt="" />
      ) : (
        <div />
      ),
  });
  useEffect(() => {
    if (inOutHistoryController.inOutHistories) {
      setHistoryData(
        inOutHistoryController.inOutHistories.map((history: InOutHistory) =>
          convertDataToRow(history)
        )
      );
    }
  }, [inOutHistoryController.inOutHistories]);

  return {
    columns: isTimeKeepingModule()
      ? [
          { Header: "Camera", accessor: "cameraName", align: "center" },
          { Header: "Check in/ Check out", accessor: "checked", align: "center" },
          { Header: "Tên nhân viên", accessor: "userName", align: "center" },
          { Header: "Mã nhân viên", accessor: "userCode", align: "center" },
          { Header: "Quản lý", accessor: "manager", align: "center" },
          { Header: "Thời gian", accessor: "time", align: "center" },
          { Header: "Hình ảnh", accessor: "image", align: "center" },
        ]
      : [
          { Header: "Camera", accessor: "cameraName", align: "center" },
          { Header: "Vào/Ra KVHC", accessor: "inOutAreaRestriction", align: "center" },
          { Header: "Tên nhân viên", accessor: "userName", align: "center" },
          { Header: "Mã nhân viên", accessor: "userCode", align: "center" },
          { Header: "Quản lý", accessor: "manager", align: "center" },
          { Header: "Thời gian", accessor: "time", align: "center" },
          { Header: "Hình ảnh", accessor: "image", align: "center" },
        ],

    rows: historyData,
    fetchData,
    pageCount,
    itemCount,
  };
}
