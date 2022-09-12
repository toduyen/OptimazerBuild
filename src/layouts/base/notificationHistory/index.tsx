import React, { useEffect } from "react";
import BasePage from "layouts/base/basePage";
import notificationHistoryTableData from "./data";
import { FilterFormAreaRestriction } from "./component/FilterFormAreaRestriction";
import { isTimeKeepingModule } from "utils/checkRoles";
import FilterFormTimeKeeping from "./component/FilterFormTimeKeeping";

function NotificationHistory(): React.ReactElement {
  return (
    <BasePage
      tableTitle="Lịch sử cảnh báo"
      tableData={notificationHistoryTableData}
      FilterForm={isTimeKeepingModule() ? FilterFormTimeKeeping : FilterFormAreaRestriction}
      optionFeature={{
        enableCreate: false,
        enableImport: false,
        enableExport: false,
        enableSearch: false,
      }}
    />
  );
}

export default NotificationHistory;
