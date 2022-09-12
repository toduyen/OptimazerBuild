import FormAddOrUpdate from "components/customizes/Form/FormAddOrUpdate";
import {
  ERROR_TYPE,
  SUCCESS_TYPE,
  UPDATE_LABEL,
  UPDATE_SUCCESS,
} from "constants/app";
import { CODE_EMPTY_ERROR, LOCATION_EMPTY_ERROR } from "constants/validate";
import { showSnackbar, useSnackbarController } from "context/snackbarContext";
import { Location } from "models/base/location";
import { useState } from "react";
import { updateLocationApi } from "../api";
import { useAuthenController } from "../../../../context/authenContext";
import { updateLocationSuccess, useLocationController } from "../../../../context/locationContext";
import { getModuleOfUser } from "utils/helpers";

function EditFormLocation({ handleClose, location }: { handleClose: any; location: Location }) {
  const [name, setName] = useState(location.name);
  const [code, setCode] = useState(location.code);
  // @ts-ignore
  const [authController] = useAuthenController();
  // @ts-ignore
  const [, locationDispatch] = useLocationController();
  // @ts-ignore
  const [, snackbarDispatch] = useSnackbarController();

  const fields = [
    {
      data: name,
      type: "name",
      label: "Tên chi nhánh",
      action: setName,
    },
    {
      data: code,
      type: "code",
      label: "Mã chi nhánh",
      action: setCode,
    },
  ];

  const isValid = () => {
    if (name === null || name.trim() === "") {
      showSnackbar(snackbarDispatch, {
        typeSnackbar: ERROR_TYPE,
        messageSnackbar: LOCATION_EMPTY_ERROR,
      });

      return false;
    }
    if (code === null || code.trim() === "") {
      showSnackbar(snackbarDispatch, {
        typeSnackbar: ERROR_TYPE,
        messageSnackbar: CODE_EMPTY_ERROR,
      });

      return false;
    }

    return true;
  };

  const handleUpdateLocation = async () => {
    if (isValid()) {
      const updateLocationResponse = await updateLocationApi({
        token: authController.token,
        id: location.id,
        name,
        code,
        type: getModuleOfUser(authController.currentUser),
      });
      if (updateLocationResponse.data) {
        showSnackbar(snackbarDispatch, {
          typeSnackbar: SUCCESS_TYPE,
          messageSnackbar: UPDATE_SUCCESS,
        });
        handleClose();
        updateLocationSuccess(locationDispatch, updateLocationResponse.data);
      } else {
        showSnackbar(snackbarDispatch, {
          typeSnackbar: ERROR_TYPE,
          messageSnackbar: updateLocationResponse.messageError,
        });
      }
    }
  };

  return (
    <FormAddOrUpdate
      title="Cập nhật chi nhánh"
      fields={fields}
      handleAddOrUpdate={handleUpdateLocation}
      actionLabel={UPDATE_LABEL}
      visibleCloseButton
      handleClose={handleClose}
    />
  );
}

export default EditFormLocation;
