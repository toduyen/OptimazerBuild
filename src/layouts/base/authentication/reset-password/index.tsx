// @mui material components
// Material Dashboard 2 React components

// Images
// @ts-ignore
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormAddOrUpdate from "components/customizes/Form/FormAddOrUpdate";
import { showSnackbar, useSnackbarController } from "context/snackbarContext";
import { ERROR_TYPE, SUCCESS_TYPE } from "constants/app";
import { EMAIL_EMPTY_ERROR, EMAIL_INVALID_ERROR, SEND_EMAIL_SUCCESS } from "constants/validate";
import { isValidEmail } from "utils/helpers";
import { SIGN_IN_ROUTE } from "constants/route";
import BasicLayout from "../components/BasicLayout";
import { resetPasswordApi } from "../api";
import { Button } from "@mui/material";

function ResetPassword() {
  const [email, setEmail] = useState("");
  // @ts-ignore
  const [, snackbarDispatch] = useSnackbarController();
  const navigate = useNavigate();

  const isValid = () => {
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
  const handleResetPassword = async () => {
    if (isValid()) {
      // To do send email

      const resetPasswordResponse = await resetPasswordApi({ email });
      if (resetPasswordResponse.data) {
        showSnackbar(snackbarDispatch, {
          typeSnackbar: SUCCESS_TYPE,
          messageSnackbar: SEND_EMAIL_SUCCESS,
        });
        navigate(SIGN_IN_ROUTE);
      } else {
        showSnackbar(snackbarDispatch, {
          typeSnackbar: ERROR_TYPE,
          messageSnackbar: resetPasswordResponse.messageError,
        });
      }
    }
  };

  const fields = [
    {
      type: "email",
      label: "Email",
      data: email,
      action: setEmail,
    },
  ];

  const signInLink = () => (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div />
      <Button
        size="small"
        onClick={() => {
          navigate(SIGN_IN_ROUTE);
        }}
      >
        Quay lại đăng nhập
      </Button>
    </div>
  );

  return (
    <BasicLayout image={bgImage}>
      <FormAddOrUpdate
        handleAddOrUpdate={handleResetPassword}
        fields={fields}
        actionLabel="Reset"
        title="Reset Password"
        visibleCloseButton={false}
      >
        {signInLink()}
      </FormAddOrUpdate>
    </BasicLayout>
  );
}

export default ResetPassword;
