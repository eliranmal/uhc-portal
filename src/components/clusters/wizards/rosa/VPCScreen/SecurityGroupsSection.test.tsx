import React from 'react';
import { Formik } from 'formik';

import { render, screen, waitFor } from '~/testUtils';

import { FieldId, initialValues } from '../constants';

import SecurityGroupsSection from './SecurityGroupsSection';

const defaultProps = {
  openshiftVersion: '4.14.0',
  selectedVPC: { id: 'my-vpc', name: 'my vpc' },
};

const buildTestComponent = (children: React.ReactNode, formValues = {}) => (
  <Formik
    initialValues={{
      ...initialValues,
      ...formValues,
      [FieldId.SecurityGroups]: {
        applyControlPlaneToAll: true,
        controlPlane: [],
        infra: [],
        worker: [],
      },
    }}
    onSubmit={() => {}}
  >
    {children}
  </Formik>
);

describe('<SecurityGroupsSection />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  describe('is displayed when', () => {
    it.each([[false], [true]])(
      'the VPC has been selected. Is hypershift: %s',
      async (isHypershift: boolean) => {
        render(
          buildTestComponent(
            <SecurityGroupsSection {...defaultProps} isHypershiftSelected={isHypershift} />,
          ),
        );
        await waitFor(() => {
          expect(screen.getByText('Additional security groups')).toBeInTheDocument();
        });
      },
    );
  });

  describe('is hidden when', () => {
    it.each([[false], [true]])(
      'the VPC has not been selected. Is hypershift: %s',
      async (isHypershift: boolean) => {
        render(
          buildTestComponent(
            <SecurityGroupsSection
              openshiftVersion="4.14.0"
              selectedVPC={{ id: '', name: '' }}
              isHypershiftSelected={isHypershift}
            />,
          ),
        );
        await waitFor(() => {
          expect(screen.queryByText('Additional security groups')).not.toBeInTheDocument();
        });
      },
    );
  });
});
