import React, { useEffect, useState } from "react";
import { updateEmployeeApi } from "layouts/base/employees/api";
import { convertTimeStringToDate, isValidEmail } from "utils/helpers";
import { showSnackbar, useSnackbarController } from "context/snackbarContext";
import { ERROR_TYPE, SUCCESS_TYPE, UPDATE_LABEL, UPDATE_SUCCESS } from "constants/app";
import {
  CODE_EMPLOYEE_EMPTY_ERROR,
  EMAIL_INVALID_ERROR,
  FULLNAME_EMPTY_ERROR,
  SHIFT_EMPTY_ERROR,
} from "constants/validate";
import FormAddOrUpdate from "components/customizes/Form/FormAddOrUpdate";
import { Employee } from "models/base/employee";
import { Shift } from "models/time-keeping/shift";
import AvatarUser from "components/customizes/AvatarUser";
import { getShiftFromName } from "../util";
import { useAuthenController } from "../../../../context/authenContext";
import { updateEmployeeSuccess, useEmployeeController } from "../../../../context/employeeContext";
import { useShiftController } from "../../../../context/shiftContext";
import { isTimeKeepingModule } from "utils/checkRoles";
import { Button } from "@mui/material";
import AreaRestrictionTime from "../components/AreaRestrictionTime";
import { useAreaRestrictionController } from "context/areaRestrictionContext";
import { AreaEmployeeTimeType } from "types/areaEmployeeTimeType";
import EmployeeAutocomplete from "../components/EmployeeAutocomplete";

const initAreaEmployeeTime: AreaEmployeeTimeType = {
  areaRestriction: null,
  timeStart: null,
  timeEnd: null,
};

