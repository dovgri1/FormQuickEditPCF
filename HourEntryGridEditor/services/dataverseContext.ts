import { IField } from "../interfaces/types";
import { IInputs } from "../generated/ManifestTypes";
import { PicklistAttributeMetadata } from "../interfaces/optionSetValue";

export let _context: ComponentFramework.Context<IInputs>;
export let _notyfyOutputChanged: () => void;

export const setContext = (context: ComponentFramework.Context<IInputs>, notifyMethod: () => void) => {
  _context = context;
  _notyfyOutputChanged = notifyMethod;
};

export interface RawRecord {
  [key: string]: any;
}

interface IEntityMetadata {
  schemaName: string;
  pluralName: string;
}

export interface ILookupData {
  pluralName: string;
  schemaName: string;
  entityArray: any[];
}

export interface ILookupObject {
  entityLogicalName: string;
  pluralName: string;
  schemaName: string;
  id: string;
  displayName: string;
}

declare let Xrm: any;

export interface TransformedRecord {
  [key: string]: any;
  lookupData?: {
    [lookupField: string]: {
      entityLogicalName: string;
      id: string;
      displayName: string;
    }[];
  };
  optionSetData?: {
    [optionSetField: string]: PicklistAttributeMetadata[];
  };
}

export const getEntityRecord = async (entityName: string, recordId: string, columns: IField[]): Promise<TransformedRecord> => {
  const newColumns = columns.map((column) => ({
    ...column,
    key: column.fieldType === "Lookup" || column.fieldType === "Customer" ? "_" + column.key + "_value" : column.key,
  }));
  const selectQuery = `$select=${newColumns.map((column) => column.key).join(",")}`;
  const options = `?${selectQuery}`;

  const rawRecord: RawRecord = await _context.webAPI.retrieveRecord(entityName, recordId, options);

  const transformedRecord: TransformedRecord = {
    lookupData: {},
    optionSetData: {},
  };

  for (const [key, value] of Object.entries(rawRecord)) {
    const field = newColumns.find((column) => column.key === key);
    const fieldType = field?.fieldType || "";

    switch (fieldType) {
      case "Lookup":
      case "Customer":
        if (field === undefined) continue;
        const { baseKey, fieldSchemaName, lookupEntityName } = getLookupMetadata(field, key);
        transformedRecord.lookupData![key.replace("_value", "").replace("_", "")] = await fetchLookupRecords(lookupEntityName, entityName, fieldSchemaName || "", field?.fieldName || "", 250);   
        transformedRecord[baseKey] = transformedRecord.lookupData?.[baseKey].find((item: any) => item.id === value) || {};
        if(transformedRecord[baseKey].displayName === undefined && value !== null) {
          const lookupRecord = await fetchLookUpRecord(lookupEntityName, field?.fieldName || "", value, entityName, baseKey);
          transformedRecord[baseKey] = lookupRecord
          transformedRecord.lookupData![key.replace("_value", "").replace("_", "")].push(lookupRecord);
        }
        break;

      case "OptionSet":
        const response: PicklistAttributeMetadata = await fetchOptionSetValues(entityName, key);
        transformedRecord.optionSetData![key] = [response];
        transformedRecord[key] = rawRecord[key + "@OData.Community.Display.V1.FormattedValue"];
        break;

      case "Date":
      case "DateTime":
        transformedRecord[key] = new Date(value);
        break;

      default:
        transformedRecord[key] = value;
        break;
    }
  }

  return transformedRecord;
};

const getLookupMetadata = (field: IField, key: string) => {
  const baseKey = key.replace("_value", "").replace("_", "");
  const fieldSchemaName = key.replace("_value", "").replace("_", "");
  const lookupEntityName = field?.entityLogicalName || key.replace("_value", "");

  return { baseKey, fieldSchemaName, lookupEntityName };
};

export const fetchLookUpRecord = async (entityName: string, displayNameField: string, recordId: string, currentEntityName : string, field: string ): Promise<ILookupObject> => {
  const rawRecord: RawRecord = await _context.webAPI.retrieveRecord(entityName, recordId);
  const metadata: IEntityMetadata = await fetchEntityMetadata(currentEntityName, field);
  const lookupObject: ILookupObject = {
    entityLogicalName: entityName,
    pluralName: metadata.pluralName,
    schemaName: metadata.schemaName,
    id: rawRecord[entityName + "id"] || "",
    displayName: rawRecord[displayNameField]
  };

  return lookupObject;
}

