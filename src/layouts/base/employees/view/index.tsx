import FormInfo from "components/customizes/Form/FormInfo";
import { Employee } from "models/base/employee";
import React from "react";
import MDAvatar from "components/bases/MDAvatar";
import MDBox from "components/bases/MDBox";
import MDTypography from "components/bases/MDTypography";
import { Shift } from "../../../../models/time-keeping/shift";
import { useEmployeeController } from "../../../../context/employeeContext";
import { isTimeKeepingModule } from "utils/checkRoles";

function ViewEmployee({ handleClose, employee }: { handleClose: any; employee: Employee }) {
  // @ts-ignore
  const [employeeController] = useEmployeeController();
  const fullAttrEmployee = employeeController.employees.filter(
    (item: Employee) => item.id === employee.id
  )[0];
  return (
    <FormInfo title="Thông tin nhân viên" handleClose={handleClose} enableUpdate={false}>
      <MDBox display="flex" flexDirection="column">
        <MDBox display="flex" justifyContent="center" paddingBottom="41px">
          <MDAvatar
            src={fullAttrEmployee.image ? fullAttrEmployee.image.path : ""}
            alt={fullAttrEmployee.name}
            size="xxl"
            shadow="md"
          />
        </MDBox>
        <MDBox display="flex" flexDirection="column" lineHeight="28px">
          <MDTypography variant="text" color="text" fontSize="14px">
            Họ và tên: {fullAttrEmployee.name}
          </MDTypography>
          <MDTypography variant="text" color="text" fontSize="14px">
            Mã nhân viên: {fullAttrEmployee.code}
          </MDTypography>
          <MDTypography variant="text" color="text" fontSize="14px">
            Email: {fullAttrEmployee.email}
          </MDTypography>
          <MDTypography variant="text" color="text" fontSize="14px">
            Số điện thoại: {fullAttrEmployee.phone}
          </MDTypography>
          {isTimeKeepingModule() ? (
            <MDTypography variant="text" color="text" fontSize="14px">
              Ca làm việc:{" "}
              {fullAttrEmployee.shifts.map((shift: Shift) => `${shift.name}`).join(", ")}
            </MDTypography>
          ) : (
            <div />
          )}
          <MDTypography variant="text" color="text" fontSize="14px">
            Người quản lý:
            {fullAttrEmployee.manager
              ? ` ${fullAttrEmployee.manager.code}-${fullAttrEmployee.manager.name}`
              : ""}
          </MDTypography>
        </MDBox>
      </MDBox>
    </FormInfo>
  );
}

export default ViewEmployee;
