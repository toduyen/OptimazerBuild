import React, { createContext, useContext, useMemo, useReducer } from "react";
import {
  ADD_USER_ATTENDANCE_ITEM_SUCCESS,
  GET_ALL_NOTIFICATION_HISTORIES_SUCCESS,
  GET_USER_ATTENDANCE_ITEMS_SUCCESS,
  UPDATE_AREA_RESTRICTION_CHOOSED,
  UPDATE_FILTER_NOTIFICATION_HISTORY,
  UPDATE_AREA_USER_ATTENDANCE_CHOOSED,
  UPDATE_CONFIRM_AUDIO,
  UPDATE_EMPLOYEE_CHOOSED,
  UPDATE_HAS_NOTIFICATION_AUDIO,
  UPDATE_STATUS_AUDIO,
  UPDATE_USER_ATTENDANCE_ITEM_SUCCESS,
  UPDATE_NOTIFICATION_STATUS,
  UPDATE_TOGGLE_NOTIFICATION_HISTORY,
} from "constants/action";

import { NotificationHistory } from "../models/base/notificationHistory";
import { UserAttendanceItemType } from "../types/userAttendanceItemType";
import { AreaRestriction } from "models/area-restriction/areaRestriction";
import { Employee } from "models/base/employee";

// @ts-ignore
const NotificationHistoryContext = createContext();
NotificationHistoryContext.displayName = "NotificationHistoryContext";

type NotificationHistoryStateType = {
  notificationHistories: Array<NotificationHistory>;
  userAttendanceItems: Array<UserAttendanceItemType>;
  userAttendanceChoosed: any;
  isConfirmAudio: boolean;
  isAudioOn: boolean;
  hasNotificationAudio: boolean;
  areaRestrictionChoosed: AreaRestriction | null;
  employeeChoosed: Employee | null;
  toggle: boolean;
  filter: {
    areaRestriction: AreaRestriction | null;
    status: string | null;
  };
};

type NotificationHistoryActionType = {
  type: string;
  payload: any;
};

const initialState: NotificationHistoryStateType = {
  notificationHistories: [],
  userAttendanceItems: [],
  userAttendanceChoosed: null,
  isConfirmAudio: false,
  isAudioOn: false,
  hasNotificationAudio: false,
  areaRestrictionChoosed: null,
  employeeChoosed: null,
  toggle: false,
  filter: {
    areaRestriction: null,
    status: "Chưa xử lý",
  },
};

