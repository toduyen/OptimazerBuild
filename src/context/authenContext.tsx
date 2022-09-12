import React, { createContext, useContext, useMemo, useReducer } from "react";
import { LOG_OUT_SUCCESS, SIGN_IN_SUCCESS, UPDATE_MY_INFO_SUCCESS } from "constants/action";
import { User } from "models/base/user";

// @ts-ignore
const AuthenContext = createContext();
AuthenContext.displayName = "AuthenContext";

type AuthenStateType = {
  currentUser: User | null;
  token: string | null;
};

type AuthenActionType = {
  type: string;
  payload: any;
};

const initialState: AuthenStateType = {
  currentUser: null,
  token: null,
};

const reducer = (state: AuthenStateType, action: AuthenActionType) => {
  switch (action.type) {
    case SIGN_IN_SUCCESS: {
      return {
        ...state,
        currentUser: action.payload.user,
        token: action.payload.token,
      };
    }
    case UPDATE_MY_INFO_SUCCESS: {
      return {
        ...state,
        currentUser: action.payload,
      };
    }
    case LOG_OUT_SUCCESS: {
      return initialState;
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

function AuthenProvider({ children }: { children: React.ReactElement }) {
  const [controller, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(() => [controller, dispatch], [controller, dispatch]);
  return <AuthenContext.Provider value={value}>{children}</AuthenContext.Provider>;
}

const useAuthenController = () => {
  const context = useContext(AuthenContext);

  if (!context) {
    throw new Error("useAuthenController should be used inside the AuthenContextProvider.");
  }

  return context;
};

const signInSuccess = (dispatch: any, user: { user: User; token: string }) =>
  dispatch({ type: SIGN_IN_SUCCESS, payload: user });

const updateMyInfoSuccess = (dispatch: any, user: User) =>
  dispatch({ type: UPDATE_MY_INFO_SUCCESS, payload: user });

const logoutSuccess = (dispatch: any) => dispatch({ type: LOG_OUT_SUCCESS, payload: null });

export { AuthenProvider, useAuthenController, signInSuccess, updateMyInfoSuccess, logoutSuccess };
