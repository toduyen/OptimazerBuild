import axios from "axios";
import { axiosConfig } from "configs/api";
import {
  ADD_AREA_RESTRICTION_API,
  getAreaRestrictionNotificationUrl,
  getDeleteAreaRestrictionUrl,
  getUpdateAreaRestrictionUrl,
  getAllAreaRestrictionUrl,
} from "constants/api";
import { SERVER_ERROR } from "constants/app";
import {
  AreaRestriction,
  convertAreaRestrictionToRequest,
  convertResponseToAreaRestriction,
} from "models/area-restriction/areaRestriction";
import {
  AreaRestrictionNotification,
  convertAreaRestrictionNotificationToRequest,
  convertResponseToAreaRestrictionNotification,
} from "models/area-restriction/areaRestrictionNotification";
import { ApiResponse } from "types/apiResponse";

const getAllAreaRestrictionApi = async ({
  token,
  page,
  size,
  search,
}: {
  token: any;
  page: number;
  size: number;
  search?: string;
}): Promise<ApiResponse> =>
  axios
    .get(getAllAreaRestrictionUrl(page, size, search || ""), axiosConfig(token))
    .then((response) => {
      if (response.status === 200) {
        if (response.data.code === 1) {
          const areaRestrictions: Array<AreaRestriction> = [];
          response.data.area_restrictions.forEach((element: any) => {
            const areaRestriction = convertResponseToAreaRestriction(element);
            areaRestrictions.push(areaRestriction);
          });
          return {
            messageError: response.data.message,
            data: {
              data: areaRestrictions,
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

const addAreaRestrictionApi = async ({
  token,
  areaName,
  areaCode,
  personnelInCharge,
  timeStart,
  timeEnd,
}: {
  token: any;
  areaName: string;
  areaCode: string;
  personnelInCharge: Array<number>;
  timeStart: string | null;
  timeEnd: string | null;
}): Promise<ApiResponse> =>
  axios
    .post(
      ADD_AREA_RESTRICTION_API,
      {
        name: areaName,
        code: areaCode,
        manager_ids: personnelInCharge,
        time_start: timeStart,
        time_end: timeEnd,
      },
      axiosConfig(token)
    )
    .then((response) => {
      if (response.status === 200) {
        if (response.data.code === 1) {
          return {
            messageError: response.data.message,
            data: convertResponseToAreaRestriction(response.data.area_restriction),
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

const updateAreaRestrictionApi = async ({
  token,
  areaRestriction,
}: {
  token: any;
  areaRestriction: AreaRestriction;
}): Promise<ApiResponse> =>
  axios
    .put(
      getUpdateAreaRestrictionUrl(areaRestriction.id),
      convertAreaRestrictionToRequest(areaRestriction),
      axiosConfig(token)
    )
    .then((response) => {
      if (response.status === 200) {
        if (response.data.code === 1) {
          return {
            messageError: response.data.message,
            data: convertResponseToAreaRestriction(response.data.area_restriction),
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

const updateAreaRestrictionMethodApi = async ({
  token,
  areaRestrictionNotification,
}: {
  token: string;
  areaRestrictionNotification: AreaRestrictionNotification;
}): Promise<ApiResponse> =>
  axios
    .put(
      getAreaRestrictionNotificationUrl(areaRestrictionNotification.areaRestriction.id),
      convertAreaRestrictionNotificationToRequest(areaRestrictionNotification),
      axiosConfig(token)
    )
    .then((response) => {
      if (response.status === 200) {
        if (response.data.code === 1) {
          return {
            messageError: response.data.mesasge,
            data: convertResponseToAreaRestrictionNotification(
              response.data.area_restriction_notification
            ),
          };
        }
        return {
          messageError: response.data.message,
          data: null,
        };
      }
      return {
        messageError: SERVER_ERROR,
        data: null,
      };
    })
    .catch((e) => {
      console.log(e);
      return { messageError: SERVER_ERROR, data: null };
    });

const handleDeleteApi = async ({ token, id }: { token: any; id: number }): Promise<ApiResponse> =>
  axios
    .delete(getDeleteAreaRestrictionUrl(id), axiosConfig(token))
    .then((response) => {
      if (response.status === 200) {
        if (response.data.code === 1) {
          return {
            messageError: response.data.message,
            data: true,
          };
        }
        return {
          messageError: response.data.message,
          data: null,
        };
      }
      return {
        messageError: SERVER_ERROR,
        data: null,
      };
    })
    .catch((e) => {
      console.log(e);
      return {
        messageError: SERVER_ERROR,
        data: null,
      };
    });

const getAllAreaRestrictionNotificationApi = async ({ token, id }: { token: any; id: number }) =>
  axios
    .get(getAreaRestrictionNotificationUrl(id), axiosConfig(token))
    .then((response) => {
      if (response.status === 200) {
        if (response.data.code === 1) {
          return {
            messageError: response.data.message,
            data: convertResponseToAreaRestrictionNotification(
              response.data.area_restriction_notification
            ),
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

export {
  getAllAreaRestrictionApi,
  addAreaRestrictionApi,
  updateAreaRestrictionApi,
  updateAreaRestrictionMethodApi,
  handleDeleteApi,
  getAllAreaRestrictionNotificationApi,
};
