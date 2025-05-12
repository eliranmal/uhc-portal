import React from 'react';

import * as useFetchCloudProviders from '~/queries/common/useFetchCloudProviders';
import { render, screen } from '~/testUtils';

import { ClusterLocationLabel, ClusterLocationLabelProps } from './ClusterLocationLabel';

const mockUseFetchCloudProviders = jest.spyOn(useFetchCloudProviders, 'useFetchCloudProviders');

describe('<ClusterLocationLabel />', () => {
  const defaultProps: ClusterLocationLabelProps = {
    cloudProviderID: 'aws',
    regionID: 'us-east-1',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches cloud providers on render', () => {
    expect(mockUseFetchCloudProviders).not.toHaveBeenCalled();

    render(<ClusterLocationLabel {...defaultProps} />);

    expect(mockUseFetchCloudProviders).toHaveBeenCalled();
  });

  it("displays cloud provider and region when there's no provider data available", () => {
    // @ts-ignore
    mockUseFetchCloudProviders.mockReturnValue({ data: {} });
    render(<ClusterLocationLabel {...defaultProps} />);

    expect(screen.getByText('AWS (us-east-1)')).toBeInTheDocument();
  });

  it('does not display region  when region is not known', () => {
    // @ts-ignore
    mockUseFetchCloudProviders.mockReturnValue({ data: {} });
    render(<ClusterLocationLabel cloudProviderID="gcp" regionID="N/A" />);

    expect(screen.getByText('GCP')).toBeInTheDocument();
  });

  it('displays content from providers when providers have been fetched', () => {
    mockUseFetchCloudProviders.mockReturnValue({
      // @ts-ignore
      data: { baremetal: { display_name: 'Bare Metal' } },
    });
    render(<ClusterLocationLabel cloudProviderID="baremetal" regionID="some-region" />);

    expect(screen.getByText('Bare Metal (some-region)')).toBeInTheDocument();
  });
});
