import MDBox from "../../../../components/bases/MDBox";
import MDButton from "../../../../components/bases/MDButton";
import Icon from "@mui/material/Icon";
import React from "react";
import { Tooltip } from "@mui/material";

export default function ExpandComponent({
  handleOnClick,
  tooltipContent,
}: {
  handleOnClick: Function;
  tooltipContent: string;
}) {
  return (
    <MDBox mr={1}>
      <Tooltip title={tooltipContent}>
        <MDButton variant="text" color="white" onClick={handleOnClick}>
          <Icon>aspect_ratio</Icon>&nbsp;
        </MDButton>
      </Tooltip>
    </MDBox>
  );
}
