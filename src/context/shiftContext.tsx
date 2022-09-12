import React, { createContext, useContext, useMemo, useReducer } from "react";
import { GET_ALL_SHIFT_SUCCESS, UPDATE_SHIFTS_SUCCESS } from "constants/action";
import { Shift } from "../models/time-keeping/shift";

// @ts-ignore
const ShiftContext = createContext();
ShiftContext.displayName = "ShiftContext";

type ShiftStateType = {
  shifts: Array<Shift>;
};

type ShiftActionType = {
  type: string;
  payload: any;
};

const initialState: ShiftStateType = {
  shifts: [],
};

const reducer = (state: ShiftStateType, action: ShiftActionType) => {
  switch (action.type) {
    case GET_ALL_SHIFT_SUCCESS: {
      return {
        ...state,
        shifts: action.payload,
      };
    }
    case UPDATE_SHIFTS_SUCCESS: {
      return {
        ...state,
        shifts: action.payload,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

function ShiftProvider({ children }: { children: React.ReactElement }) {
  const [controller, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(() => [controller, dispatch], [controller, dispatch]);
  return <ShiftContext.Provider value={value}>{children}</ShiftContext.Provider>;
}

const useShiftController = () => {
  const context = useContext(ShiftContext);

  if (!context) {
    throw new Error("useShiftController should be used inside the ShiftContextProvider.");
  }

  return context;
};

const getAllShiftSuccess = (dispatch: any, shifts: Array<Shift>) =>
  dispatch({ type: GET_ALL_SHIFT_SUCCESS, payload: shifts });

const updateShiftSuccess = (dispatch: any, shifts: Array<Shift>) =>
  dispatch({
    type: UPDATE_SHIFTS_SUCCESS,
    payload: shifts,
  });

export { ShiftProvider, useShiftController, getAllShiftSuccess, updateShiftSuccess };
