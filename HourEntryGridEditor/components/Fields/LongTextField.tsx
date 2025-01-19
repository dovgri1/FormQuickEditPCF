import * as React from "react";
import { TextField } from "@fluentui/react";
import { componentStyling } from "../../configuration/configuration";

type Field = {
  friendlyName: string;
  key: string;
  editable: boolean;
};

type CustomFluentInputFieldProps = {
  field: Field;
  value?: string;
  handleFieldChange: (key: string, newValue: string | undefined) => void;
};

export const CustomLongTextField: React.FC<CustomFluentInputFieldProps> = ({
  field,
  value = "",
  handleFieldChange,
}: CustomFluentInputFieldProps) => {
  return (
<TextField
  label={field.friendlyName}
  value={value || ""}
  readOnly={!field.editable}
  onChange={(e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => 
    handleFieldChange(field.key, newValue)
  }
  borderless
  multiline
  autoAdjustHeight // Enables dynamic height adjustment
  spellCheck={false}
  styles={{
    root: {
      marginBottom: "16px",
    },
    fieldGroup: {
      padding: "6px 12px",
      borderRadius: "8px",
      background: componentStyling.fieldBackgroundColor,
      border: componentStyling.fieldBorderColor,
      boxShadow: "inset 0 0 0 1px rgba(200, 200, 200, 0.4)",
      transition: "all 0.3s ease",
      selectors: {
        ":focus-within": {
          border: componentStyling.fieldBorderHoverColor,
          borderWidth: "1px",
          borderStyle: "solid",
          boxShadow: "0 0 8px rgba(0, 120, 212, 0.3)",
          outline: "none",
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

