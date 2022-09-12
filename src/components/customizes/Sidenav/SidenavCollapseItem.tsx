import React from "react";
import { styled } from "@mui/material/styles";
import {
  Accordion as MuiAccordion,
  AccordionDetails as MuiAccordionDetails,
  AccordionSummary as MuiAccordionSummary,
} from "@mui/material";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { NavLink } from "react-router-dom";
import SidenavCollapse from "./SidenavCollapse";

const Accordion = styled((props) => (
  // @ts-ignore
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  background: "transparent",
  border: "none",
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
  "&:has(.active)": {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
}));

const AccordionSummary = styled((props: any) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ color: "white" }} />}
    {...props}
  />
))(({ theme }) => ({
  padding: 0,
  backgroundColor: "none",
  flexDirection: "row",
  "& .MuiAccordionSummary-expandIconWrapper": {
    position: "absolute",
    right: "20px",
    color: "white",
    fontSize: "13px",
  },
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    margin: 0,
  },
  "&#panel1a-header-active .MuiBox-root.css-mvs481": {
    opacity: 1,
    background: "rgba(255, 255, 255, 0.2)",
    color: "rgb(255, 255, 255)",
    display: "flex",
    alignItems: "center",
    width: "100%",
    padding: "0.5rem 1rem",
    margin: "0.09375rem 1rem",
    borderRadius: "0.375rem",
    cursor: "pointer",
    userSelect: "none",
    whiteSpace: "nowrap",
    boxShadow:
      "rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem",
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: `0 0 0 ${theme.spacing(2)}`,
  border: "none",
  "& .active .MuiBox-root.css-mvs481": {
    opacity: 1,
    background: "linear-gradient(195deg, #49a3f1, #1A73E8)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    width: "100%",
    padding: "0.5rem 0.625rem",
    margin: "0.09375rem 1rem",
    borderRadius: "0.375rem",
    cursor: "pointer",
    userSelect: "none",
    whiteSpace: "nowrap",
    boxShadow:
      "0rem 0.25rem 0.375rem -0.0625rem rgba(0, 0, 0, 0.1),0rem 0.125rem 0.25rem -0.0625rem rgba(0, 0, 0, 0.06)",
  },
}));

// eslint-disable-next-line react/prop-types
function SidenavCollapseItem({ name, icon, parentKey, collapseName, collapse = [] }: any) {
  return (
    <Accordion>
      <AccordionSummary
        aria-controls="panel1a-content"
        id={`panel1a-header${parentKey === collapseName.toString().split("/")[0] ? "-active" : ""}`}
      >
        <SidenavCollapse name={name} icon={icon} active={parentKey === collapseName} />
      </AccordionSummary>
      <AccordionDetails>
        {collapse.map((item: any) => (
          <NavLink key={item.key} to={item.route}>
            <SidenavCollapse
              name={item.name}
              icon={item.icon}
              active={parentKey === collapseName}
            />
          </NavLink>
        ))}
      </AccordionDetails>
    </Accordion>
  );
}

export default SidenavCollapseItem;
