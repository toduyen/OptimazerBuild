import React, { createContext, useContext, useMemo, useReducer } from "react";
import {
  ADD_AREA_RESTRICTION_SUCCESS,
  DELETE_AREA_RESTRICTION_SUCCESS,
  GET_ALL_AREA_RESTRICTION_NOTIFICATION_SUCCESS,
  GET_ALL_AREA_RESTRICTION_SUCCESS,
  UPDATE_AREA_RESTRICTION_NOTIFICATION_SUCCESS,
  UPDATE_AREA_RESTRICTION_SUCCESS,
} from "constants/action";
import { AreaRestriction } from "models/area-restriction/areaRestriction";
import { AreaRestrictionNotification } from "models/area-restriction/areaRestrictionNotification";

// @ts-ignore
const AreaRestrictionContext = createContext();
AreaRestrictionContext.displayName = "AreaRestrictionContext";

type AreaRestrictionStateType = {
  areaRestrictions: Array<AreaRestriction>;
  areaRestrictionNotification: AreaRestrictionNotification | null;
};

type AreaRestrictionActionType = {
  type: string;
  payload: any;
};

const initialState: AreaRestrictionStateType = {
  areaRestrictions: [],
  areaRestrictionNotification: null,
};

const reducer = (state: AreaRestrictionStateType, action: AreaRestrictionActionType) => {
  switch (action.type) {
    case GET_ALL_AREA_RESTRICTION_SUCCESS: {
      return {
        ...state,
        areaRestrictions: action.payload,
      };
    }
    case ADD_AREA_RESTRICTION_SUCCESS: {
      return {
        ...state,
        areaRestrictions: [action.payload, ...state.areaRestrictions],
      };
    }
    case UPDATE_AREA_RESTRICTION_SUCCESS: {
      const areaRestriction = action.payload;
      const areaRestrictions = state.areaRestrictions.map((items) => {
        if (items.id === areaRestriction.id) {
          return areaRestriction;
        }
        return items;
      });
      return {
        ...state,
        areaRestrictions,
      };
    }
    case DELETE_AREA_RESTRICTION_SUCCESS: {
      return {
        ...state,
        areaRestrictions: state.areaRestrictions.filter(
          (areaRestriction) => areaRestriction.id !== action.payload
        ),
      };
    }
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

function AreaRestrictionProvider({ children }: { children: React.ReactElement }) {
  const [controller, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(() => [controller, dispatch], [controller, dispatch]);
  return (
    <AreaRestrictionContext.Provider value={value}>{children}</AreaRestrictionContext.Provider>
  );
}

const useAreaRestrictionController = () => {
  const context = useContext(AreaRestrictionContext);

  if (!context) {
    throw new Error(
      "useAreaRestrictionController should be used inside the AreaRestrictionContextProvider."
    );
  }

  return context;
};

const getAllAreaRestrictionSuccess = (dispatch: any, areaRestrictions: Array<AreaRestriction>) =>
  dispatch({ type: GET_ALL_AREA_RESTRICTION_SUCCESS, payload: areaRestrictions });

const addAreaRestrictionSuccess = (dispatch: any, areaRestriction: AreaRestriction) =>
  dispatch({ type: ADD_AREA_RESTRICTION_SUCCESS, payload: areaRestriction });

const updateAreaRestrictionSuccess = (dispatch: any, areaRestriction: AreaRestriction) =>
  dispatch({ type: UPDATE_AREA_RESTRICTION_SUCCESS, payload: areaRestriction });

const deleteAreaRestrictionSuccess = (dispatch: any, id: number) =>
  dispatch({ type: DELETE_AREA_RESTRICTION_SUCCESS, payload: id });

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
  AreaRestrictionProvider,
  useAreaRestrictionController,
  getAllAreaRestrictionSuccess,
  addAreaRestrictionSuccess,
  updateAreaRestrictionSuccess,
  getAllAreaRestrictionNotificationSuccess,
  updateAreaRestrictionNotificationSuccess,
  deleteAreaRestrictionSuccess,
};
