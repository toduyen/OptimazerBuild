import React, { createContext, useContext, useMemo, useReducer } from "react";
import {
  ADD_LOCATION_SUCCESS,
  DELETE_LOCATION_SUCCESS,
  GET_ALL_LOCATION_SUCCESS,
  UPDATE_LOCATION_SUCCESS,
} from "constants/action";
import { Location } from "models/base/location";

// @ts-ignore
const LocationContext = createContext();
LocationContext.displayName = "LocationContext";

type LocationStateType = {
  locations: Array<Location>;
};

type LocationActionType = {
  type: string;
  payload: any;
};

const initialState: LocationStateType = {
  locations: [],
};

const reducer = (state: LocationStateType, action: LocationActionType) => {
  switch (action.type) {
    case GET_ALL_LOCATION_SUCCESS: {
      return {
        ...state,
        locations: action.payload,
      };
    }
    case ADD_LOCATION_SUCCESS: {
      return {
        ...state,
        locations: [action.payload, ...state.locations],
      };
    }
    case UPDATE_LOCATION_SUCCESS: {
      const updateLocation = action.payload;
      const updateLocations = state.locations.map((location) => {
        if (location.id === updateLocation.id) {
          return updateLocation;
        }
        return location;
      });
      return {
        ...state,
        locations: updateLocations,
      };
    }
    case DELETE_LOCATION_SUCCESS: {
      return {
        ...state,
        locations: state.locations.filter((location) => location.id !== action.payload),
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

function LocationProvider({ children }: { children: React.ReactElement }) {
  const [controller, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(() => [controller, dispatch], [controller, dispatch]);
  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

const useLocationController = () => {
  const context = useContext(LocationContext);

  if (!context) {
    throw new Error("useLocationController should be used inside the LocationContextProvider.");
  }

  return context;
};

const getAllLocationSuccess = (dispatch: any, locations: Array<Location>) =>
  dispatch({ type: GET_ALL_LOCATION_SUCCESS, payload: locations });

const addLocationSuccess = (dispatch: any, locations: Array<Location>) =>
  dispatch({ type: ADD_LOCATION_SUCCESS, payload: locations });

const updateLocationSuccess = (dispatch: any, location: Location) =>
  dispatch({ type: UPDATE_LOCATION_SUCCESS, payload: location });

const deleteLocationSuccess = (dispatch: any, id: number) =>
  dispatch({ type: DELETE_LOCATION_SUCCESS, payload: id });

export {
  LocationProvider,
  useLocationController,
  getAllLocationSuccess,
  addLocationSuccess,
  updateLocationSuccess,
  deleteLocationSuccess,
};
