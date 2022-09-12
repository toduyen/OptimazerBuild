import React, { useEffect, useState } from "react";
import { Camera } from "../../../../../models/base/camera";
import { CAMERA_STARTED_LOCAL_STORAGE, ERROR_TYPE } from "../../../../../constants/app";
import { Grid } from "@mui/material";
import { useAuthenController } from "../../../../../context/authenContext";
import { WEB_SOCKET_STREAM_URL } from "../../../../../constants/api";
import OpenViewCamera from "layouts/base/camera/components/OpenViewCamera";

require("../index.css");

export default function CameraViewItem({
  camera,
  numberInRow,
}: {
  camera: Camera | null;
  numberInRow: number;
}) {
  // @ts-ignore
  const [authController] = useAuthenController();

  const [imageData, setImageData] = useState<string | null>(null);
  const [pause, setPause] = useState(true);

  // @ts-ignore
  useEffect(async () => {
    const listCamera = localStorage.getItem(CAMERA_STARTED_LOCAL_STORAGE);
    if (listCamera !== null && camera) {
      const listCameraArray = JSON.parse(listCamera);

      if (listCameraArray.filter((item: number) => item === camera.id).length > 0) {
        setImageData(`${WEB_SOCKET_STREAM_URL}:${camera.taken}/bgr/${camera.id}`);
        setPause(false);
      } else {
        setImageData(null);
        setPause(true);
      }
    } else {
      setImageData(null);
      setPause(true);
    }
  }, [camera, localStorage.getItem(CAMERA_STARTED_LOCAL_STORAGE)]);

  const handlePlay = async (e: any) => {
    e.stopPropagation();
    setPause(false);
    // Start camera
    if (authController.currentUser !== null && camera !== null) {
      setImageData(`${WEB_SOCKET_STREAM_URL}:${camera.taken}/bgr/${camera.id}`);
      const listCamera = localStorage.getItem(CAMERA_STARTED_LOCAL_STORAGE);
      let listCameraArray = listCamera !== null ? JSON.parse(listCamera) : [];
      listCameraArray = listCameraArray.filter((item: number) => item !== camera.id);
      listCameraArray.push(camera.id);
      localStorage.setItem(CAMERA_STARTED_LOCAL_STORAGE, JSON.stringify(listCameraArray));
    } else {
      setImageData(null);
    }
  };

  const handlePause = () => {
    setPause(true);
    if (camera) {
      const listCamera = localStorage.getItem(CAMERA_STARTED_LOCAL_STORAGE);
      if (listCamera !== null) {
        let listCameraArray = JSON.parse(listCamera);
        listCameraArray = listCameraArray.filter((item: number) => item !== camera.id);
        localStorage.setItem(CAMERA_STARTED_LOCAL_STORAGE, JSON.stringify(listCameraArray));
      }
    }
  };

  return camera !== null ? (
    <Grid
      key={`${camera.name}_${camera.id}`}
      item
      xs={12 / numberInRow}
      md={12 / numberInRow}
      lg={12 / numberInRow}
      style={{ position: "relative" }}
    >
      <OpenViewCamera
        handlePlay={handlePlay}
        handlePause={handlePause}
        pause={pause}
        imageData={imageData}
        cameraName={camera.name}
      />
    </Grid>
  ) : (
    <div />
  );
}
