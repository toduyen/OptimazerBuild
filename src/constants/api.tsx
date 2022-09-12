const BASE_URL = process.env.REACT_APP_SERVER_URL;
const WEB_SOCKET_STREAM_URL = process.env.REACT_APP_WEB_SOCKET_STREAM_URL;
const WEB_SOCKET_IN_OUT_URL = process.env.REACT_APP_WEB_SOCKET_IN_OUT_URL;
const GET_ALL_USER_API = `${BASE_URL}/accounts/users`;
const GET_ALL_ROLE_API = `${BASE_URL}/accounts/roles`;
const SIGN_IN_API = `${BASE_URL}/accounts/auth/login`;
const ADD_USER_API = `${BASE_URL}/accounts/users`;
const GET_ALL_SHIFT_API = `${BASE_URL}/time-keepings/shifts`;
const GET_TIME_KEEPING_NOTIFICATION_API = `${BASE_URL}/time-keepings/time-keeping-notifications`;
const getUpdateShiftUrl = (id: number) => `${BASE_URL}/time-keepings/shifts/${id}`;
const getUpdateTimeKeepingNotificationUrl = (id: number) =>
  `${BASE_URL}/time-keepings/time-keeping-notifications/${id}`;
const getDeleteUserUrl = (id: number) => `${BASE_URL}/accounts/users/${id}`;
const getAllUserUrl = (status?: string) => {
  let url = `${BASE_URL}/users`;
  if (status) {
    url += `?status=${status}`;
  }
  return url;
};

const GET_ALL_ORGANIZATION_API = `${BASE_URL}/organizations/organizations`;
const ADD_ORGANIZATION_API = `${BASE_URL}/organizations/organizations`;
const getDeleteOrganizationUrl = (id: number) =>
  `${BASE_URL}/organizations/organizations/${id.toString()}`;
const getUpdateOrganizationUrl = (id: number) => `${BASE_URL}/organizations/organizations/${id}`;

const GET_ALL_FEATURES_API = `${BASE_URL}/features/features`;
const getAllUserLogUrl = (page: number, size: number, search: string) =>
  `${BASE_URL}/user-logs/user-logs?page=${page}&size=${size}&search=${search}`;
const getUpdateUserUrl = (id: number) => `${BASE_URL}/accounts/users/${id.toString()}`;

const RESET_PASSWORD_API = `${BASE_URL}/accounts/auth/forget-password`;
const CHANGE_PASSWORD_API = `${BASE_URL}/accounts/auth/change-password`;

const GET_ADD_GUEST_API = `${BASE_URL}/users/guest`;

const getAllCameraUrl = (
  page: number,
  size: number,
  search: string,
  cameraIds?: string,
  areaRestrictionId?: number,
  locationId?: number,
  status?: string
) => {
  let url = `${BASE_URL}/cameras/cameras?page=${page}&size=${size}&search=${search}`;
  if (cameraIds) {
    url += `&camera_ids=${cameraIds}`;
  }
  if (areaRestrictionId) {
    url += `&area_restriction_id=${areaRestrictionId}`;
  }
  if (locationId) {
    url += `&location_id=${locationId}`;
  }
  if (status && status.trim() !== "") {
    url += `&status=${status}`;
  }
  return url;
};

const ADD_CAMERA_API = `${BASE_URL}/cameras/cameras`;
const getAllLocationUrl = (page: number, size: number, search: string) =>
  `${BASE_URL}/locations/locations?page=${page}&size=${size}&search=${search}`;
const ADD_LOCATION_API = `${BASE_URL}/locations/locations`;
const getUpdateLocationUrl = (id: number) => `${BASE_URL}/locations/locations/${id.toString()}`;
const getDeleteLocationUrl = (id: number) => `${BASE_URL}/locations/locations/${id.toString()}`;
const getDeleteCameraUrl = (id: number) => `${BASE_URL}/cameras/cameras/${id.toString()}`;
const getUpdateCameraUrl = (id: number) => `${BASE_URL}/cameras/cameras/${id.toString()}`;
const getUpdatePolygonsCameraUrl = (id: number) =>
  `${BASE_URL}/cameras/cameras/${id.toString()}/polygons`;
const getAllInOutHistoryUrl = (page: number, size: number) =>
  `${BASE_URL}/histories/in-out-histories?page=${page}&size=${size}`;

const getAllEmployeeUrl = (page: number, size: number, search: string, status?: string) => {
  let url = `${BASE_URL}/employees/employees?page=${page}&size=${size}&search=${search}`;
  if (status) {
    url += `&status=${status}`;
  }
  return url;
};
const ADD_EMPLOYEE_API = `${BASE_URL}/employees/employees`;

const getUpdateEmployeeUrl = (id: number) => `${BASE_URL}/employees/employees/${id.toString()}`;

const getChangeManagerUrl = (oldManagerId: number, newManagerId: number) =>
  `${BASE_URL}/employees/employees/${oldManagerId}/change/${newManagerId}`;

