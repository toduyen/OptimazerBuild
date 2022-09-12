import FormAddOrUpdate from "components/customizes/Form/FormAddOrUpdate";
import { ERROR_TYPE, SUCCESS_TYPE, UPDATE_LABEL, UPDATE_SUCCESS } from "constants/app";
import { showSnackbar, useSnackbarController } from "context/snackbarContext";
import { Role } from "models/base/role";
import { User } from "models/base/user";
import React, { useEffect, useState } from "react";
import { updateUserApi } from "../api";
import { Organization } from "../../../../models/base/organization";
import {
  EMAIL_EMPTY_ERROR,
  EMAIL_INVALID_ERROR,
  FULLNAME_EMPTY_ERROR,
  LOCATION_EMPTY_ERROR,
  USER_ROLE_EMPTY_ERROR,
} from "../../../../constants/validate";
import { isValidEmail } from "../../../../utils/helpers";
import { isSuperAdmin, isSuperAdminOrganization } from "../../../../utils/checkRoles";
import AvatarUser from "../../../../components/customizes/AvatarUser";
import { Location } from "../../../../models/base/location";
import { useAuthenController } from "../../../../context/authenContext";
import { updateUserSuccess, useUserController } from "../../../../context/userContext";
import { useRoleController } from "../../../../context/roleContext";
import { useOrganizationController } from "../../../../context/organizationContext";
import { useLocationController } from "../../../../context/locationContext";
import LocationAutocomplete from "layouts/base/location/components/LocationAutocomplete";

function EditFormUser({ handleClose, user }: { handleClose: any; user: User }) {
  const [avatar, setAvatar] = useState<any>(null);
  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [roles, setRoles] = useState<any>([]);
  const [organizationName, setOrganizationName] = useState(user.organization?.name);
  const [location, setLocation] = React.useState<Location | null>(user.location);

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

  useEffect(() => {
    if (authController.token) {
      setRoles(
        isSuperAdmin(authController.currentUser) ||
          isSuperAdminOrganization(authController.currentUser)
          ? user.roles.map((role) => role.name)
          : user.roles[0].name
      );
    }
  }, [authController.token]);

  const fields = [
    {
      data: fullName,
      type: "name",
      label: "Họ và tên *",
      action: setFullName,
    },
    {
      data: email,
      type: "email",
      label: "Email",
      action: setEmail,
    },
  ];

  const fieldSuperAdmin = [
    ...fields,
    {
      data: roleController.roles.map((role: Role) => role.name),
      checked: roles,
      type: "autocomplete-multiple",
      label: "Quyền *",
      action: setRoles,
    },
    {
      data: organizationController.organizations.map(
        (organizationUser: Organization) => organizationUser.name
      ),
      choosedValue: organizationName,
      type: "autocomplete",
      label: "Tổ chức *",
      action: setOrganizationName,
    },
  ];

  const fieldSuperAdminOrganization = [
    ...fields,
    {
      data: roleController.roles.map((role: Role) => role.name),
      checked: roles,
      type: "autocomplete-multiple",
      label: "Quyền *",
      action: setRoles,
    },
  ];
  const fieldAdminOrganization = [
    ...fields,
    {
      data: roleController.roles.map((role: Role) => role.name),
      choosedValue: roles,
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

  const handleUpdate = async () => {
    if (isValid()) {
      const organization = isSuperAdmin(authController.currentUser)
        ? getOrganizationFromName()
        : authController.currentUser.organization;

      if (organization !== null) {
        const updateUserResponse = await updateUserApi({
          token: authController.token,
          userId: user.id,
          file: avatar,
          fullName,
          email,
          organizationId: organization.id,
          locationId: location ? location.id : "",
          roles: Array.isArray(roles)
            ? `[${roles.map((role) => `"${role}"`).join(",")}]`
            : `["${roles}"]`,
        });

        if (updateUserResponse.data !== null) {
          showSnackbar(snackbarDispatch, {
            typeSnackbar: SUCCESS_TYPE,
            messageSnackbar: UPDATE_SUCCESS,
          });
          handleClose();
          updateUserSuccess(userDispatch, updateUserResponse.data);
        } else {
          showSnackbar(snackbarDispatch, {
            typeSnackbar: ERROR_TYPE,
            messageSnackbar: updateUserResponse.messageError,
          });
        }
      }
    }
  };

  // eslint-disable-next-line no-nested-ternary
  return authController.currentUser !== null && isSuperAdmin(authController.currentUser) ? (
    <FormAddOrUpdate
      title="Cập nhật người dùng"
      fields={fieldSuperAdmin}
      handleAddOrUpdate={handleUpdate}
      actionLabel={UPDATE_LABEL}
      visibleCloseButton
      handleClose={handleClose}
      headChildren={<AvatarUser avatar={user.avatar} handleFile={(file) => setAvatar(file)} />}
    />
  ) : isSuperAdminOrganization(authController.currentUser) ? (
    <FormAddOrUpdate
      title="Cập nhật người dùng"
      fields={fieldSuperAdminOrganization}
      handleAddOrUpdate={handleUpdate}
      actionLabel={UPDATE_LABEL}
      visibleCloseButton
      handleClose={handleClose}
    />
  ) : (
    <FormAddOrUpdate
      title="Cập nhật người dùng"
      fields={fieldAdminOrganization}
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
  );
}

export default EditFormUser;
