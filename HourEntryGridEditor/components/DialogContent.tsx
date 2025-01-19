import * as React from "react";
import { IField } from "../interfaces/types";
import {
  Shimmer,
  Stack,
  ShimmerElementType,
  TextField,
  Checkbox,
  ComboBox,
  IComboBoxOption,
} from "@fluentui/react";
import { dateFormats, dialogSettings } from "../configuration/configuration";
import { format } from "date-fns";
import { useEntityRecordStore } from "../store/RecordStore";
import {
  PicklistAttributeMetadata,
  Option,
} from "../interfaces/optionSetValue";
import { LookupField } from "./Fields/LookupField";
import { DateField } from "./Fields/DateField";
import { CustomTextField } from "./Fields/TextField";
import { CustomLongTextField } from "./Fields/LongTextField";
import { OptionSetField } from "./Fields/OpstionSet";
import { CustomCheckbox } from "./Fields/CustomCheckBox";

interface IDialogContextProps {
  fieldsArray: IField[];
  record: ComponentFramework.WebApi.Entity;
}

export const DialogContext: React.FC<IDialogContextProps> = (props) => {
  const isLoading = Object.keys(props.record).length === 0;
  const dateTimeFormat = dateFormats.DateTime;
  const dateOnlyFormat = dateFormats.Date;

  const setRecord = useEntityRecordStore((state) => state.setRecord);
  const setRecordToUpdate = useEntityRecordStore(
    (state) => state.setRecordToUpdate
  );
  const storeUpdateRecord = useEntityRecordStore(
    (state) => state.recordToUpdate
  );
  const storeRecord = useEntityRecordStore((state) => state.record);

  const columnPercentage = 100 / dialogSettings.CountOfColumns;
  const flexBasis = `calc(${columnPercentage}% - 16px)`; // Subtract gap for spacing

  const handleFieldChange = (key: string, value: any, type?: string) => {
    let newValue = value;
    let newKey = key;
    let record = { ...storeRecord, [key]: value };

    if (type === "Customer" || type === "Lookup") {
      const lookupOption = storeRecord.lookupData?.[key]?.find(
        (item) => item.id === value
      );
      newValue = "/" + lookupOption?.pluralName + "(" + value + ")";
      newKey =
        type === "Customer"
          ? lookupOption?.schemaName.toLowerCase()
          : lookupOption?.schemaName;
      newKey =
        newKey +
        (type === "Customer" ? "_" + lookupOption?.entityLogicalName : "") +
        "@odata.bind";

      record = {
        ...storeRecord,
        [key]: {
          entityLogicalName: lookupOption?.entityLogicalName,
          id: value,
          name: lookupOption?.displayName,
        },
      };
    }

    if (type === "OptionSet") {
      const optionSetValues =
        storeRecord.optionSetData?.[key]?.[0]?.OptionSet?.Options || [];
      const selectedOption = optionSetValues.find(
        (item) => item?.Value === value
      );
      newValue = selectedOption?.Value;
      const newLabel = selectedOption?.Label.UserLocalizedLabel?.Label;

      record = {
        ...storeRecord,
        [key]: newLabel,
      };
    }

    let updateRecord = { ...storeUpdateRecord, [newKey]: newValue };
    updateRecord = { ...updateRecord };
    setRecord(record);
    setRecordToUpdate(updateRecord);
  };

  const renderField = (field: IField) => {
    const value = storeRecord[field.key];

    const optionSetValuesMetadata =
      (storeRecord.optionSetData?.[
        field.key
      ]?.[0] as PicklistAttributeMetadata) ?? null;
    const optionSetValues = optionSetValuesMetadata?.OptionSet?.Options ?? [];
    const selectedOption = optionSetValues.find(
      (item) => item?.Label?.UserLocalizedLabel?.Label === value
    );

    switch (field.fieldType) {
      case "Text":
        return (
          <CustomTextField
            field={{
              fiendlyName: field.fiendlyName,
              key: field.key,
              editable: true,
            }}
            handleFieldChange={handleFieldChange}
            value={value?.toString() || ""}
          />
        );

      case "OptionSet":
        return (
          <OptionSetField
            label={field.fiendlyName}
            selectedKey={selectedOption?.Value || null}
            options={
              optionSetValues.map((item: Option) => ({
                key: item.Value,
                text: item.Label.UserLocalizedLabel?.Label || "Unnamed",
              })) || []
            }
            onChange={(option: IComboBoxOption) => {
              if (option) {
                handleFieldChange(field.key, option.key, field.fieldType); // Use option.key here
              }
            }}
          />
        );

      case "Number":
        return (
          <CustomTextField
            field={{
              fiendlyName: field.fiendlyName,
              key: field.key,
              editable: true,
            }}
            handleFieldChange={handleFieldChange}
            value={value?.toString() || ""}
          />
        );

      case "Date":
        return (
          <DateField
            label={field.fiendlyName}
            value={value}
            editable={field.editable}
            onChange={(newValue) => handleFieldChange(field.key, newValue)}
            dateFormat={dateOnlyFormat}
          />
        );

      case "DateTime":
        return (
          <TextField
            underlined
            label={field.fiendlyName}
            value={value ? format(new Date(value), dateTimeFormat) : ""}
            readOnly={!field.editable}
            onChange={(e, newValue) => handleFieldChange(field.key, newValue)}
          />
        );

      case "Boolean":
        return (
          <OptionSetField
            label={field.fiendlyName}
            selectedKey={value == true ? 1 : 0} // Initial value
            options={[
              { key: 1, text: field.booleanLabels?.trueLabel != undefined ? field.booleanLabels?.trueLabel : "Yes", }, // Option for true
              { key: 0, text: field.booleanLabels?.falseLabel != undefined ? field.booleanLabels?.falseLabel : "No" }, // Option for false
            ]}
            onChange={(option: IComboBoxOption) => {
              if (option) {
                const newValue = option.key == 0 ? false : true;
                handleFieldChange(field.key, newValue, field.fieldType); // Use option.key here
              }
            }}
          />
        );

      case "LongText":
        return (
          <CustomLongTextField
            field={{
              fiendlyName: field.fiendlyName,
              key: field.key,
              editable: true,
            }}
            handleFieldChange={handleFieldChange}
            value={value?.toString() || ""}
          />
        );

      case "Lookup":
      case "Customer":
        return (
          <LookupField
            field={field}
            value={value}
            editable={field.editable}
            onChange={handleFieldChange}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Stack
      horizontal
      wrap
      tokens={{ childrenGap: 16 }}
      style={{
        display: "flex",
        flexWrap: "wrap",
        maxHeight: "500px",
        overflowY: "auto",
        overflowX: "hidden",
        width: `${dialogSettings.dialogWidth}px`,
        maxWidth: "100%",
      }}
    >
      {isLoading
        ? props.fieldsArray.map((field) => (
            <Stack key={field.key} style={{ flexBasis, marginBottom: "16px" }}>
              <Shimmer
                shimmerElements={[
                  { type: ShimmerElementType.line, width: "100%", height: 20 },
                  { type: ShimmerElementType.gap, width: 10 },
                  { type: ShimmerElementType.line, width: "100%", height: 20 },
                ]}
                isDataLoaded={false}
              />
            </Stack>
          ))
        : props.fieldsArray.map((field) => (
            <Stack
              key={field.key}
              style={{
                flexBasis,
                marginBottom: "16px",
                justifyContent: "center",
                justifyItems: "center",
              }}
            >
              {renderField(field)}
            </Stack>
          ))}
    </Stack>
  );
};
