import React, { useCallback } from 'react';
import { get } from 'lodash';

import { NumberInput } from '@patternfly/react-core';

import { subscriptionSettings } from '~/common/subscriptionTypes';
import PopoverHint from '~/components/common/PopoverHint';
import {
  Subscription,
  SubscriptionCommonFieldsSystem_units as SubscriptionCommonFieldsSystemUnits,
} from '~/types/accounts_mgmt.v1';

import { LABEL_ICON_CLASS, MIN_VAL } from '../constants';
import { validateSystemUnitsNumericField } from '../utils';

type CpuSocketNumberFieldProps = {
  minVal: number;
  isDisconnected: boolean;
  subscription: Subscription;
  cpuSocketValue: number;
  cpuSocketLabel: string;
  isDisabled: boolean;
  handleChange: (settingName: string, value: any) => void;
};
const CpuSocketNumberField = ({
  minVal,
  isDisconnected,
  subscription,
  cpuSocketValue,
  cpuSocketLabel,
  isDisabled,
  handleChange,
}: CpuSocketNumberFieldProps) => {
  const handleUnitsNumberDelta = useCallback(
    (delta: number) => {
      const handler = (_: React.MouseEvent, name?: string) => {
        if (name) {
          const value = get(subscription, name);
          const { isValid } = validateSystemUnitsNumericField(subscription, value);
          if (isValid) {
            handleChange(name, parseInt(value + delta, 10));
          } else {
            handleChange(name, MIN_VAL);
          }
        }
      };
      return handler;
    },
    [handleChange, subscription],
  );

  const handleUnitsNumberChange = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      const { name, value: rawValue } = event.target as HTMLInputElement;
      const value = Number(rawValue);

      const { isValid } = validateSystemUnitsNumericField(subscription, value);

      if (isValid) {
        handleChange(name, parseInt(`${value}`, 10));
      } else {
        handleChange(name, rawValue);
      }
    },
    [handleChange, subscription],
  );

  return isDisconnected ? (
    <NumberInput
      value={cpuSocketValue}
      min={minVal}
      inputName={
        subscription.system_units === SubscriptionCommonFieldsSystemUnits.Sockets
          ? subscriptionSettings.SOCKET_TOTAL
          : subscriptionSettings.CPU_TOTAL
      }
      isDisabled={isDisabled}
      onMinus={handleUnitsNumberDelta(-1)}
      onPlus={handleUnitsNumberDelta(1)}
      onChange={handleUnitsNumberChange}
      inputAriaLabel={
        subscription.system_units === SubscriptionCommonFieldsSystemUnits.Sockets
          ? 'Number of sockets (excluding control plane nodes)'
          : 'Number of compute cores (excluding control plane nodes)'
      }
      minusBtnAriaLabel="decrement the number by 1"
      plusBtnAriaLabel="increment the number by 1"
      widthChars={5}
    />
  ) : (
    <>
      <span id="cpu-socket-value">{`${cpuSocketValue} ${cpuSocketLabel}`}</span>
      <PopoverHint
        id="cpu-socket-value-hint"
        hint="This data is gathered directly from the telemetry metrics submitted by the cluster and cannot be changed."
        iconClassName={LABEL_ICON_CLASS}
        hasAutoWidth
        maxWidth="30.0rem"
      />
    </>
  );
};

export default CpuSocketNumberField;
