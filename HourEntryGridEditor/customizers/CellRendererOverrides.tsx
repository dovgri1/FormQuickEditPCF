import {
  IconButton,
  IDialogContentProps,
  mergeStyles,
  PrimaryButton,
} from "@fluentui/react";
import * as React from "react";
import {
  CellRendererOverrides,
  CellRendererProps,
  GetRendererParams,
  RECID,
} from "../interfaces/types";
import { Dialog, DialogFooter, DialogType } from "@fluentui/react";
import { useState } from "react";
import {
  _context,
  getEntityRecord,
  saveEntityRecord,
  _notyfyOutputChanged,
} from "../services/dataverseContext";
import { DialogContext } from "../components/DialogContent";
import {
  componentStyling,
  customizerParams,
  dialogSettings,
  entityMetadata,
  fieldsArray,
} from "../configuration/configuration";
import { EntityRecord, useEntityRecordStore } from "../store/RecordStore";
import { LoadingScreen } from "../components/LoadingScreen";
import { ITextCellRenderer } from "../interfaces/types";

declare let Xrm: any;

export const cellRendererOverrides: CellRendererOverrides = {
  [customizerParams.overridenColumnType]: (
    props: CellRendererProps,
    col: GetRendererParams
  ) => {
    const params: ITextCellRenderer = { props, col };
    if (col.columnIndex === customizerParams.columnToRender) {
      return <TextCellRenderer {...params} />;
    }
  },
};

const TextCellRenderer: React.FC<ITextCellRenderer> = ({ props, col }) => {
  const [hideDialog, setHideDialog] = useState(true);
  const [record, setRecord] = useState<ComponentFramework.WebApi.Entity>({});
  const setStoreRecord = useEntityRecordStore((state) => state.setRecord);
  const storeUpdateRecord = useEntityRecordStore(
    (state) => state.recordToUpdate
  );
  const storeRecord = useEntityRecordStore((state) => state.record);
  const [showLoadingSpinner, setShowLoadgingSpinner] = useState<boolean>(false);

  const onDismiss = () => {
    setHideDialog(true);
  };

  const saveEntity = async () => {
    showHideLoadingScreen(true);
    await saveEntityRecord(
      entityMetadata.entityLogicalName,
      storeRecord[entityMetadata.entityIdPrimaryKeyName],
      storeUpdateRecord
    );
    showHideLoadingScreen(false);
  };

  const showHideLoadingScreen = (value: boolean) => {
    setShowLoadgingSpinner(value);
  };

  const dialogContentProps: IDialogContentProps = {
    type: DialogType.normal,
    title: dialogSettings.DialogTitle,
    closeButtonAriaLabel: "Close",
    styles: {},
  };

  const getRecord = async () => {
    const record: ComponentFramework.WebApi.Entity = await getEntityRecord(
      entityMetadata.entityLogicalName,
      col.rowData?.[RECID] ?? "",
      fieldsArray
    );
    setRecord(record);
    const storeRecord: EntityRecord = {};
    fieldsArray.forEach((field) => {
      storeRecord[entityMetadata.entityIdPrimaryKeyName] =
        record[entityMetadata.entityIdPrimaryKeyName];
      storeRecord[field.key] = record[field.key];
      storeRecord.lookupData = record.lookupData;
      storeRecord.optionSetData = record.optionSetData;
    });
    setStoreRecord(storeRecord);
  };

  const circularButtonStyle = mergeStyles({
    borderRadius: "50%",
    padding: "7px",
    cursor: "pointer",
    width: "30px",
    height: "30px",
    backgroundColor: "#f3f2f1",
    border: "1px solid #e1dfdd",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <IconButton
        iconProps={{ iconName: "StatusCircleQuestionMark" }}
        className={circularButtonStyle}
        onClick={() => {
          console.log("Icon clicked");
          setHideDialog(false);
          getRecord();
        }}
        aria-label="Click to perform action"
      />
      <Dialog
        hidden={hideDialog}
        onDismiss={onDismiss}
        dialogContentProps={dialogContentProps}
        modalProps={{
          isBlocking: false,

          styles: {
            root: {
              background: "rgba(255, 255, 255, 0.7)",
              backdropFilter: "blur(2px)",
              borderRadius: "12px",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
            },
            main: {
              background: componentStyling.dialogBackgroundColor,
              backdropFilter: "blur(2px)",
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
              overflow: "hidden",
              padding: "0",
            },
          },
        }}
        maxWidth={1000}
        minWidth={300}
      >
        <div style={{ position: "relative" }}>
          {showLoadingSpinner && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 1000,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <LoadingScreen message="Saving records..." />
            </div>
          )}
          <DialogContext fieldsArray={fieldsArray} record={record} />
        </div>
        <DialogFooter
          styles={{
            actions: {
              display: "flex",
              width: dialogSettings.dialogWidth,
              justifyContent: "space-between", // Space out buttons evenly
              alignItems: "center", // Vertically center buttons
            },
          }}
        >
          <PrimaryButton
            onClick={onDismiss}
            text="Close"
            styles={{
              root: {
                background: componentStyling.cancelButtonColor,
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "8px 16px",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)", // Subtle button shadow
              },
            }}
          />
          <PrimaryButton
            onClick={saveEntity}
            text="Update Record"
            styles={{
              root: {
                background: componentStyling.submitButtonColor,
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "8px 16px",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)", // Subtle button shadow
              },
            }}
          />
        </DialogFooter>
      </Dialog>
    </div>
  );
};
