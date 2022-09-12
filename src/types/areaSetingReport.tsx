import { Employee } from "models/base/employee";

export type AreaSettingReportType = {
    staff: Employee | null;
    timeReport: number | null;
  };