// PersistentStorageDropdown shows a selection of storage options
// for setting on the installed a cluster.

import React from 'react';

import { FormSelect, FormSelectOption, Spinner, Tooltip } from '@patternfly/react-core';

import { useFetchStorageQuotaValues } from '~/queries/ClusterActionsQueries/useFetchStorageQuotaValues';
import { useFetchOrganizationAndQuota } from '~/queries/common/useFetchOrganizationAndQuota';

import { noQuotaTooltip } from '../../../../common/helpers';
import { humanizeValueWithUnitGiB } from '../../../../common/units';
import ErrorBox from '../../../common/ErrorBox';
import { QuotaTypes } from '../quotaModel';
import { availableQuota } from '../quotaSelectors';

import { filterPersistentStorageValuesByQuota } from './PersistentStorageDropDownHelper';

type PersistentStorageDropdownProps = {
  input: any;
  disabled: boolean;
  currentValue: any;
  billingModel: any;
  product: string;
  cloudProviderID: string;
  isBYOC: boolean;
  isMultiAZ: boolean;
  region: string;
};

const PersistentStorageDropdown = ({
  input,
  disabled,
  currentValue,
  billingModel,
  product,
  cloudProviderID,
  isBYOC,
  isMultiAZ,
  region,
}: PersistentStorageDropdownProps) => {
  const {
    data: persistentStorageValues,
    isFetched: persistentStorageIsFetched,
    isError: persistentStorageIsError,
    error: persistentStorageError,
  } = useFetchStorageQuotaValues(region);

  const {
    quota: quotaList,
    isError: quotaIsError,
    error: quotaError,
    isFetched: quotaFetched,
  } = useFetchOrganizationAndQuota();

  // Set up options for storage values
  const storageOption = (value: any) => {
    // value is a tuple of {value, unit}
    const valueWithUnit = humanizeValueWithUnitGiB(value.value);
    const strValue = value.value.toString();
    // Values passed in the select are *always* in bytes, but we display them
    // in a humanize form.

    return (
      <FormSelectOption
        key={strValue}
        value={strValue}
        label={`${valueWithUnit.value} ${valueWithUnit.unit}`}
      />
    );
  };

  if (persistentStorageIsFetched && !persistentStorageIsError && quotaFetched && !quotaIsError) {
    const storageQuota = availableQuota(quotaList, {
      resourceType: QuotaTypes.STORAGE,
      billingModel,
      product,
      cloudProviderID,
      isBYOC,
      // @ts-ignore
      isMultiAZ,
      resourceName: 'gp2',
    });

    const filteredStorageValues = filterPersistentStorageValuesByQuota(
      currentValue,
      persistentStorageValues,
      storageQuota,
    );
    const notEnoughQuota = filteredStorageValues.values.length <= 1;
    const isDisabled = disabled || notEnoughQuota;

    const { onChange, ...restInput } = input;
    const formSelect = (
      <FormSelect
        className="quota-dropdown"
        aria-label="Persistent Storage"
        isDisabled={isDisabled}
        onChange={(_event, value) => onChange(value)}
        {...restInput}
      >
        {filteredStorageValues.values.sort((a, b) => a.value - b.value).map(storageOption)}
      </FormSelect>
    );

    if (notEnoughQuota) {
      return (
        <Tooltip content={noQuotaTooltip} position="right">
          <div>{formSelect}</div>
        </Tooltip>
      );
    }
    return formSelect;
  }

  return persistentStorageIsError || quotaIsError ? (
    <ErrorBox
      message="Error loading persistent storage list"
      response={persistentStorageError || quotaError || {}}
    />
  ) : (
    <>
      <div className="spinner-fit-container">
        <Spinner size="lg" aria-label="Loading..." />
      </div>
      <div className="spinner-loading-text">Loading persistent storage list...</div>
    </>
  );
};

export default PersistentStorageDropdown;
