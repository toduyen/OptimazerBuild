import React from 'react';
import { useEffect, useState } from "react";

// react-router-dom components
import { useNavigate } from "react-router-dom";

// Authentication layout components
import BasicLayout from "layouts/base/authentication/components/BasicLayout";

// Images
// @ts-ignore
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { Button } from "@mui/material";
import { signInSuccess, useAuthenController } from "context/authenContext";
import { showSnackbar, useSnackbarController } from "context/snackbarContext";
import {
  ERROR_TYPE,
  LOGIN_SUCCESS,
  MODULE_AREA_RESTRICTION_TYPE,
  MODULE_TIME_KEEPING_TYPE,
  SET_EXPIRY_LOCAL_STORAGE,
  SIGN_IN_LABEL,
  SUCCESS_TYPE,
} from "constants/app";
import FormAddOrUpdate from "components/customizes/Form/FormAddOrUpdate";
import { DASHBOARD_ROUTE, MAIN_ROUTE, RESET_PASSWORD_ROUTE } from "constants/route";
import { signInApi } from "../api";
import {
  hasRoleModule,
  isSuperAdmin,
  isSuperAdminOrganization,
} from "../../../../utils/checkRoles";

function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // @ts-ignore
  const [authController, dispatch] = useAuthenController();
  // @ts-ignore
  const [, snackbarDispatch] = useSnackbarController();
  const navigate = useNavigate();

  const fields = [
    {
      type: "username",
      label: "Tên đăng nhập",
      data: username,
      action: setUsername,
    },
    {
      type: "password",
      label: "Mật khẩu",
      data: password,
      action: setPassword,
    },
  ];

  useEffect(() => {
    if (authController.currentUser != null) {
      if (
        isSuperAdmin(authController.currentUser) ||
        isSuperAdminOrganization(authController.currentUser)
      ) {
        navigate(DASHBOARD_ROUTE);
        navigate(0);
      } else if (
        hasRoleModule(authController.currentUser, MODULE_TIME_KEEPING_TYPE) &&
        !hasRoleModule(authController.currentUser, MODULE_AREA_RESTRICTION_TYPE)
      ) {
        localStorage.setItem("module", MODULE_TIME_KEEPING_TYPE);
        navigate(DASHBOARD_ROUTE);
        navigate(0);
      } else if (
        hasRoleModule(authController.currentUser, MODULE_AREA_RESTRICTION_TYPE) &&
        !hasRoleModule(authController.currentUser, MODULE_TIME_KEEPING_TYPE)
      ) {
        localStorage.setItem("module", MODULE_AREA_RESTRICTION_TYPE);
        navigate(DASHBOARD_ROUTE);
        navigate(0);
      } else {
        navigate(MAIN_ROUTE);
      }
    }
  }, [authController.token]);

  const isValid = () => {
    if (username === null || username.trim() === "") {
      showSnackbar(snackbarDispatch, {
        typeSnackbar: ERROR_TYPE,
        messageSnackbar: "Tên đăng nhập không được để trống",
      });
      return false;
    }
    if (password === null || password.trim() === "") {
      showSnackbar(snackbarDispatch, {
        typeSnackbar: ERROR_TYPE,
        messageSnackbar: "Mật khẩu không được để trống",
      });
      return false;
    }
    return true;
  };

  const handlekeyDown = async (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault();
      await handleSignIn();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handlekeyDown);
    return () => {
      window.removeEventListener("keydown", handlekeyDown);
    };
  }, [handlekeyDown]);

  function setWithExpiry(key: any, ttl: number) {
    const now = new Date();
    // `item` is an object which contains the original value
    // as well as the time when it's supposed to expire
    const item = {
      expiry: now.getTime() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
  }

  const handleSignIn = async () => {
    if (isValid()) {
      const signInResponse = await signInApi({ username, password });
      if (signInResponse.data !== null) {
        // Toast message
        showSnackbar(snackbarDispatch, {
          typeSnackbar: SUCCESS_TYPE,
          messageSnackbar: LOGIN_SUCCESS,
        });

        // Update to local storage
        localStorage.setItem("currentUser", JSON.stringify(signInResponse.data));

        setWithExpiry("timeToLine", SET_EXPIRY_LOCAL_STORAGE);

        // Update to reducer (context Api)
        signInSuccess(dispatch, signInResponse.data);
      } else {
        // Toast error message
        showSnackbar(snackbarDispatch, {
          typeSnackbar: ERROR_TYPE,
          messageSnackbar: "Tên đăng nhập hoặc mật khẩu không đúng",
        });
      }
    }
  };

  const forgetPasswordLink = () => (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div />
      <Button
        size="small"
        onClick={() => {
          navigate(RESET_PASSWORD_ROUTE);
        }}
      >
        Quên mật khẩu?
      </Button>
    </div>
  );

  return (
    <BasicLayout image={bgImage}>
      <FormAddOrUpdate
        title={SIGN_IN_LABEL}
        fields={fields}
        handleAddOrUpdate={handleSignIn}
        actionLabel={SIGN_IN_LABEL}
        visibleCloseButton={false}
      >
        {forgetPasswordLink()}
      </FormAddOrUpdate>
    </BasicLayout>
  );
}

export default SignIn;
