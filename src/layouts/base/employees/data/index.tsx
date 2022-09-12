import React, { useCallback, useEffect, useState } from "react";
import { getAllEmployeesApi } from "../api";
import { Employee } from "models/base/employee";
import MDBox from "../../../../components/bases/MDBox";
import { CardMedia } from "@mui/material";
import { useAuthenController } from "../../../../context/authenContext";
import { getAllEmployeeSuccess, useEmployeeController } from "../../../../context/employeeContext";
import { isTimeKeepingModule } from "utils/checkRoles";
import { AreaEmployee } from "models/area-restriction/areaEmployee";
import { useAreaRestrictionController } from "context/areaRestrictionContext";
import { getTimeKeepingShiftApi } from "../../../time-keeping/setting/api";
import { getAllShiftSuccess, useShiftController } from "../../../../context/shiftContext";
import RowAction from "../../../../components/customizes/Tables/RowAction";
import { convertStatusToString } from "utils/helpers";

export default function data(
  handleView: (employee: Employee) => void,
  handleEdit: (employee: Employee) => void,
  handleDelete: (employee: Employee) => void
) {
  const [pageCount, setPageCount] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [employeesDatas, setEmployeesData] = useState([]);

  // @ts-ignore
  const [authController] = useAuthenController();
  // @ts-ignore
  const [employeeController, employeeDispatch] = useEmployeeController();
  // @ts-ignore
  const [, shiftDispatch] = useShiftController();

  const [token, setToken] = useState(null);

  useEffect(() => {
    if (token !== authController.token) {
      setToken(authController.token);
    }
  }, [authController.token]);

  const fetchData = useCallback(
    async ({ page, size, search }) => {
      const status = employeeController.filter.status
        ? employeeController.filter.status === "Đã xóa"
          ? "deleted"
          : "active"
        : "";
      if (token) {
        const getAllEmployeesResponse = await getAllEmployeesApi({
          token,
          page,
          size,
          search,
          status,
        });
        if (getAllEmployeesResponse.data !== null) {
          getAllEmployeeSuccess(employeeDispatch, getAllEmployeesResponse.data.data);
          setPageCount(getAllEmployeesResponse.data.pageCount);
          setItemCount(getAllEmployeesResponse.data.itemCount);
        }
      }
    },
    [token, employeeController.filter]
  );

  const fetchShiftData = useCallback(async () => {
    if (token) {
      const getAllShiftResponse = await getTimeKeepingShiftApi(token);
      if (getAllShiftResponse.data !== null) {
        getAllShiftSuccess(shiftDispatch, getAllShiftResponse.data);
      }
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      if (isTimeKeepingModule()) {
        fetchShiftData().catch(console.error);
      }
    }
  }, [token]);

  const convertDataToRow = (employee: Employee) => {
    let temp = {
      id: employee.id,
      name: employee.name,
      code: employee.code,
      email: employee.email,
      phone: employee.phone,
    };
    if (isTimeKeepingModule()) {
      temp = {
        ...temp,
        // @ts-ignore
        shifts: (
          <>
            {employee.shifts.map((shift) => (
              <MDBox
                borderRadius={20}
                px={1}
                my={1}
                style={{
                  backgroundColor: "#4F4F52",
                  color: "white",
                  fontSize: "0.875rem",
                }}
              >
                {shift.name}
              </MDBox>
            ))}
          </>
        ),
      };
    } else {
      temp = {
        ...temp,
        // @ts-ignore
        areaEmployees: (
          <>
            {employee.areaEmployees.map((item: AreaEmployee) => (
              <MDBox
                borderRadius={20}
                px={1}
                my={1}
                style={{
                  backgroundColor: "#4F4F52",
                  color: "white",
                  fontSize: "0.875rem",
                }}
              >
                {`${item.areaRestriction.areaName}, ${item.timeStart}-${item.timeEnd}`}
              </MDBox>
            ))}
          </>
        ),
      };
    }
    temp = {
      ...temp,
      // @ts-ignore
      image:
        employee.image !== null ? (
          <CardMedia component="img" height="80" image={employee.image.path} alt={employee.name} />
        ) : (
          <div />
        ),
      status: convertStatusToString(employee.status),
      action:
        employee.status === "active" ? (
          <RowAction
            handleView={() => handleView(employee)}
            handleEdit={() => handleEdit(employee)}
            handleDelete={() => handleDelete(employee)}
          />
        ) : (
          <div />
        ),
    };
    return temp;
  };
  const getEmployeesDataOfManager = (employeeIsManager: Employee): Array<any> =>
    employeeIsManager.employees.map((employee: Employee) => convertDataToRow(employee));

  const convertDataToRowStep1 = (employeeIsManager: Employee) => {
    const rows = getEmployeesDataOfManager(employeeIsManager);
    return {
      manager: `${employeeIsManager.code}-${employeeIsManager.name}`,
      employees: rows,
    };
  };

  useEffect(() => {
    const managers = employeeController.employees.filter(
      (employee: Employee) => employee.employees.length > 0
    );
    const employeeNoManagers: Array<Employee> = [];
    employeeController.employees.forEach((item: Employee) => {
      const { manager } = item;
      if (manager === null) {
        employeeNoManagers.push(item);
      } else if (managers.filter((e: Employee) => e.id === item.manager?.id).length === 0) {
        manager.employees = [item];
        managers.push(manager);
      }
    });

    const managersData = managers.map((employee: Employee) => convertDataToRowStep1(employee));
    const employeeNoManagersData = employeeNoManagers.map((employee: Employee) => ({
      manager: "",
      employees: [convertDataToRow(employee)],
    }));
    setEmployeesData(managersData.concat(employeeNoManagersData));
  }, [employeeController.employees]);

  return {
    columns: [
      {
        Header: "Người quản lý",
        columns: [{ Header: "Mã Số-Họ và tên", accessor: "managerName", align: "center" }],
        align: "center",
      },
      {
        Header: "Nhân sự",
        columns: isTimeKeepingModule()
          ? [
              { Header: "Họ và tên", accessor: "name", align: "center" },
              { Header: "Mã số", accessor: "code", align: "center" },
              { Header: "Email", accessor: "email", align: "center" },
              { Header: "Số điện thoại", accessor: "phone", align: "center" },
              { Header: "Ca làm việc", accessor: "shifts", align: "center" },
              { Header: "Hình ảnh nhận diện", accessor: "image", align: "center" },
              { Header: "Trạng thái", accessor: "status", align: "center" },
              { Header: "Thao tác", accessor: "action", align: "left" },
            ]
          : [
              { Header: "Họ và tên", accessor: "name", align: "center" },
              { Header: "Mã số", accessor: "code", align: "center" },
              { Header: "Email", accessor: "email", align: "center" },
              { Header: "Số điện thoại", accessor: "phone", align: "center" },
              { Header: "Khu vực, thời gian cho phép", accessor: "areaEmployees", align: "center" },
              { Header: "Hình ảnh nhận diện", accessor: "image", align: "center" },
              { Header: "Trạng thái", accessor: "status", align: "center" },
              { Header: "Thao tác", accessor: "action", align: "left" },
            ],
        align: "center",
      },
    ],

    rows: employeesDatas,
    fetchData,
    pageCount,
    itemCount,
  };
}
