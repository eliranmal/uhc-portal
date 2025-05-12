import { checkAccessibility, render, screen } from '~/testUtils';

import { ServiceMeshDrawerPanelBody } from '../../components/common/DrawerPanelContents/ServiceMesh/DrawerPanelBody';

import '@testing-library/jest-dom';

describe('ServiceMeshDrawerPanelBody', () => {
  it('renders elements', async () => {
    const { container } = render(ServiceMeshDrawerPanelBody);

    expect(
      screen.getByText(
        /Connect, manage, and observe microservices-based applications in a uniform way./i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Red Hat OpenShift Service Mesh is based on the open source/i),
    ).toBeInTheDocument();

    const istioLink = screen.getByText('Istio');
    expect(istioLink).toBeInTheDocument();
    expect(istioLink).toHaveAttribute(
      'href',
      'https://www.redhat.com/en/topics/microservices/what-is-istio',
    );
    expect(istioLink).toHaveAttribute('target', '_blank');
    expect(istioLink).toHaveAttribute('rel', 'noreferrer noopener');

    expect(
      screen.getByText(
        /project and is pre-validated and fully supported to work on Red Hat OpenShift. It can be installed with the/i,
      ),
    ).toBeInTheDocument();

    const kialiLink = screen.getByText('Kiali');
    expect(kialiLink).toBeInTheDocument();
    expect(kialiLink).toHaveAttribute('href', 'https://github.com/kiali/kiali-operator');
    expect(kialiLink).toHaveAttribute('target', '_blank');
    expect(kialiLink).toHaveAttribute('rel', 'noreferrer noopener');

    const redHatOpenShiftObservabilityLink = screen.getByText('Red Hat OpenShift Observability');
    expect(redHatOpenShiftObservabilityLink).toBeInTheDocument();
    expect(redHatOpenShiftObservabilityLink).toHaveAttribute(
      'href',
      'https://www.redhat.com/en/technologies/cloud-computing/openshift/observability',
    );
    expect(redHatOpenShiftObservabilityLink).toHaveAttribute('target', '_blank');
    expect(redHatOpenShiftObservabilityLink).toHaveAttribute('rel', 'noreferrer noopener');

    const benefitsTitle = screen.getByTestId('drawer-panel-content-benefits-title');
    expect(benefitsTitle).toBeInTheDocument();
    expect(benefitsTitle).toHaveTextContent('Benefits');

    expect(screen.getByText(/Identify and diagnose problems easier:/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /Red Hat OpenShift Service Mesh adds tracing and visualization so you have a greater/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Implement secure zero-trust application networks:/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Focus on business value:/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /Give developers time back to delivering business value and writing application code./i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/Enable traffic management capabilities:/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /Red Hat OpenShift Service Mesh provides a control plane and infrastructure that transparently/i,
      ),
    ).toBeInTheDocument();

    expect(screen.getByText('Use cases:')).toBeInTheDocument();
    expect(
      screen.getByText(/Deploy your applications to multiple platforms, including:/i),
    ).toBeInTheDocument();
    const useCasesListItems = screen.getAllByTestId('use-cases-list-item');
    const expectedItems = [
      'Canary releases',
      'Access control',
      'End-to-end mTLS encryption',
      'A/B testing',
      'Service-to-service authentication',
      'Failure recovery',
    ];

    expect(useCasesListItems).toHaveLength(expectedItems.length);
    for (let i = 0; i < expectedItems.length; i += 1) {
      expect(useCasesListItems[i]).toHaveTextContent(expectedItems[i]);
    }

    const learnMoreBtn = screen.getByTestId(
      'learn-more-about-red-hat-openshift-service-mesh-drawer-panel-content-link',
    );
    expect(learnMoreBtn).toBeInTheDocument();
    expect(learnMoreBtn).toHaveTextContent('Learn more about Red Hat OpenShift Service Mesh');
    expect(learnMoreBtn).toHaveAttribute(
      'href',
      'https://catalog.redhat.com/software/container-stacks/detail/5ec53e8c110f56bd24f2ddc4',
    );

    await checkAccessibility(container);
  });
});
