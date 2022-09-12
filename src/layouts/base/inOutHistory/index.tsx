import React from "react";
import BasePage from "layouts/base/basePage";
import inOutHistoryTableData from "./data";
import { useNavigate } from "react-router-dom";
import { IN_OUT_HISTORY_BOARD_ROUTE } from "../../../constants/route";
import { isTimeKeepingModule } from "../../../utils/checkRoles";
import ExpandComponent from "../basePage/components/ExpandComponent";
import FilterForm from "./components/FilterForm";

function ExpandInOut() {
  const navigate = useNavigate();
  return (
    <ExpandComponent
      handleOnClick={() => navigate(IN_OUT_HISTORY_BOARD_ROUTE)}
      tooltipContent="Xem danh sách vào ra ngày hôm nay"
    />
  );
}
function InOutHistory(): React.ReactElement {
  return (
    <BasePage
      tableTitle="Lịch sử vào ra"
      tableData={inOutHistoryTableData}
      ExpandForm={ExpandInOut}
      FilterForm={FilterForm}
      optionFeature={{
        enableCreate: false,
        enableImport: false,
        enableExport: false,
        enableExpand: isTimeKeepingModule(),
        enableSearch: false,
      }}
    />
  );
}

export default InOutHistory;
