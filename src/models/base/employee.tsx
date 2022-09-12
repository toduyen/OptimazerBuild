import { convertResponseToMetadata, Metadata } from "./metadata";
import { convertResponseToShift, Shift } from "../time-keeping/shift";
import { AreaEmployee, convertResponseToAreaEmployee } from "models/area-restriction/areaEmployee";

export interface Employee {
  id: number;
  name: string;
  code: string;
  phone: string;
  email: string;
  image: Metadata;
  manager: Employee | null;
  shifts: Array<Shift>;
  employees: Array<Employee>;
  areaEmployees: Array<AreaEmployee>;
  status: string;
}

export const convertResponseToEmployee = (response: any) => ({
  id: response.id,
  name: response.name,
  code: response.code,
  phone: response.phone,
  email: response.email,
  image: response.image ? convertResponseToMetadata(response.image) : null,
  shifts: response.shifts ? response.shifts.map((shift: any) => convertResponseToShift(shift)) : [],
  areaEmployees: response.area_employees
    ? response.area_employees.map((item: any) => convertResponseToAreaEmployee(item))
    : [],
  manager: response.manager
    ? {
        id: response.manager.id,
        name: response.manager.name,
        code: response.manager.code,
        phone: response.manager.phone,
        email: response.manager.email,
        image: response.manager.image ? convertResponseToMetadata(response.manager.image) : null,
        status: response.manager.status,
      }
    : null,
  employees: response.employees
    ? response.employees.map((employee: any) => convertResponseToEmployee(employee))
    : [],
  status: response.status,
});
