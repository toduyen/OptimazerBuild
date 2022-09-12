import axios from "axios";
import { axiosConfig } from "configs/api";
import {
  ADD_LOCATION_API,
  getAllLocationUrl,
  getDeleteLocationUrl,
  getUpdateLocationUrl,
} from "constants/api";
import { SERVER_ERROR } from "constants/app";
import { ApiResponse } from "types/apiResponse";
import { convertResponseToLocation } from "../../../../models/base/location";

const getAllLocationApi = async ({
  token,
  page,
  size,
  search,
}: {
  token: string;
  page: number;
  size: number;
  search?: string;
}): Promise<ApiResponse> =>
  axios
    .get(getAllLocationUrl(page, size, search || ""), axiosConfig(token))
    .then((response) => {
      if (response.status === 200) {
        if (response.data.code === 1) {
          return {
            messageError: response.data.message,
            data: {
              data: response.data.locations.map((location: any) =>
                convertResponseToLocation(location)
              ),
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

const addLocationApi = async ({
  token,
  name,
  code,
  type,
}: {
  token: string;
  name: string;
  code: string | null;
  type: string;
}): Promise<ApiResponse> =>
  axios
    .post(ADD_LOCATION_API, { name, code, type }, axiosConfig(token))
    .then((response) => {
      if (response.status === 200) {
        if (response.data.code === 1) {
          return {
            messageError: response.data.message,
            data: convertResponseToLocation(response.data.location),
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

const updateLocationApi = async ({
  token,
  id,
  name,
  code,
  type,
}: {
  token: string;
  id: number;
  name: string;
  code: string;
  type: string;
}): Promise<ApiResponse> =>
  axios
    .put(getUpdateLocationUrl(id), { name, code, type }, axiosConfig(token))
    .then((response) => {
      if (response.status === 200) {
        if (response.data.code === 1) {
          return {
            messageError: response.data.message,
            data: convertResponseToLocation(response.data.location),
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

const deleteLocationApi = async ({
  token,
  id,
}: {
  token: string;
  id: number;
}): Promise<ApiResponse> =>
  axios
    .delete(getDeleteLocationUrl(id), axiosConfig(token))
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

export { getAllLocationApi, addLocationApi, updateLocationApi, deleteLocationApi };
