import BasePage from "layouts/base/basePage";
import React from "react";
import AddAreaRestriction from "./add";
import areaRestrictionTableData from "./data";
import EditFormAreaRestriction from "./edit";
import ViewAreaRestriction from "./view";
import { handleDeleteApi } from "./api";
import {
  deleteAreaRestrictionSuccess,
  useAreaRestrictionController,
} from "../../../context/areaRestrictionContext";
import SettingFormAreaRestriction from "./setting";

function AreaRestriction(): React.ReactElement {
  // @ts-ignore
  const [, areaRestrictionDispatch] = useAreaRestrictionController();
  return (
    <BasePage
      tableTitle="Danh sách KVHC"
      tableData={areaRestrictionTableData}
      AddForm={({ handleClose }) => AddAreaRestriction({ handleClose })}
      EditForm={({ handleClose, item }) =>
        EditFormAreaRestriction({ handleClose, areaRestriction: item })
      }
      ViewForm={({ handleClose, item }) =>
        ViewAreaRestriction({ handleClose, areaRestriction: item })
      }
      SettingForm={({ handleClose, item }) =>
        SettingFormAreaRestriction({ handleClose, areaRestriction: item })
      }
      deleteAction={{
        actionDelete: (id) => deleteAreaRestrictionSuccess(areaRestrictionDispatch, id),
        deleteApi: handleDeleteApi,
      }}
      optionFeature={{
        enableCreate: true,
        enableExport: false,
        enableImport: false,
      }}
    />
  );
}

export default AreaRestriction;
