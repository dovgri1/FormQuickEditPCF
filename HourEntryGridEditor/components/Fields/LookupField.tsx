import * as React from "react";
import { ComboBox } from "@fluentui/react";
import { debounce } from "lodash";
import { fetchFilteredLookupRecords } from "../../services/dataverseContext";
import { IField } from "../../interfaces/types";
import { useEntityRecordStore } from "../../store/RecordStore";
import {
  componentStyling,
  entityMetadata,
} from "../../configuration/configuration";

interface ILookupFieldProps {
  field: IField;
  value: any;
  editable: boolean;
  onChange: (key: string, value: any, fieldType: string) => void;
}

export const LookupField: React.FC<ILookupFieldProps> = ({
  field,
  value,
  editable,
  onChange,
}) => {
  const storeRecord = useEntityRecordStore((state) => state.record);
  const setRecord = useEntityRecordStore((state) => state.setRecord);
  const [dynamicOptions, setDynamicOptions] = React.useState<
    { key: string; text: string }[]
  >([]);

  const initializeDynamicOptions = React.useCallback(() => {
    const lookupData = storeRecord.lookupData?.[field.key];
    if (lookupData) {
      const options = lookupData.map((record: any) => ({
        key: record.id,
        text: record.displayName || "Unnamed",
      }));
      setDynamicOptions(options);
    } else {
      setDynamicOptions([]);
    }
  }, [storeRecord, field.key]);

  React.useEffect(() => {
    initializeDynamicOptions();
  }, [initializeDynamicOptions]);

  const handleSearch = React.useMemo(
    () =>
      debounce(async (query: string) => {
        if (!query || query.length < 2) {
          setDynamicOptions([]); // Clear results for short queries
          return;
        }

        try {
          const lookupEntityLogicalName = field.entityLogicalName || "";
          const currentEntityLogicalName = entityMetadata.entityLogicalName; // Replace with actual entity logical name
          const lookupFieldLogicalName = field.key || "";
          const lookupEntitySearchFieldName = field.fieldName || "";

          const fetchedRecords = await fetchFilteredLookupRecords(
            lookupEntityLogicalName,
            currentEntityLogicalName,
            lookupFieldLogicalName,
            50,
            lookupEntitySearchFieldName,
            query
          );

          const updatedRecord = {
            ...storeRecord,
            [lookupEntityLogicalName]:
              fetchedRecords.length > 0 ? fetchedRecords[0] : [],
            lookupData: {
              ...storeRecord.lookupData,
              [lookupFieldLogicalName]: fetchedRecords,
            },
          };

          const options = fetchedRecords.map((record: any) => ({
            key: record.id,
            text: record.displayName || "Unnamed",
          }));

          setRecord(updatedRecord);
          setDynamicOptions(options);
        } catch (error) {
          console.error("Error fetching records:", error);
        }
      }, 500),
    [field, storeRecord]
  );

  return (
    <ComboBox
      label={field.friendlyName}
      selectedKey={value?.id || null}
      options={dynamicOptions}
      allowFreeform={true}
      autoComplete="on"
      disabled={!editable}
      onChange={(event, option) => {
        if (option) {
          onChange(field.key, option.key, field.fieldType);
        }
      }}
      onInputValueChange={(query) => {
        handleSearch(query);
      }}
      styles={{
        root: {
          marginBottom: "16px",
          borderRadius: "8px",
          background: componentStyling.fieldBackgroundColor,
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
        // Apply custom label styling
        label: {
          fontWeight: "600",
          fontSize: "14px",
          color:  componentStyling.fieldLabelColor, // Custom label color
          marginBottom: "4px", // Optional spacing below the label
        },
      }}
    />
  );
};
