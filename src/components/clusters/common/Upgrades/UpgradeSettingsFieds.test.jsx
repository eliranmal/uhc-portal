import React from 'react';
import { Formik } from 'formik';

import { useFormState } from '~/components/clusters/wizards/hooks';
import { FieldId } from '~/components/clusters/wizards/rosa/constants';
import { render, screen } from '~/testUtils';

import UpgradeSettingsFields from './UpgradeSettingsFields';

jest.mock('~/components/clusters/wizards/hooks', () => ({
  useFormState: jest.fn(),
}));

describe('<UpgradeSettingsFields />', () => {
  const defaultProps = {
    isDisabled: false,
    showDivider: true,
    isRosa: true,
    initialScheduleValue: '',
  };

  beforeEach(() => {
    useFormState.mockReturnValue({
      setFieldValue: jest.fn(),
      setFieldTouched: jest.fn(),
      getFieldProps: jest.fn((fieldName) => ({
        name: fieldName,
        value: '', // Provide default values or mock data here
        onBlur: jest.fn(),
        onChange: jest.fn(),
      })),
      values: {
        [FieldId.UpgradePolicy]: 'manual', // Mock the UpgradePolicy value as needed
      },
    });
  });

  describe('Node draining grace period', () => {
    it('is shown if not hypershift', () => {
      const newProps = {
        ...defaultProps,
        isHypershift: false,
      };
      render(
        <Formik>
          <UpgradeSettingsFields {...newProps} />
        </Formik>,
      );
      expect(screen.getByText('Node draining')).toBeInTheDocument();
    });
    it('is hidden if hypershift', () => {
      const newProps = {
        ...defaultProps,
        isHypershift: true,
      };
      render(
        <Formik>
          <UpgradeSettingsFields {...newProps} />
        </Formik>,
      );
      expect(screen.queryByText('Node draining')).not.toBeInTheDocument();
    });
  });
});
