import { ApiResponse } from "../../../../types/apiResponse";
import { axiosConfig } from "../../../../configs/api";
import axios from "axios";
import { SERVER_ERROR } from "../../../../constants/app";
import {
  GET_ADD_GUEST_API,
  GET_NUMBER_AREA_RESTRICTION_NOTIFICATION_API,
  GET_NUMBER_TIME_KEEPING_NOTIFICATION_API,
} from "../../../../constants/api";

const getTimeKeepingNotificationCountApi = async ({
  token,
}: {
  token: string;
}): Promise<ApiResponse> =>
  axios
    .get(GET_NUMBER_TIME_KEEPING_NOTIFICATION_API, axiosConfig(token))
    .then((response) => {
      if (response.status === 200) {
        if (response.data.code === 1) {
          return {
            messageError: response.data.message,
            data: {
              numberCheckIn: response.data.number_check_in,
              numberLateTime: response.data.number_late_time,
              numberLateIn: response.data.number_late_in,
            },
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

const getAreaRestrictionNotificationCountApi = async ({
  token,
}: {
  token: string;
}): Promise<ApiResponse> =>
  axios
    .get(GET_NUMBER_AREA_RESTRICTION_NOTIFICATION_API, axiosConfig(token))
    .then((response) => {
      if (response.status === 200) {
        if (response.data.code === 1) {
          return {
            messageError: response.data.message,
            data: {
              numberAreaRestrictionWarning: response.data.number_area_restriction_warning,
              numberNotificationInDay: response.data.number_notification_in_day,
              numberNotificationNotResolve: response.data.number_notification_not_resolve,
              numberNotificationNotResolveUsingRing:
                response.data.number_notification_not_resolve_using_ring,
            },
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
const getAddGuestApi = async ({
  token,
  avatar,
  name,
  phone,
  email,
}: {
  token: string;
  avatar: string;
  name: string;
  phone: string;
  email: string;
}): Promise<ApiResponse> =>
  axios
    .post(GET_ADD_GUEST_API, { avatar, name, phone, email }, axiosConfig(token))
    .then((response) => {
      if (response.status === 200) {
        if (response.data.code === 1) {
          return {
            messageError: response.data.message,
            data: response.data.guest,
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
  getTimeKeepingNotificationCountApi,
  getAreaRestrictionNotificationCountApi,
  getAddGuestApi,
};
