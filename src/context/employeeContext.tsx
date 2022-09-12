import React, { createContext, useContext, useMemo, useReducer } from "react";
import {
  ADD_EMPLOYEE_SUCCESS,
  CHANGE_MANAGER_SUCCESS,
  DELETE_EMPLOYEE_SUCCESS,
  GET_ALL_EMPLOYEE_SUCCESS,
  UPDATE_EMPLOYEE_SUCCESS,
  UPDATE_FILTER_EPLOYEE,
} from "constants/action";
import { Employee } from "../models/base/employee";

// @ts-ignore
const EmployeeContext = createContext();
EmployeeContext.displayName = "EmployeeContext";

type EmployeeStateType = {
  employees: Array<Employee>;
  filter: {
    status: string | null;
  };
};

type EmployeeActionType = {
  type: string;
  payload: any;
};

const initialState: EmployeeStateType = {
  employees: [],
  filter: {
    status: "Đang hoạt động",
  },
};

const reducer = (state: EmployeeStateType, action: EmployeeActionType) => {
  switch (action.type) {
    case GET_ALL_EMPLOYEE_SUCCESS: {
      return {
        ...state,
        employees: action.payload,
      };
    }
    case ADD_EMPLOYEE_SUCCESS: {
      const newEmployee = action.payload;
      let newEmployees = [newEmployee, ...state.employees];
      if (newEmployee.manager !== null) {
        const managerOfEmployees = state.employees.filter(
          (item: Employee) => item.id === newEmployee.manager.id
        );
        if (managerOfEmployees.length > 0) {
          managerOfEmployees[0].employees.push(newEmployee);
          newEmployees = newEmployees.map((item: Employee) => {
            if (item.id === managerOfEmployees[0].id) {
              return managerOfEmployees[0];
            }
            return item;
          });
        }
      }
      return {
        ...state,
        employees: newEmployees,
      };
    }
    case UPDATE_EMPLOYEE_SUCCESS: {
      return {
        ...state,
        employees: state.employees.map((employee) => {
          if (employee.id === action.payload.id) {
            return action.payload;
          }
          const newEmployees = employee.employees.filter((item) => item.id !== action.payload.id);
          if (action.payload.manager !== null && action.payload.manager.id === employee.id) {
            newEmployees.push(action.payload);
          }
          return {
            ...employee,
            employees: newEmployees,
          };
        }),
      };
    }
    case CHANGE_MANAGER_SUCCESS: {
      return {
        ...state,
      };
    }
    case DELETE_EMPLOYEE_SUCCESS: {
      const employeeDeletedId = action.payload;
      // Delete employee from list
      let newEmployees = state.employees.map((employee) => {
        if (employee.id === employeeDeletedId) {
          return {
            ...employee,
            employees: [],
            manager: null,
            status: "deleted",
            areaEmployees: [],
          };
        }

        return {
          ...employee,
          employees: employee.employees.filter((item) => item.id !== employeeDeletedId),
        };
      });

      // Delete manager of list employee
      newEmployees = newEmployees.map((employee) => {
        if (employee.manager !== null && employee.manager.id === employeeDeletedId) {
          return {
            ...employee,
            manager: null,
          };
        }
        return employee;
      });

      return {
        ...state,
        employees: newEmployees,
      };
    }
    case UPDATE_FILTER_EPLOYEE: {
      return {
        ...state,
        filter: action.payload,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

function EmployeeProvider({ children }: { children: React.ReactElement }) {
  const [controller, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(() => [controller, dispatch], [controller, dispatch]);
  return <EmployeeContext.Provider value={value}>{children}</EmployeeContext.Provider>;
}

const useEmployeeController = () => {
  const context = useContext(EmployeeContext);

  if (!context) {
    throw new Error("useEmployeeController should be used inside the EmployeeContextProvider.");
  }

  return context;
};

const getAllEmployeeSuccess = (dispatch: any, employees: Array<Employee>) =>
  dispatch({
    type: GET_ALL_EMPLOYEE_SUCCESS,
    payload: employees,
  });

const addEmployeeSuccess = (dispatch: any, employee: Employee) =>
  dispatch({
    type: ADD_EMPLOYEE_SUCCESS,
    payload: employee,
  });

const updateEmployeeSuccess = (dispatch: any, employee: Employee) =>
  dispatch({
    type: UPDATE_EMPLOYEE_SUCCESS,
    payload: employee,
  });

const changeManagerSuccess = (dispatch: any, employee: Employee) =>
  dispatch({
    type: CHANGE_MANAGER_SUCCESS,
    payload: employee,
  });

const deleteEmployeeSuccess = (dispatch: any, id: number) =>
  dispatch({
    type: DELETE_EMPLOYEE_SUCCESS,
    payload: id,
  });

const updateFilterEmployee = (dispatch: any, filter: any) =>
  dispatch({ type: UPDATE_FILTER_EPLOYEE, payload: filter });

export {
  EmployeeProvider,
  useEmployeeController,
  getAllEmployeeSuccess,
  addEmployeeSuccess,
  updateEmployeeSuccess,
  changeManagerSuccess,
  deleteEmployeeSuccess,
  updateFilterEmployee,
};
