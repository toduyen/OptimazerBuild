import React, { useState } from "react";
import { addUserApi } from "layouts/base/users/api";
import { isValidEmail } from "utils/helpers";
import { showSnackbar, useSnackbarController } from "context/snackbarContext";
import { CREATE_LABEL, ERROR_TYPE, SUCCESS_TYPE } from "constants/app";
import {
  CREATE_USER_SUCCESS,
  EMAIL_EMPTY_ERROR,
  EMAIL_INVALID_ERROR,
  FULLNAME_EMPTY_ERROR,
  LOCATION_EMPTY_ERROR,
  ORGANIZATION_EMPTY_ERROR,
  USER_ROLE_EMPTY_ERROR,
} from "constants/validate";
import FormAddOrUpdate from "components/customizes/Form/FormAddOrUpdate";
import { Role } from "models/base/role";
import { Organization } from "models/base/organization";
import { isSuperAdmin, isSuperAdminOrganization } from "../../../../utils/checkRoles";
import { Location } from "../../../../models/base/location";
import { useLocationController } from "../../../../context/locationContext";
import { addUser, useUserController } from "context/userContext";
import { useAuthenController } from "context/authenContext";
import { useRoleController } from "context/roleContext";
import { useOrganizationController } from "context/organizationContext";
import LocationAutocomplete from "layouts/base/location/components/LocationAutocomplete";

function AddUser({ handleClose }: { handleClose: any }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  // @ts-ignore
  const [authController] = useAuthenController();
  // @ts-ignore
  const [, userDispatch] = useUserController();
  // @ts-ignore
  const [roleController] = useRoleController();
  // @ts-ignore
  const [organizationController] = useOrganizationController();
  // @ts-ignore
  const [, snackbarDispatch] = useSnackbarController();

  const [roles, setRoles] = React.useState<any>([]);

  const [organizationName, setOrganizationName] = React.useState<any>("");
  const [location, setLocation] = React.useState<Location | null>(null);

  const fields = [
    {
      data: fullName,
      type: "fullName",
      label: "Họ và tên *",
      action: setFullName,
    },
    {
      data: email,
      type: "email",
      label: "Email *",
      action: setEmail,
    },
  ];

  const fieldsSuperAdmin = [
    ...fields,
    {
      data: roleController.roles.map((role: Role) => role.name),
      type: "autocomplete-multiple",
      label: "Quyền *",
      action: setRoles,
    },
    {
      data: organizationController.organizations.map(
        (organizationUser: Organization) => organizationUser.name
      ),
      type: "autocomplete",
      label: "Tổ chức *",
      action: setOrganizationName,
    },
  ];

  const fieldsSuperAdminOrganization = [
    ...fields,
    {
      data: roleController.roles.map((role: Role) => role.name),
      type: "autocomplete-multiple",
      label: "Quyền *",
      action: setRoles,
    },
  ];

  const fieldsAdminOrganization = [
    ...fields,
    {
      data: roleController.roles.map((role: Role) => role.name),
      type: "autocomplete",
      label: "Quyền *",
      action: setRoles,
    },
  ];

  const getOrganizationFromName = () => {
    const organizations = organizationController.organizations.filter(
      (item: Organization) => item.name === organizationName
    );
    if (organizations.length > 0) {
      return organizations[0];
    }
    return null;
  };

  const isValid = () => {
    if (fullName === null || fullName.trim() === "") {
      showSnackbar(snackbarDispatch, {
        typeSnackbar: ERROR_TYPE,
        messageSnackbar: FULLNAME_EMPTY_ERROR,
      });

      return false;
    }
    if (email === null || email.trim() === "") {
      showSnackbar(snackbarDispatch, {
        typeSnackbar: ERROR_TYPE,
        messageSnackbar: EMAIL_EMPTY_ERROR,
      });

      return false;
    }

    if (!isValidEmail(email)) {
      showSnackbar(snackbarDispatch, {
        typeSnackbar: ERROR_TYPE,
        messageSnackbar: EMAIL_INVALID_ERROR,
      });

      return false;
    }
    if (roles.length === 0) {
      showSnackbar(snackbarDispatch, {
        typeSnackbar: ERROR_TYPE,
        messageSnackbar: USER_ROLE_EMPTY_ERROR,
      });

      return false;
    }

    if (isSuperAdmin(authController.currentUser) && organizationName.trim() === "") {
      showSnackbar(snackbarDispatch, {
        typeSnackbar: ERROR_TYPE,
        messageSnackbar: ORGANIZATION_EMPTY_ERROR,
      });

      return false;
    }

    if (
      !isSuperAdmin(authController.currentUser) &&
      !isSuperAdminOrganization(authController.currentUser) &&
      location === null
    ) {
      showSnackbar(snackbarDispatch, {
        typeSnackbar: ERROR_TYPE,
        messageSnackbar: LOCATION_EMPTY_ERROR,
      });

      return false;
    }
    return true;
  };
  const handleCreateUser = async () => {
    if (isValid()) {
      const organization = isSuperAdmin(authController.currentUser)
        ? getOrganizationFromName()
        : authController.currentUser.organization;
      if (organization !== null) {
        const addUserResponse = await addUserApi({
          token: authController.token,
          fullName,
          email,
          roles: Array.isArray(roles) ? roles : Array.of(roles),
          organizationId: organization.id,
          locationId: location ? location.id : "",
        });

        if (addUserResponse.data !== null) {
          showSnackbar(snackbarDispatch, {
            typeSnackbar: SUCCESS_TYPE,
            messageSnackbar: CREATE_USER_SUCCESS,
          });
          handleClose();
          addUser(userDispatch, addUserResponse.data);
        } else {
          showSnackbar(snackbarDispatch, {
            typeSnackbar: ERROR_TYPE,
            messageSnackbar: addUserResponse.messageError,
          });
        }
      }
    }
  };
  // eslint-disable-next-line no-nested-ternary
  return isSuperAdmin(authController.currentUser) ? (
    <FormAddOrUpdate
      title="Thêm người dùng"
      fields={fieldsSuperAdmin}
      handleAddOrUpdate={handleCreateUser}
      actionLabel={CREATE_LABEL}
      visibleCloseButton
      handleClose={handleClose}
    />
  ) : isSuperAdminOrganization(authController.currentUser) ? (
    <FormAddOrUpdate
      title="Thêm người dùng"
      fields={fieldsSuperAdminOrganization}
      handleAddOrUpdate={handleCreateUser}
      actionLabel={CREATE_LABEL}
      visibleCloseButton
      handleClose={handleClose}
    />
  ) : (
    <FormAddOrUpdate
      title="Thêm người dùng"
      fields={fieldsAdminOrganization}
      handleAddOrUpdate={handleCreateUser}
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
  );
}

export default AddUser;
