import axios from "axios";
import { axiosConfig } from "configs/api";
import {
  GET_ALL_SHIFT_API,
  GET_TIME_KEEPING_NOTIFICATION_API,
  getUpdateShiftUrl,
  getUpdateTimeKeepingNotificationUrl,
  SHARE_QR_CODE_API,
} from "constants/api";
import {
  convertResponseToTimeKeepingNotification,
  convertTimeKeepingNotificationToRequest,
  TimeKeepingNotification,
} from "models/time-keeping/timeKeepingNotification";
import { convertResponseToShift, convertShiftToRequest, Shift } from "models/time-keeping/shift";
import { ApiResponse } from "../../../../types/apiResponse";
import { SERVER_ERROR } from "../../../../constants/app";

const getTimeKeepingShiftApi = async (token: string): Promise<ApiResponse> =>
  axios
    .get(GET_ALL_SHIFT_API, axiosConfig(token))
    .then((response) => {
      if (response.status === 200) {
        if (response.data.code === 1) {
          return {
            messageError: response.data.message,
            data: response.data.shifts.map((shift: any) => convertResponseToShift(shift)),
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

const getTimeKeepingNotificationApi = async (token: string): Promise<ApiResponse> =>
  axios
    .get(GET_TIME_KEEPING_NOTIFICATION_API, axiosConfig(token))
    .then((response) => {
      if (response.status === 200) {
        if (response.data.code === 1) {
          return {
            messageError: response.data.message,
            data: convertResponseToTimeKeepingNotification(response.data.time_keeping_notification),
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

const updateTimeKeepingShiftApi = async (token: string, shift: Shift): Promise<ApiResponse> =>
  axios
    .put(getUpdateShiftUrl(shift.id), convertShiftToRequest(shift), axiosConfig(token))
    .then((response) => {
      if (response.status === 200) {
        if (response.data.code === 1) {
          return {
            messageError: response.data.message,
            data: convertResponseToShift(response.data.shift),
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

const updateTimeKeepingNotificationApi = (
  token: string,
  timeKeepingNotification: TimeKeepingNotification
): Promise<ApiResponse> =>
  axios
    .put(
      getUpdateTimeKeepingNotificationUrl(timeKeepingNotification.id),
      convertTimeKeepingNotificationToRequest(timeKeepingNotification),
      axiosConfig(token)
    )
    .then((response) => {
      if (response.status === 200) {
        if (response.data.code === 1) {
          return {
            messageError: response.data.message,
            data: convertResponseToTimeKeepingNotification(response.data.time_keeping_notification),
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

const shareQrCodeApi = async (
  token: string,
  employeeIds: Array<number> | null,
  checkAll: boolean
) =>
  axios
    .post(SHARE_QR_CODE_API, { employee_ids: employeeIds, check_all: checkAll }, axiosConfig(token))
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
export {
  getTimeKeepingShiftApi,
  getTimeKeepingNotificationApi,
  updateTimeKeepingShiftApi,
  updateTimeKeepingNotificationApi,
  shareQrCodeApi,
};
