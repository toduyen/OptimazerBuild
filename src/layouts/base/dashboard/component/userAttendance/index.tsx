import React, { useEffect, useState } from "react";
import MDBox from "components/bases/MDBox";
import StaffComponent from "./StaffComponent";
// @ts-ignore
import Pulse from "react-reveal/Pulse";
import { convertNotificationHistoryToUserAttendanceItem, UserAttendanceItemType } from "types/userAttendanceItemType";
import { TabPanel, TitleTabs } from "./TabPanel";
import MDInput from "components/bases/MDInput";
import { getAllNotificationHistoryApi } from "../../../notificationHistory/api";
import {
  convertStringFromDateTime,
  convertStringTime,
  convertTimeStringToDate,
} from "utils/helpers";
import { NotificationHistory } from "models/base/notificationHistory";
import { useAuthenController } from "context/authenContext";
import {
  getUserAttendanceItemsSuccess,
  useNotificationHistoryController,
} from "context/notificationHistoryContext";
import InfiniteScroll from "react-infinite-scroll-component";
import { CircularProgress } from "@mui/material";
import {
  setOpenConfigurator,
  useMaterialUIController,
} from "../../../../../context/materialContext";
import { useAudio } from "./useAudio";
import { RING_URL } from "../../../../../constants/app";

export default function UserAttendance() {
  const [value, setValue] = React.useState(0);
  const [userAttendanceItems, setUserAttendanceItems] = useState<Array<UserAttendanceItemType>>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  // @ts-ignore
  const [controller, dispatch] = useMaterialUIController();
  const handleConfiguratorClose = () => setOpenConfigurator(dispatch, false);

  // @ts-ignore
  const [notificationHistoryController, notificationHistoryDispatch] =
    useNotificationHistoryController();

  // @ts-ignore
  const [authController] = useAuthenController();

  const [playing, play, pause] = useAudio(RING_URL);
  const [hasNotify, setHasNotify] = useState(false);

  useEffect(() => {
    if (notificationHistoryController.hasNotificationAudio) {
      setHasNotify(true);
    } else {
      setHasNotify(false);
    }
  }, [notificationHistoryController.hasNotificationAudio]);

  // @ts-ignore
  useEffect(async () => {
    if (notificationHistoryController.isAudioOn && hasNotify) {
      // @ts-ignore
      await play();
    } else {
      // @ts-ignore
      await pause();
    }
  }, [notificationHistoryController.isAudioOn, hasNotify]);

  // @ts-ignore
  useEffect(async () => {
    if (authController.token) {
      await getUserAttendanceItems(0, 10, null, true);
    }
  }, [authController.token]);

  useEffect(() => {
    if (notificationHistoryController.userAttendanceItems) {
      setUserAttendanceItems(notificationHistoryController.userAttendanceItems);
    }
  }, [notificationHistoryController.userAttendanceItems]);

  const getUserAttendanceItems = async (
    page: number,
    size: number,
    hasEmployee: boolean | null,
    isFromStart: boolean
  ) => {
    const getNotificationHistoriesInCurrentDay = await getAllNotificationHistoryApi({
      token: authController.token,
      page,
      size,
      timeStart: convertStringFromDateTime(convertTimeStringToDate("00:00:00")),
      timeEnd: convertStringFromDateTime(convertTimeStringToDate("23:59:59")),
      hasEmployee,
    });
    if (getNotificationHistoriesInCurrentDay.data !== null) {
      const dataInPage = getNotificationHistoriesInCurrentDay.data.data.map(
        (item: NotificationHistory) =>
          convertNotificationHistoryToUserAttendanceItem(
            item,
            authController.currentUser.location.id
          )
      );

      const newData = isFromStart
        ? dataInPage
        : [...notificationHistoryController.userAttendanceItems, ...dataInPage];
      getUserAttendanceItemsSuccess(notificationHistoryDispatch, newData);
      setTotalPage(getNotificationHistoriesInCurrentDay.data.pageCount);
    }
  };

  const handleChange = async (event: any, newValue: any) => {
    setValue(newValue);
    setCurrentPage(0);
    await getUserAttendanceItems(0, 10, newValue === 0 ? null : newValue === 2, true);
  };

  const getTabPanelContent = () => (
    <div id="scrollableDiv" style={{ height: "52vh", overflowY: "auto", overflowX: "hidden" }}>
      <InfiniteScroll
        dataLength={userAttendanceItems.length}
        next={async () => {
          const newPage = currentPage + 1;
          setCurrentPage(newPage);
          await getUserAttendanceItems(newPage, 10, value === 0 ? null : value === 2, false);
        }}
        hasMore={currentPage < totalPage - 1}
        loader={
          <MDBox>
            <CircularProgress color="info" />
          </MDBox>
        }
        scrollableTarget="scrollableDiv"
        style={{ overflow: "unset" }}
      >
        {userAttendanceItems.map((item: UserAttendanceItemType, index: number) =>
          !item.isControlled ? (
            <Pulse forever key={`${item.employeeName}_${item.time}_${index}`}>
              <StaffComponent item={item} />
            </Pulse>
          ) : (
            <StaffComponent item={item} key={`${item.employeeName}_${item.time}_${index}`} />
          )
        )}
      </InfiniteScroll>
    </div>
  );

  return (
    <MDBox style={{ background: "DEE2E8", boxShadow: "0px 2px 6px rgb(0 0 0 / 25%)" }}>
      <MDBox>
         <MDInput label="Tìm kiếm" style={{ margin: "10px", width: "-webkit-fill-available" }} />
       </MDBox>
       <MDBox>
         <TitleTabs
          labelId="demo-a11y-tabs-automatic-label"
          selectionFollowsFocus
          onChange={handleChange}
          value={value}
        />
        <MDBox style={{ position: "sticky" }}>
          <TabPanel value={value} index={0}>
            {getTabPanelContent()}
          </TabPanel>
          <TabPanel value={value} index={1}>
            {getTabPanelContent()}
          </TabPanel>
          <TabPanel value={value} index={2}>
            {getTabPanelContent()}
          </TabPanel>
        </MDBox>
      </MDBox>
    </MDBox>
  );
}
