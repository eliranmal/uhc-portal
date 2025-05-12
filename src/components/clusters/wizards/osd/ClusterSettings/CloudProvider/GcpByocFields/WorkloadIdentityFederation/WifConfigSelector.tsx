import React, { useCallback, useMemo, useState } from 'react';

import { Button, Flex, FlexItem, FormGroup } from '@patternfly/react-core';

import { FormGroupHelperText } from '~/components/common/FormGroupHelperText';
import { FuzzySelect, FuzzySelectProps } from '~/components/common/FuzzySelect/FuzzySelect';
import { WifConfig } from '~/types/clusters_mgmt.v1';

interface WifConfigSelectorProps {
  wifConfigs: WifConfig[];
  selectedWifConfigID?: string;
  input: {
    name: string;
    value?: string;
    onChange?: any;
  };
  meta: {
    touched?: boolean;
    error?: string;
  };
  isLoading?: boolean;
  onRefresh: () => void;
}

const WifConfigSelector = (props: WifConfigSelectorProps) => {
  const {
    wifConfigs,
    selectedWifConfigID,
    input: { name, onChange },
    meta: { error, touched },
    isLoading,
    onRefresh,
  } = props;
  const [isOpen, setIsOpen] = useState(false);

  const selectOptions = wifConfigs.map((wifConfig) => ({
    entryId: wifConfig.id as string,
    label: wifConfig.display_name as string,
    description: wifConfig.id as string,
  }));

  const onToggle = useCallback(
    (toggleOpenValue: boolean | ((prevState: boolean) => boolean)) => setIsOpen(toggleOpenValue),
    [],
  );

  const onSelect: FuzzySelectProps['onSelect'] = (_, selection) => {
    setIsOpen(false);
    onChange(selection);
  };

  const hasWifConfigs = wifConfigs.length > 0;

  const placeholder = useMemo(() => {
    switch (true) {
      case isLoading:
        return 'Loading';
      case !isLoading && !hasWifConfigs:
        return 'No WIF configurations found';
      default:
        return 'Select a configuration';
    }
  }, [hasWifConfigs, isLoading]);

  return (
    <FormGroup label="WIF configuration" isRequired>
      <Flex>
        <FlexItem grow={{ default: 'grow' }}>
          <FuzzySelect
            isOpen={isOpen}
            selectionData={selectOptions}
            selectedEntryId={hasWifConfigs ? selectedWifConfigID ?? '' : ''}
            onOpenChange={onToggle}
            onSelect={onSelect}
            toggleId={name}
            popperProps={{
              appendTo: document.body,
            }}
            placeholderText={placeholder}
            isDisabled={isLoading || !hasWifConfigs}
            validated={touched && error ? 'danger' : undefined}
            inlineFilterPlaceholderText="Filter by name / ID"
          />
        </FlexItem>
        <FlexItem>
          <Button
            size="sm"
            variant="secondary"
            isDisabled={isLoading}
            isLoading={isLoading}
            onClick={() => {
              onRefresh();
            }}
          >
            {isLoading ? 'Loading' : 'Refresh'}
          </Button>
        </FlexItem>
      </Flex>
      <FormGroupHelperText touched={touched} error={error} />
    </FormGroup>
  );
};

export { WifConfigSelector };
