export interface PicklistAttributeMetadata {
    "@odata.context": string;
    LogicalName: string;
    MetadataId: string;
    OptionSet: OptionSet;
}

interface OptionSet {
    MetadataId: string;
    Options: Option[];
}

export interface Option {
    Value: number;
    Color: string | null;
    IsManaged: boolean;
    ExternalValue: string | null;
    ParentValues: any[]; // Replace `any` with a more specific type if known
    Tag: string | null;
    IsHidden: boolean;
    MetadataId: string | null;
    HasChanged: boolean | null;
    Label: Label;
    Description: Description;
}

interface Label {
    LocalizedLabels: LocalizedLabel[];
    UserLocalizedLabel: LocalizedLabel | null;
}

interface LocalizedLabel {
    Label: string;
    LanguageCode: number;
    IsManaged: boolean;
    MetadataId: string;
    HasChanged: boolean | null;
}

interface Description {
    LocalizedLabels: LocalizedLabel[];
    UserLocalizedLabel: LocalizedLabel | null;
}