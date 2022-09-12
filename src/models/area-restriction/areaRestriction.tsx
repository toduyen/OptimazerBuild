import { Employee } from "models/base/employee";

export interface AreaRestriction {
  id: number;
  areaName: string;
  areaCode: string;
  personnelAllowedInOut: number;
  personnelInCharge: Array<Employee>;
  timeStart: string;
  timeEnd: string;
  numberCamera: number;
  numberOfAlertsForTheDay: number;
  employeeAreaRestrictions: Array<string>;
}

export const convertResponseToAreaRestriction = (response: any): AreaRestriction => ({
  id: response.id,
  areaName: response.name,
  areaCode: response.code,
  personnelAllowedInOut: response.number_employee_allow,
  personnelInCharge: response.managers,
  timeStart: response.time_start,
  timeEnd: response.time_end,
  numberCamera: response.number_camera,
  numberOfAlertsForTheDay: response.number_notification,
  employeeAreaRestrictions: response.employeeAreaRestrictions,
});

export const convertAreaRestrictionToRequest = (areaRestriction: AreaRestriction): Object => ({
  name: areaRestriction.areaName,
  code: areaRestriction.areaCode,
  manager_ids: areaRestriction.personnelInCharge.map((item) => item.id),
  time_start: areaRestriction.timeStart,
  time_end: areaRestriction.timeEnd,
});
