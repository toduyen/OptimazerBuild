import BasePage from "layouts/base/basePage";
import AddCamera from "./add";
import { deleteCameraApi } from "./api";
import cameraTableDatas from "./data";
import EditFormCamera from "./edit";
import ViewCamera from "./view";
import { deleteCameraSuccess, useCameraController } from "../../../context/cameraContext";
import SettingFormCamera from "./setting";
import { FilterFormCameraAreaRestriction } from "./components/FilterFormCameraAreaRestriction";
import { isTimeKeepingModule } from "utils/checkRoles";
import { FilterFormCameraTimeKeeping } from "./components/FilterFormCameraTimeKeeping";

function Camera() {
  // @ts-ignore
  const [, cameraDispatch] = useCameraController();
  return (
    <BasePage
      tableTitle="Danh sách camera"
      tableData={cameraTableDatas}
      AddForm={({ handleClose }) => AddCamera({ handleClose })}
      EditForm={({ handleClose, item }) => EditFormCamera({ handleClose, camera: item })}
      ViewForm={({ handleClose, item }) => ViewCamera({ handleClose, camera: item })}
      SettingForm={({ handleClose, item }) => SettingFormCamera({ handleClose, camera: item })}
      FilterForm={isTimeKeepingModule() ? FilterFormCameraTimeKeeping: FilterFormCameraAreaRestriction }
      deleteAction={{
        actionDelete: (id) => deleteCameraSuccess(cameraDispatch, id),
        deleteApi: deleteCameraApi,
      }}
      optionFeature={{
        enableCreate: true,
        enableImport: false,
        enableExport: false,
      }}
    />
  );
}

export default Camera;
