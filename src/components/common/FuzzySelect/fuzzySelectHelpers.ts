import { FuzzyEntryGroup, FuzzyEntryType } from '~/components/common/FuzzySelect/types';

export const isFuzzyEntryGroup = (value: any): value is FuzzyEntryGroup =>
  typeof value === 'object' &&
  value !== null &&
  !Array.isArray(value) &&
  Object.values(value).every((arr) => Array.isArray(arr));

export const findGroupedItemById = (
  selectOptions: FuzzyEntryGroup,
  entryId: string,
): FuzzyEntryType | undefined => {
  let foundItem: FuzzyEntryType | undefined;
  Object.values(selectOptions).some((entries) => {
    foundItem = entries.find((entry) => entry.entryId === entryId);
    return foundItem !== undefined;
  });
  return foundItem;
};
