import { Icon } from "@mui/material";
import MDAvatar from "components/bases/MDAvatar";
import MDBox from "components/bases/MDBox";
import MDDropzone from "components/bases/MDDropzone";
import MDInput from "components/bases/MDInput";
import MDTypography from "components/bases/MDTypography";
import FormInfo from "components/customizes/Form/FormInfo";
import { User } from "models/base/user";
import { useState } from "react";
import { useAuthenController, updateMyInfoSuccess } from "context/authenContext";
import { isValidEmail } from "utils/helpers";
import { showSnackbar, useSnackbarController } from "context/snackbarContext";
import { EMAIL_EMPTY_ERROR, EMAIL_INVALID_ERROR, FULLNAME_EMPTY_ERROR } from "constants/validate";
import {
  ERROR_TYPE,
  ROLE_SUPER_ADMIN_ORGANIZATION,
  SUCCESS_TYPE,
  UPDATE_SUCCESS,
} from "constants/app";
import { updateUserApi } from "../../../../layouts/base/users/api";
import { isSuperAdminOrganization } from "../../../../utils/checkRoles";
// @ts-ignore
import avatarDefault from "assets/images/avatar_default.png";

function ViewInformation({
  user,
  handleClose,
  handleClickUpdate,
}: {
  user: User;
  handleClose: any;
  handleClickUpdate: any;
}) {
  const getMyRole = () => {
    if (isSuperAdminOrganization(user)) {
      return ROLE_SUPER_ADMIN_ORGANIZATION;
    }
    return user.roles.map((role) => role.name).join(", ");
  };

  return (
    <FormInfo
      title="Thông tin cá nhân"
      handleClose={handleClose}
      enableUpdate
      handleUpdate={handleClickUpdate}
    >
      <MDBox display="flex" flexDirection="column">
        <MDBox display="flex" justifyContent="center" paddingBottom="41px">
          <MDAvatar
            src={user.avatar ? user.avatar.path : avatarDefault}
            alt={user.fullName}
            size="xxl"
            shadow="md"
          />
        </MDBox>
        <MDBox display="flex" flexDirection="column" lineHeight="28px">
          <MDTypography variant="text" color="text" fontSize="14px">
            Họ và tên: {user.fullName}
          </MDTypography>
          <MDTypography variant="text" color="text" fontSize="14px">
            Email: {user.email}
          </MDTypography>
          <MDTypography variant="text" color="text" fontSize="14px">
            Tổ chức: {user.organization?.name}
          </MDTypography>
          {user.location && (
            <MDTypography variant="text" color="text" fontSize="14px">
              Chi nhánh: {user.location?.name}
            </MDTypography>
          )}
          <MDTypography variant="text" color="text" fontSize="14px">
            Quyền: {getMyRole()}
          </MDTypography>
        </MDBox>
      </MDBox>
    </FormInfo>
  );
}

function UpdateInformation({ user, handleClose }: { user: User; handleClose: any }) {
  // @ts-ignore
  const [, snackbarDispatch] = useSnackbarController();
  // @ts-ignore
  const [controller, dispatch] = useAuthenController();
  const [name, setName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [avatar, setAvatar] = useState<any>(null);
  const [fileData, setFileData] = useState(null);

  const isValid = () => {
    if (name === null || name.trim() === "") {
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
    return true;
  };
  const handleChangeAvatar = (file: any, data: any) => {
    setAvatar(file);
    setFileData(data);
  };
  const handleUpdateInfo = async () => {
    if (user.organization && isValid()) {
      const updateInfoResponse = await updateUserApi({
        token: controller.token,
        userId: user.id,
        file: avatar,
        fullName: name,
        email,
        organizationId: user.organization.id,
        locationId: user.location ? user.location.id : "",
        roles: `[${user.roles.map((role) => `"${role.name}"`).join(",")}]`,
      });

      if (updateInfoResponse.data !== null) {
        showSnackbar(snackbarDispatch, {
          typeSnackbar: SUCCESS_TYPE,
          messageSnackbar: UPDATE_SUCCESS,
        });
        handleClose();
        // Update to local storage
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            token: controller.token,
            user: updateInfoResponse.data,
          })
        );
        // Update to reducer (context Api)
        updateMyInfoSuccess(dispatch, updateInfoResponse.data);
      } else {
        showSnackbar(snackbarDispatch, {
          typeSnackbar: ERROR_TYPE,
          messageSnackbar: updateInfoResponse.messageError,
        });
      }
    }
  };

  return (
    <FormInfo
      title="Cập nhật thông tin cá nhân"
      handleClose={handleClose}
      enableUpdate
      handleUpdate={handleUpdateInfo}
    >
      <MDBox display="flex" flexDirection="column">
        <MDBox display="flex" justifyContent="center" paddingBottom="41px">
          <MDDropzone
            handleOnAbort={() => {}}
            handleOnError={() => {}}
            handleOnLoad={handleChangeAvatar}
          >
            <MDBox position="relative">
              <MDAvatar
                src={avatar === null && user.avatar !== null ? user.avatar.path : fileData}
                alt={name}
                size="xxl"
                shadow="md"
              />
              <Icon
                style={{
                  color: "white",
                  position: "absolute",
                  top: "40%",
                  left: "40%",
                }}
              >
                image
              </Icon>
            </MDBox>
          </MDDropzone>
        </MDBox>
        <MDBox mb={2}>
          <MDInput
            fullWidth
            type="fullname"
            value={name}
            label="Họ và tên"
            onChange={(e: any) => {
              setName(e.target.value);
            }}
          />
        </MDBox>
        <MDBox mb={2}>
          <MDInput
            fullWidth
            value={email}
            type="email"
            label="Email"
            onChange={(e: any) => {
              setEmail(e.target.value);
            }}
          />
        </MDBox>
      </MDBox>
    </FormInfo>
  );
}

function MyProfile({ handleClose, user }: { handleClose: any; user: User }) {
  const [isUpdateForm, setIsUpdateForm] = useState(false);
  const handleClickUpdate = () => {
    setIsUpdateForm(true);
  };

  return !isUpdateForm ? (
    <ViewInformation user={user} handleClose={handleClose} handleClickUpdate={handleClickUpdate} />
  ) : (
    <UpdateInformation user={user} handleClose={handleClose} />
  );
}

export default MyProfile;
