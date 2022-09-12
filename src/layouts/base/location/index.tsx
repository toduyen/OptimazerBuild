import BasePage from "layouts/base/basePage";
import AddLocation from "./add";
import locationTableData from "./data";
import EditFormLocation from "./edit";
import React from "react";
import ViewUser from "./view";
import { deleteLocationApi } from "./api";
import { deleteLocationSuccess, useLocationController } from "../../../context/locationContext";

function Location(): React.ReactElement {
  // @ts-ignore
  const [, locationDispatch] = useLocationController();
  return (
    <BasePage
      tableTitle="Danh sách chi nhánh"
      tableData={locationTableData}
      AddForm={({ handleClose }) => AddLocation({ handleClose })}
      EditForm={({ handleClose, item }) => EditFormLocation({ handleClose, location: item })}
      ViewForm={({ handleClose, item }) => ViewUser({ handleClose, location: item })}
      deleteAction={{
        actionDelete: (id) => deleteLocationSuccess(locationDispatch, id),
        deleteApi: deleteLocationApi,
      }}
      optionFeature={{
        enableCreate: true,
        enableImport: false,
        enableExport: false,
      }}
    />
  );
}

export default Location;
