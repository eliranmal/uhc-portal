import { checkAccessibility, render, screen } from '~/testUtils';

import { PipelinesDrawerPanelBody } from '../../components/common/DrawerPanelContents/Pipelines/DrawerPanelBody';

import '@testing-library/jest-dom';

describe('PipelinesDrawerPanelBody', () => {
  it('renders elements', async () => {
    const { container } = render(PipelinesDrawerPanelBody);

    expect(
      screen.getByText(
        /Speed up the delivery of your applications with advanced continuous integration/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Built on the open source Tekton framework, Red Hat OpenShift Pipelines provides a/i,
      ),
    ).toBeInTheDocument();

    const benefitsTitle = screen.getByTestId('drawer-panel-content-benefits-title');
    expect(benefitsTitle).toBeInTheDocument();
    expect(benefitsTitle).toHaveTextContent('Benefits');

    expect(screen.getByText(/React quickly with the market:/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        'Continuous integration / continuous deployment (CI/CD) allows you to deliver new products and features faster.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/Automate application delivery:/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Create pipelines of activity from simple, repeatable steps./i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Ensure security:/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        'Kubernetes role-based access control (RBAC) and security model ensures security consistently across pipelines and workloads.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/Adapt to your customers’ needs:/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /You’ll have full control of your application lifecycle to support your exact requirements./i,
      ),
    ).toBeInTheDocument();

    const platformsTitle = screen.getByTestId('drawer-panel-content-platforms-title');
    expect(platformsTitle).toBeInTheDocument();
    expect(platformsTitle).toHaveTextContent('Platforms');

    expect(
      screen.getByText(/Deploy your applications to multiple platforms, including:/i),
    ).toBeInTheDocument();
    const platformsListItems = screen.getAllByTestId('platforms-list-item');
    const expectedItems = ['Kubernetes', 'Serverless', 'Virtual machines'];
    expect(platformsListItems).toHaveLength(expectedItems.length);
    for (let i = 0; i < expectedItems.length; i += 1) {
      expect(platformsListItems[i]).toHaveTextContent(expectedItems[i]);
    }

    const learnMoreBtn = screen.getByTestId(
      'learn-more-about-red-hat-openshift-pipelines-drawer-panel-content-link',
    );
    expect(learnMoreBtn).toBeInTheDocument();
    expect(learnMoreBtn).toHaveTextContent('Learn more about Red Hat OpenShift Pipelines');
    expect(learnMoreBtn).toHaveAttribute(
      'href',
      'https://catalog.redhat.com/software/container-stacks/detail/5ec54a4628834587a6b85ca5',
    );

    await checkAccessibility(container);
  });
});
