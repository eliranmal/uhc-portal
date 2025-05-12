import React from 'react';
import * as formik from 'formik';
import { Formik } from 'formik';

import { FieldId } from '~/components/clusters/wizards/common/constants';
import * as utils from '~/components/clusters/wizards/form/utils';
import { checkAccessibility, screen, waitFor, withState } from '~/testUtils';

import MachinePoolSubnetsForm from '../MachinePoolSubnetsForm';

import { repeatedSubnets } from './MachinePoolSubnetsForm.fixtures';

describe('<MachinePoolSubnetsForm />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const defaultProps = {
    selectedVPC: {
      name: 'test-123abc-vpc',
      aws_subnets: [
        {
          availability_zone: 'us-east-2a',
          cidr_block: '10.0.0.0/19',
          name: 'subnet-03df6fb9d7677c84c',
          public: false,
          red_hat_managed: false,
          subnet_id: 'subnet-03df6fb9d7677c84c',
        },
      ],
    },
  };

  describe('it is accessible', () => {
    it('no content', async () => {
      // Act
      const { container } = withState({}).render(
        <Formik
          initialValues={{
            [FieldId.MachinePoolsSubnets]: [],
          }}
          onSubmit={() => {}}
        >
          <MachinePoolSubnetsForm {...defaultProps} />
        </Formik>,
      );

      // Assert
      await checkAccessibility(container);
    });

    it('with content', async () => {
      // Act
      const { container } = withState({}).render(
        <Formik
          initialValues={{
            [FieldId.MachinePoolsSubnets]: repeatedSubnets,
          }}
          onSubmit={() => {}}
        >
          <MachinePoolSubnetsForm {...defaultProps} />
        </Formik>,
      );

      // Assert
      await waitFor(() => checkAccessibility(container));
    });
  });

  describe('check validation', () => {
    it('changes machine pools subnets on removal', async () => {
      // Arrange
      const setNestedObjectValuesSpy = jest.spyOn(formik, 'setNestedObjectValues');
      const getScrollErrorIdsSpy = jest.spyOn(utils, 'getScrollErrorIds');
      const expectedErrors = [
        {
          machinePoolsSubnets: [
            undefined,
            {
              privateSubnetId: 'Every machine pool must be associated to a different subnet',
            },
            {
              privateSubnetId: 'Every machine pool must be associated to a different subnet',
            },
          ],
        },
        {
          machinePoolsSubnets: [
            undefined,
            {
              privateSubnetId: 'Subnet is required',
            },
            {
              privateSubnetId: 'Subnet is required',
            },
          ],
        },
      ];

      const { user } = withState({}).render(
        <Formik
          initialValues={{
            [FieldId.MachinePoolsSubnets]: repeatedSubnets,
          }}
          onSubmit={() => {}}
        >
          <MachinePoolSubnetsForm {...defaultProps} />
        </Formik>,
      );

      expect(screen.getByText('subnet-03df6fb9d7677c84c')).toBeInTheDocument();

      // Act
      await user.click(screen.getByTestId('remove-machine-pool-2'));
      await user.click(screen.getAllByLabelText('Remove machine pool')[0]);

      // Assert
      expect(setNestedObjectValuesSpy).toHaveBeenCalledTimes(4);
      expect(setNestedObjectValuesSpy).toHaveBeenCalledWith(expectedErrors[0], true);
      expect(setNestedObjectValuesSpy).toHaveBeenCalledWith(expectedErrors[1], true);

      expect(screen.queryByText('subnet-03df6fb9d7677c84c')).toBe(null);

      expect(getScrollErrorIdsSpy).toHaveBeenCalledTimes(4);
      expect(getScrollErrorIdsSpy).toHaveBeenCalledWith(expectedErrors[0]);
      expect(getScrollErrorIdsSpy).toHaveBeenCalledWith(expectedErrors[1]);
    });
  });
});