export const saveEntityRecord = async (entityName: string, recordId: string, record: TransformedRecord): Promise<void> => {
  await _context.webAPI.updateRecord(entityName, recordId, record);
};

const fetchLookupRecords = async (targetEntityName: string, currentEntityName: string, field: string, nameField: string, top: number): Promise<ILookupObject[]> => {
  try {
    const metadata: IEntityMetadata = await fetchEntityMetadata(currentEntityName, field);
    const queryOptions = `?$top=${top}`;
    const response = await _context.webAPI.retrieveMultipleRecords(targetEntityName, queryOptions);

    const lookupData: ILookupObject[] = response.entities.map((record) => ({
      entityLogicalName: targetEntityName,
      pluralName: metadata.pluralName,
      schemaName: metadata.schemaName,
      id: record[`${targetEntityName}id`] || "",
      displayName: record[nameField] ? record[nameField] : "",
    }));

    return lookupData || {};
  } catch (error) {
    console.error(`Error fetching lookup records for ${targetEntityName}:`, error);
    throw error;
  }
};

export const fetchFilteredLookupRecords = async (
  targetEntityName: string,
  currentEntityName: string,
  field: string,
  top: number,
  filterFieldName: string,
  filter: string
): Promise<ILookupObject[]> => {
  try {
    const metadata: IEntityMetadata = await fetchEntityMetadata(currentEntityName, field);
    const filterString = `contains(${filterFieldName}, '${filter}')` || "";
    const queryOptions = `?$top=${top}&$filter=${filterString}`;
    const lookupEntityIdKeyLogicalName = (targetEntityName + "id") as string;
    const response = await _context.webAPI.retrieveMultipleRecords(targetEntityName, queryOptions);

    const lookupObject: ILookupObject[] = response.entities.map((record) => ({
      entityLogicalName: targetEntityName,
      pluralName: metadata.pluralName,
      schemaName: metadata.schemaName,
      id: record[lookupEntityIdKeyLogicalName] || "",
      displayName: record[filterFieldName] ? record[filterFieldName] : "",
    }));

    return lookupObject;
  } catch (error) {
    console.error(`Error fetching lookup records for ${targetEntityName}:`, error);
    throw error;
  }
};

const fetchOptionSetValues = async (entityName: string, field: string): Promise<PicklistAttributeMetadata> => {
  const clientUrl = Xrm.Utility.getGlobalContext().getClientUrl();
  const url = `${clientUrl}/api/data/v9.2/EntityDefinitions(LogicalName='${entityName}')/Attributes(LogicalName='${field}')/Microsoft.Dynamics.CRM.PicklistAttributeMetadata?$select=LogicalName&$expand=OptionSet($select=Options)`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "OData-MaxVersion": "4.0",
        "OData-Version": "4.0",
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/json",
        Prefer: "odata.include-annotations=*",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const result = await response.json();
    console.log(result);

    const optionSetValues = result;
    console.log(`Schema Name: ${optionSetValues}`);

    return optionSetValues;
  } catch (error) {
    console.error(`Failed to fetch attribute schema name: ${(error as Error).message}`);
    const emptyResponse = {} as PicklistAttributeMetadata;
    return emptyResponse;
  }
};

export const fetchEntityMetadata = async (entityName: string, field: string): Promise<IEntityMetadata> => {
  const metadata = await Xrm.Utility.getEntityMetadata(entityName);
  const schemaName = await fetchAttributeSchemaName(entityName, field);
  return { pluralName: metadata.EntitySetName, schemaName: schemaName };
};

const fetchAttributeSchemaName = async (entityName: string, fieldLogicalName: string): Promise<string> => {
  const clientUrl = Xrm.Utility.getGlobalContext().getClientUrl();
  const apiEndpoint = `${clientUrl}/api/data/v9.2/EntityDefinitions(LogicalName='${entityName}')/Attributes(LogicalName='${fieldLogicalName}')?$select=SchemaName`;

  try {
    const response = await fetch(apiEndpoint, {
      method: "GET",
      headers: {
        "OData-MaxVersion": "4.0",
        "OData-Version": "4.0",
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/json",
        Prefer: "odata.include-annotations=*",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const result = await response.json();
    console.log(result);

    // Process result
    const schemaName = result.SchemaName;
    console.log(`Schema Name: ${schemaName}`);

    return schemaName;
  } catch (error) {
    console.error(`Failed to fetch attribute schema name: ${(error as Error).message}`);
    return "";
  }
};
