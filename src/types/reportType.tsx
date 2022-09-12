import React from "react";

export type FieldType = {
  title: string;
  data: any;
  checked?: any;
  choosedValue?: string | null;
  type: string;
  label: string;
  action: Function;
};

export type ReportType = {
  title: string;
  fields: Array<FieldType>;
  headChildren?: React.ReactElement;
  children?: React.ReactElement;
  baseReportLink: string;
  actionReport: (link: string) => void;
};
