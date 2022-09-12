import axios from "axios";
import { axiosConfig } from "configs/api";
import {
  ADD_CAMERA_API,
  getAllCameraUrl,
  getDeleteCameraUrl,
  getUpdateCameraUrl,
  getUpdatePolygonsCameraUrl,
} from "constants/api";
import { SERVER_ERROR } from "constants/app";
import { convertResponseToCamera } from "models/base/camera";
import { ApiResponse } from "types/apiResponse";

const getAllCameraApi = async ({
  token,
  page,
  size,
  search,
  cameraIds,
  areaRestrictionId,
  locationId,
  status,
}: {
  token: any;
  page: number;
  size: number;
  search?: string;
  cameraIds?: string;
  areaRestrictionId?: number;
  locationId?: number;
  status?: string;
}): Promise<ApiResponse> =>
  axios
    .get(
      getAllCameraUrl(page, size, search || "", cameraIds, areaRestrictionId, locationId, status),
      axiosConfig(token)
    )
    .then((response) => {
      if (response.status === 200) {
        if (response.data.code === 1) {
          return {
            messageError: response.data.message,
            data: {
              data: response.data.cameras.map((camera: any) => convertResponseToCamera(camera)),
              pageCount: response.data.total_pages,
              itemCount: response.data.total_items,
            },
          };
        }
        return { messageError: response.data.message, data: null };
      }
      return { messageError: SERVER_ERROR, data: null };
    })
    .catch((e) => {
      console.log(e);
      return { messageError: SERVER_ERROR, data: null };
    });

const addCameraApi = async ({
  token,
  name,
  ipAddress,
  locationId,
  type,
  areaRestrictionId,
}: {
  token: any;
  name: string;
  ipAddress: string | null;
  locationId: number | null;
  type: string;
  areaRestrictionId: number | null;
}): Promise<ApiResponse> =>
  axios
    .post(
      ADD_CAMERA_API,
      {
        name,
        ip_address: ipAddress,
        location_id: locationId,
        type,
        area_restriction_id: areaRestrictionId,
      },
      axiosConfig(token)
    )
    .then((response) => {
      if (response.status === 200) {
        if (response.data.code === 1) {
          return {
            messageError: response.data.message,
            data: convertResponseToCamera(response.data.camera),
          };
        }
        return { messageError: response.data.message, data: null };
      }
      return { messageError: SERVER_ERROR, data: null };
    })
    .catch((e) => {
      console.log(e);
      return { messageError: SERVER_ERROR, data: null };
    });

const updateCameraApi = async ({
  token,
  id,
  name,
  ipAddress,
  locationId,
  type,
  areaRestrictionId,
}: {
  token: any;
  id: number;
  name: string;
  ipAddress: string;
  // brandId: number,
  locationId: number | null;
  type: string;
  areaRestrictionId: number | null;
}): Promise<ApiResponse> =>
  axios
    .put(
      getUpdateCameraUrl(id),
      {
        name,
        ip_address: ipAddress,
        // brand_id: brandId,
        location_id: locationId,
        type,
        area_restriction_id: areaRestrictionId,
      },
      axiosConfig(token)
    )
    .then((response) => {
      if (response.status === 200) {
        if (response.data.code === 1) {
          return {
            messageError: response.data.message,
            data: convertResponseToCamera(response.data.camera),
          };
        }
        return { messageError: response.data.message, data: null };
      }

      return { messageError: SERVER_ERROR, data: null };
    })
    .catch((e) => {
      console.log(e);
      return { messageError: SERVER_ERROR, data: null };
    });

const deleteCameraApi = async ({ token, id }: { token: any; id: number }): Promise<ApiResponse> =>
  axios
    .delete(getDeleteCameraUrl(id), axiosConfig(token))
    .then((response) => {
      if (response.status === 200) {
        if (response.data.code === 1) {
          return { messageError: response.data.message, data: true };
        }
        return { messageError: response.data.message, data: null };
      }
      return { messageError: SERVER_ERROR, data: null };
    })
    .catch((e) => {
      console.log(e);
      return { messageError: SERVER_ERROR, data: null };
    });

const updatePolygonsCameraApi = async ({
  token,
  id,
  polygons,
}: {
  token: any;
  id: number;
  polygons: string;
}): Promise<ApiResponse> =>
  axios
    .put(
      getUpdatePolygonsCameraUrl(id),
      {
        polygons,
      },
      axiosConfig(token)
    )
    .then((response) => {
      if (response.status === 200) {
        if (response.data.code === 1) {
          return { messageError: response.data.message, data: true };
        }
        return { messageError: response.data.message, data: null };
      }
      return { messageError: SERVER_ERROR, data: null };
    })
    .catch((e) => {
      console.log(e);
      return { messageError: SERVER_ERROR, data: null };
    });

export { getAllCameraApi, addCameraApi, deleteCameraApi, updateCameraApi, updatePolygonsCameraApi };
