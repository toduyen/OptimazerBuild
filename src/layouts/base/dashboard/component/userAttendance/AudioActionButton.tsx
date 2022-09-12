import { Fab } from "react-tiny-fab";
import "react-tiny-fab/dist/styles.css";

import React, { useEffect, useState } from "react";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import {
  updateStatusAudio,
  useNotificationHistoryController,
} from "../../../../../context/notificationHistoryContext";

function AudioActionButton() {
  const [enableAudio, setEnableAudio] = useState(true);

  // @ts-ignore
  const [notificationHistoryController, notificationHistoryDispatch] =
    useNotificationHistoryController();

  useEffect(() => {
    if (notificationHistoryController.isAudioOn) {
      setEnableAudio(true);
    } else {
      setEnableAudio(false);
    }
  }, [notificationHistoryController.isAudioOn]);
  return (
    <div>
      <Fab
        mainButtonStyles={{
          backgroundColor: "#1976d2",
        }}
        style={{
          top: -20,
          right: -20,
        }}
        icon={enableAudio ? <VolumeUpIcon /> : <VolumeOffIcon />}
        event="click"
        key={-1}
        alwaysShowTitle={false}
        onClick={() => {
          const newState = !enableAudio;
          updateStatusAudio(notificationHistoryDispatch, newState);
        }}
        text={enableAudio ? "Tắt âm thanh" : "Bật âm thanh"}
      />
    </div>
  );
}

export default AudioActionButton;
