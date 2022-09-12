import React, { createContext, useContext, useMemo, useReducer } from "react";
import { HIDE_LOADING, HIDE_SNACKBAR, SHOW_LOADING, SHOW_SNACKBAR } from "../constants/action";
import { SUCCESS_TYPE } from "../constants/app";

// @ts-ignore
const SnackbarContext = createContext();
SnackbarContext.displayName = "SnackbarContext";

type SnackbarStateType = {
  openSnackbar: boolean;
  typeSnackbar: string;
  messageSnackbar: string;
  timeSnackbar: number;
  showLoading: boolean;
};

type SnackbarActionType = {
  type: string;
  payload: any;
};

const reducer = (state: SnackbarStateType, action: SnackbarActionType) => {
  switch (action.type) {
    case SHOW_SNACKBAR:
      return {
        ...state,
        openSnackbar: true,
        typeSnackbar: action.payload.typeSnackbar,
        messageSnackbar: action.payload.messageSnackbar,
        timeSnackbar: action.payload.timeSnackbar || 3000,
      };
    case HIDE_SNACKBAR:
      return {
        ...state,
        openSnackbar: false,
      };
    case SHOW_LOADING:
      return {
        ...state,
        showLoading: true,
      };
    case HIDE_LOADING:
      return {
        ...state,
        showLoading: false,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

function SnackbarProvider({ children }: { children: React.ReactElement }) {
  const initialState: SnackbarStateType = {
    openSnackbar: false,
    typeSnackbar: SUCCESS_TYPE,
    messageSnackbar: "Success",
    timeSnackbar: 3000,
    showLoading: false,
  };

  const [controller, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => [controller, dispatch], [controller, dispatch]);
  return <SnackbarContext.Provider value={value}>{children}</SnackbarContext.Provider>;
}

const useSnackbarController = () => {
  const context = useContext(SnackbarContext);

  if (!context) {
    throw new Error("useSnackbarController should be used inside the SnackbarContextProvider.");
  }

  return context;
};

const showSnackbar = (
  dispatch: any,
  {
    typeSnackbar,
    messageSnackbar,
    timeSnackbar,
  }: { typeSnackbar: string; messageSnackbar: any; timeSnackbar?: number }
) => dispatch({ type: SHOW_SNACKBAR, payload: { typeSnackbar, messageSnackbar, timeSnackbar } });

const hideSnackbar = (dispatch: any) => dispatch({ type: HIDE_SNACKBAR });

const showLoading = (dispatch: any) => dispatch({ type: SHOW_LOADING });

const hideLoading = (dispatch: any) => dispatch({ type: HIDE_LOADING });

export {
  SnackbarProvider,
  useSnackbarController,
  showSnackbar,
  hideSnackbar,
  showLoading,
  hideLoading,
};
