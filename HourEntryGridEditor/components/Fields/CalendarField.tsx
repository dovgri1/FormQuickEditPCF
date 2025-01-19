import * as React from "react";
import {
  TextField,
  Calendar,
  Callout,
  IconButton,
  ITextFieldStyles,
  ICalloutProps,
  ICalendarStyles,
  Icon,
} from "@fluentui/react";
import { componentStyling } from "../../configuration/configuration";

interface CustomDatePickerProps {
  label: string;
  value?: string; // ISO date string
  onChange: (date: string) => void;
  fieldEditable: boolean;
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  label,
  value,
  onChange,
  fieldEditable,
}) => {
  const [isCalendarVisible, setCalendarVisible] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(
    value ? new Date(value) : null
  );
  const [textFieldValue, setTextFieldValue] = React.useState<string>(
    value ? new Date(value).toLocaleDateString() : ""
  );

  const onDateSelect = (date: Date | null): void => {
    if (date) {
      setSelectedDate(date);
      const isoDate = date.toISOString();
      setTextFieldValue(date.toLocaleDateString());
      setCalendarVisible(false);
      onChange(isoDate);
    }
  };

  const toggleCalendar = (): void => {
    setCalendarVisible(!isCalendarVisible);
  };

  const onTextChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ): void => {
    if (newValue) {
      setTextFieldValue(newValue);
      const parsedDate = new Date(newValue);
      if (!isNaN(parsedDate.getTime())) {
        setSelectedDate(parsedDate);
        onChange(parsedDate.toISOString());
      }
    }
  };

  const textFieldStyles: Partial<ITextFieldStyles> = {
    root: {
      marginBottom: "16px",
    },
    fieldGroup: {
      height: "30px",
      borderRadius: "8px",
      padding: "6px 12px",
      cursor: "pointer",
      background:
        componentStyling.fieldBackgroundColor,
      border: componentStyling.fieldBorderColor,
      boxShadow: "inset 0 0 0 1px rgba(200, 200, 200, 0.4)",
      transition: "all 0.3s ease",
      selectors: {
        cursor: "pointer",
        ":focus-within": {
          border: componentStyling.fieldBorderHoverColor,
          borderWidth: "1px",

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
          boxShadow: "0 0 8px rgba(0, 120, 212, 0.3)",
          background: componentStyling.fieldHoverBackgroundColor,
        },
        ":focus-within::after": {
          borderWidth: 0,
        },
      },
    },
    field: {
      fontSize: "14px",
      lineHeight: "32px",
      color: fieldEditable ? "#000" : "rgba(100, 100, 100, 0.8)",
      cursor: "pointer",
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
    suffix: {
      background: "transparent",
    },
  };

  const calloutStyles: ICalloutProps["styles"] = {
    root: {
      borderRadius: "8px",
      border: componentStyling.fieldBorderColor,
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
  };

  const calendarStyles: Partial<ICalendarStyles> = {
    root: {
      borderRadius: "8px",
    },
  };

  return (
    <div style={{ position: "relative" }}>
      <TextField
        label={label}
        value={textFieldValue}
        onClick={toggleCalendar} // Make the entire TextField clickable
        readOnly // Prevent text editing, making the field non-interactive for typing
        placeholder="Select a date"
        styles={textFieldStyles}
        onRenderSuffix={() => (
          <Icon
            iconName="Calendar"
            onClick={toggleCalendar}
            styles={{
              root: {
                zIndex: 1,
                background: "transparent",
                backgroundColor: "transparent",
                border: "none",
                color: "rgba(100, 100, 100, 0.8)", // Default color
                fontSize: "16px", // Adjust icon size
                selectors: {
                  ":hover": {
                    color: "rgba(0, 120, 212, 0.8)", // Change icon color on hover
                  },
                },
              },
              
            }}
          />
        )}
      />

      {isCalendarVisible && (
        <Callout
          target={`.ms-TextField`}
          onDismiss={() => setCalendarVisible(false)}
          setInitialFocus
          styles={calloutStyles}
        >
          <Calendar
            onSelectDate={onDateSelect}
            value={selectedDate || undefined}
            styles={calendarStyles}
          />
        </Callout>
      )}
    </div>
  );
};

export default CustomDatePicker;
