import axios from "axios";
import { axiosConfig } from "configs/api";
import { getAllUserLogUrl } from "constants/api";
import { ApiResponse } from "types/apiResponse";
import { SERVER_ERROR } from "constants/app";

const getAllLogApi = async ({
  token,
  page,
  size,
  search,
  userId,
}: {
  token: any;
  page: number;
  size: number;
  search?: string;
  userId?: number;
}): Promise<ApiResponse> => {
  let url = getAllUserLogUrl(page, size, search || "");
  if (userId) {
    url += `&user_id=${userId}`;
  }
  return axios
    .get(url, axiosConfig(token))
    .then((response) => {
      if (response.status === 200) {
        if (response.data.code === 1) {
          return {
            messageError: response.data.message,
            data: {
              data: response.data.user_logs,
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
export { getAllLogApi };
