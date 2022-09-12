import axios from "axios";
import { axiosConfig } from "configs/api";
import { GET_ALL_FEATURES_API } from "constants/api";
import { ApiResponse } from "types/apiResponse";
import { SERVER_ERROR } from "constants/app";
import { convertResponseToFeature } from "../../../../models/base/feature";

const getAllFeaturesApi = async (token: any): Promise<ApiResponse> =>
  axios
    .get(GET_ALL_FEATURES_API, axiosConfig(token))
    .then((response) => {
      if (response.status === 200) {
        if (response.data.code === 1) {
          return {
            messageError: response.data.message,
            data: response.data.features.map((feature: any) => convertResponseToFeature(feature)),
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

export { getAllFeaturesApi };
