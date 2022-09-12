import { convertResponseToEmployee, Employee } from "models/base/employee";

export interface ManagerTimeSkip {
  manager: Employee | null;
  timeSkip: number;
}

export const convertResponseToManagerTimeSkip = (response: any) => ({
  manager: response.manager ? convertResponseToEmployee(response.manager) : {},
  timeSkip: response.time_skip,
});
