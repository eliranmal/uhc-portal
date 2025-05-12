import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import { GeneralDrawerPanelHead } from '../../components/common/DrawerPanelContents/GeneralDrawerPanelHead';
import PRODUCT_CARD_LOGOS from '../../components/common/ProductCardLogos';

import '@testing-library/jest-dom';

const SAMPLE_WITH_LINK = {
  title: PRODUCT_CARD_LOGOS.openshiftAi.title,
  logo: PRODUCT_CARD_LOGOS.openshiftAi.logo,
  trialButtonLink:
    'https://www.redhat.com/en/technologies/cloud-computing/openshift/openshift-ai/trial',
};

const SAMPLE_WITHOUT_LINK = {
  title: PRODUCT_CARD_LOGOS.gitops.title,
  logo: PRODUCT_CARD_LOGOS.gitops.logo,
};

describe('<GeneralDrawerPanelHead />', () => {
  it('renders element with trial button', async () => {
    render(<GeneralDrawerPanelHead {...SAMPLE_WITH_LINK} />);
    expect(screen.getByText(SAMPLE_WITH_LINK.title)).toBeInTheDocument();
    expect(screen.getByText('Start free trial')).toBeInTheDocument();
  });

  it('renders element without trial button', async () => {
    render(<GeneralDrawerPanelHead {...SAMPLE_WITHOUT_LINK} />);
    expect(screen.getByText(SAMPLE_WITHOUT_LINK.title)).toBeInTheDocument();
    expect(screen.queryByText('Start free trial')).not.toBeInTheDocument();
  });

  it('checks if the component is accessible', async () => {
    const { container } = render(<GeneralDrawerPanelHead {...SAMPLE_WITH_LINK} />);
    await checkAccessibility(container);
  });
});
