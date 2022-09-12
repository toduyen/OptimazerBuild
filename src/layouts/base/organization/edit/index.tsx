import FormAddOrUpdate from "components/customizes/Form/FormAddOrUpdate";
import { ERROR_TYPE, SUCCESS_TYPE, UPDATE_LABEL, UPDATE_SUCCESS } from "constants/app";
import {
  EMAIL_INVALID_ERROR,
  ORGANIZATION_EMPTY_ERROR,
  PHONE_INVALID_ERROR,
} from "constants/validate";
import { showSnackbar, useSnackbarController } from "context/snackbarContext";
import { Organization } from "models/base/organization";
import React, { useState } from "react";
import { isValidEmail, isValidPhone } from "utils/helpers";
import { updateOrganizationApi } from "../api";
import { useAuthenController } from "../../../../context/authenContext";
import {
  updateOrganizationSuccess,
  useOrganizationController,
} from "../../../../context/organizationContext";

function EditFormOrganization({
  handleClose,
  organization,
}: {
  handleClose: any;
  organization: Organization;
}) {
  const [name, setName] = useState(organization.name || "");
  const [email, setEmail] = useState(organization.email || "");
  const [phone, setPhone] = useState(organization.phone || "");
  const [description, setDescription] = useState(organization.description || "");

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

  const handleUpdate = async () => {
    if (organization && isValid()) {
      const updateOrganizationResponse = await updateOrganizationApi({
        token: authController.token,
        id: organization.id,
        name,
        email,
        phone,
        description,
      });
      if (updateOrganizationResponse.data) {
        showSnackbar(snackbarDispatch, {
          typeSnackbar: SUCCESS_TYPE,
          messageSnackbar: UPDATE_SUCCESS,
        });
        handleClose();
        updateOrganizationSuccess(organizationDispatch, updateOrganizationResponse.data);
      } else {
        showSnackbar(snackbarDispatch, {
          typeSnackbar: ERROR_TYPE,
          messageSnackbar: updateOrganizationResponse.messageError,
        });
      }
    }
  };

  return (
    <FormAddOrUpdate
      title="Cập nhật tổ chức"
      fields={fields}
      handleAddOrUpdate={handleUpdate}
      actionLabel={UPDATE_LABEL}
      visibleCloseButton
      handleClose={handleClose}
    />
  );
}

export default EditFormOrganization;
