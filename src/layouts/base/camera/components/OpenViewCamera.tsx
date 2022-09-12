import React from 'react';
import MDAvatar from "components/bases/MDAvatar";
import MDBox from "components/bases/MDBox";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
// @ts-ignore
import videoBackground from "assets/images/video_background.jpg";

type Props = {
  handlePlay: (e: any) => void;
  handlePause: Function;
  children?: React.ReactElement;
  imageData?: string | null;
  pause?: Boolean;
  cameraName?: string;
};

function OpenViewCamera({
  handlePlay,
  handlePause,
  children,
  imageData,
  pause,
  cameraName,
}: Props) {
  return (
    <MDBox>
      {children}
      <MDBox
        style={{
          width: "100%",
          aspectRatio: "16/9",
          cursor: "pointer",
          position: "relative",
        }}
        onClick={handlePause}
      >
        {imageData !== null && (
          <img
            src={imageData}
            alt={""}
            width="100%"
            height="100%"
            style={{ borderRadius: "10px", aspectRatio: "16/9" }}
          />
        )}

        {pause && (
          <MDBox style={{ position: "absolute", top: "0", bottom: "0", left: "0", right: "0" }}>
            <MDBox style={{ position: "relative", width: "100%", height: "100%" }}>
              <MDAvatar
                src={videoBackground}
                alt=""
                style={{ borderRadius: "10px", width: "100%", height: "100%" }}
              />
              <PlayCircleOutlineIcon
                style={{
                  position: "absolute",
                  top: "40%",
                  left: "40%",
                  width: "20%",
                  height: "20%",
                  color: "white",
                }}
                onClick={handlePlay}
              />
            </MDBox>
          </MDBox>
        )}

        <MDBox
          style={{
            position: "absolute",
            bottom: "13px",
            left: "45px",
            fontWeight: "700",
            color: "#ffffff",
            fontSize: "26px",
            zIndex: 1000,
            textShadow: "1px 0px 1px #CCCCCC, 0px 1px 1px #EEEEEE, 0px 0px 100px rgba(0,0,0,0.5)",
          }}
        >
          {cameraName}
        </MDBox>
      </MDBox>
    </MDBox>
  );
}
OpenViewCamera.defaultProps = {
  children: <div />,
  handleClose: () => {},
};

export default OpenViewCamera;
