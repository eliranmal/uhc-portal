import React from 'react';

import { Popover, SelectOption } from '@patternfly/react-core';

import { FuzzyEntryType } from '~/components/common/FuzzySelect/types';

export interface FuzzySelectOptionProps {
  entry: FuzzyEntryType;
  displayLabel: React.ReactElement | string;
  nonTruncatedLabel?: string;
  isPopover?: boolean;
}

export const FuzzySelectOption: React.FC<FuzzySelectOptionProps> = (props) => {
  const { entry, displayLabel, nonTruncatedLabel, isPopover } = props;

  return (
    <SelectOption
      key={entry.entryId}
      id={entry.entryId}
      value={entry.entryId}
      description={entry.description}
      isDisabled={entry.disabled}
    >
      {isPopover ? (
        <Popover
          triggerAction="hover"
          aria-label="Hoverable popover"
          bodyContent={<div>{nonTruncatedLabel}</div>}
        >
          <span>{displayLabel}</span>
        </Popover>
      ) : (
        <span>{displayLabel}</span>
      )}
    </SelectOption>
  );
};
