// Not used

import * as React from "react";
import { TextField, ITextFieldProps, ITextFieldStyles } from "@fluentui/react";
import { componentStyling } from "../../configuration/configuration";

interface CustomCheckboxProps
  extends Omit<ITextFieldProps, "value" | "onClick"> {
  label: string;
  isChecked: boolean; // Use a custom prop to represent the boolean value
  editable?: boolean;
  onClick: (newValue: boolean) => void; // Callback triggered on click to toggle value
}

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  label,
  isChecked,
  editable = true,
  onClick,
  ...restProps
}) => {
  // Dynamic styles based on the isChecked value
  const [checked, setChecked] = React.useState<boolean>(isChecked);
  const textFieldStyles: Partial<ITextFieldStyles> = {
    fieldGroup: {
      height: "30px",
      borderRadius: "8px",
      padding: "6px 12px",
      border: componentStyling.fieldBorderColor,
      background: isChecked
        ? "linear-gradient(135deg, rgba(200, 255, 218, 0.9), rgba(150, 255, 150, 0.85))" // Light red gradient for true
        : "linear-gradient(135deg, rgba(255, 200, 200, 0.9), rgba(255, 150, 150, 0.85))", // Light green gradient for false
      boxShadow: "inset 0 0 0 1px rgba(200, 200, 200, 0.4)",
      transition: "all 0.3s ease",
      selectors: {
            ":focus-within": {
              border: componentStyling.fieldBorderColor,
              boxShadow: "0 0 8px rgba(0, 120, 212, 0.3)",
              outline: "none",
            },
            ":focus": {
                border: "none",
                outline: "none",
              },
        ":hover": {
          border: componentStyling.fieldBorderColor,
          boxShadow: "0 0 8px rgba(0, 120, 212, 0.3)",
        },
      },
    },
    field: {
      textAlign: "center", // Center the value
      fontWeight: 800,
      fontSize: "12px",
      color: editable ? "#000" : "rgba(100, 100, 100, 0.7)", // Text color for editable or disabled states
      background: "transparent", // Ensure no additional background
      cursor: editable ? "pointer" : "default", // Pointer cursor for clickable
      selectors: {
        ":focus": {
          outline: "none", // Remove focus outline
        },
      },
    },
    root: {
      marginBottom: "16px",
    },
  };

  // Handle click to toggle value
  const handleClick = () => {
    if (editable) {
      setChecked(!isChecked);
      onClick(!isChecked); // Toggle the value and call the onClick handler
    }
  };

  return (
    <TextField
      label={label}
      value={checked ? "True" : "False"} // Display "True" or "False" based on isChecked
      readOnly // Prevent manual text input
      onClick={handleClick} // Handle click to toggle value
      styles={textFieldStyles}
      {...restProps}
    />
  );
};