const reducer = (state: NotificationHistoryStateType, action: NotificationHistoryActionType) => {
  switch (action.type) {
    case GET_ALL_NOTIFICATION_HISTORIES_SUCCESS: {
      return {
        ...state,
        notificationHistories: action.payload,
      };
    }
    case GET_USER_ATTENDANCE_ITEMS_SUCCESS: {
      return {
        ...state,
        userAttendanceItems: action.payload,
      };
    }
    case ADD_USER_ATTENDANCE_ITEM_SUCCESS: {
      const newData = [action.payload, ...state.userAttendanceItems];
      return {
        ...state,
        userAttendanceItems: newData.slice(0, Math.max(newData.length - 1, 10)), // For prevent duplicate page user attendance
      };
    }
    case UPDATE_USER_ATTENDANCE_ITEM_SUCCESS: {
      let notifications;

      if (state.filter.status === "Chưa xử lý") {
        notifications = state.notificationHistories.filter((item) => item.id !== action.payload);
      } else {
        notifications = state.notificationHistories.map((item) => {
          if (item.id === action.payload) {
            return { ...item, status: "Đã xử lý" };
          }
          return item;
        });
      }
      return {
        ...state,
        notificationHistories: notifications,

        userAttendanceItems: state.userAttendanceItems.map((item) => {
          if (item.notificationHistoryId === action.payload) {
            return { ...item, isControlled: true };
          }
          return item;
        }),
      };
    }
    case UPDATE_AREA_USER_ATTENDANCE_CHOOSED: {
      return {
        ...state,
        userAttendanceChoosed: action.payload,
      };
    }
    case UPDATE_CONFIRM_AUDIO: {
      return {
        ...state,
        isConfirmAudio: action.payload,
      };
    }
    case UPDATE_STATUS_AUDIO: {
      return {
        ...state,
        isAudioOn: action.payload,
      };
    }
    case UPDATE_HAS_NOTIFICATION_AUDIO: {
      return {
        ...state,
        hasNotificationAudio: action.payload,
      };
    }
    case UPDATE_EMPLOYEE_CHOOSED: {
      return {
        ...state,
        employeeChoosed: action.payload,
      };
    }
    case UPDATE_FILTER_NOTIFICATION_HISTORY: {
      return {
        ...state,
        filter: action.payload,
      };
    }
    case UPDATE_TOGGLE_NOTIFICATION_HISTORY: {
      return {
        ...state,
        toggle: !state.toggle,
      };
    }
    case UPDATE_NOTIFICATION_STATUS: {
      const updateStatusNotificationId = action.payload;
      const updateStatusIds = state.notificationHistories.map((item) => {
        if (item.id === updateStatusNotificationId) {
          return { ...item, status: "Đã xử lý" };
        }
        return item;
      });
      return {
        ...state,
        notificationHistories: updateStatusIds,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

function NotificationHistoryProvider({ children }: { children: React.ReactElement }) {
  const [controller, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(() => [controller, dispatch], [controller, dispatch]);
  return (
    <NotificationHistoryContext.Provider value={value}>
      {children}
    </NotificationHistoryContext.Provider>
  );
}

const useNotificationHistoryController = () => {
  const context = useContext(NotificationHistoryContext);

  if (!context) {
    throw new Error(
      "useNotificationHistoryController should be used inside the NotificationHistoryContextProvider."
    );
  }

  return context;
};

const getAllNotificationHistoriesSuccess = (
  dispatch: any,
  notificationHistories: Array<NotificationHistory>
) => dispatch({ type: GET_ALL_NOTIFICATION_HISTORIES_SUCCESS, payload: notificationHistories });

const getUserAttendanceItemsSuccess = (
  dispatch: any,
  userAttendanceItems: Array<UserAttendanceItemType>
) => dispatch({ type: GET_USER_ATTENDANCE_ITEMS_SUCCESS, payload: userAttendanceItems });

const addUserAttendanceItemSuccess = (dispatch: any, userAttendanceItem: UserAttendanceItemType) =>
  dispatch({ type: ADD_USER_ATTENDANCE_ITEM_SUCCESS, payload: userAttendanceItem });

const updateUserAttendanceItemSuccess = (dispatch: any, userAttendanceItemId: number) =>
  dispatch({ type: UPDATE_USER_ATTENDANCE_ITEM_SUCCESS, payload: userAttendanceItemId });

const updateUserAttendanceChoosed = (dispatch: any, userAttendanceChoosed: any) =>
  dispatch({ type: UPDATE_AREA_USER_ATTENDANCE_CHOOSED, payload: userAttendanceChoosed });

const updateConfirmAudio = (dispatch: any, isConfirmAudio: any) =>
  dispatch({ type: UPDATE_CONFIRM_AUDIO, payload: isConfirmAudio });

const updateStatusAudio = (dispatch: any, isConfirmAudio: any) =>
  dispatch({ type: UPDATE_STATUS_AUDIO, payload: isConfirmAudio });

const updateHasNotificationAudio = (dispatch: any, hasNotificationAudio: any) =>
  dispatch({ type: UPDATE_HAS_NOTIFICATION_AUDIO, payload: hasNotificationAudio });

const updateEmployeeChoosed = (dispatch: any, employeeChoosed: any) =>
  dispatch({ type: UPDATE_EMPLOYEE_CHOOSED, payload: employeeChoosed });

const updateFilterNotificationHistory = (dispatch: any, filter: any) =>
  dispatch({ type: UPDATE_FILTER_NOTIFICATION_HISTORY, payload: filter });

const updateStatusNotification = (dispatch: any, id: number) =>
  dispatch({ type: UPDATE_NOTIFICATION_STATUS, payload: id });

const updateToggleNotificationHistory = (dispatch: any) =>
  dispatch({ type: UPDATE_TOGGLE_NOTIFICATION_HISTORY, payload: null });
export {
  NotificationHistoryProvider,
  useNotificationHistoryController,
  getAllNotificationHistoriesSuccess,
  getUserAttendanceItemsSuccess,
  addUserAttendanceItemSuccess,
  updateUserAttendanceItemSuccess,
  updateUserAttendanceChoosed,
  updateConfirmAudio,
  updateStatusAudio,
  updateHasNotificationAudio,
  updateEmployeeChoosed,
  updateFilterNotificationHistory,
  updateStatusNotification,
  updateToggleNotificationHistory,
};
