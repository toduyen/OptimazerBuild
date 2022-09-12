import axios from "axios";
import { axiosConfig, axiosConfigMultipart } from "configs/api";
import {
  ADD_EMPLOYEE_API,
  getAllEmployeeUrl,
  getChangeManagerUrl,
  getDeleteEmployeeUrl,
  getUpdateEmployeeUrl,
  UPLOAD_EMPLOYEE_API,
} from "constants/api";
import { ApiResponse } from "types/apiResponse";
import { SERVER_ERROR } from "constants/app";
import { convertResponseToEmployee } from "../../../../models/base/employee";
import { EMPLOYEE_EXISTED_CODE } from "../../../../constants/responseCode";

const getAllEmployeesApi = async ({
  token,
  page,
  size,
  search,
  status,
}: {
  token: any;
  page: number;
  size: number;
  search?: string;
  status?: string;
}): Promise<ApiResponse> =>
  axios
    .get(getAllEmployeeUrl(page, size, search || "", status), axiosConfig(token))
    .then((response) => {
      if (response.status === 200) {
        if (response.data.code === 1) {
          return {
            messageError: response.data.message,
            data: {
              data: response.data.employees.map((employee: any) =>
                convertResponseToEmployee(employee)
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

const addEmployeeApi = async ({
  token,
  avatar,
  name,
  code,
  phone,
  email,
  managerId,
  areaEmployee,
  shifts,
  confirmUpdate,
}: {
  token: any;
  avatar: any;
  name: string;
  code: string;
  phone: string;
  email: string;
  managerId: number | null;
  areaEmployee: string;
  shifts: string;
  confirmUpdate?: boolean;
}): Promise<ApiResponse> => {
  const formData = new FormData();
  formData.append("image", avatar);
  formData.append("name", name);
  formData.append("code", code);
  formData.append("phone", phone);
  formData.append("email", email);
  formData.append("manager_id", managerId ? managerId.toString() : "");
  formData.append("area_employees", areaEmployee);
  formData.append("shift_ids", shifts);
  if (confirmUpdate !== undefined) {
    formData.append("force_update", confirmUpdate.toString());
  }

  return axios
    .post(ADD_EMPLOYEE_API, formData, axiosConfigMultipart(token))
    .then((response) => {
      if (response.status === 200) {
        if (response.data.code === 1) {
          return {
            messageError: response.data.message,
            data: convertResponseToEmployee(response.data.employee),
          };
        }
        if (response.data.code === EMPLOYEE_EXISTED_CODE) {
          return {
            messageError: response.data.message,
            data: EMPLOYEE_EXISTED_CODE,
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

const updateEmployeeApi = async ({
  token,
  employeeId,
  avatar,
  name,
  code,
  phone,
  email,
  managerId,
  shifts,
  areaEmployee,
}: {
  token: any;
  employeeId: number;
  avatar: any;
  name: string;
  code: string;
  phone: string;
  email: string;
  managerId: number | null;
  shifts: string;
  areaEmployee: string;
}): Promise<ApiResponse> => {
  const formData = new FormData();
  formData.append("image", avatar);
  formData.append("name", name);
  formData.append("code", code);
  formData.append("phone", phone);
  formData.append("email", email);
  formData.append("manager_id", managerId !== null ? managerId.toString() : "");
  formData.append("shift_ids", shifts);
  formData.append("area_employees", areaEmployee);

  return axios
    .put(getUpdateEmployeeUrl(employeeId), formData, axiosConfigMultipart(token))
    .then((response) => {
      if (response.status === 200) {
        if (response.data.code === 1) {
          return {
            messageError: response.data.message,
            data: convertResponseToEmployee(response.data.employee),
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

const changeManagerApi = async ({
  token,
  oldManagerId,
  newManagerId,
}: {
  token: string;
  oldManagerId: number;
  newManagerId: number;
}): Promise<ApiResponse> =>
  axios
    .put(getChangeManagerUrl(oldManagerId, newManagerId), {}, axiosConfig(token))
    .then((response: any) => {
      if (response.status === 200) {
        if (response.data.code === 1) {
          return {
            messageError: response.data.message,
            data: convertResponseToEmployee(response.data.employee),
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

const deleteEmployeeApi = ({ token, id }: { token: string; id: number }): Promise<ApiResponse> =>
  axios
    .delete(getDeleteEmployeeUrl(id), axiosConfig(token))
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

const uploadEmployeeApi = async ({
  token,
  files,
  excelFile,
}: {
  token: string;
  files: Array<any>;
  excelFile: any;
}): Promise<ApiResponse> => {
  const formData = new FormData();
  files.forEach((item: any) => formData.append("file", item));
  formData.append("excelFile", excelFile);

  return axios
    .post(UPLOAD_EMPLOYEE_API, formData, axiosConfig(token))
    .then((response: any) => {
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
      return { messageError: SERVER_ERROR, data: null };
    });
};

export {
  getAllEmployeesApi,
  addEmployeeApi,
  updateEmployeeApi,
  changeManagerApi,
  deleteEmployeeApi,
  uploadEmployeeApi,
};
