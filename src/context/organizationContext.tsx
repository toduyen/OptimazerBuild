import React, { createContext, useContext, useMemo, useReducer } from "react";
import {
  ADD_ORGANIZATION_SUCCESS,
  DELETE_ORGANIZATION_SUCCESS,
  GET_ALL_ORGANIZATION_SUCCESS,
  UPDATE_ORGANIZATION_SUCCESS,
} from "constants/action";
import { Organization } from "models/base/organization";

// @ts-ignore
const OrganizationContext = createContext();
OrganizationContext.displayName = "OrganizationContext";

type OrganizationStateType = {
  organizations: Array<Organization>;
};

type OrganizationActionType = {
  type: string;
  payload: any;
};

const initialState: OrganizationStateType = {
  organizations: [],
};

const reducer = (state: OrganizationStateType, action: OrganizationActionType) => {
  switch (action.type) {
    case GET_ALL_ORGANIZATION_SUCCESS: {
      return {
        ...state,
        organizations: action.payload,
      };
    }
    case ADD_ORGANIZATION_SUCCESS: {
      return {
        ...state,
        organizations: [...state.organizations, action.payload],
      };
    }
    case DELETE_ORGANIZATION_SUCCESS: {
      return {
        ...state,
        organizations: state.organizations.filter(
          (organization) => organization.id !== action.payload
        ),
      };
    }
    case UPDATE_ORGANIZATION_SUCCESS: {
      const updateOrganization = action.payload;
      const updateOrganizations = state.organizations.map((organization) => {
        if (organization.id === updateOrganization.id) {
          return updateOrganization;
        }
        return organization;
      });
      return {
        ...state,
        organizations: updateOrganizations,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

function OrganizationProvider({ children }: { children: React.ReactElement }) {
  const [controller, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(() => [controller, dispatch], [controller, dispatch]);
  return <OrganizationContext.Provider value={value}>{children}</OrganizationContext.Provider>;
}

const useOrganizationController = () => {
  const context = useContext(OrganizationContext);

  if (!context) {
    throw new Error(
      "useOrganizationController should be used inside the OrganizationContextProvider."
    );
  }

  return context;
};

const getAllOrganizationSuccess = (dispatch: any, organizations: Array<Organization>) =>
  dispatch({ type: GET_ALL_ORGANIZATION_SUCCESS, payload: organizations });

const addOrganizationSuccess = (dispatch: any, organization: Organization) =>
  dispatch({ type: ADD_ORGANIZATION_SUCCESS, payload: organization });

const deleteOrganizationSuccess = (dispatch: any, id: number) =>
  dispatch({ type: DELETE_ORGANIZATION_SUCCESS, payload: id });

const updateOrganizationSuccess = (dispatch: any, organization: Organization) =>
  dispatch({ type: UPDATE_ORGANIZATION_SUCCESS, payload: organization });

export {
  OrganizationProvider,
  useOrganizationController,
  getAllOrganizationSuccess,
  addOrganizationSuccess,
  updateOrganizationSuccess,
  deleteOrganizationSuccess,
};
