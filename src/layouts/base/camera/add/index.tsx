import FormAddOrUpdate from "components/customizes/Form/FormAddOrUpdate";
import { CREATE_LABEL, ERROR_TYPE, SUCCESS_TYPE } from "constants/app";
import { showSnackbar, useSnackbarController } from "context/snackbarContext";
import React, { useState } from "react";
import { Location } from "models/base/location";
import { addCameraApi } from "../api";
import {
  CAMERA_EMPTY_ERROR,
  CREATE_CAMERA_SUCCESS,
  IP_CAMERA_EMPTY_ERROR,
  TYPE_CAMERA_EMPTY_ERROR,
} from "constants/validate";
import { useAuthenController } from "../../../../context/authenContext";
import { addCamera, useCameraController } from "../../../../context/cameraContext";
import { isTimeKeepingModule } from "utils/checkRoles";
import { AreaRestriction } from "models/area-restriction/areaRestriction";
import LocationAutocomplete from "../../location/components/LocationAutocomplete";
import AreaRestrictionAutocomplete from "../../../area-restriction/areaRestriction/components/AreaRestrictionAutocomplete";

function AddCamera({ handleClose }: { handleClose: any }) {
  const [name, setName] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [location, setLocation] = React.useState<Location | null>(null);
  const [type, setType] = useState<string | null>(null);
  const [areaRestriction, setAreaRestriction] = React.useState<AreaRestriction | null>(null);

  // @ts-ignore
  const [authController] = useAuthenController();
  // @ts-ignore
  const [, cameraDispatch] = useCameraController();
  // @ts-ignore
  const [, snackbarDispatch] = useSnackbarController();

  const fields = [
    {
      data: name,
      type: "name",
      label: "Tên camera *",
      action: setName,
    },
    {
      data: ipAddress,
      type: "ipAddress",
      label: "Link rtsp camera *",
      action: setIpAddress,
    },
  ];
  const fieldsWithTimeKeeping = [
    ...fields,
    {
      data: ["Check in", "Check out"],
      type: "autocomplete",
      label: "Check in/ Check out *",
      action: setType,
    },
  ];

  const isValid = () => {
    if (name === null || name.trim() === "") {
      showSnackbar(snackbarDispatch, {
        typeSnackbar: ERROR_TYPE,
        messageSnackbar: CAMERA_EMPTY_ERROR,
      });
      return false;
    }
    if (ipAddress === null) {
      showSnackbar(snackbarDispatch, {
        typeSnackbar: ERROR_TYPE,
        messageSnackbar: IP_CAMERA_EMPTY_ERROR,
      });
      return false;
    }
    if (isTimeKeepingModule()) {
      if (type === null || type.trim() === "") {
        showSnackbar(snackbarDispatch, {
          typeSnackbar: ERROR_TYPE,
          messageSnackbar: TYPE_CAMERA_EMPTY_ERROR,
        });
        return false;
      }
    }
    return true;
  };

  const handleCreateCamera = async () => {
    if (isValid()) {
      if (authController.token) {
        const addCameraResponse = await addCameraApi({
          token: authController.token,
          name,
          ipAddress,
          locationId: location ? location.id : null,
          type: type || "",
          areaRestrictionId: areaRestriction ? areaRestriction.id : null,
        });

        if (addCameraResponse.data !== null) {
          showSnackbar(snackbarDispatch, {
            typeSnackbar: SUCCESS_TYPE,
            messageSnackbar: CREATE_CAMERA_SUCCESS,
          });
          handleClose();
          addCamera(cameraDispatch, addCameraResponse.data);
        } else {
          showSnackbar(snackbarDispatch, {
            typeSnackbar: ERROR_TYPE,
            messageSnackbar: addCameraResponse.messageError,
          });
        }
      }
    }
  };

  return isTimeKeepingModule() ? (
    <FormAddOrUpdate
      title="Thêm mới camera"
      fields={fieldsWithTimeKeeping}
      handleAddOrUpdate={handleCreateCamera}
      actionLabel={CREATE_LABEL}
      visibleCloseButton
      handleClose={handleClose}
    >
      <LocationAutocomplete
        type="autocomplete"
        label="Chi nhánh *"
        handleChoose={(locations) => {
          if (locations.length > 0) {
            setLocation(locations[0]);
          } else setLocation(null);
        }}
      />
    </FormAddOrUpdate>
  ) : (
    <FormAddOrUpdate
      title="Thêm mới camera"
      fields={fields}
      handleAddOrUpdate={handleCreateCamera}
      actionLabel={CREATE_LABEL}
      visibleCloseButton
      handleClose={handleClose}
    >
      <AreaRestrictionAutocomplete
        type="autocomplete"
        label="Khu vực hạn chế *"
        handleChoose={(areaRestrictions) => {
          if (areaRestrictions.length > 0) {
            setAreaRestriction(areaRestrictions[0]);
          } else setAreaRestriction(null);
        }}
      />
    </FormAddOrUpdate>
  );
}

export default AddCamera;
