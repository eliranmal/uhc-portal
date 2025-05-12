import React, { useCallback, useEffect, useState } from 'react';
import { Field, FieldProps, useField } from 'formik';

import {
  FormGroup,
  MenuToggle,
  MenuToggleElement,
  Select,
  SelectList,
  SelectOption,
  SelectProps,
} from '@patternfly/react-core';

import { normalizedProducts } from '~/common/subscriptionTypes';
import { CloudProviderType } from '~/components/clusters/wizards/common/constants';
import { useFormState } from '~/components/clusters/wizards/hooks';
import { FieldId } from '~/components/clusters/wizards/osd/constants';
import { FormGroupHelperText } from '~/components/common/FormGroupHelperText';
import { SubscriptionCommonFieldsCluster_billing_model as SubscriptionCommonFieldsClusterBillingModel } from '~/types/accounts_mgmt.v1';

import './MarketplaceSelectField.scss';

export interface MarketplaceSelectFieldProps {
  hasGcpQuota: boolean;
  hasRhmQuota: boolean;
}

export const MarketplaceSelectField = ({
  hasGcpQuota,
  hasRhmQuota,
}: MarketplaceSelectFieldProps) => {
  const [input] = useField(FieldId.MarketplaceSelection);
  const {
    values: {
      // Selected radio button: standard-trial | standard | marketplace | marketplace-gcp
      [FieldId.BillingModel]: billingModel,
      // Selected marketplace: marketplace | marketplace-gcp
      [FieldId.MarketplaceSelection]: selectedMarketplace,
    },
    setFieldValue,
    setFieldTouched,
    validateField,
  } = useFormState();

  const reset = useCallback(() => {
    setFieldValue(FieldId.MarketplaceSelection, null, false);
  }, [setFieldValue]);

  useEffect(() => {
    // reset if we select a radio button other than the parent radio
    if (!billingModel.startsWith(SubscriptionCommonFieldsClusterBillingModel.marketplace)) {
      reset();
    }
  }, [billingModel, reset]);

  useEffect(() => {
    if (billingModel.startsWith(SubscriptionCommonFieldsClusterBillingModel.marketplace)) {
      validateField(FieldId.MarketplaceSelection);
    }
  }, [billingModel, selectedMarketplace, validateField]);

  const [isOpen, setIsOpen] = useState(false);

  const phLabel = 'Select your marketplace';
  const gcmLabel = 'Google Cloud Marketplace';
  const rhmLabel = 'Red Hat Marketplace';
  const phError = 'A selection is required.';
  const gcmError = 'You do not currently have a Google Cloud Platform subscription.';
  const rhmError = 'You do not currently have a Red Hat Marketplace subscription.';

  const marketplaceOptions = [
    {
      label: phLabel,
      value: 'placeholder',
    },
    {
      label: gcmLabel,
      value: SubscriptionCommonFieldsClusterBillingModel.marketplace_gcp,
      isDisabled: !hasGcpQuota,
      description: !hasGcpQuota ? gcmError : null,
    },
    {
      label: rhmLabel,
      value: SubscriptionCommonFieldsClusterBillingModel.marketplace,
      isDisabled: !hasRhmQuota,
      description: !hasRhmQuota ? rhmError : null,
    },
  ];

  const onToggle = () => {
    setIsOpen(!isOpen);
  };

  const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      onClick={onToggle}
      isExpanded={isOpen}
      isDisabled={!hasGcpQuota && !hasRhmQuota}
      isFullWidth
      className="marketplace-select-menu-toggle"
    >
      {marketplaceOptions.find((option) => option.value === selectedMarketplace)?.label ?? phLabel}
    </MenuToggle>
  );

  const onSelect: SelectProps['onSelect'] = (_event, value) => {
    setFieldTouched(FieldId.MarketplaceSelection, true, false);
    if (!value || value === 'placeholder') {
      reset();
    } else {
      setFieldValue(FieldId.MarketplaceSelection, value, false);

      setFieldValue(
        FieldId.CloudProvider,
        value === SubscriptionCommonFieldsClusterBillingModel.marketplace_gcp
          ? CloudProviderType.Gcp
          : CloudProviderType.Aws,
        false,
      );

      // it's possible the select was used before the parent radio button was selected
      // ensure the parent radio button is selected and the correct values are set
      setFieldValue(FieldId.BillingModel, value, false);
      setFieldValue(FieldId.Byoc, 'true', false);
      setFieldValue(FieldId.Product, normalizedProducts.OSD, false);
    }

    setIsOpen(false);
  };

  const validate = (value: string): string | undefined => {
    if (
      (!value || value === 'placeholder') &&
      billingModel.startsWith(SubscriptionCommonFieldsClusterBillingModel.marketplace)
    ) {
      return phError;
    }
    return undefined;
  };

  return (
    <Field name={FieldId.MarketplaceSelection} validate={validate}>
      {({ field, form, meta }: FieldProps) => (
        <FormGroup {...input} fieldId={field.name} isRequired className="pf-v5-u-mt-sm">
          <Select
            isOpen={isOpen}
            selected={selectedMarketplace}
            toggle={toggle}
            onSelect={onSelect}
            onOpenChange={(isOpen) => setIsOpen(isOpen)}
          >
            <SelectList>
              {marketplaceOptions.map(({ label, value, isDisabled, description }) => (
                <SelectOption
                  value={value}
                  key={value}
                  isDisabled={isDisabled}
                  description={description}
                >
                  {label}
                </SelectOption>
              ))}
            </SelectList>
          </Select>
          <FormGroupHelperText touched={meta.touched} error={meta.error} />
        </FormGroup>
      )}
    </Field>
  );
};
