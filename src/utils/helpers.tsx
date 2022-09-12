import {
  MODULE_TIME_KEEPING_TYPE,
  MODULE_AREA_RESTRICTION_TYPE,
  MODULE_BEHAVIOR_TYPE,
  DELETED_TYPE,
  ACTIVE_TYPE,
  PENDING_TYPE,
} from "constants/app";
import { User } from "models/base/user";
import { isTimeKeepingAdmin, isAreaRestrictionAdmin, isBehaviorAdmin } from "./checkRoles";
import MDTypography from "../components/bases/MDTypography";

const isValidPassword = (password: string | null) =>
  !(
    password === null ||
    !password.match(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,}$/)
  );

const isValidUsername = (username: string | null) =>
  !(username === null || !username.match(/^[a-zA-Z0-9]{5,}$/));

const isValidEmail = (email: string | null) =>
  !(email === null || !email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/));

const convertTimeStringToDate = (time: string) => {
  const now = new Date();
  const [hour, minute, second] = time.split(":");
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    parseInt(hour, 10),
    parseInt(minute, 10),
    parseInt(second, 10)
  );
};

const convertTimeFromDateTime = (time: Date) => {
  const hour = `0${time.getHours()}`.slice(-2);
  const minute = `0${time.getMinutes()}`.slice(-2);
  const second = `0${time.getSeconds()}`.slice(-2);
  return `${hour}:${minute}:${second}`;
};

const convertStringFromDateTime = (time: Date) => {
  const date = `0${time.getDate()}`.slice(-2);
  const month = `0${time.getMonth() + 1}`.slice(-2);
  const year = time.getFullYear();
  return `${date}/${month}/${year} ${convertTimeFromDateTime(time)}.${time.getMilliseconds()}`;
};
const isValidPhone = (phone: string | null) =>
  !(phone === null || !phone.match(/^(03|05|07|08|09)+([0-9]{8})$/));

const convertStringTime = (time: string) => {
  const datetime = new Date(time);
  const date = `0${datetime.getDate()}`.slice(-2);
  const month = `0${datetime.getMonth() + 1}`.slice(-2);
  const year = datetime.getFullYear();
  return `${date}/${month}/${year} ${convertTimeFromDateTime(datetime)}`;
};

const getStartCurrentDateString = () => {
  const datetime = new Date();
  const date = `0${datetime.getDate()}`.slice(-2);
  const month = `0${datetime.getMonth() + 1}`.slice(-2);
  const year = datetime.getFullYear();
  return `${date}/${month}/${year} 00:00:00`;
};

const getEndCurrentDateString = () => {
  const datetime = new Date();
  const date = `0${datetime.getDate()}`.slice(-2);
  const month = `0${datetime.getMonth() + 1}`.slice(-2);
  const year = datetime.getFullYear();
  return `${date}/${month}/${year} 23:59:59`;
};

const convertStringToDate = (datetimeString: string) => {
  const [dateString, timeString] = datetimeString.split(" ");
  const [date, month, year] = dateString.split("/");
  const [hour, minute, second] = timeString.split(":");
  return new Date(
    parseInt(year, 10),
    parseInt(month, 10) - 1,
    parseInt(date, 10),
    parseInt(hour, 10),
    parseInt(minute, 10),
    parseInt(second, 10)
  );
};

const convertStatusToString = (status: string) => {
  switch (status) {
    case "active":
      return (
        <MDTypography variant="body2" color="success">
          {ACTIVE_TYPE}
        </MDTypography>
      );
    case "deleted":
      return (
        <MDTypography variant="body2" color="error">
          {DELETED_TYPE}
        </MDTypography>
      );
    case "pending":
      return <MDTypography variant="body2">{PENDING_TYPE}</MDTypography>;
    default:
      return null;
  }
};

const getModuleOfUser = (user: User) => {
  if (isTimeKeepingAdmin(user)) {
    return MODULE_TIME_KEEPING_TYPE;
  }

  if (isAreaRestrictionAdmin(user)) {
    return MODULE_AREA_RESTRICTION_TYPE;
  }

  if (isBehaviorAdmin(user)) {
    return MODULE_BEHAVIOR_TYPE;
  }
  return "";
};

export {
  isValidPassword,
  isValidUsername,
  isValidEmail,
  isValidPhone,
  convertTimeStringToDate,
  convertTimeFromDateTime,
  convertStringFromDateTime,
  convertStringTime,
  getEndCurrentDateString,
  getStartCurrentDateString,
  convertStringToDate,
  convertStatusToString,
  getModuleOfUser,
};
