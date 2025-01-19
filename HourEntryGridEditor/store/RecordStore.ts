import {create} from "zustand"
import { PicklistAttributeMetadata } from "../interfaces/optionSetValue";


export interface EntityRecord {
    [key: string]: any;
    lookupData?: {
        [lookupField: string]: any[];
      };
      optionSetData?: {
        [optionSetField: string]: PicklistAttributeMetadata[]
      }
  }

interface EntityRecordStore {
    record: EntityRecord; // The current entity record
    recordToUpdate: EntityRecord; // The record to be updated
    setRecord: (newRecord: EntityRecord) => void; // Function to update the record
    setRecordToUpdate: (newRecord: EntityRecord) => void; // Function to update the record to be updated

  }

  export const useEntityRecordStore = create<EntityRecordStore>((set) => ({
    record: {}, // Initial record is empty
    recordToUpdate: {}, // Initial record to be updated is empty
    setRecord: (value) => set({ record: value }),
    setRecordToUpdate: (value) => set({ recordToUpdate: value }),
  }));