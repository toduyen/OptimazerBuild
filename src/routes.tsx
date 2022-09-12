import SignIn from "layouts/base/authentication/sign-in";
import React from "react";
// @mui icons
import Icon from "@mui/material/Icon";
import Organization from "layouts/base/organization";
import ResetPassword from "./layouts/base/authentication/reset-password";
import {
  AREA_RESTRICTION_ROUTE,
  CAMERA_LIST_ROUTE,
  CHANGE_PASSWORD_ROUTE,
  DASHBOARD_ROUTE,
  EMPLOYEE_LIST_ROUTE,
  FEATURE_LIST_ROUTE,
  HISTORY_LIST_ROUTE,
  IN_OUT_HISTORY_BOARD_ROUTE,
  LOCATION_LIST_ROUTE,
  LOG_LIST_ROUTE,
  MAIN_ROUTE,
  NOTIFICATION_HISTORY_ROUTE,
  ORGANIZATION_LIST_ROUTE,
  REPORT_ROUTE,
  RESET_PASSWORD_ROUTE,
  SIGN_IN_ROUTE,
  SYSTEM_SETTING_ROUTE,
  USER_LIST_ROUTE,
} from "./constants/route";
import { RouteType } from "./types/routeType";
import {
  ROLE_AREA_RESTRICTION_ADMIN,
  ROLE_AREA_RESTRICTION_USER,
  ROLE_BEHAVIOR_ADMIN,
  ROLE_BEHAVIOR_USER,
  ROLE_SUPER_ADMIN,
  ROLE_SUPER_ADMIN_ORGANIZATION,
  ROLE_TIME_KEEPING_ADMIN,
  ROLE_TIME_KEEPING_USER,
} from "./constants/app";
import Users from "./layouts/base/users";
import Setting from "./layouts/time-keeping/setting";
import Features from "layouts/base/features";
import LogList from "layouts/base/userLogs";
import ChangePassword from "./layouts/base/authentication/change-password";
import Camera from "layouts/base/camera";
import Employees from "./layouts/base/employees";
import Location from "layouts/base/location";
import InOutHistory from "layouts/base/inOutHistory";
import NotificationHistory from "layouts/base/notificationHistory";
import Report from "layouts/time-keeping/report";
import AreaRestriction from "layouts/area-restriction/areaRestriction";
import InOutHistoryBoard from "./layouts/base/inOutHistory/components/InOutHistoryBoard";
import Main from "./layouts/base/main";
import ReportAreaRestriction from "layouts/area-restriction/report";
import { isAreaRestrictionModule, isBehaviorModule } from "utils/checkRoles";
// lazy load component
const Dashboard = React.lazy(() => import('./layouts/base/dashboard'));

