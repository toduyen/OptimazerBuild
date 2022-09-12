import { AppBar, Box, Tab, Tabs, Typography } from "@mui/material";
import PropTypes from "prop-types";
import HomeIcon from "@mui/icons-material/Home";
import PsychologyTwoToneIcon from "@mui/icons-material/PsychologyTwoTone";
import GroupTwoToneIcon from "@mui/icons-material/GroupTwoTone";
import React from "react";

export function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`a11y-tabpanel-${index}`}
      aria-labelledby={`a11y-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={2}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export function TitleTabs(props: any) {
  const { labelId, onChange, selectionFollowsFocus, value } = props;
  const viewportWidth = document.documentElement.clientWidth;

  return (
    <AppBar position="static">
      <Tabs
        aria-labelledby={labelId}
        onChange={onChange}
        selectionFollowsFocus={selectionFollowsFocus}
        value={value}
      >
        {viewportWidth > 1350 ? (
          <Tab label="Tất cả" aria-controls="a11y-tabpanel-0" id="a11y-tab-0" icon={<HomeIcon />} />
        ) : (
          <Tab label="" aria-controls="a11y-tabpanel-0" id="a11y-tab-0" icon={<HomeIcon />} />
        )}
        <Tab
          label="Người lạ"
          aria-controls="a11y-tabpanel-1"
          id="a11y-tab-1"
          icon={<PsychologyTwoToneIcon />}
        />
        <Tab
          label="Nhân viên"
          aria-controls="a11y-tabpanel-2"
          id="a11y-tab-2"
          icon={<GroupTwoToneIcon />}
        />
      </Tabs>
    </AppBar>
  );
}

TitleTabs.propTypes = {
  labelId: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  selectionFollowsFocus: PropTypes.bool,
  value: PropTypes.number.isRequired,
};
