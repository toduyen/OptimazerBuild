import { useCallback, useEffect, useState } from "react";
import { useAuthenController } from "context/authenContext";
import { getAllLogApi } from "../api";
import { UserLog } from "models/base/userLog";
import { convertStringTime } from "../../../../utils/helpers";
import { getAllUserLogResponseSuccess, useUserLogController } from "context/userLogContext";

export default function data() {
  const [pageCount, setPageCount] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [logDatas, setLogDatas] = useState([]);

  // @ts-ignore
  const [authController] = useAuthenController();
  // @ts-ignore
  const [userLogController, userLogDispatch] = useUserLogController();

  const [token, setToken] = useState(null);

  useEffect(() => {
    if (token !== authController.token) {
      setToken(authController.token);
    }
  }, [authController.token]);

  const fetchData = useCallback(
    async ({ page, size, search }) => {
      if (token) {
        const getAllLogResponse = await getAllLogApi({ token, page, size, search });
        if (getAllLogResponse.data !== null) {
          getAllUserLogResponseSuccess(userLogDispatch, getAllLogResponse.data.data);
          setPageCount(getAllLogResponse.data.pageCount);
          setItemCount(getAllLogResponse.data.itemCount);
        }
      }
    },
    [token]
  );

  // @ts-ignore
  useEffect(async () => {
    if (token) {
      const getAllLogResponse = await getAllLogApi({
        token,
        page: 0,
        size: 10,
        userId: userLogController.accountChoosed ? userLogController.accountChoosed.id : "",
      });
      if (getAllLogResponse.data !== null) {
        getAllUserLogResponseSuccess(userLogDispatch, getAllLogResponse.data.data);
        setPageCount(getAllLogResponse.data.pageCount);
        setItemCount(getAllLogResponse.data.itemCount);
      }
    }
  }, [userLogController.accountChoosed]);

  const convertDataToRow = (log: UserLog) => ({
    accountName: log.username,
    time: convertStringTime(log.time),
    logInfo: log.content,
  });

  useEffect(() => {
    if (userLogController.userLogs) {
      setLogDatas(userLogController.userLogs.map((log: UserLog) => convertDataToRow(log)));
    }
  }, [userLogController.userLogs]);

  return {
    columns: [
      { Header: "Tên tài khoản", accessor: "accountName", align: "center" },
      { Header: "Thời gian", accessor: "time", align: "center" },
      { Header: "Thông tin log", accessor: "logInfo", align: "center" },
    ],

    rows: logDatas,
    fetchData,
    pageCount,
    itemCount,
  };
}
