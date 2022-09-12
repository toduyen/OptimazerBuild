import MDBox from "components/bases/MDBox";
import FormInfo from "components/customizes/Form/FormInfo";
import { useEffect, useState } from "react";
import {
  getAllAreaRestrictionNotificationSuccess,
  updateAreaRestrictionNotificationSuccess,
} from "context/areaRestrictionContext";
import { getAllAreaRestrictionNotificationApi, updateAreaRestrictionMethodApi } from "../api";
import { AreaRestrictionNotification } from "models/area-restriction/areaRestrictionNotification";
import { ERROR_TYPE, SUCCESS_TYPE } from "constants/app";
import { showSnackbar, useSnackbarController } from "context/snackbarContext";
import { useAuthenController } from "../../../../context/authenContext";
import AreaRestrictionNotificationComponent from "./component/AreaRestrictionNotificationComponent";
import AreaRestrictionManagerComponent from "./component/AreaRestrictionManagerComponent";
import { AreaRestriction } from "../../../../models/area-restriction/areaRestriction";
import { useAreaRestrictionNotificationController } from "../../../../context/areaRestrictionNotificationContext";
import { NotificationMethod } from "../../../../models/base/notificationMethod";
import { Button, Modal, Tooltip } from "@mui/material";
import { AreaSettingReportType } from "types/areaSetingReport";
import { ManagerTimeSkip } from "models/area-restriction/managerTimeSkip";
import MDButton from "components/bases/MDButton";
import QrCodeComponent from "components/customizes/QrCodeComponent";

const initAreaSettingReportTime: AreaSettingReportType = {
  staff: null,
  timeReport: null,
};

