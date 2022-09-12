import FormAddOrUpdate from "components/customizes/Form/FormAddOrUpdate";
import { ERROR_TYPE, SUCCESS_TYPE, UPDATE_LABEL, UPDATE_SUCCESS } from "constants/app";
import { Camera } from "models/base/camera";
import { Location } from "models/base/location";
import React, { useState } from "react";
import { showSnackbar, useSnackbarController } from "context/snackbarContext";
import { updateCameraApi } from "../api";
import { useAuthenController } from "../../../../context/authenContext";
import { updateCameraSuccess, useCameraController } from "../../../../context/cameraContext";
import { isTimeKeepingModule } from "utils/checkRoles";
import { AreaRestriction } from "models/area-restriction/areaRestriction";
import { useAreaRestrictionController } from "context/areaRestrictionContext";
import LocationAutocomplete from "../../location/components/LocationAutocomplete";
import AreaRestrictionAutocomplete from "../../../area-restriction/areaRestriction/components/AreaRestrictionAutocomplete";

function EditFormCamera({ handleClose, camera }: { handleClose: any; camera: Camera }) {
  const [name, setName] = useState(camera.name);
  const [ipAddress, setIpAddress] = useState(camera.ipAddress);
  const [location, setLocation] = useState<Location | null>(camera.location);
  const [type, setType] = useState(camera.type);
  const [areaRestriction, setAreaRestriction] = useState<AreaRestriction | null>(
    camera.areaRestriction
  );

  // @ts-ignore
  const [authController] = useAuthenController();
  // @ts-ignore
  const [areaRestrictionController] = useAreaRestrictionController();
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
      choosedValue: type,
      type: "autocomplete",
      label: "Check in/ Check out *",
      action: setType,
    },
  ];

  const handleUpdate = async () => {
    const updateCameraResponse = await updateCameraApi({
      token: authController.token,
      id: camera.id,
      name,
      ipAddress: ipAddress.toString(),
      locationId: location ? location.id : null,
      type: type || "",
      areaRestrictionId: areaRestriction ? areaRestriction.id : null,
    });

    if (updateCameraResponse.data) {
      showSnackbar(snackbarDispatch, {
        typeSnackbar: SUCCESS_TYPE,
        messageSnackbar: UPDATE_SUCCESS,
      });

      handleClose();
      updateCameraSuccess(cameraDispatch, updateCameraResponse.data);
    } else {
      showSnackbar(snackbarDispatch, {
        typeSnackbar: ERROR_TYPE,
        messageSnackbar: updateCameraResponse.messageError,
      });
    }
  };

  return isTimeKeepingModule() ? (
    <FormAddOrUpdate
      title="Cập nhật camera"
      fields={fieldsWithTimeKeeping}
      handleAddOrUpdate={handleUpdate}
      actionLabel={UPDATE_LABEL}
      visibleCloseButton
      handleClose={handleClose}
    >
      <LocationAutocomplete
        type="autocomplete"
        label="Chi nhánh *"
        defaultData={location ? Array.of(location) : []}
        handleChoose={(locations) => {
          if (locations.length > 0) {
            setLocation(locations[0]);
          } else setLocation(null);
        }}
      />
    </FormAddOrUpdate>
  ) : (
    <FormAddOrUpdate
      title="Cập nhật camera"
      fields={fields}
      handleAddOrUpdate={handleUpdate}
      actionLabel={UPDATE_LABEL}
      visibleCloseButton
      handleClose={handleClose}
    >
      <AreaRestrictionAutocomplete
        type="autocomplete"
        label="Khu vực hạn chế *"
        defaultData={areaRestriction ? Array.of(areaRestriction) : []}
        handleChoose={(areaRestrictions) => {
          if (areaRestrictions.length > 0) {
            setAreaRestriction(areaRestrictions[0]);
          } else setAreaRestriction(null);
        }}
      />
    </FormAddOrUpdate>
  );
}

export default EditFormCamera;