function UpdateEmployee({ handleClose, employee }: { handleClose: any; employee: Employee }) {
  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState(employee.name);
  const [code, setCode] = useState(employee.code);
  const [phone, setPhone] = useState(employee.phone);
  const [email, setEmail] = useState(employee.email);
  const [manager, setManager] = useState<Employee | null>(employee.manager);
  const [shiftNames, setShiftNames] = useState(employee.shifts.map((shift) => shift.name));

  const convertAreaEmployees = (): Array<AreaEmployeeTimeType> =>
    employee.areaEmployees.map((item) => ({
      areaRestriction: item.areaRestriction,
      timeStart: convertTimeStringToDate(item.timeStart),
      timeEnd: convertTimeStringToDate(item.timeEnd),
    }));
  const [rowsData, setRowData] = useState<Array<AreaEmployeeTimeType>>(convertAreaEmployees());
  // @ts-ignore
  const [authController] = useAuthenController();
  // @ts-ignore
  const [employeeController, employeeDispatch] = useEmployeeController();
  // @ts-ignore
  const [shiftController] = useShiftController();
  // @ts-ignore
  const [, snackbarDispatch] = useSnackbarController();

  useEffect(() => {
    const temp = employeeController.employees.filter((e: Employee) => e.id === employee.id)[0];
    setManager(temp.manager);
  }, []);

  const fieldsNoShift = [
    {
      data: name,
      type: "text",
      label: "Họ và tên *",
      action: setName,
    },
    {
      data: code,
      type: "text",
      label: "Mã số nhân viên *",
      action: setCode,
    },
    {
      data: phone,
      type: "text",
      label: "Số điện thoại *",
      action: setPhone,
    },
    {
      data: email,
      type: "text",
      label: "Email *",
      action: setEmail,
    },
  ];

  const fieldsWithShift = [
    ...fieldsNoShift,
    {
      data: shiftController.shifts.map((shift: Shift) => shift.name),
      checked: shiftNames,
      type: "autocomplete-multiple",
      label: "Ca làm việc *",
      action: setShiftNames,
    },
  ];
  const handleAddAreaRestrictionTime = () => {
    setRowData((prevState: any) => [...prevState, initAreaEmployeeTime]);
  };
  const handleUpdate = (index: number, newValue: AreaEmployeeTimeType | null) => {
    if (!newValue) {
      const rowsDataTmp = [...rowsData];
      rowsDataTmp.splice(index, 1);

      setRowData(rowsDataTmp);
    } else {
      const rowsDataTmp = [...rowsData];
      rowsDataTmp[index] = newValue;
      setRowData(rowsDataTmp);
    }
  };
  const convertAreaEmployee = () => {
    let result = "";
    rowsData.forEach((item: AreaEmployeeTimeType) => {
      if (
        item.timeStart === null ||
        item.timeEnd === null ||
        item.areaRestriction === null ||
        item.timeStart.toLocaleString() === "Invalid Date" ||
        item.timeEnd.toLocaleString() === "Invalid Date"
      ) {
        return;
      }

      const timeStartStr = item.timeStart.toLocaleTimeString("vi-VN", { hour12: false });
      const timeEndStr = item.timeEnd.toLocaleTimeString("vi-VN", { hour12: false });
      const { areaRestriction } = item;
      if (areaRestriction !== null) {
        result += `{"area_restriction_id":${areaRestriction.id},"time_start":"${timeStartStr}","time_end":"${timeEndStr}"},`;
      }
    });
    if (result.length > 1) {
      result = `[${result.substring(0, result.length - 1)}]`;
    }
    return result;
  };
  const isValid = () => {
    if (name === null || name.trim() === "") {
      showSnackbar(snackbarDispatch, {
        typeSnackbar: ERROR_TYPE,
        messageSnackbar: FULLNAME_EMPTY_ERROR,
      });

      return false;
    }
    if (code === null || code.trim() === "") {
      showSnackbar(snackbarDispatch, {
        typeSnackbar: ERROR_TYPE,
        messageSnackbar: CODE_EMPLOYEE_EMPTY_ERROR,
      });

      return false;
    }
    if (email !== null && email.trim() !== "" && !isValidEmail(email)) {
      showSnackbar(snackbarDispatch, {
        typeSnackbar: ERROR_TYPE,
        messageSnackbar: EMAIL_INVALID_ERROR,
      });

      return false;
    }
    if (isTimeKeepingModule() && shiftNames.length === 0) {
      showSnackbar(snackbarDispatch, {
        typeSnackbar: ERROR_TYPE,
        messageSnackbar: SHIFT_EMPTY_ERROR,
      });

      return false;
    }
    return true;
  };
  const handleUpdateEmployee = async () => {
    if (isValid()) {
      const shiftIds = shiftNames
        .map((shiftName) => getShiftFromName(shiftController.shifts, shiftName))
        .filter((shift) => shift !== null)
        .map((shift) => shift!.id)
        .join(",");
      const updateEmployeeResponse = await updateEmployeeApi({
        token: authController.token,
        employeeId: employee.id,
        avatar,
        name,
        code,
        phone,
        email,
        managerId: manager !== null ? manager.id : null,
        shifts: `[${shiftIds}]`,
        areaEmployee: convertAreaEmployee(),
      });

      if (updateEmployeeResponse.data !== null) {
        showSnackbar(snackbarDispatch, {
          typeSnackbar: SUCCESS_TYPE,
          messageSnackbar: UPDATE_SUCCESS,
        });
        handleClose();
        updateEmployeeSuccess(employeeDispatch, updateEmployeeResponse.data);
      } else {
        showSnackbar(snackbarDispatch, {
          typeSnackbar: ERROR_TYPE,
          messageSnackbar: updateEmployeeResponse.messageError,
        });
      }
    }
  };
  return isTimeKeepingModule() ? (
    <FormAddOrUpdate
      title="Cập nhật nhân viên"
      fields={fieldsWithShift}
      handleAddOrUpdate={handleUpdateEmployee}
      actionLabel={UPDATE_LABEL}
      visibleCloseButton
      handleClose={handleClose}
      headChildren={<AvatarUser avatar={employee.image} handleFile={(file) => setAvatar(file)} />}
    >
      <EmployeeAutocomplete
        defaultData={manager ? Array.of(manager) : null}
        type="autocomplete"
        label="Người quản lý"
        handleChoose={(employees) => {
          if (employees.length > 0) {
            setManager(employees[0]);
          } else setManager(null);
        }}
        status="active"
      />
    </FormAddOrUpdate>
  ) : (
    <FormAddOrUpdate
      title="Cập nhật nhân viên"
      fields={fieldsNoShift}
      handleAddOrUpdate={handleUpdateEmployee}
      actionLabel={UPDATE_LABEL}
      visibleCloseButton
      handleClose={handleClose}
      headChildren={<AvatarUser avatar={employee.image} handleFile={(file) => setAvatar(file)} />}
    >
      <>
        <EmployeeAutocomplete
          defaultData={manager ? Array.of(manager) : null}
          type="autocomplete"
          label="Người quản lý"
          handleChoose={(employees) => {
            if (employees.length > 0) {
              setManager(employees[0]);
            } else setManager(null);
          }}
          status="active"
        />
        {rowsData.map((item: AreaEmployeeTimeType, index: number) => (
          <AreaRestrictionTime
            areaRestrictionTime={item}
            position={index}
            handleUpdate={handleUpdate}
          />
        ))}
        <Button
          onClick={handleAddAreaRestrictionTime}
          style={{ padding: "0", fontWeight: "400", fontSize: "12px", textTransform: "initial" }}
        >
          Thêm khu vực, thời gian cho phép
        </Button>
      </>
    </FormAddOrUpdate>
  );
}

export default UpdateEmployee;
