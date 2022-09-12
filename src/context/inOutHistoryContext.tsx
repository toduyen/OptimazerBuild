import React, { createContext, useContext, useMemo, useReducer } from "react";
import { GET_ALL_IN_OUT_HISTORIES_SUCCESS, UPDATE_EMPLOYEE_CHOOSED } from "constants/action";
import { InOutHistory } from "../models/base/inOutHistory";
import { Employee } from "models/base/employee";

// @ts-ignore
const InOutHistoryContext = createContext();
InOutHistoryContext.displayName = "InOutHistoryContext";

type InOutHistoryStateType = {
  inOutHistories: Array<InOutHistory>;
  employeeChoosed: Employee | null;
};

type InOutHistoryActionType = {
  type: string;
  payload: any;
};

const initialState: InOutHistoryStateType = {
  inOutHistories: [],
  employeeChoosed: null,
};

const reducer = (state: InOutHistoryStateType, action: InOutHistoryActionType) => {
  switch (action.type) {
    case GET_ALL_IN_OUT_HISTORIES_SUCCESS: {
      return {
        ...state,
        inOutHistories: action.payload,
      };
    }
    case UPDATE_EMPLOYEE_CHOOSED: {
      return {
        ...state,
        employeeChoosed: action.payload,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

function InOutHistoryProvider({ children }: { children: React.ReactElement }) {
  const [controller, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(() => [controller, dispatch], [controller, dispatch]);
  return <InOutHistoryContext.Provider value={value}>{children}</InOutHistoryContext.Provider>;
}

const useInOutHistoryController = () => {
  const context = useContext(InOutHistoryContext);

  if (!context) {
    throw new Error(
      "useInOutHistoryController should be used inside the InOutHistoryContextProvider."
    );
  }

  return context;
};

const getAllInOutHistoriesSuccess = (dispatch: any, inOutHistories: Array<InOutHistory>) =>
  dispatch({ type: GET_ALL_IN_OUT_HISTORIES_SUCCESS, payload: inOutHistories });

const updateEmployeeChoosed = (dispatch: any, employeeChoosed: any) =>
  dispatch({ type: UPDATE_EMPLOYEE_CHOOSED, payload: employeeChoosed });

export {
  InOutHistoryProvider,
  useInOutHistoryController,
  getAllInOutHistoriesSuccess,
  updateEmployeeChoosed,
};
