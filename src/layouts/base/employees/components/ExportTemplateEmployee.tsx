import React from "react";
import ExportComponent from "../../basePage/components/ExportComponent";
// @ts-ignore
import EmployeeTemplate from "assets/excels/employee_template.xlsx";

export default function ExportTemplateEmployee() {
  return <ExportComponent title="Tải mẫu danh sách" linkDownload={EmployeeTemplate} />;
}
