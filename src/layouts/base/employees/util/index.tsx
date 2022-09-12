import { Employee } from "../../../../models/base/employee";
import { Shift } from "../../../../models/time-keeping/shift";

const getEmployeeFromName = (tkEmployees: Array<Employee>, managerName: string | null) => {
  if (managerName === null) {
    return null;
  }
  const employees = tkEmployees.filter(
    (item: Employee) =>
      item.name === managerName.split("-")[1] && item.code === managerName.split("-")[0]
  );
  if (employees.length > 0) {
    return employees[0];
  }
  return null;
};

const getShiftFromName = (tkShifts: Array<Shift>, shiftName: string) => {
  const shifts = tkShifts.filter((shift: Shift) => shift.name === shiftName);
  if (shifts.length > 0) {
    return shifts[0];
  }
  return null;
};

export { getEmployeeFromName, getShiftFromName };
