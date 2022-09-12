import {
  isAreaRestrictionModule,
  isBehaviorModule,
  isTimeKeepingAdmin,
  isTimeKeepingModule,
} from "../utils/checkRoles";
import {
  MODULE_AREA_RESTRICTION_TYPE,
  MODULE_BEHAVIOR_TYPE,
  MODULE_TIME_KEEPING_TYPE,
} from "../constants/app";

const axiosConfig = (jwtToken: string) => {
  const module = getModuleName();
  return {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
      token: jwtToken,
      module,
    },
  };
};
const axiosConfigMultipart = (jwtToken: string) => {
  const module = getModuleName();
  return {
    headers: {
      "Content-Type": "multipart/formdata",
      "Access-Control-Allow-Origin": "*",
      token: jwtToken,
      module,
    },
  };
};

const getModuleName = () => {
  if (isTimeKeepingModule()) return MODULE_TIME_KEEPING_TYPE;
  if (isAreaRestrictionModule()) return MODULE_AREA_RESTRICTION_TYPE;
  if (isBehaviorModule()) return MODULE_BEHAVIOR_TYPE;
  return "";
};
// eslint-disable-next-line import/prefer-default-export
export { axiosConfig, axiosConfigMultipart };
