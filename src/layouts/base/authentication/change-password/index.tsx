import React, { useState } from "react";
import { isValidPassword } from "utils/helpers";
import { showSnackbar, useSnackbarController } from "context/snackbarContext";
import {
  CHANGE_PASSWORD_LABEL,
  CHANGE_PASSWORD_SUCCESS,
  ERROR_TYPE,
  SUCCESS_TYPE,
} from "constants/app";
import {
  CONFIRM_PASSWORD_EMPTY_ERROR,
  CONFIRM_PASSWORD_NOT_MATCH_ERROR,
  NEW_PASSWORD_EMPTY_ERROR,
  NEW_PASSWORD_INVALID_ERROR,
  PASSWORD_EMPTY_ERROR,
} from "constants/validate";
// @ts-ignore
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import FormAddOrUpdate from "components/customizes/Form/FormAddOrUpdate";
import { FieldType } from "types/formAddOrUpdateType";
import BasicLayout from "../components/BasicLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import { changePasswordApi } from "../api";
import { SIGN_IN_ROUTE } from "../../../../constants/route";
import { useAuthenController } from "context/authenContext";

function ChangePassword() {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  // @ts-ignore
  const [, snackbarDispatch] = useSnackbarController();
  // @ts-ignore
  const [authController] = useAuthenController();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const fieldNoPasswords: Array<FieldType> = [
    {
      data: newPassword,
      type: "password",
      label: "Mật khẩu mới *",
      action: setNewPassword,
    },
    {
      data: rePassword,
      type: "password",
      label: "Nhập lại mật khẩu *",
      action: setRePassword,
    },
  ];
  const fields: Array<FieldType> = [
    {
      data: password,
      type: "password",
      label: "Mật khẩu cũ *",
      action: setPassword,
    },
    ...fieldNoPasswords,
  ];

  const isValid = () => {
    if (searchParams.get("code") === null && (password === null || password.trim() === "")) {
      showSnackbar(snackbarDispatch, {
        typeSnackbar: ERROR_TYPE,
        messageSnackbar: PASSWORD_EMPTY_ERROR,
      });

      return false;
    }
    if (newPassword === null || newPassword.trim() === "") {
      showSnackbar(snackbarDispatch, {
        typeSnackbar: ERROR_TYPE,
        messageSnackbar: NEW_PASSWORD_EMPTY_ERROR,
      });

      return false;
    }
    if (rePassword === null || rePassword.trim() === "") {
      showSnackbar(snackbarDispatch, {
        typeSnackbar: ERROR_TYPE,
        messageSnackbar: CONFIRM_PASSWORD_EMPTY_ERROR,
      });

      return false;
    }
    if (newPassword !== rePassword) {
      showSnackbar(snackbarDispatch, {
        typeSnackbar: ERROR_TYPE,
        messageSnackbar: CONFIRM_PASSWORD_NOT_MATCH_ERROR,
      });

      return false;
    }
    if (!isValidPassword(newPassword)) {
      showSnackbar(snackbarDispatch, {
        typeSnackbar: ERROR_TYPE,
        messageSnackbar: NEW_PASSWORD_INVALID_ERROR,
      });

      return false;
    }
    return true;
  };
  const handleChangePassword = async () => {
    if (isValid()) {
      let userId = 0;
      let code = "";
      const userIdParam = searchParams.get("user_id");
      const codeParam = searchParams.get("code");
      if (userIdParam !== null) {
        userId = parseInt(userIdParam, 10);
      } else {
        userId = authController.currentUser.id;
      }
      if (codeParam !== null) {
        code = codeParam;
      }
      const changePasswordResponse = await changePasswordApi({
        userId,
        code,
        oldPassword: password,
        newPassword,
      });
      if (changePasswordResponse.data !== null) {
        showSnackbar(snackbarDispatch, {
          typeSnackbar: SUCCESS_TYPE,
          messageSnackbar: CHANGE_PASSWORD_SUCCESS,
        });
        navigate(SIGN_IN_ROUTE);
      } else {
        showSnackbar(snackbarDispatch, {
          typeSnackbar: ERROR_TYPE,
          messageSnackbar: changePasswordResponse.messageError,
        });
      }
    }
  };
  return (
    <BasicLayout image={bgImage}>
      {searchParams.get("code") ? (
        <FormAddOrUpdate
          title="Thay đổi mật khẩu"
          fields={fieldNoPasswords}
          handleAddOrUpdate={handleChangePassword}
          actionLabel={CHANGE_PASSWORD_LABEL}
          visibleCloseButton={false}
        />
      ) : (
        <FormAddOrUpdate
          title="Thay đổi mật khẩu"
          fields={fields}
          handleAddOrUpdate={handleChangePassword}
          actionLabel={CHANGE_PASSWORD_LABEL}
          visibleCloseButton={false}
        />
      )}
    </BasicLayout>
  );
}

export default ChangePassword;
