import { Camera } from "models/base/camera";
import MDBox from "components/bases/MDBox";
import MDButton from "components/bases/MDButton";
import Canvas, { POLYGON_SIZE, POLYGON_TYPE } from "react-draw-polygons";
import React, { useEffect, useRef, useState } from "react";
import { Grid } from "@mui/material";
// @ts-ignore
import rectangle from "assets/images/square-outline-xxl.png";
// @ts-ignore
import hexagon from "assets/images/hexagon-outline-xxl.png";
// @ts-ignore
import octxagon from "assets/images/octagon-outline-xxl.png";
import FormUpdateCameraAreaRestriction from "./components/FormUpdateCameraAreaRestriction";
import { WEB_SOCKET_STREAM_URL } from "../../../../constants/api";
import { updatePolygonsCameraApi } from "../api";
import { useAuthenController } from "../../../../context/authenContext";
import { showSnackbar, useSnackbarController } from "../../../../context/snackbarContext";
import { ERROR_TYPE, SUCCESS_TYPE } from "../../../../constants/app";
import { Point, PolygonType } from "../../../../types/polygonType";

function SettingFormCamera({ handleClose, camera }: { handleClose: any; camera: Camera }) {
  const canvasRef = useRef();

  const [width, setWidth] = React.useState(0);
  const [height, setHeight] = React.useState(0);
  // @ts-ignore
  const [authController, authDispatch] = useAuthenController();
  // @ts-ignore
  const [snackbarController, snackbarDispatch] = useSnackbarController();

  useEffect(() => {
    const newWidth = (window.innerWidth * 9) / 12;
    setWidth(newWidth);
    setHeight((newWidth * 9) / 16);
  }, []);

  const handleUpdate = async () => {
    if (authController.token) {
      // @ts-ignore
      const polygons: Array<PolygonType> = canvasRef.current.onConfirm();
      // Camera has 1280*720
      const tmp = polygons.map(
        (polygon: PolygonType) =>
          `[${polygon.polygon.map((point: Point) => {
            const x =
              point.x < 0 ? 0 : point.x > width ? 1280 : Math.round((point.x * 1280) / width);
            const y =
              point.y < 0 ? 0 : point.y > height ? 720 : Math.round((point.y * 720) / height);
            return `[${x},${y}]`;
          })}]`
      );
      const updatePolygonCameraResponse = await updatePolygonsCameraApi({
        token: authController.token,
        id: camera.id,
        polygons: `[${tmp}]`,
      });

      if (updatePolygonCameraResponse.data !== null) {
        showSnackbar(snackbarDispatch, {
          typeSnackbar: SUCCESS_TYPE,
          messageSnackbar: "Cập nhật vùng hạn chế thành công",
        });
        handleClose();
      } else {
        showSnackbar(snackbarDispatch, {
          typeSnackbar: ERROR_TYPE,
          messageSnackbar: updatePolygonCameraResponse.messageError,
        });
      }
    }
  };
  const handleDrawRec = () => {
    // @ts-ignore
    canvasRef.current.onDraw({ type: POLYGON_TYPE.rec, size: POLYGON_SIZE.normal });
  };

  const handleDrawHex = () => {
    // @ts-ignore
    canvasRef.current.onDraw({ type: POLYGON_TYPE.hex, size: POLYGON_SIZE.normal });
  };

  const handleDrawOct = () => {
    // @ts-ignore
    canvasRef.current.onDraw({ type: POLYGON_TYPE.oct, size: POLYGON_SIZE.normal });
  };

  const handleDrawFree = () => {
    // @ts-ignore
    canvasRef.current.toggleDraw();
  };

  return (
    <FormUpdateCameraAreaRestriction
      title="Cập nhật vùng hạn chế"
      handleClose={handleClose}
      handleSaveData={() => handleUpdate()}
    >
      <MDBox style={{maxHeight:"670px"}}>
        <Grid container>
          {width > 0 && (
            <>
              <Grid item xs={10} md={10} lg={10} xl={10}>
                <Canvas ref={canvasRef} canvasHeight={height} canvasWidth={width}>
                  <img
                    src={`${WEB_SOCKET_STREAM_URL}:${camera.taken}/bgr/${camera.id}`}
                    alt={camera.name}
                    width={width}
                    height={height}
                  />
                </Canvas>
              </Grid>

              <Grid item xs={2} md={2} lg={2} xl={2}>
                <MDBox
                  style={{
                    background: "#FFFFFF",
                    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.25)",
                    display: "flex",
                    flexFlow: "column",
                    height: "95%",
                    borderRadius: "12px",
                    justifyContent: "space-around",
                  }}
                >
                  <MDBox style={{ justifyContent: "center", display: "flex" }}>Công cụ</MDBox>
                  <MDButton onClick={handleDrawRec} mt={3}>
                    <img src={rectangle} alt="rectangle" width="60%" />
                  </MDButton>
                  <MDButton onClick={handleDrawHex} mt={3}>
                    <img src={hexagon} alt="hexagon" width="60%" />
                  </MDButton>
                  <MDButton onClick={handleDrawOct}>
                    <img src={octxagon} alt="octxagon" width="60%" />
                  </MDButton>
                  <MDButton onClick={handleDrawFree}>Vẽ tự do</MDButton>
                </MDBox>
              </Grid>
            </>
          )}
        </Grid>
      </MDBox>
    </FormUpdateCameraAreaRestriction>
  );
}

export default SettingFormCamera;