const routes: Array<RouteType> = [
  {
    type: "collapse",
    icon: <Icon fontSize="small">dashboard</Icon>,
    name: "Dashboard",
    key: "dashboard",
    route: DASHBOARD_ROUTE,
    component: <Dashboard />,
  },
  {
    type: "title",
    title: "Tính năng",
    name: "Tính năng",
    icon: "",
    route: "",
    key: "title",
  },
  {
    type: "collapse",
    name: "Danh sách tổ chức",
    key: "organization",
    icon: <Icon fontSize="small">group</Icon>,
    route: ORGANIZATION_LIST_ROUTE,
    component: <Organization />,
    roles: [ROLE_SUPER_ADMIN],
  },
  {
    type: "collapse",
    name: "Danh sách chi nhánh",
    key: "location",
    icon: <Icon fontSize="small">location_city</Icon>,
    route: LOCATION_LIST_ROUTE,
    component: <Location />,
    roles: [ROLE_TIME_KEEPING_ADMIN, ROLE_AREA_RESTRICTION_ADMIN, ROLE_BEHAVIOR_ADMIN],
  },
  {
    type: "collapse",
    name: "Danh sách người dùng",
    key: "people",
    icon: <Icon fontSize="small">person</Icon>,
    route: USER_LIST_ROUTE,
    component: <Users />,
    roles: [
      ROLE_SUPER_ADMIN,
      ROLE_SUPER_ADMIN_ORGANIZATION,
      ROLE_TIME_KEEPING_ADMIN,
      ROLE_AREA_RESTRICTION_ADMIN,
      ROLE_BEHAVIOR_ADMIN,
    ],
  },
  {
    type: "collapse",
    name: "Danh sách tính năng",
    key: "features",
    icon: <Icon fontSize="small">list</Icon>,
    route: FEATURE_LIST_ROUTE,
    component: <Features />,
    roles: [ROLE_SUPER_ADMIN, ROLE_SUPER_ADMIN_ORGANIZATION],
  },
  {
    type: "collapse",
    name: "Danh sách nhân sự",
    key: "employee",
    route: EMPLOYEE_LIST_ROUTE,
    component: <Employees />,
    icon: <Icon fontSize="small">person</Icon>,
    roles: [ROLE_TIME_KEEPING_USER, ROLE_AREA_RESTRICTION_USER, ROLE_BEHAVIOR_USER],
  },
  {
    type: "collapse",
    name: "Danh sách KVHC",
    key: "area-restriction",
    route: AREA_RESTRICTION_ROUTE,
    component: <AreaRestriction />,
    icon: <Icon fontSize="small">location_on</Icon>,
    roles: [ROLE_AREA_RESTRICTION_USER, ROLE_BEHAVIOR_USER],
  },
  {
    type: "collapse",
    name: "Danh sách Camera",
    key: "camera",
    icon: <Icon fontSize="small">camera</Icon>,
    route: CAMERA_LIST_ROUTE,
    component: <Camera />,
    roles: [ROLE_TIME_KEEPING_ADMIN, ROLE_AREA_RESTRICTION_USER, ROLE_BEHAVIOR_USER],
  },
  {
    type: "collapse",
    name: "Danh sách log",
    key: "log",
    icon: <Icon fontSize="small">apps</Icon>,
    route: LOG_LIST_ROUTE,
    component: <LogList />,
    roles: [
      ROLE_SUPER_ADMIN,
      ROLE_SUPER_ADMIN_ORGANIZATION,
      ROLE_TIME_KEEPING_ADMIN,
      ROLE_AREA_RESTRICTION_ADMIN,
      ROLE_BEHAVIOR_ADMIN,
    ],
  },
  {
    type: "collapse",
    name: "Lịch sử vào ra",
    key: "inOutHistory",
    icon: <Icon fontSize="small">work_history</Icon>,
    route: HISTORY_LIST_ROUTE,
    component: <InOutHistory />,
    roles: [ROLE_TIME_KEEPING_USER, ROLE_AREA_RESTRICTION_USER, ROLE_BEHAVIOR_USER],
  },
  {
    type: "collapse",
    name: "Lịch sử cảnh báo",
    key: "notificationHistory",
    icon: <Icon fontSize="small">report_problem</Icon>,
    route: NOTIFICATION_HISTORY_ROUTE,
    component: <NotificationHistory />,
    roles: [ROLE_TIME_KEEPING_USER, ROLE_AREA_RESTRICTION_USER, ROLE_BEHAVIOR_USER],
  },
  {
    type: "collapse",
    name: "Báo cáo",
    key: "report",
    route: REPORT_ROUTE,
    component:
      isAreaRestrictionModule() || isBehaviorModule() ? <ReportAreaRestriction /> : <Report />,
    icon: <Icon fontSize="small">report</Icon>,
    roles: [ROLE_TIME_KEEPING_USER, ROLE_AREA_RESTRICTION_USER, ROLE_BEHAVIOR_USER],
  },
  {
    type: "collapse",
    name: "Cài đặt hệ thống",
    key: "system-setting",
    route: SYSTEM_SETTING_ROUTE,
    component: <Setting />,
    icon: <Icon fontSize="small">settings</Icon>,
    roles: [ROLE_TIME_KEEPING_USER],
  },
  {
    name: "In Out History Board",
    key: "in-out-history-board",
    route: IN_OUT_HISTORY_BOARD_ROUTE,
    component: <InOutHistoryBoard />,
    icon: <Icon fontSize="small">settings</Icon>,
    roles: [ROLE_TIME_KEEPING_USER],
  },
  {
    name: "Main",
    key: "main",
    route: MAIN_ROUTE,
    component: <Main />,
    icon: "",
  },
  {
    name: "Sign In",
    key: "sign-in",
    route: SIGN_IN_ROUTE,
    component: <SignIn />,
    icon: "",
  },
  {
    name: "Reset Password",
    key: "reset-password",
    route: RESET_PASSWORD_ROUTE,
    component: <ResetPassword />,
    icon: "",
  },
  {
    name: "Change Password",
    key: "change-password",
    route: CHANGE_PASSWORD_ROUTE,
    component: <ChangePassword />,
    icon: "",
  },
];

const getRouteNameFromPath = (path: string) => {
  const result = routes.filter((element) => element.route === path);
  if (result.length > 0) {
    return result[0].name;
  }
  return "";
};

export { routes, getRouteNameFromPath };
