import AvatarUser from "components/customizes/AvatarUser";
import FormAddOrUpdate from "components/customizes/Form/FormAddOrUpdate";
import { ADD_SUCCESS, CREATE_LABEL, ERROR_TYPE, SUCCESS_TYPE } from "constants/app";
import { useState } from "react";
import { showSnackbar, useSnackbarController } from "context/snackbarContext";
import {
  FULLNAME_EMPTY_ERROR,
  PHONE_EMPTY_ERROR,
  PHONE_INVALID_ERROR,
  EMAIL_EMPTY_ERROR,
  EMAIL_INVALID_ERROR,
} from "constants/validate";
import { isValidPhone, isValidEmail } from "utils/helpers";
import { getAddGuestApi } from "../../api";
import { useAuthenController } from "context/authenContext";
import { useNotificationHistoryController } from "context/notificationHistoryContext";
import { addGuestSuccess } from "context/guestContext";

export function FormAddGuest({ handleClose }: { handleClose: Function }) {
  // const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // @ts-ignore
  const [, snackbarDispatch] = useSnackbarController();

  // @ts-ignore
  const [authController, dispatch] = useAuthenController();

  // @ts-ignore
  const [notificationHistoryController] = useNotificationHistoryController();

  const fields = [
    {
      data: name,
      type: "text",
      label: "Họ và tên *",
      action: setName,
    },
    {
      data: phone,
      type: "text",
      label: "Số điện thoại *",
      action: setPhone,
    },
    {
      data: email,
      type: "text",
      label: "Email *",
      action: setEmail,
    },
  ];

  const isValid = () => {
    if (name === null || name.trim() === "") {
      showSnackbar(snackbarDispatch, {
        typeSnackbar: ERROR_TYPE,
        messageSnackbar: FULLNAME_EMPTY_ERROR,
      });

      return false;
    }
    if (phone === null || phone.trim() === "") {
      showSnackbar(snackbarDispatch, {
        typeSnackbar: ERROR_TYPE,
        messageSnackbar: PHONE_EMPTY_ERROR,
      });

      return false;
    }
    if (!isValidPhone(phone)) {
      showSnackbar(snackbarDispatch, {
        typeSnackbar: ERROR_TYPE,
        messageSnackbar: PHONE_INVALID_ERROR,
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

  const handleCreateGuest = async () => {
    if (isValid()) {
      const addGuestResponse = await getAddGuestApi({
        token: authController.token,
        avatar: notificationHistoryController.userAttendanceChoosed.image,
        name,
        phone,
        email,
      });

      if (addGuestResponse.data) {
        showSnackbar(snackbarDispatch, {
          typeSnackbar: SUCCESS_TYPE,
          messageSnackbar: ADD_SUCCESS,
        });
        handleClose();
        addGuestSuccess(dispatch, addGuestResponse.data);
      } else {
        showSnackbar(snackbarDispatch, {
          typeSnackbar: ERROR_TYPE,
          messageSnackbar: addGuestResponse.messageError,
        });
      }
    }
  };

  return (
    <FormAddOrUpdate
      title="Thêm khách"
      fields={fields}
      handleAddOrUpdate={handleCreateGuest}
      actionLabel={CREATE_LABEL}
      visibleCloseButton
      handleClose={(e: any) => {
        e.stopPropagation();
        handleClose();
      }}
      headChildren={
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingBottom: "0.8em",
          }}
        >
          <img
            src={notificationHistoryController.userAttendanceChoosed.image}
            style={{ borderRadius: "50%", width: "25%" }}
          />
        </div>
      }
    />
  );
}
