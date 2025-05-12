// LoadBalancersDropdown shows a selection of load balancer
// options for setting on the installed a cluster.

import React from 'react';

import { FormSelect, FormSelectOption, Spinner, Tooltip } from '@patternfly/react-core';

import { useFetchLoadBalancerQuotaValues } from '~/queries/ClusterActionsQueries/useFetchLoadBalancerQuotaValues';
import { useFetchOrganizationAndQuota } from '~/queries/common/useFetchOrganizationAndQuota';

import { noQuotaTooltip } from '../../../../common/helpers';
import ErrorBox from '../../../common/ErrorBox';
import { QuotaTypes } from '../quotaModel';
import { availableQuota } from '../quotaSelectors';

import { filterLoadBalancerValuesByQuota } from './LoadBalancersDropdownHelper';

type LoadBalancersDropdownProps = {
  input: any;
  disabled: boolean;
  currentValue: string;
  billingModel: any;
  product: string;
  cloudProviderID: string;
  isBYOC: boolean;
  isMultiAZ: boolean;
  region: string;
};

const LoadBalancersDropdown = ({
  input,
  disabled,
  currentValue,
  billingModel,
  product,
  cloudProviderID,
  isBYOC,
  isMultiAZ,
  region,
}: LoadBalancersDropdownProps) => {
  const {
    data: loadBalancerValues,
    isError: loadBalancerValuesIsError,
    error: loadBalancerValuesError,
  } = useFetchLoadBalancerQuotaValues(region);

  const {
    quota: quotaList,
    isError: quotaListIsError,
    error: quotaListError,
  } = useFetchOrganizationAndQuota();

  const loadBalancerOption = (value: any) => (
    <FormSelectOption key={value} value={value} label={value} />
  );

  if (loadBalancerValues && !loadBalancerValuesIsError && quotaList && !quotaListError) {
    const query = {
      resourceType: QuotaTypes.LOAD_BALANCER,
      billingModel,
      product,
      cloudProviderID,
      isBYOC,
      isMultiAZ,
    };
    // @ts-ignore
    const quota = availableQuota(quotaList, query);

    const filteredValues = filterLoadBalancerValuesByQuota(currentValue, loadBalancerValues, quota);
    const notEnoughQuota = filteredValues.values.length <= 1;
    const isDisabled = disabled || notEnoughQuota;
    const { onChange, ...restInput } = input;
    const formSelect = (
      <FormSelect
        className="quota-dropdown"
        aria-label="Load Balancers"
        isDisabled={isDisabled}
        onChange={(_event, value) => onChange(value)}
        {...restInput}
      >
        {filteredValues.values.map((value: any) => loadBalancerOption(value.toString()))}
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

  return loadBalancerValuesIsError || quotaListIsError ? (
    <ErrorBox
      message="Error loading load balancers list"
      response={loadBalancerValuesError || {}}
    />
  ) : (
    <>
      <div className="spinner-fit-container">
        <Spinner size="lg" aria-label="Loading..." />
      </div>
      <div className="spinner-loading-text">Loading load balancers list...</div>
    </>
  );
};

export default LoadBalancersDropdown;
