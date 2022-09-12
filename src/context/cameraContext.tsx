import React, { createContext, useContext, useMemo, useReducer } from "react";
import {
  ADD_CAMERA_SUCCESS,
  DELETE_CAMERA_SUCCESS,
  GET_ALL_CAMERA_SUCCESS,
  UPDATE_CAMERA_LOCATION_CHOOSED,
  UPDATE_CAMERA_RESTRICTION_CHOOSED,
  UPDATE_CAMERA_SUCCESS,
  UPDATE_FILTER_CAMERA,
} from "constants/action";
import { Camera } from "../models/base/camera";
import { AreaRestriction } from "models/area-restriction/areaRestriction";

// @ts-ignore
const CameraContext = createContext();
CameraContext.displayName = "CameraContext";

type CameraStateType = {
  cameras: Array<Camera>;
  areaRestrictionChoosed: AreaRestriction | null;
  locationChoosed: Location | null;
  filter: {
    areaRestriction: AreaRestriction | null;
    status: string | null;
  };
};

type CameraActionType = {
  type: string;
  payload: any;
};

const initialState: CameraStateType = {
  cameras: [],
  areaRestrictionChoosed: null,
  locationChoosed: null,
  filter: {
    areaRestriction: null,
    status: "Đang hoạt động",
  },
};

const reducer = (state: CameraStateType, action: CameraActionType) => {
  switch (action.type) {
    case GET_ALL_CAMERA_SUCCESS: {
      return {
        ...state,
        cameras: action.payload,
      };
    }
    case ADD_CAMERA_SUCCESS: {
      return {
        ...state,
        cameras: [action.payload, ...state.cameras],
      };
    }
    case DELETE_CAMERA_SUCCESS: {
      let deleteCameras;
      if (state.filter.status === "Đang hoạt động") {
        return {
          ...state,
          cameras: state.cameras.filter((camera) => camera.id !== action.payload),
        };
      } else {
        deleteCameras = state.cameras.map((camera) => {
          if (camera.id === action.payload) {
            return {
              ...camera,
              status: "deleted",
            };
          }
          return camera;
        });
      }

      return {
        ...state,
        cameras: deleteCameras,
      };
    }
    case UPDATE_CAMERA_SUCCESS: {
      const uploadCamera = action.payload;
      const uploadCameras = state.cameras.map((camera) => {
        if (camera.id === uploadCamera.id) {
          return uploadCamera;
        }
        return camera;
      });
      return {
        ...state,
        cameras: uploadCameras,
      };
    }
    case UPDATE_CAMERA_RESTRICTION_CHOOSED: {
      return {
        ...state,
        areaRestrictionChoosed: action.payload,
      };
    }
    case UPDATE_CAMERA_LOCATION_CHOOSED: {
      return {
        ...state,
        locationChoosed: action.payload,
      };
    }
    case UPDATE_FILTER_CAMERA: {
      return {
        ...state,
        filter: action.payload,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

function CameraProvider({ children }: { children: React.ReactElement }) {
  const [controller, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(() => [controller, dispatch], [controller, dispatch]);
  return <CameraContext.Provider value={value}>{children}</CameraContext.Provider>;
}

const useCameraController = () => {
  const context = useContext(CameraContext);

  if (!context) {
    throw new Error("useCameraController should be used inside the CameraContextProvider.");
  }

  return context;
};

const getAllCameraSuccess = (dispatch: any, cameras: Array<Camera>) =>
  dispatch({ type: GET_ALL_CAMERA_SUCCESS, payload: cameras });

const addCamera = (dispatch: any, camera: Camera) =>
  dispatch({ type: ADD_CAMERA_SUCCESS, payload: camera });

const deleteCameraSuccess = (dispatch: any, id: number) =>
  dispatch({ type: DELETE_CAMERA_SUCCESS, payload: id });

const updateCameraSuccess = (dispatch: any, camera: Camera) =>
  dispatch({ type: UPDATE_CAMERA_SUCCESS, payload: camera });

const updateAreaRestrictionChoosed = (dispatch: any, areaRestrictionChoosed: any) =>
  dispatch({ type: UPDATE_CAMERA_RESTRICTION_CHOOSED, payload: areaRestrictionChoosed });

const updateLocationChoosed = (dispatch: any, locationChoosed: any) =>
  dispatch({ type: UPDATE_CAMERA_LOCATION_CHOOSED, payload: locationChoosed });

const updateFilterCamera = (dispatch: any, filter: any) =>
  dispatch({ type: UPDATE_FILTER_CAMERA, payload: filter });

export {
  CameraProvider,
  useCameraController,
  getAllCameraSuccess,
  addCamera,
  updateCameraSuccess,
  deleteCameraSuccess,
  updateAreaRestrictionChoosed,
  updateLocationChoosed,
  updateFilterCamera,
};
