import FormAddOrUpdate from "components/customizes/Form/FormAddOrUpdate";
import {
  CREATE_LABEL,
  ERROR_TYPE,
  SUCCESS_TYPE,
} from "constants/app";
import { useState } from "react";
import { addLocationApi } from "../api";
import { showSnackbar, useSnackbarController } from "context/snackbarContext";
import {
  CODE_EMPTY_ERROR,
  CREATE_LOCATION_SUCCESS,
  LOCATION_EMPTY_ERROR,
} from "constants/validate";
import { useAuthenController } from "../../../../context/authenContext";
import { addLocationSuccess, useLocationController } from "../../../../context/locationContext";
import { getModuleOfUser } from "utils/helpers";

function AddLocation({ handleClose }: { handleClose: any }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

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
      label: "Tên chi nhánh *",
      action: setName,
    },
    {
      data: code,
      type: "code",
      label: "Mã chi nhánh *",
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
    if (code === null || name.trim() === "") {
      showSnackbar(snackbarDispatch, {
        typeSnackbar: ERROR_TYPE,
        messageSnackbar: CODE_EMPTY_ERROR,
      });

      return false;
    }

    return true;
  };

  const handleCreateLocation = async () => {
    if (isValid()) {
      const addLocationResponse = await addLocationApi({
        token: authController.token,
        name,
        code,
        type: getModuleOfUser(authController.currentUser),
      });

      if (addLocationResponse.data) {
        showSnackbar(snackbarDispatch, {
          typeSnackbar: SUCCESS_TYPE,
          messageSnackbar: CREATE_LOCATION_SUCCESS,
        });
        handleClose();
        addLocationSuccess(locationDispatch, addLocationResponse.data);
      } else {
        showSnackbar(snackbarDispatch, {
          typeSnackbar: ERROR_TYPE,
          messageSnackbar: addLocationResponse.messageError,
        });
      }
    }
  };

  return (
    <FormAddOrUpdate
      title="Thêm chi nhánh"
      fields={fields}
      handleAddOrUpdate={handleCreateLocation}
      actionLabel={CREATE_LABEL}
      visibleCloseButton
      handleClose={handleClose}
    />
  );
}

export default AddLocation;
