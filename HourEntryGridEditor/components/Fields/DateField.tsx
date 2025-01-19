import * as React from "react";
import { DatePicker, TextField, mergeStyleSets } from "@fluentui/react";
import { format } from "date-fns";
import CustomDatePicker from "./CalendarField";
import { CustomTextField } from "./TextField";

const styles = mergeStyleSets({
  datePicker: { width: "100%" },
});

interface DateFieldProps {
  label: string;
  value: string;
  editable: boolean;
  onChange: (newValue: string) => void;
  dateFormat: string;
}

export const DateField: React.FC<DateFieldProps> = ({
  label,
  value,
  editable,
  onChange,
  dateFormat,
}) => {
  return editable ? (
    <CustomDatePicker label={label} value={value} onChange={onChange} fieldEditable={true} />

  ) : (
    <CustomTextField field={{
        friendlyName: label,
        key: value,
        editable: false
      }} handleFieldChange={onChange}      
    />
  );
};
