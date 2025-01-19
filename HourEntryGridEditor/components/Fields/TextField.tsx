import * as React from "react";
import { TextField } from "@fluentui/react";
import { componentStyling } from "../../configuration/configuration";

type Field = {
  fiendlyName: string;
  key: string;
  editable: boolean;
};

type CustomFluentInputFieldProps = {
  field: Field;
  value?: string;
  handleFieldChange: (key: string, newValue: string | undefined) => void;
};

export const CustomTextField: React.FC<CustomFluentInputFieldProps> = ({
  field,
  value = "",
  handleFieldChange,
}: CustomFluentInputFieldProps) => {
  return (
    <TextField
      label={field.fiendlyName}
      value={value || ""}
      readOnly={!field.editable}
      onChange={(e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => handleFieldChange(field.key, newValue)}
      spellCheck={false}
      borderless
      styles={{
        root: {
          marginBottom: "16px",
        },
        fieldGroup: {
          height: "30px",
          borderRadius: "8px",
          padding: "6px 12px",
          background:
            componentStyling.fieldBackgroundColor,
          border: componentStyling.fieldBorderColor,
          boxShadow: "inset 0 0 0 1px rgba(200, 200, 200, 0.4)",
          transition: "all 0.3s ease",
          selectors: {
            ":focus-within": {
              border: componentStyling.fieldBorderHoverColor,
              borderStyle: "solid",
              boxShadow: "0 0 8px rgba(0, 120, 212, 0.3)",
              outline: "none",
              borderWidth: "1px",
              background: componentStyling.fieldHoverBackgroundColor,
            },
            ":focus": {
              border: "none",
              outline: "none",
            },
            ":hover": {
                border: componentStyling.fieldBorderHoverColor,
                borderWidth: "1px",
                borderStyle: "solid",
                boxShadow: "0 0 8px rgba(0, 120, 212, 0.3)",
                background: componentStyling.fieldHoverBackgroundColor,
            },
          },
        },
        field: {
          fontSize: "14px",
          lineHeight: "32px",
          color: field.editable ? "#000" : "rgba(100, 100, 100, 0.8)",
        },
        wrapper: {
          flexDirection: "column",
          alignItems: "flex-start",
        },
        subComponentStyles: {
          label: {
            root: {
              fontWeight: "600",
              fontSize: "14px",
              color: componentStyling.fieldLabelColor, // Updated label color
              marginBottom: "4px",
            },
          },
        },
      }}
    />
  );
};

