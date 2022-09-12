import axios from "axios";
import { axiosConfig } from "configs/api";
import { getAllNotificationHistoryUrl, uploadNotificationUrl } from "constants/api";
import { SERVER_ERROR } from "constants/app";
import { convertResponseToNotificationHistory } from "../../../../models/base/notificationHistory";

const getAllNotificationHistoryApi = async ({
  token,
  page,
  size,
  timeStart,
  timeEnd,
  hasEmployee,
  areaRestrictionId,
  employeeId,
  status,
}: {
  token: any;
  page: number;
  size: number;
  timeStart?: string;
  timeEnd?: string;
  hasEmployee?: boolean | null;
  areaRestrictionId?: number;
  employeeId?: number;
  status?: string;
}) => {
  let url = getAllNotificationHistoryUrl(page, size);
  if (timeStart && timeEnd) {
    url += `&time_start=${timeStart}&time_end=${timeEnd}`;
  }
  if (hasEmployee !== null && hasEmployee !== undefined) {
    url += `&has_employee=${hasEmployee}`;
  }
  if (areaRestrictionId) {
    url += `&area_restriction_ids=${areaRestrictionId}`;
  }
  if (employeeId) {
    url += `&employee_ids=${employeeId}`;
  }
  if (status) {
    url += `&status=${status}`;
  }
  return axios
    .get(url, axiosConfig(token))
    .then((response) => {
      if (response.status === 200) {
        if (response.data.code === 1) {
          return {
            messageError: response.data.message,
            data: {
              data: response.data.histories.map((item: any) =>
                convertResponseToNotificationHistory(item)
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
};

const updateStatusOfNotification = async ({ token, id }: { token: string; id: number }) =>
  axios
    .put(uploadNotificationUrl(id), {}, axiosConfig(token))
    .then((response) => {
      if (response.status === 200) {
        if (response.data.code === 1) {
          return {
            messageError: response.data.message,
            data: true,
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

export { getAllNotificationHistoryApi, updateStatusOfNotification };
