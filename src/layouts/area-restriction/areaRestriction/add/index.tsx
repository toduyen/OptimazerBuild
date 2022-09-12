import MDBox from "components/bases/MDBox";
import MDTimePicker from "components/bases/MDTimePicker";
import FormAddOrUpdate from "components/customizes/Form/FormAddOrUpdate";
import { CREATE_LABEL, ERROR_TYPE, SUCCESS_TYPE } from "constants/app";
import {
  CREATE_AREA_RESTRICTION_SUCCESS,
  NAME_AREA_EMPTY_ERROR,
  NAME_CODE_EMPTY_ERROR,
  PERSONNEL_IN_CHARGE_EMPTY_ERROR,
} from "constants/validate";
import { showSnackbar, useSnackbarController } from "context/snackbarContext";
import { useState } from "react";
import { addAreaRestrictionApi } from "../api";
import {
  addAreaRestrictionSuccess,
  useAreaRestrictionController,
} from "../../../../context/areaRestrictionContext";
import { useAuthenController } from "../../../../context/authenContext";
import { Employee } from "../../../../models/base/employee";
import EmployeeAutocomplete from "../../../base/employees/components/EmployeeAutocomplete";

function AddAreaRestriction({ handleClose }: { handleClose: any }) {
  const [areaName, setAreaName] = useState("");
  const [areaCode, setAreaCode] = useState("");
  const [personnelInCharges, setPersonnelInCharges] = useState<Array<Employee>>([]);
  const [timeStart, setTimeStart] = useState<string | null>("");
  const [timeEnd, setTimeEnd] = useState<string | null>("");

  // @ts-ignore
  const [, snackbarDispatch] = useSnackbarController();

  // @ts-ignore
  const [, areaRestrictionDispatch] = useAreaRestrictionController();

  // @ts-ignore
  const [authController] = useAuthenController();

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
  const handleChangeStartTime = (time: Date | null) => {
    if (time !== null && time.toLocaleString() !== "Invalid Date") {
      setTimeStart(time.toLocaleTimeString("vi-VN", { hour12: false }));
    } else {
      setTimeStart(null);
    }
  };
  const handleChangeEndTime = (time: Date | null) => {
    if (time !== null && time.toLocaleString() !== "Invalid Date") {
      setTimeEnd(time.toLocaleTimeString("vi-VN", { hour12: false }));
    } else {
      setTimeEnd(null);
    }
  };

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
    if (personnelInCharges.length === 0) {
      showSnackbar(snackbarDispatch, {
        typeSnackbar: ERROR_TYPE,
        messageSnackbar: PERSONNEL_IN_CHARGE_EMPTY_ERROR,
      });
      return false;
    }
    return true;
  };

  const handleAddAreaRestriction = async () => {
    if (isValid()) {
      const managerIds: Array<number> = personnelInCharges.map((item) => item.id);
      if (authController.token) {
        const addAreaRestrictionResponse = await addAreaRestrictionApi({
          token: authController.token,
          areaName,
          areaCode,
          personnelInCharge: managerIds,
          timeStart,
          timeEnd,
        });

        if (addAreaRestrictionResponse.data !== null) {
          showSnackbar(snackbarDispatch, {
            typeSnackbar: SUCCESS_TYPE,
            messageSnackbar: CREATE_AREA_RESTRICTION_SUCCESS,
          });
          handleClose();
          addAreaRestrictionSuccess(areaRestrictionDispatch, addAreaRestrictionResponse.data);
        } else {
          showSnackbar(snackbarDispatch, {
            typeSnackbar: ERROR_TYPE,
            messageSnackbar: addAreaRestrictionResponse.messageError,
          });
        }
      }
    }
  };

  return (
    <FormAddOrUpdate
      title="Thêm khu vực hạn chế"
      fields={fields}
      handleAddOrUpdate={handleAddAreaRestriction}
      actionLabel={CREATE_LABEL}
      visibleCloseButton
      handleClose={handleClose}
    >
      <>
        <EmployeeAutocomplete
          type="autocomplete-multiple"
          label="Nhân sự phụ trách *"
          handleChoose={(employees) => {
            setPersonnelInCharges(employees);
          }}
          status="active"
        />
        <MDBox display="flex" flexDirection="row" justifyContent="space-between" gap={2}>
          <MDTimePicker
            label="Thời gian bắt đầu"
            time={null}
            handleChooseTime={(time: any) => handleChangeStartTime(time)}
          />
          <MDTimePicker
            label="Thời gian kết thúc"
            time={null}
            handleChooseTime={(time: any) => {
              handleChangeEndTime(time);
            }}
          />
        </MDBox>
      </>
    </FormAddOrUpdate>
  );
}

export default AddAreaRestriction;
