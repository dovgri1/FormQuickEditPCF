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
  columnIconName: string
}


  /**
   * Used to define fields that should be rendered in the dialog. Currently supported fields: Text, LongText, OptionSet, Date, DateTime, Boolean, Customer, Lookup
   * @param key field logical name in the form
   * @param friendlyName field name represented on the form.
   * @param fieldType field type which will be used to render the field. Also requires definition because I was lazy to implement dynamic field rendering.
   * @param editable defines if the field is editable or not.
   * @param entityLogicalName used for Customer and Lookup fields to define the entity logical name that fields are referencing.
   * @param fieldName used in Customer and Lookup fields to define the logical name of the field in that referenced entity. If referenced entity account, then field name of <name> will reference that account's name.
   * @param booleanLabels used in Boolean fields to define custom labels for true and false values. 
   */
export const fieldsArray: IField[] = [
  {
    key: "fullname",
    friendlyName: "Full Name",
    fieldType: "Text",
    editable: true,
  },
  // {
  //   key: "parentcustomerid",
  //   friendlyName: "Account Name",
  //   fieldType: "Customer",
  //   editable: true,
  //   entityLogicalName: "account",
  //   fieldName: "name",
  // },
  {
    key: "description",
    friendlyName: "Personal Notes",
    fieldType: "LongText",
    editable: true,
  },
  // {
  //   key: "preferredcontactmethodcode",
  //   friendlyName: "Preferred Contact Method",
  //   fieldType: "OptionSet",
  //   editable: true,
  // },
  // {
  //   key: "createdon",
  //   friendlyName: "Created On",
  //   fieldType: "Date",
  //   editable: true,
  // },
  {
    key: "dis_checkbox",
    friendlyName: "Trustworthy?",
    fieldType: "Boolean",
    editable: true,
    booleanLabels: {trueLabel: "Yes sir!", falseLabel: "No way, Hose!"}
  },
];

/**
 * @param entityLogicalName logical name of entity that is being used in the form.
 * @param entityIdPrimaryKeyName primary key of that entity.
 */
export const entityMetadata = {
  entityLogicalName: "contact",
  entityIdPrimaryKeyName: "contactid",
};

/**
 * @param columnToRender defines column index that should be rendered with custom renderer.
 * @param customizerSubgridName currently not used, but can be used to define subgrid name that should be refreshed after form data is saved.
 * @param overridenColumnType data type that should be rendered with custom renderer. If Grid column is text, then this should be "Text", customer - "Customer", etc. Reference to ColumnDataType interface for types.
 */
export const customizerParams: CustomizerParams = {
  columnToRender: 0,
  customizerSubgridName: "Subgrid_new_1",
  overridenColumnType: "Text",
};

/**
 * Defines date formats used in the form
 */
export const dateFormats: DateFormats = {
  Date: "yyyy-MM-dd",
  DateTime: "yyyy-MM-dd HH:mm:ss",
};

/**
 * Defines basic dialog settings information
 */
export const dialogSettings: DialogSettings = {
  DialogTitle: "Information",
  CountOfColumns: 1,
  dialogWidth: 500,
};

/**
 * Defines component styling information
 */
export const componentStyling: IComponentStyling = {
  //fieldHoverBackgroundColor: "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(183, 183, 243, 0.85))",
  fieldHoverBackgroundColor: "trasparent",
  //fieldBackgroundColor: "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(242, 241, 247, 0.85))",
  fieldBackgroundColor: "rgba(232, 230, 241, 0.85)",
  //dialogBackgroundColor: "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgb(180, 220, 255))",
  dialogBackgroundColor: "linear-gradient(90deg, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)",
  loadingScreenbackgroundColor: "linear-gradient(90deg, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)",
  columnIconName: "StatusCircleQuestionMark",
  fieldBorderColor: "0px solid transparent",
  submitButtonColor: "rgba(0, 120, 212, 0.8)",
  cancelButtonColor: " #ff5c5c",
  fieldBorderHoverColor: "rgb(15, 108, 189)",
  //fieldLabelColor: "rgb(15, 108, 189)"
  fieldLabelColor: "rgb(0, 0, 0)"
}