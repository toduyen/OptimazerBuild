import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import MDTypography from "components/bases/MDTypography";
import NotificationMethodItem from "./NotificationMethodItem";
import MDBox from "components/bases/MDBox";
import { NotificationMethod } from "../../../../../models/base/notificationMethod";

export default function AreaRestrictionComponent({
  notificationMethod,
  handleChange,
}: {
  notificationMethod: NotificationMethod;
  handleChange: (newNotificationMethod: NotificationMethod) => void;
}) {
  const [notificationMethodState, setNotificationMethodState] = useState(notificationMethod);

  const handleChangeUseOTT = (isChecked: boolean) => {
    handleChange({
      ...notificationMethod,
      useOTT: isChecked,
    });
  };

  const handleChangeUseEmail = (isChecked: boolean) => {
    handleChange({
      ...notificationMethod,
      useEmail: isChecked,
    });
  };

  const handleChangeScreen = (isChecked: boolean) => {
    handleChange({
      ...notificationMethod,
      useScreen: isChecked,
    });
  };

  const handleChangeRing = (isChecked: boolean) => {
    handleChange({
      ...notificationMethod,
      useRing: isChecked,
    });
  };

  useEffect(() => {
    setNotificationMethodState(notificationMethod);
  }, [notificationMethod]);

  return (
    <MDBox>
      <Grid container mb={1}>
        <MDTypography fontSize={16} fontWeight="medium">
          Hình thức cảnh báo
        </MDTypography>
      </Grid>
      <Grid container mb={3} spacing={1}>
        <NotificationMethodItem
          label="Tin nhắn OTT"
          checked={notificationMethodState.useOTT}
          handleAfterChangeChecked={(isChecked) => handleChangeUseOTT(isChecked)}
        />
        <NotificationMethodItem
          label="Email"
          checked={notificationMethodState.useEmail}
          handleAfterChangeChecked={(isChecked) => handleChangeUseEmail(isChecked)}
        />
        <NotificationMethodItem
          label="Màn hình"
          checked={notificationMethodState.useScreen}
          handleAfterChangeChecked={(isChecked) => handleChangeScreen(isChecked)}
        />
        <NotificationMethodItem
          label="Chuông"
          checked={notificationMethodState.useRing}
          handleAfterChangeChecked={(isChecked) => handleChangeRing(isChecked)}
        />
      </Grid>
    </MDBox>
  );
}
