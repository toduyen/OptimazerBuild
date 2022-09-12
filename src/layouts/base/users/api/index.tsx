import axios from "axios";
import {
  ADD_USER_API,
  GET_ALL_ROLE_API,
  GET_ALL_USER_API,
  GET_NUMBER_ACCOUNT_API,
  getDeleteUserUrl,
  getUpdateUserUrl,
  reSendCodeUrl,
  getAllUserUrl,
} from "constants/api";
import { axiosConfig, axiosConfigMultipart } from "configs/api";
import { convertResponseToUser, User } from "models/base/user";
import { ApiResponse } from "types/apiResponse";
import { SERVER_ERROR } from "constants/app";

const getAllUserApi = async ({
  token,
  status,
}: {
  token: string;
  status?: string;
}): Promise<ApiResponse> =>
  axios
    .get(getAllUserUrl(status), axiosConfig(token))
    .then((response) => {
      if (response.status === 200) {
        if (response.data.code === 1) {
          return {
            messageError: response.data.message,
            data: response.data.users.map((user: User) => convertResponseToUser(user)),
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

const getAllRoleApi = async (token: string): Promise<ApiResponse> =>
  axios
    .get(GET_ALL_ROLE_API, axiosConfig(token))
    .then((response) => {
      if (response.status === 200) {
        if (response.data.code === 1) {
          return { messageError: response.data.message, data: response.data.roles };
        }
        return { messageError: response.data.message, data: null };
      }
      return { messageError: SERVER_ERROR, data: null };
    })
    .catch((e) => {
      console.log(e);
      return { messageError: SERVER_ERROR, data: null };
    });

const updateUserApi = async ({
  token,
  userId,
  file,
  fullName,
  email,
  organizationId,
  locationId,
  roles,
}: {
  token: string;
  userId: number;
  file: any;
  fullName: string;
  email: string;
  organizationId: number;
  locationId: number | string;
  roles: string;
}): Promise<ApiResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fullname", fullName);
  formData.append("user_id", userId.toString());
  formData.append("email", email);
  formData.append("organization_id", organizationId.toString());
  formData.append("location_id", locationId.toString());
  formData.append("roles", roles);
  return axios
    .put(getUpdateUserUrl(userId), formData, axiosConfigMultipart(token))
    .then((response) => {
      if (response.status === 200) {
        if (response.data.code === 1) {
          return {
            messageError: response.data.message,
            data: convertResponseToUser(response.data.user),
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

const addUserApi = async ({
  token,
  fullName,
  email,
  roles,
  organizationId,
  locationId,
}: {
  token: string;
  fullName: string;
  email: string;
  roles: Array<string>;
  organizationId: number;
  locationId: number | string;
}): Promise<ApiResponse> =>
  axios
    .post(
      ADD_USER_API,
      {
        fullname: fullName,
        email,
        roles,
        organization_id: organizationId,
        location_id: locationId,
      },
      axiosConfig(token)
    )
    .then((response) => {
      if (response.status === 200) {
        if (response.data.code === 1) {
          return {
            messageError: response.data.message,
            data: convertResponseToUser(response.data.user),
          };
        }
        return {
          messageError: response.data.message,
          data: null,
        };
      }
      return { messageError: SERVER_ERROR, data: null };
    })
    .catch((e) => {
      console.log(e);
      return { messageError: SERVER_ERROR, data: null };
    });

const deleteUserApi = async ({ token, id }: { token: string; id: number }): Promise<ApiResponse> =>
  axios
    .delete(getDeleteUserUrl(id), axiosConfig(token))
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

const getAccountNumberApi = (token: string): Promise<ApiResponse> =>
  axios
    .get(GET_NUMBER_ACCOUNT_API, axiosConfig(token))
    .then((response) => {
      if (response.status === 200) {
        if (response.data.code === 1) {
          return {
            messageError: response.data.message,
            data: response.data.number_account,
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

const reSendCodeUserApi = ({ token, id }: { token: string; id: number }): Promise<ApiResponse> =>
  axios
    .post(reSendCodeUrl(id), axiosConfig(token))
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
  getAllUserApi,
  getAllRoleApi,
  updateUserApi,
  addUserApi,
  deleteUserApi,
  getAccountNumberApi,
  reSendCodeUserApi,
};
