import { ColumnDataType, IField } from "../interfaces/types";

interface CustomizerParams {
  columnToRender: number;
  customizerSubgridName: string;
  overridenColumnType: ColumnDataType;
}

interface DateFormats {
  Date: string;
  DateTime: string;
}

interface DialogSettings {
  DialogTitle: string;
  CountOfColumns: number;
  dialogWidth: number;
}

interface IComponentStyling {
  fieldHoverBackgroundColor: string
  fieldBackgroundColor: string
  dialogBackgroundColor: string
  fieldBorderColor: string
  submitButtonColor: string
  fieldBorderHoverColor: string
  cancelButtonColor: string
  fieldLabelColor: string
  loadingScreenbackgroundColor: string
}

export const fieldsArray: IField[] = [
  {
    key: "fullname",
    fiendlyName: "Full Name",
    fieldType: "Text",
    editable: true,
  },
  // {
  //   key: "parentcustomerid",
  //   fiendlyName: "Account Name",
  //   fieldType: "Customer",
  //   editable: true,
  //   entityLogicalName: "account",
  //   fieldName: "name",
  // },
  {
    key: "description",
    fiendlyName: "Personal Notes",
    fieldType: "LongText",
    editable: true,
  },
  // {
  //   key: "preferredcontactmethodcode",
  //   fiendlyName: "Preferred Contact Method",
  //   fieldType: "OptionSet",
  //   editable: true,
  // },
  // {
  //   key: "createdon",
  //   fiendlyName: "Created On",
  //   fieldType: "Date",
  //   editable: true,
  // },
  // {
  //   key: "dis_checkbox",
  //   fiendlyName: "True False",
  //   fieldType: "Boolean",
  //   editable: true,
  //   booleanLabels: {trueLabel: "Yes sir!", falseLabel: "No way, Hose!"}
  // },
];

export const entityMetadata = {
  entityLogicalName: "contact",
  entityIdPrimaryKeyName: "contactid",
};

export const customizerParams: CustomizerParams = {
  columnToRender: 0,
  customizerSubgridName: "Subgrid_new_1",
  overridenColumnType: "Text",
};

export const dateFormats: DateFormats = {
  Date: "yyyy-MM-dd",
  DateTime: "yyyy-MM-dd HH:mm:ss",
};

export const dialogSettings: DialogSettings = {
  DialogTitle: "Information",
  CountOfColumns: 1,
  dialogWidth: 500,
};

export const componentStyling: IComponentStyling = {
  //fieldHoverBackgroundColor: "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(183, 183, 243, 0.85))",
  fieldHoverBackgroundColor: "trasparent",
  //fieldBackgroundColor: "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(242, 241, 247, 0.85))",
  fieldBackgroundColor: "rgba(232, 230, 241, 0.85)",
  //dialogBackgroundColor: "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgb(180, 220, 255))",
  dialogBackgroundColor: "linear-gradient(90deg, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)",
  loadingScreenbackgroundColor: "linear-gradient(90deg, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)",

  fieldBorderColor: "0px solid transparent",
  submitButtonColor: "rgba(0, 120, 212, 0.8)",
  cancelButtonColor: " #ff5c5c",
  fieldBorderHoverColor: "rgb(15, 108, 189)",
  //fieldLabelColor: "rgb(15, 108, 189)"
  fieldLabelColor: "rgb(0, 0, 0)"
}