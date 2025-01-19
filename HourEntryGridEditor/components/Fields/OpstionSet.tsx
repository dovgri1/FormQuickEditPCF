import * as React from "react";
import { ComboBox, IComboBox, IComboBoxOption, IComboBoxStyles } from "@fluentui/react";
import { componentStyling } from "../../configuration/configuration";

interface CustomComboBoxProps {
  label: string;
  selectedKey: number | null;
  options: IComboBoxOption[];
  editable?: boolean;
  onChange: (option: IComboBoxOption) => void;
}

export const OptionSetField: React.FC<CustomComboBoxProps> = ({
  label,
  selectedKey,
  options,
  editable = true,
  onChange,
}) => {
  const comboBoxStyles: Partial<IComboBoxStyles> = {
        root: {
          marginBottom: "16px",
          borderRadius: "8px",
          background:
            componentStyling.fieldBackgroundColor,
          border: componentStyling.fieldBorderColor,
          boxShadow: "inset 0 0 0 1px rgba(200, 200, 200, 0.4)",
          selectors: {
            button: {
              background: "transparent", // Ensure no background by default
              border: "none", // Remove border
              color: "black",
            },
            "button:hover": {
              background: "transparent", // Make chevron button transparent on hover
            },
            "::after": {
              height: "30px",
              content: "''",
              pointerEvents: "none",
              position: "absolute",
              inset: 0,
              borderWidth: 0,
              borderStyle: "solid",
              borderColor: "rgba(200, 200, 200, 0.6)",
              borderRadius: "8px",
            },
            ":hover::after": {
              borderWidth: 0,
            },
            ":hover": {
              borderWidth: 1,
              borderStyle: "solid",
              background: componentStyling.fieldHoverBackgroundColor,
              borderColor: componentStyling.fieldBorderHoverColor,
              boxShadow: "0 0 8px rgba(0, 120, 212, 0.3)",
              borderRadius: "8px",
            },
            ":focus-within::after": {
              borderWidth: 0,
            },
            ":focus-within": {
              borderWidth: 1,
              borderStyle: "solid",
              background: componentStyling.fieldHoverBackgroundColor,
              borderColor: componentStyling.fieldBorderHoverColor,
              boxShadow: "0 0 8px rgba(0, 120, 212, 0.3)",
              borderRadius: "8px",
            },
          },
        },
        label: {
          fontWeight: "600",
          fontSize: "14px",
          color:  componentStyling.fieldLabelColor, // Custom label color
          marginBottom: "4px", // Optional spacing below the label
        },
        container: {
          border: "none",
          borderRadius: "8px",
        },
        input: {
          color: editable ? "rgba(0, 0, 0, 0.87)" : "rgba(100, 100, 100, 0.7)", // Text color for editable and disabled states
          zIndex: 1,
          background: "transparent", // Ensure the background remains transparent
          fontSize: "14px", // Adjust font size for better readability
          selectors: {
            ":focus": {
              outline: "none",
            },
          },
        },

        callout: {
          borderRadius: "8px",
          border: "none",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        },
  };

  return (
    <ComboBox
      label={label}
      selectedKey={selectedKey}
      options={options}
      allowFreeform={false}
      autoComplete="on"
      disabled={!editable}
      onChange={(event, option) => {
        if (option) {
          onChange(option); // Pass the entire IComboBoxOption object
        }
      }}
      styles={comboBoxStyles}
    />
  );
};

