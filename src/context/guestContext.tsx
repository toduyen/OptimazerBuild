import React, { createContext, useContext, useMemo, useReducer } from "react";
import { Guest } from "models/base/guest";
import { ADD_GUEST } from "constants/action";

// @ts-ignore
const GuestContext = createContext();
GuestContext.displayName = "GuestContext";

type GuestStateType = {
  guest: Array<Guest>;
};

type GuestActionType = {
  type: string;
  payload: any;
};

const initialState: GuestStateType = {
  guest: [],
};

const reducer = (state: GuestStateType, action: GuestActionType) => {
  switch (action.type) {
    case ADD_GUEST: {
      return {
        ...state,
        guest: [...state.guest, action.payload],
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

function GuestProvider({ children }: { children: React.ReactElement }) {
  const [controller, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(() => [controller, dispatch], [controller, dispatch]);
  return <GuestContext.Provider value={value}>{children}</GuestContext.Provider>;
}

const useGuestController = () => {
  const context = useContext(GuestContext);

  if (!context) {
    throw new Error("useGuestController should be used inside the GuestContextProvider.");
  }

  return context;
};

const addGuestSuccess = (dispatch: any, guest: Guest) =>
  dispatch({ type: ADD_GUEST, payload: guest });

export { GuestProvider, useGuestController, addGuestSuccess };
