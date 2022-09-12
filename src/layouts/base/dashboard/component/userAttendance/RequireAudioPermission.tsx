import React from 'react';
import MDBox from "components/bases/MDBox";
import MDTypography from "components/bases/MDTypography";
import { setOpenConfigurator, useMaterialUIController } from "context/materialContext";
import { styled } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import MDButton from "components/bases/MDButton";

const ConfiguratorRoot = styled(Drawer)(
  ({ theme, ownerState }: { theme?: any; ownerState: { openConfigurator: any } }) => {
    const { boxShadows, functions, transitions } = theme;
    const { openConfigurator } = ownerState;

    const configuratorWidth = 420;
    const { lg } = boxShadows;
    const { pxToRem } = functions;

    // drawer styles when openConfigurator={true}
    const drawerOpenStyles = () => ({
      width: configuratorWidth,
      left: `calc(50vw - ${configuratorWidth / 2}px)`,
      right: `calc(50vw - ${configuratorWidth / 2}px)`,
      top: `calc(40vh)`,
      bottom: `calc(40vh)`,
      transition: transitions.create("all", {
        easing: transitions.easing.easeOut,
        duration: transitions.duration.shortest,
      }),
    });

    // drawer styles when openConfigurator={false}
    const drawerCloseStyles = () => ({
      left: "initial",
      right: pxToRem(-350),
      top: pxToRem(-350),
      bottom: "initial",
      transition: transitions.create("all", {
        easing: transitions.easing.sharp,
        duration: transitions.duration.short,
      }),
    });

    return {
      "& .MuiDrawer-paper": {
        height: "180px",
        margin: 0,
        padding: `0 ${pxToRem(10)}`,
        borderRadius: 10,
        boxShadow: lg,
        overflowY: "auto",
        ...(openConfigurator ? drawerOpenStyles() : drawerCloseStyles()),
      },
    };
  }
);

function Configurator({
  handleConfirm,
  handleReject,
}: {
  handleConfirm: Function;
  handleReject: Function;
}) {
  // @ts-ignore
  const [controller, dispatch] = useMaterialUIController();
  const { openConfigurator, darkMode } = controller;

  const handleCloseConfigurator = () => setOpenConfigurator(dispatch, false);

  return (
    <ConfiguratorRoot variant="permanent" ownerState={{ openConfigurator }}>
      <MDBox
        display="flex"
        justifyContent="space-between"
        alignItems="baseline"
        pt={4}
        pb={0.5}
        px={3}
      >
        <MDBox>
          <MDTypography variant="h5">Bật âm thanh cảnh báo</MDTypography>
          <MDTypography
            variant="body2"
            color="text"
            style={{
              wordWrap: "break-word",
              whiteSpace: "pre-wrap",
            }}
          >
            Một số KVHC sử dụng âm thanh để cảnh báo
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox mt={3} px={3} mb={1} display="flex" gap="10px">
        <MDButton
          variant="gradient"
          color="info"
          fullWidth
          onClick={() => {
            handleConfirm();
            handleCloseConfigurator();
          }}
        >
          Xác nhận
        </MDButton>
        <MDButton
          variant="gradient"
          color="error"
          fullWidth
          onClick={() => {
            handleReject();
            handleCloseConfigurator();
          }}
        >
          Từ chối
        </MDButton>
      </MDBox>
    </ConfiguratorRoot>
  );
}

export default Configurator;
