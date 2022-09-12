import React, { createContext, useContext, useMemo, useReducer } from "react";
import {
  GET_ALL_AREA_RESTRICTION_NOTIFICATION_SUCCESS,
  UPDATE_AREA_RESTRICTION_NOTIFICATION_SUCCESS,
} from "constants/action";
import { AreaRestrictionNotification } from "models/area-restriction/areaRestrictionNotification";

// @ts-ignore
const AreaRestrictionNotificationContext = createContext();
AreaRestrictionNotificationContext.displayName = "AreaRestrictionNotificationContext";

type AreaRestrictionNotificationStateType = {
  areaRestrictionNotification: AreaRestrictionNotification | null;
};

type AreaRestrictionNotificationActionType = {
  type: string;
  payload: any;
};

const initialState: AreaRestrictionNotificationStateType = {
  areaRestrictionNotification: null,
};

const reducer = (
  state: AreaRestrictionNotificationStateType,
  action: AreaRestrictionNotificationActionType
) => {
  switch (action.type) {
    case GET_ALL_AREA_RESTRICTION_NOTIFICATION_SUCCESS: {
      return {
        ...state,
        areaRestrictionNotification: action.payload,
      };
    }
    case UPDATE_AREA_RESTRICTION_NOTIFICATION_SUCCESS: {
      return {
        ...state,
        areaRestrictionNotification: action.payload,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

function AreaRestrictionNotificationProvider({ children }: { children: React.ReactElement }) {
  const [controller, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(() => [controller, dispatch], [controller, dispatch]);
  return (
    <AreaRestrictionNotificationContext.Provider value={value}>
      {children}
    </AreaRestrictionNotificationContext.Provider>
  );
}

const useAreaRestrictionNotificationController = () => {
  const context = useContext(AreaRestrictionNotificationContext);

  if (!context) {
    throw new Error(
      "useAreaRestrictionNotificationController should be used inside the AreaRestrictionNotificationContextProvider."
    );
  }

  return context;
};

const getAllAreaRestrictionNotificationSuccess = (
  dispatch: any,
  areaRestrictionNotification: AreaRestrictionNotification
) =>
  dispatch({
    type: GET_ALL_AREA_RESTRICTION_NOTIFICATION_SUCCESS,
    payload: areaRestrictionNotification,
  });

const updateAreaRestrictionNotificationSuccess = (
  dispatch: any,
  areaRestrictionNotification: AreaRestrictionNotification
) =>
  dispatch({
    type: UPDATE_AREA_RESTRICTION_NOTIFICATION_SUCCESS,
    payload: areaRestrictionNotification,
  });

export {
  AreaRestrictionNotificationProvider,
  useAreaRestrictionNotificationController,
  getAllAreaRestrictionNotificationSuccess,
  updateAreaRestrictionNotificationSuccess,
};
