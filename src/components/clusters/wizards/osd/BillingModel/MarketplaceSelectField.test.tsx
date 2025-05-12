import * as React from 'react';
import { Form, Formik } from 'formik';

import { CloudProviderType } from '~/components/clusters/wizards/osd/ClusterSettings/CloudProvider/types';
import { render, screen } from '~/testUtils';
import { SubscriptionCommonFieldsCluster_billing_model as SubscriptionCommonFieldsClusterBillingModel } from '~/types/accounts_mgmt.v1';

import { FieldId, initialValues } from '../constants';

import { MarketplaceSelectField } from './MarketplaceSelectField';

const defaultProps = {
  hasGcpQuota: true,
  hasRhmQuota: true,
};

describe('<MarketplaceSelectField />', () => {
  it('should show a placeholder', async () => {
    render(
      <Formik initialValues={initialValues} onSubmit={() => {}}>
        <MarketplaceSelectField {...defaultProps} />
      </Formik>,
    );

    expect(screen.queryByText('Select your marketplace')).toBeInTheDocument();
  });

  xit('should have 2 select items', async () => {});

  xit('selecting Red Hat marketplace sets the right field value', async () => {});

  xit('selecting Google cloud marketplace sets the right field value', async () => {});

  it('shows a previously selected marketplace', async () => {
    const formValues = {
      ...initialValues,
      [FieldId.BillingModel]: SubscriptionCommonFieldsClusterBillingModel.marketplace,
      [FieldId.MarketplaceSelection]: SubscriptionCommonFieldsClusterBillingModel.marketplace_gcp,
    };
    render(
      <Formik initialValues={formValues} onSubmit={() => {}}>
        <MarketplaceSelectField {...defaultProps} />
      </Formik>,
    );

    expect(await screen.findByText('Google Cloud Marketplace')).toBeInTheDocument();
    expect(screen.queryByText('Select your marketplace')).not.toBeInTheDocument();
  });

  it('resets the marketplace value when billing model is not "on-demand" (marketplace)', async () => {
    const formValues = {
      ...initialValues,
      [FieldId.BillingModel]: SubscriptionCommonFieldsClusterBillingModel.standard,
      [FieldId.MarketplaceSelection]: SubscriptionCommonFieldsClusterBillingModel.marketplace_gcp,
      [FieldId.CloudProvider]: CloudProviderType.Gcp,
    };
    const handleSubmit = jest.fn();
    const { user } = render(
      <Formik initialValues={formValues} onSubmit={handleSubmit}>
        <Form>
          <MarketplaceSelectField {...defaultProps} />
          <button type="submit">Submit</button>
        </Form>
      </Formik>,
    );

    expect(await screen.findByText('Select your marketplace')).toBeInTheDocument();
    expect(screen.queryByText('Google Cloud Marketplace')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    // checking that only the marketplace selection is reset as previously the cloud provider
    // was wrongfully reset too
    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        [FieldId.BillingModel]: SubscriptionCommonFieldsClusterBillingModel.standard,
        [FieldId.MarketplaceSelection]: null,
        [FieldId.CloudProvider]: CloudProviderType.Gcp,
      }),
      expect.anything(),
    );
  });
});
