import React from "react";
import employeesTableData from "./data";
import BasePage from "../basePage";
import AddEmployee from "./add";
import UpdateEmployee from "./edit";
import ViewEmployee from "./view";
import { deleteEmployeeApi } from "./api";
import { deleteEmployeeSuccess, useEmployeeController } from "../../../context/employeeContext";
import ImportEmployee from "./components/ImportEmployee";
import ExportTemplateEmployee from "./components/ExportTemplateEmployee";
import { FilterForm } from "./components/FilterForm";

function Employees(): React.ReactElement {
  // @ts-ignore
  const [, employeeDispatch] = useEmployeeController();

  return (
    <BasePage
      tableTitle="Danh sách nhân sự"
      tableData={employeesTableData}
      AddForm={({ handleClose }) => AddEmployee({ handleClose })}
      EditForm={({ handleClose, item }) => UpdateEmployee({ handleClose, employee: item })}
      ViewForm={({ handleClose, item }) => ViewEmployee({ handleClose, employee: item })}
      FilterForm={FilterForm}
      deleteAction={{
        actionDelete: (id) => deleteEmployeeSuccess(employeeDispatch, id),
        deleteApi: deleteEmployeeApi,
      }}
      optionFeature={{
        enableCreate: true,
        enableImport: true,
        enableExport: true,
      }}
      ImportForm={ImportEmployee}
      ExportForm={ExportTemplateEmployee}
      isCustomTable
    />
  );
}

export default Employees;