const getDeleteEmployeeUrl = (id: number) => `${BASE_URL}/employees/employees/${id.toString()}`;

const getAllNotificationHistoryUrl = (page: number, size: number) =>
  `${BASE_URL}/histories/notification-histories?page=${page}&size=${size}`;

const GET_ALL_IN_OUT_HISTORY_REPORT_API = `${BASE_URL}/histories/in-out-histories/report`;
const GET_ALL_NOTIFICATION_HISTORY_REPORT_API = `${BASE_URL}/histories/notification-histories/report`;

const GET_NUMBER_ACCOUNT_API = `${BASE_URL}/accounts/users/account-number`;

const getAllAreaRestrictionUrl = (page: number, size: number, search: string) =>
  `${BASE_URL}/area-restrictions/area-restrictions?page=${page}&size=${size}&search=${search}`;

const getAreaRestrictionNotificationUrl = (id: number) =>
  `${BASE_URL}/area-restrictions/area-restrictions/${id.toString()}/notification`;

const ADD_AREA_RESTRICTION_API = `${BASE_URL}/area-restrictions/area-restrictions`;

const getUpdateAreaRestrictionUrl = (id: number) =>
  `${BASE_URL}/area-restrictions/area-restrictions/${id.toString()}`;

const GET_NUMBER_TIME_KEEPING_NOTIFICATION_API = `${BASE_URL}/histories/histories/time-keepings/count`;
const GET_NUMBER_AREA_RESTRICTION_NOTIFICATION_API = `${BASE_URL}/histories/histories/area-restrictions/count`;

const getDeleteAreaRestrictionUrl = (id: number) =>
  `${BASE_URL}/area-restrictions/area-restrictions/${id.toString()}`;

const GET_ALL_IN_OUT_HISTORY_AREA_RESTRICTION_API = `${BASE_URL}/histories/in-out-histories/report-area-restriction`;
const GET_ALL_NOTIFICATION_AREA_RESTRICTION_API = `${BASE_URL}/histories/notification-histories/report-area-restriction`;

const UPLOAD_EMPLOYEE_API = `${BASE_URL}/employees/employees/import`;
const SHARE_QR_CODE_API = `${BASE_URL}/employees/employees/send-qrcode`;
const uploadNotificationUrl = (id: number) =>
  `${BASE_URL}/histories/notification-histories/${id}/update-status`;

const reSendCodeUrl = (id: number) => `${BASE_URL}/users/${id}/resend-code`;

export {
  GET_ALL_USER_API,
  GET_ALL_ROLE_API,
  SIGN_IN_API,
  ADD_USER_API,
  GET_ALL_SHIFT_API,
  GET_TIME_KEEPING_NOTIFICATION_API,
  getUpdateShiftUrl,
  getUpdateTimeKeepingNotificationUrl,
  getDeleteUserUrl,
  GET_ALL_ORGANIZATION_API,
  ADD_ORGANIZATION_API,
  getDeleteOrganizationUrl,
  getUpdateOrganizationUrl,
  GET_ALL_FEATURES_API,
  getAllUserLogUrl,
  getUpdateUserUrl,
  RESET_PASSWORD_API,
  CHANGE_PASSWORD_API,
  getAllCameraUrl,
  getAllEmployeeUrl,
  ADD_EMPLOYEE_API,
  getUpdateEmployeeUrl,
  ADD_CAMERA_API,
  getAllLocationUrl,
  ADD_LOCATION_API,
  getUpdateLocationUrl,
  getDeleteLocationUrl,
  getChangeManagerUrl,
  getDeleteCameraUrl,
  getDeleteEmployeeUrl,
  getUpdateCameraUrl,
  getAllInOutHistoryUrl,
  getAllNotificationHistoryUrl,
  GET_ALL_IN_OUT_HISTORY_REPORT_API,
  GET_ALL_NOTIFICATION_HISTORY_REPORT_API,
  GET_NUMBER_ACCOUNT_API,
  getAreaRestrictionNotificationUrl,
  getAllAreaRestrictionUrl,
  ADD_AREA_RESTRICTION_API,
  getUpdateAreaRestrictionUrl,
  GET_NUMBER_TIME_KEEPING_NOTIFICATION_API,
  getDeleteAreaRestrictionUrl,
  WEB_SOCKET_STREAM_URL,
  GET_NUMBER_AREA_RESTRICTION_NOTIFICATION_API,
  WEB_SOCKET_IN_OUT_URL,
  getUpdatePolygonsCameraUrl,
  GET_ALL_IN_OUT_HISTORY_AREA_RESTRICTION_API,
  GET_ALL_NOTIFICATION_AREA_RESTRICTION_API,
  UPLOAD_EMPLOYEE_API,
  SHARE_QR_CODE_API,
  uploadNotificationUrl,
  reSendCodeUrl,
  getAllUserUrl,
  GET_ADD_GUEST_API,
};
