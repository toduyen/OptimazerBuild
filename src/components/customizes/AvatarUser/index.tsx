import { Metadata } from "../../../models/base/metadata";
import { useState } from "react";
import MDBox from "../../bases/MDBox";
import MDDropzone from "../../bases/MDDropzone";
import MDAvatar from "../../bases/MDAvatar";
import { Icon } from "@mui/material";
// @ts-ignore
import avatarDefault from "assets/images/avatar_default.png";

export default function AvatarUser({
  avatar,
  handleFile,
}: {
  avatar: Metadata | null;
  handleFile: (file: any) => void;
}) {
  const [fileData, setFileData] = useState(null);
  const handleChangeFile = (file: any, data: any) => {
    handleFile(file);
    setFileData(data);
  };
  return (
    <MDBox display="flex" justifyContent="center" paddingBottom="41px">
      <MDDropzone handleOnAbort={() => {}} handleOnError={() => {}} handleOnLoad={handleChangeFile}>
        <MDBox position="relative">
          <MDAvatar
            src={fileData == null ? (avatar !== null ? avatar.path : avatarDefault) : fileData}
            alt=""
            size="xxl"
            shadow="md"
          />
          <Icon
            style={{
              color: "white",
              position: "absolute",
              top: "40%",
              left: "40%",
            }}
          >
            image
          </Icon>
        </MDBox>
      </MDDropzone>
    </MDBox>
  );
}
