// @ts-ignore
import Audio from "assets/audios/canh_bao.mp3";

const SUCCESS_TYPE = "success";
const ERROR_TYPE = "error";
const INFO_TYPE = "info";
const CREATE_LABEL = "Thêm";
const UPDATE_LABEL = "Cập nhật";
const SIGN_IN_LABEL = "Đăng nhập";
const CHANGE_PASSWORD_LABEL = "Thay đổi mật khẩu";

const ROLE_SUPER_ADMIN = "Super Admin";
const ROLE_SUPER_ADMIN_ORGANIZATION = "Super Admin Organization";

const ROLE_TIME_KEEPING_ADMIN = "Admin Quản lý chấm công";
const ROLE_TIME_KEEPING_USER = "Cán bộ Quản lý chấm công";
const ROLE_AREA_RESTRICTION_ADMIN = "Admin Kiểm soát khu vực hạn chế";
const ROLE_AREA_RESTRICTION_USER = "Cán bộ Kiểm soát khu vực hạn chế";
const ROLE_BEHAVIOR_ADMIN = "Admin Kiểm soát hành vi";
const ROLE_BEHAVIOR_USER = "Cán bộ Kiểm soát hành vi";

const DELETE_CONFIRM_TITLE = "Xác nhận xóa";
const DELETE_CONFIRM_CONTENT = "Bạn có chắc chắn muốn xóa không?";
const DELETE_SUCCESS = "Xóa thành công";
const DELETE_ERROR = "Xóa thất bại";

const ADD_SUCCESS = "Thêm thành công";

const UPDATE_SUCCESS = "Cập nhật thành công";
const UPDATE_ERROR = "Cập nhật thất bại";

const EDIT_TYPE = "edit";
const DELETE_TYPE = "delete";
const VIEW_TYPE = "view";
const SETTING_TYPE = "setting";
const USER_ATTENDANCE_TYPE = "view user attendance";
const RE_SEND_CODE_TYPE = "resend code";

const SERVER_ERROR = "Có lỗi xảy ra, vui lòng thực hiện lại sau!";
const CHANGE_PASSWORD_SUCCESS = "Thay đổi mật khẩu thành công";
const LOGIN_SUCCESS = "Đăng nhập thành công";

const CAMERA_ORDER_CONFIG_LOCAL_STORAGE = "cameraOrderConfig";
const CAMERA_STARTED_LOCAL_STORAGE = "cameraStartedConfig";

const MAX_NUMBER_CAM_SHOW = process.env.REACT_APP_MAX_NUMBER_CAM_SHOW || "6";
const RING_URL = process.env.REACT_APP_RING_URL || Audio;

const MODULE_TIME_KEEPING_TYPE = "time_keeping";
const MODULE_AREA_RESTRICTION_TYPE = "area_restriction";
const MODULE_BEHAVIOR_TYPE = "behavior";

const QR_CODE_IMAGE_URL = process.env.REACT_APP_QR_CODE_IMAGE_URL || "";
const FORCE_UPDATE_EMPLOYEE_TITLE = "Xác nhận cập nhật";
const FORCE_UPDATE_EMPLOYEE_CONTENT = "Mã nhân viên đã tồn tại, bạn có muốn cập nhật thông tin?";

const DELETED_TYPE = "Đã xóa";
const ACTIVE_TYPE = "Đang hoạt động";
const PENDING_TYPE = "Đang chờ xác nhận";

const SET_EXPIRY_LOCAL_STORAGE = 1000*60*60*24*7;

export {
  SUCCESS_TYPE,
  ERROR_TYPE,
  INFO_TYPE,
  CREATE_LABEL,
  UPDATE_LABEL,
  SIGN_IN_LABEL,
  CHANGE_PASSWORD_LABEL,
  ROLE_SUPER_ADMIN,
  ROLE_TIME_KEEPING_ADMIN,
  ROLE_TIME_KEEPING_USER,
  ROLE_AREA_RESTRICTION_ADMIN,
  ROLE_AREA_RESTRICTION_USER,
  ROLE_BEHAVIOR_ADMIN,
  ROLE_BEHAVIOR_USER,
  DELETE_CONFIRM_TITLE,
  DELETE_CONFIRM_CONTENT,
  DELETE_SUCCESS,
  DELETE_ERROR,
  UPDATE_SUCCESS,
  UPDATE_ERROR,
  EDIT_TYPE,
  DELETE_TYPE,
  VIEW_TYPE,
  SERVER_ERROR,
  CHANGE_PASSWORD_SUCCESS,
  LOGIN_SUCCESS,
  ROLE_SUPER_ADMIN_ORGANIZATION,
  CAMERA_ORDER_CONFIG_LOCAL_STORAGE,
  SETTING_TYPE,
  CAMERA_STARTED_LOCAL_STORAGE,
  MAX_NUMBER_CAM_SHOW,
  ADD_SUCCESS,
  MODULE_AREA_RESTRICTION_TYPE,
  MODULE_TIME_KEEPING_TYPE,
  MODULE_BEHAVIOR_TYPE,
  USER_ATTENDANCE_TYPE,
  RING_URL,
  QR_CODE_IMAGE_URL,
  FORCE_UPDATE_EMPLOYEE_CONTENT,
  FORCE_UPDATE_EMPLOYEE_TITLE,
  ACTIVE_TYPE,
  PENDING_TYPE,
  DELETED_TYPE,
  RE_SEND_CODE_TYPE,
  SET_EXPIRY_LOCAL_STORAGE,
};
