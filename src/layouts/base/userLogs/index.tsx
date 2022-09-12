import React from "react";
import logTableData from "./data";
import BasePage from "../basePage";
import FilterFormLogList from "./components/FilterForm";

function LogList(): React.ReactElement {
  return (
    <BasePage
      tableTitle="Danh sách log"
      tableData={logTableData}
      FilterForm={FilterFormLogList}
      optionFeature={{
        enableCreate: false,
        enableImport: false,
        enableExport: false,
      }}
    />
  );
}

export default LogList;
