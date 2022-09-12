import React, { createContext, useContext, useMemo, useReducer } from "react";
import { GET_ALL_ROLE_SUCCESS } from "constants/action";
import { Role } from "models/base/role";

// @ts-ignore
const RoleContext = createContext();
RoleContext.displayName = "RoleContext";

type RoleStateType = {
  roles: Array<Role>;
};

type RoleActionType = {
  type: string;
  payload: any;
};

const initialState: RoleStateType = {
  roles: [],
};

const reducer = (state: RoleStateType, action: RoleActionType) => {
  switch (action.type) {
    case GET_ALL_ROLE_SUCCESS: {
      return {
        ...state,
        roles: action.payload,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

function RoleProvider({ children }: { children: React.ReactElement }) {
  const [controller, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(() => [controller, dispatch], [controller, dispatch]);
  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

const useRoleController = () => {
  const context = useContext(RoleContext);

  if (!context) {
    throw new Error("useRoleController should be used inside the RoleContextProvider.");
  }

  return context;
};

const getAllRoleSuccess = (dispatch: any, roles: Array<Role>) =>
  dispatch({ type: GET_ALL_ROLE_SUCCESS, payload: roles });

export { RoleProvider, useRoleController, getAllRoleSuccess };