function SettingFormAreaRestriction({
  handleClose,
  areaRestriction,
}: {
  handleClose: any;
  areaRestriction: AreaRestriction;
}) {
  const [areaRestrictionNotification, setAreaRestrictionNotification] =
    useState<AreaRestrictionNotification | null>(null);
  const [rowsData, setRowData] = useState<Array<AreaSettingReportType>>([]);
  const [open, setOpen] = useState(false);

  const handleCloseQrCodeForm = () => {
    setOpen(false)
  }

  // @ts-ignore
  const [authController] = useAuthenController();

  // @ts-ignore
  const [areaRestrictionNotificationController, areaRestrictionNotificationDispatch] =
    useAreaRestrictionNotificationController();

  // @ts-ignore
  const [, snackbarDispatch] = useSnackbarController();

  const handleChangeNotificationMethod = (newNotificationMethod: NotificationMethod) => {
    if (areaRestrictionNotification) {
      areaRestrictionNotification.notificationMethod = newNotificationMethod;
      setAreaRestrictionNotification((prevState) => {
        if (prevState) {
          return {
            ...prevState,
            notificationMethod: newNotificationMethod,
          };
        }
        return null;
      });
    }
  };

  const convertAreaSettingReport = (): Array<AreaSettingReportType> =>
    areaRestrictionNotification?.managers
      ? areaRestrictionNotification.managers.map((item: any) => ({
          staff: item.manager,
          timeReport: item.timeSkip,
        }))
      : [];

  const handleAddReportSttaff = () => {
    setRowData((prevState: any) => [...prevState, initAreaSettingReportTime]);
  };

  // @ts-ignore
  useEffect(async () => {
    const getAllAreaRestrictionNotificationResponse = await getAllAreaRestrictionNotificationApi({
      token: authController.token,
      id: areaRestriction.id,
    });
    if (getAllAreaRestrictionNotificationResponse.data !== null) {
      getAllAreaRestrictionNotificationSuccess(
        areaRestrictionNotificationDispatch,
        getAllAreaRestrictionNotificationResponse.data
      );
      setAreaRestrictionNotification(getAllAreaRestrictionNotificationResponse.data);
    }
  }, [authController.token]);

  useEffect(() => {
    if (areaRestrictionNotification) {
      setRowData(convertAreaSettingReport());
    }
  }, [areaRestrictionNotification]);

  const handleUpdateReport = (index: number, newValue: AreaSettingReportType | null) => {
    if (!newValue) {
      const rowsDataTmp = [...rowsData];
      rowsDataTmp.splice(index, 1);

      setRowData(rowsDataTmp);
    } else {
      const rowsDataTmp = [...rowsData];
      rowsDataTmp[index] = newValue;
      setRowData(rowsDataTmp);
    }
  };
  const convertAreaReport = (): Array<ManagerTimeSkip> => {
    const result: Array<ManagerTimeSkip> = [];
    rowsData.forEach((item: AreaSettingReportType) => {
      if (item.timeReport === null) {
        return;
      }
      const time = item.timeReport;
      result.push({
        manager: item.staff,
        timeSkip: time,
      });
    });
    return result;
  };

  const handleChangeSetting = async () => {
    const newARNotification = { ...areaRestrictionNotification, managers: convertAreaReport() };
    const settingAreaRestrictionResponse = await updateAreaRestrictionMethodApi({
      token: authController.token,
      // @ts-ignore
      areaRestrictionNotification: newARNotification,
    });

    if (settingAreaRestrictionResponse !== null) {
      updateAreaRestrictionNotificationSuccess(
        areaRestrictionNotificationDispatch,
        settingAreaRestrictionResponse.data
      );

      if (settingAreaRestrictionResponse !== null) {
        updateAreaRestrictionNotificationSuccess(
          areaRestrictionNotificationDispatch,
          settingAreaRestrictionResponse.data
        );
        handleClose();
        showSnackbar(snackbarDispatch, {
          typeSnackbar: SUCCESS_TYPE,
          messageSnackbar: "Cập nhật thành công",
        });
      } else {
        showSnackbar(snackbarDispatch, {
          typeSnackbar: ERROR_TYPE,
          messageSnackbar: "Error",
        });
      }
    }
  };

  useEffect(() => {
    setAreaRestrictionNotification(
      areaRestrictionNotificationController.areaRestrictionNotification
    );
  }, [areaRestrictionNotificationController.areaRestrictionNotification]);

  const formQrCode = (closeView: Function) => <QrCodeComponent handleClose={closeView} />;

  return (
    <FormInfo
      title="Cài đặt cảnh báo"
      handleClose={handleClose}
      enableUpdate
      handleUpdate={handleChangeSetting}
    >
      <>
        <MDBox style={{ overflowY: "auto", maxHeight: "500px" }}>
          <MDBox display="flex" flexDirection="column">
            <MDBox display="flex" flexDirection="column" lineHeight="28px">
              {areaRestrictionNotification !== null && (
                <AreaRestrictionNotificationComponent
                  notificationMethod={areaRestrictionNotification.notificationMethod}
                  handleChange={(newNotificationMethod) =>
                    handleChangeNotificationMethod(newNotificationMethod)
                  }
                />
              )}
              {areaRestrictionNotification !== null && (
                <AreaRestrictionManagerComponent
                  areaRestriction={areaRestrictionNotification.areaRestriction}
                  rowsData={rowsData}
                  handleUpdateReport={handleUpdateReport}
                />
              )}
            </MDBox>
          </MDBox>
          <Button
            onClick={handleAddReportSttaff}
            style={{ padding: "0", fontWeight: "400", fontSize: "12px", textTransform: "initial", margin: "24px" }}
          >
            Thêm cảnh báo
          </Button>
        </MDBox>
        {areaRestrictionNotification?.notificationMethod.useOTT && (
          <Tooltip title="Chia sẻ mã QR tới mail của các nhân sự, nhân sự có thể quét mã để sử dụng OTT">
            <MDButton variant="gradient" color="dark" style={{marginBottom: "-24px"}} fullWidth onClick={(e: any) => {
              setOpen(true)}}>
              Chia sẻ mã QR OTT
            </MDButton>
          </Tooltip>
        )}
        <Modal
          open={open}
          onClose={handleCloseQrCodeForm}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <>{formQrCode(handleCloseQrCodeForm)}</>
        </Modal>
      </>
    </FormInfo>
  );
}

export default SettingFormAreaRestriction;
