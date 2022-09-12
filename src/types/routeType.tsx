import React from "react";
import { ReactElementLike, ReactNodeArray } from "prop-types";
import { To } from "react-router-dom";

export type RouteType = {
  type?: string;
  name: string;
  icon: string | number | boolean | ReactElementLike | ReactNodeArray;
  title?: string;
  noCollapse?: boolean;
  key: string;
  href?: string;
  route: To;
  collapse?: Array<{
    name: string;
    key: string;
    icon: string | number | boolean | {} | ReactElementLike | ReactNodeArray;
    route: string;
    component: React.ReactElement;
  }>;
  roles?: Array<string>;
  component?: React.ReactElement;
};
