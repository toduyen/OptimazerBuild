import React, { createContext, useContext, useMemo, useReducer } from "react";
import {
  GET_TIME_KEEPING_NOTIFICATION_SUCCESS,
  UPDATE_TIME_KEEPING_NOTIFICATION_SUCCESS,
} from "constants/action";
import { TimeKeepingNotification } from "../models/time-keeping/timeKeepingNotification";

// @ts-ignore
const TimeKeepingNotificationContext = createContext();
TimeKeepingNotificationContext.displayName = "TimeKeepingNotificationContext";

type TimeKeepingStateType = {
  timeKeepingNotification: TimeKeepingNotification;
};

type TimeKeepingActionType = {
  type: string;
  payload: any;
};

const initialState: TimeKeepingStateType = {
  timeKeepingNotification: {
    id: 0,
    lateTime: 5,
    lateInWeek: 5,
    lateInMonth: 5,
    lateInQuarter: 5,
    notificationMethod: {
      useEmail: true,
      useOTT: false,
      useRing: false,
      useScreen: false,
    },
    startDayOfWeek: 1,
    endDayOfWeek: 5,
  },
};

const reducer = (state: TimeKeepingStateType, action: TimeKeepingActionType) => {
  switch (action.type) {
    case GET_TIME_KEEPING_NOTIFICATION_SUCCESS: {
      return {
        ...state,
        timeKeepingNotification: action.payload,
      };
    }
    case UPDATE_TIME_KEEPING_NOTIFICATION_SUCCESS: {
      return {
        ...state,
        timeKeepingNotification: action.payload,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

function TimeKeepingNotificationProvider({ children }: { children: React.ReactElement }) {
  const [controller, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(() => [controller, dispatch], [controller, dispatch]);
  return (
    <TimeKeepingNotificationContext.Provider value={value}>
      {children}
    </TimeKeepingNotificationContext.Provider>
  );
}

const useTimeKeepingNotificationController = () => {
  const context = useContext(TimeKeepingNotificationContext);

  if (!context) {
    throw new Error(
      "useTimeKeepingNotificationController should be used inside the TimeKeepingNotificationContextProvider."
    );
  }

  return context;
};

const getTimeKeepingNotificationSuccess = (
  dispatch: any,
  timeKeepingNotification: TimeKeepingNotification
) =>
  dispatch({
    type: GET_TIME_KEEPING_NOTIFICATION_SUCCESS,
    payload: timeKeepingNotification,
  });

const updateTimeKeepingNotificationSuccess = (
  dispatch: any,
  timeKeepingNotification: TimeKeepingNotification
) =>
  dispatch({
    type: UPDATE_TIME_KEEPING_NOTIFICATION_SUCCESS,
    payload: timeKeepingNotification,
  });

export {
  TimeKeepingNotificationProvider,
  useTimeKeepingNotificationController,
  getTimeKeepingNotificationSuccess,
  updateTimeKeepingNotificationSuccess,
};
