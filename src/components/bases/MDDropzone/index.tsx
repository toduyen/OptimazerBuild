import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import MDBox from "../MDBox";

function MDDropzone({
  children,
  handleOnAbort,
  handleOnError,
  handleOnLoad,
}: {
  children: React.ReactElement;
  handleOnAbort: Function;
  handleOnError: Function;
  handleOnLoad: (file: any, fileData: any) => void;
}) {
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file: any) => {
      const reader = new FileReader();

      reader.onabort = () => handleOnAbort();
      reader.onerror = () => handleOnError();
      reader.onload = () => {
        const binaryStr = reader.result;
        handleOnLoad(file, binaryStr);
      };
      reader.readAsDataURL(file);
    });
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: false });

  return (
    <MDBox {...getRootProps()} width="fit-content">
      <input {...getInputProps()} />
      {children}
    </MDBox>
  );
}

export default MDDropzone;
