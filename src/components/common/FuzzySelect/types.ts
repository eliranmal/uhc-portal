export type FuzzyEntryType = {
  groupId?: string;
  entryId: string;
  label: string;
  description?: string;
  disabled?: boolean;
};
export type FuzzyEntryGroup = Record<string, FuzzyEntryType[]>;
export type FuzzyDataType = FuzzyEntryType[] | FuzzyEntryGroup;
