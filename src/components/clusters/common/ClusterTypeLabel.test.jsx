import React from 'react';

import * as PreviewLabelFile from '~/components/clusters/common/PreviewLabel';
import { checkAccessibility, render, screen } from '~/testUtils';

import fixtures from '../ClusterDetailsMultiRegion/__tests__/ClusterDetails.fixtures';

import ClusterTypeLabel from './ClusterTypeLabel';

describe('ClusterTypeLabel', () => {
  jest.spyOn(PreviewLabelFile, 'PreviewLabel').mockImplementation(() => <span>PREVIEW LABEL</span>);

  it('does not show preview label for ROSA hypershift', async () => {
    const { cluster } = fixtures.ROSAHypershiftClusterDetails;

    const { container } = render(<ClusterTypeLabel cluster={cluster} />);
    expect(screen.queryByText('PREVIEW LABEL')).not.toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('does not show preview label for classic ROSA', () => {
    const { cluster } = fixtures.ROSAClusterDetails;
    render(<ClusterTypeLabel cluster={cluster} />);

    expect(screen.queryByText('PREVIEW LABEL')).not.toBeInTheDocument();
  });
});
