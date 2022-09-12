import React from "react";
import featuresTableData from "./data";
import BasePage from "../basePage";

function Features(): React.ReactElement {
  return (
    <BasePage
      tableTitle="Danh sách tính năng"
      tableData={featuresTableData}
      optionFeature={{
        enableCreate: false,
        enableImport: false,
        enableExport: false,
      }}
    />
  );
}

export default Features;
