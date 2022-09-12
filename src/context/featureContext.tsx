import React, { createContext, useContext, useMemo, useReducer } from "react";
import { GET_ALL_FEATURES_SUCCESS } from "constants/action";
import { Feature } from "models/base/feature";

// @ts-ignore
const FeatureContext = createContext();
FeatureContext.displayName = "FeatureContext";

type FeatureStateType = {
  features: Array<Feature>;
};

type FeatureActionType = {
  type: string;
  payload: any;
};

const initialState: FeatureStateType = {
  features: [],
};

const reducer = (state: FeatureStateType, action: FeatureActionType) => {
  switch (action.type) {
    case GET_ALL_FEATURES_SUCCESS: {
      return {
        ...state,
        features: action.payload,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

function FeatureProvider({ children }: { children: React.ReactElement }) {
  const [controller, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(() => [controller, dispatch], [controller, dispatch]);
  return <FeatureContext.Provider value={value}>{children}</FeatureContext.Provider>;
}

const useFeatureController = () => {
  const context = useContext(FeatureContext);

  if (!context) {
    throw new Error("useFeatureController should be used inside the FeatureContextProvider.");
  }

  return context;
};

const getAllFeatureSuccess = (dispatch: any, features: Array<Feature>) =>
  dispatch({ type: GET_ALL_FEATURES_SUCCESS, payload: features });

export { FeatureProvider, useFeatureController, getAllFeatureSuccess };
