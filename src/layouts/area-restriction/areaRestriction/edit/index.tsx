import MDBox from "components/bases/MDBox";
import MDTimePicker from "components/bases/MDTimePicker";
import FormAddOrUpdate from "components/customizes/Form/FormAddOrUpdate";
import { ERROR_TYPE, SUCCESS_TYPE, UPDATE_LABEL, UPDATE_SUCCESS } from "constants/app";
import { useState } from "react";
import { showSnackbar, useSnackbarController } from "context/snackbarContext";
import { convertTimeStringToDate } from "utils/helpers";
import {
  NAME_AREA_EMPTY_ERROR,
  NAME_CODE_EMPTY_ERROR,
  PERSONNEL_IN_CHARGE_EMPTY_ERROR,
} from "constants/validate";
import { updateAreaRestrictionApi } from "../api";
import { AreaRestriction } from "models/area-restriction/areaRestriction";
import {
  updateAreaRestrictionSuccess,
  useAreaRestrictionController,
} from "context/areaRestrictionContext";
import { useAuthenController } from "../../../../context/authenContext";
import { Employee } from "../../../../models/base/employee";
import EmployeeAutocomplete from "../../../base/employees/components/EmployeeAutocomplete";

function EditFormAreaRestriction({
  handleClose,
  areaRestriction,
}: {
  handleClose: any;
  areaRestriction: AreaRestriction;
}) {
  const [areaName, setAreaName] = useState(areaRestriction.areaName);
  const [areaCode, setAreaCode] = useState(areaRestriction.areaCode);
  const [timeStart, setTimeStart] = useState<Date | null>(
    convertTimeStringToDate(areaRestriction.timeStart)
  );
  const [timeEnd, setTimeEnd] = useState<Date | null>(
    convertTimeStringToDate(areaRestriction.timeEnd)
  );
  const [personnelInCharges, setPersonnelInCharges] = useState<Array<Employee> | null>(
    areaRestriction.personnelInCharge
  );

  // @ts-ignore
  const [authController] = useAuthenController();

  // @ts-ignore
  const [, snackbarDispatch] = useSnackbarController();

  // @ts-ignore
  const [, areaRestrictionDispatch] = useAreaRestrictionController();

  const fields = [
    {
      data: areaName,
      type: "areaName",
      label: "Tên khu vực *",
      action: setAreaName,
    },
    {
      data: areaCode,
      type: "areaCode",
      label: "Mã khu vực *",
      action: setAreaCode,
    },
  ];

  const isValid = () => {
    if (areaName === null || areaName.trim() === "") {
      showSnackbar(snackbarDispatch, {
        typeSnackbar: ERROR_TYPE,
        messageSnackbar: NAME_AREA_EMPTY_ERROR,
      });
      return false;
    }
    if (areaCode === null || areaCode.trim() === "") {
      showSnackbar(snackbarDispatch, {
        typeSnackbar: ERROR_TYPE,
        messageSnackbar: NAME_CODE_EMPTY_ERROR,
      });
      return false;
    }
    if (personnelInCharges === null) {
      showSnackbar(snackbarDispatch, {
        typeSnackbar: ERROR_TYPE,
        messageSnackbar: PERSONNEL_IN_CHARGE_EMPTY_ERROR,
      });
      return false;
    }
    return true;
  };

  const handleUpdateAreaRestriction = async () => {
    if (isValid()) {
      areaRestriction.areaCode = areaCode;
      areaRestriction.areaName = areaName;
      areaRestriction.personnelInCharge = personnelInCharges || [];
      areaRestriction.timeStart = timeStart
        ? timeStart.toLocaleTimeString("vi-VN", { hour12: false })
        : "";
      areaRestriction.timeEnd = timeEnd
        ? timeEnd.toLocaleTimeString("vi-VN", { hour12: false })
        : "";

      const updateAreaRestrictionResponse = await updateAreaRestrictionApi({
        token: authController.token,
        areaRestriction,
      });
      if (updateAreaRestrictionResponse.data) {
        showSnackbar(snackbarDispatch, {
          typeSnackbar: SUCCESS_TYPE,
          messageSnackbar: UPDATE_SUCCESS,
        });

        handleClose();
        updateAreaRestrictionSuccess(areaRestrictionDispatch, updateAreaRestrictionResponse.data);
      } else {
        showSnackbar(snackbarDispatch, {
          typeSnackbar: ERROR_TYPE,
          messageSnackbar: updateAreaRestrictionResponse.messageError,
        });
      }
    }
  };

  const handleChangeStartTime = (time: Date | null) => {
    if (time !== null && time.toLocaleString() !== "Invalid Date") {
      setTimeStart(time);
    } else {
      setTimeStart(null);
    }
  };

  const handleChangeEndTime = (time: Date | null) => {
    if (time !== null && time.toLocaleString() !== "Invalid Date") {
      setTimeEnd(time);
    } else {
      setTimeEnd(null);
    }
  };

  return (
    <FormAddOrUpdate
      title="Cập nhật khu vực hạn chế"
      fields={fields}
      handleAddOrUpdate={handleUpdateAreaRestriction}
      actionLabel={UPDATE_LABEL}
      visibleCloseButton
      handleClose={handleClose}
    >
      <>
        <EmployeeAutocomplete
          type="autocomplete-multiple"
          label="Nhân sự phụ trách *"
          defaultData={personnelInCharges}
          handleChoose={(employees) => {
            setPersonnelInCharges(employees);
          }}
          status="active"
        />
        <MDBox display="flex" flexDirection="row" justifyContent="space-between" gap={2}>
          <MDTimePicker
            label="Thời gian bắt đầu"
            time={timeStart}
            handleChooseTime={(time: any) => {
              handleChangeStartTime(time);
            }}
          />
          <MDTimePicker
            label="Thời gian kết thúc"
            time={timeEnd}
            handleChooseTime={(time: any) => {
              handleChangeEndTime(time);
            }}
          />
        </MDBox>
      </>
    </FormAddOrUpdate>
  );
}

export default EditFormAreaRestriction;
