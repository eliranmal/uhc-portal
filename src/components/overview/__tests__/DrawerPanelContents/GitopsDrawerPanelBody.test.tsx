import { checkAccessibility, render, screen } from '~/testUtils';

import { GitopsDrawerPanelBody } from '../../components/common/DrawerPanelContents/Gitops/DrawerPanelBody';

import '@testing-library/jest-dom';

describe('GitopsDrawerPanelBody', () => {
  it('renders elements', async () => {
    const { container } = render(GitopsDrawerPanelBody);

    expect(
      screen.getByText(
        /Consistently configure and deploy Kubernetes-based infrastructure and applications across/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/clusters and development lifecycles using Red Hat OpenShift GitOps./i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Red Hat OpenShift GitOps uses the open source project/i),
    ).toBeInTheDocument();

    const benefitsTitle = screen.getByTestId('drawer-panel-content-benefits-title');
    expect(benefitsTitle).toBeInTheDocument();
    expect(benefitsTitle).toHaveTextContent('Benefits');

    expect(screen.getByText(/Enhance traceability and visibility:/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Infrastructure and applications are stored and versioned in Git./i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Ensure consistency:/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Red Hat OpenShift GitOps makes the configuration repositories/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Automate infrastructure and deployment requirements:/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Updates and changes are pushed through declarative code across environments./i,
      ),
    ).toBeInTheDocument();

    const argoCDLink = screen.getByText(/Argo CD/i);
    expect(argoCDLink).toBeInTheDocument();
    expect(argoCDLink).toHaveAttribute(
      'href',
      'https://www.redhat.com/en/blog/argocd-and-gitops-whats-next',
    );
    expect(argoCDLink).toHaveAttribute('target', '_blank');
    expect(argoCDLink).toHaveAttribute('rel', 'noreferrer noopener');

    const learnMoreBtn = screen.getByTestId(
      'learn-more-about-red-hat-openshift-gitops-drawer-panel-content-link',
    );
    expect(learnMoreBtn).toBeInTheDocument();
    expect(learnMoreBtn).toHaveTextContent('Learn more about Red Hat OpenShift GitOps');
    expect(learnMoreBtn).toHaveAttribute(
      'href',
      'https://catalog.redhat.com/software/container-stacks/detail/5fb288c70a12d20cbecc6056',
    );

    await checkAccessibility(container);
  });
});
