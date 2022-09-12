import FormAddOrUpdate from "components/customizes/Form/FormAddOrUpdate";
import { CREATE_LABEL, ERROR_TYPE, SUCCESS_TYPE } from "constants/app";
import {
  CREATE_ORGANIZATION_SUCCESS,
  EMAIL_INVALID_ERROR,
  ORGANIZATION_EMPTY_ERROR,
  PHONE_INVALID_ERROR,
} from "constants/validate";
import { showSnackbar, useSnackbarController } from "context/snackbarContext";
import { useState } from "react";
import { isValidEmail, isValidPhone } from "utils/helpers";
import { addOrganizationApi } from "../api";
import { useAuthenController } from "../../../../context/authenContext";
import {
  addOrganizationSuccess,
  useOrganizationController,
} from "../../../../context/organizationContext";

function AddOrganization({ handleClose }: { handleClose: any }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");

  // @ts-ignore
  const [authController] = useAuthenController();
  // @ts-ignore
  const [, organizationDispatch] = useOrganizationController();
  // @ts-ignore
  const [, snackbarDispatch] = useSnackbarController();
  const fields = [
    {
      data: name,
      type: "name",
      label: "Tên tổ chức *",
      action: setName,
    },
    {
      data: email,
      type: "email",
      label: "Email",
      action: setEmail,
    },
    {
      data: phone,
      type: "phone",
      label: "Số điện thoại",
      action: setPhone,
    },
    {
      data: description,
      type: "description",
      label: "Mô tả",
      action: setDescription,
    },
  ];

  const isValid = () => {
    if (name === null || name.trim() === "") {
      showSnackbar(snackbarDispatch, {
        typeSnackbar: ERROR_TYPE,
        messageSnackbar: ORGANIZATION_EMPTY_ERROR,
      });

      return false;
    }

    if (email !== "" && !isValidEmail(email)) {
      showSnackbar(snackbarDispatch, {
        typeSnackbar: ERROR_TYPE,
        messageSnackbar: EMAIL_INVALID_ERROR,
      });

      return false;
    }

    if (phone !== "" && !isValidPhone(phone)) {
      showSnackbar(snackbarDispatch, {
        typeSnackbar: ERROR_TYPE,
        messageSnackbar: PHONE_INVALID_ERROR,
      });

      return false;
    }

    return true;
  };

  const handleCreateOrganization = async () => {
    if (isValid()) {
      const addOrganizationResponse = await addOrganizationApi({
        token: authController.token,
        name,
        email,
        phone,
        description,
      });
      if (addOrganizationResponse.data) {
        showSnackbar(snackbarDispatch, {
          typeSnackbar: SUCCESS_TYPE,
          messageSnackbar: CREATE_ORGANIZATION_SUCCESS,
        });
        addOrganizationSuccess(organizationDispatch, addOrganizationResponse.data);
        handleClose();
      } else {
        showSnackbar(snackbarDispatch, {
          typeSnackbar: ERROR_TYPE,
          messageSnackbar: addOrganizationResponse.messageError,
        });
      }
    }
  };
  return (
    <FormAddOrUpdate
      title="Thêm tổ chức"
      fields={fields}
      handleAddOrUpdate={handleCreateOrganization}
      actionLabel={CREATE_LABEL}
      visibleCloseButton
      handleClose={handleClose}
    />
  );
}

export default AddOrganization;
