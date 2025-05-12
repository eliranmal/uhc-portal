import React from 'react';
import { useDispatch } from 'react-redux';
import { Route } from 'react-router-dom';

import { PageSection } from '@patternfly/react-core';

import { AppPage } from '~/components/App/AppPage';
import Breadcrumbs from '~/components/common/Breadcrumbs';
import PageTitle from '~/components/common/PageTitle';
import { tollboothActions } from '~/redux/actions';
import { useGlobalState } from '~/redux/hooks';

import { InstructionsChooser } from './instructions/InstructionsChooser';
import { InstructionsChooserPageTitle } from './instructions/InstructionsChooserPageTitle';
import InstructionsPreRelease from './instructions/InstructionsPreRelease';
import OCPInstructions from './instructions/OCPInstructions';
import {
  InstallComponentProps,
  InstructionChooserProps,
  OCPInstructionProps,
  ReleaseInstructionsProps,
  Routes,
} from './models/types';

export const InstallWithInstructionChooserWrapper = (props: InstructionChooserProps) => {
  const {
    breadCrumbsPaths,
    appPageTitle,
    providerTitle,
    aiPageLink,
    aiLearnMoreLink,
    hideIPI,
    ipiPageLink,
    ipiLearnMoreLink,
    hideUPI,
    upiPageLink,
    upiLearnMoreLink,
    agentBasedPageLink,
    agentBasedLearnMoreLink,
    providerSpecificFeatures,
    name,
    recommend,
  } = props;

  const breadcrumbs = <Breadcrumbs path={[...breadCrumbsPaths]} />;

  return (
    <AppPage title={appPageTitle}>
      <InstructionsChooserPageTitle cloudName={providerTitle} breadcrumbs={breadcrumbs} />
      <PageSection>
        <InstructionsChooser
          aiPageLink={aiPageLink}
          aiLearnMoreLink={aiLearnMoreLink}
          hideIPI={hideIPI}
          ipiLearnMoreLink={ipiLearnMoreLink}
          ipiPageLink={ipiPageLink}
          hideUPI={hideUPI}
          upiPageLink={upiPageLink}
          upiLearnMoreLink={upiLearnMoreLink}
          agentBasedPageLink={agentBasedPageLink}
          agentBasedLearnMoreLink={agentBasedLearnMoreLink}
          providerSpecificFeatures={providerSpecificFeatures}
          name={name}
          recommend={recommend}
        />
      </PageSection>
    </AppPage>
  );
};

export const InstallWithOCPInstructionsWrapper = (props: OCPInstructionProps) => {
  const {
    breadCrumbsPaths,
    appPageTitle,
    providerTitle,
    cloudProviderId,
    customizations,
    instructionsMapping,
    isUPI,
    showPreReleaseDocs,
    installationTypeId,
  } = props;
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(tollboothActions.createAuthToken());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const token = useGlobalState((state) => state.tollbooth.token);

  const breadcrumbs = <Breadcrumbs path={[...breadCrumbsPaths]} />;

  return (
    <AppPage title={appPageTitle}>
      <PageTitle title={providerTitle} breadcrumbs={breadcrumbs} />
      <PageSection>
        <OCPInstructions
          token={token}
          cloudProviderID={cloudProviderId}
          customizations={customizations}
          showPreReleaseDocs={showPreReleaseDocs}
          installationTypeId={installationTypeId}
          isUPI={isUPI}
          {...instructionsMapping}
        />
      </PageSection>
    </AppPage>
  );
};

export const InstallWithReleaseInstructionsWrapper = (props: ReleaseInstructionsProps) => {
  const { breadCrumbsPaths, appPageTitle, providerTitle, installer } = props;
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(tollboothActions.createAuthToken());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const token = useGlobalState((state) => state.tollbooth.token);

  const breadcrumbs = <Breadcrumbs path={[...breadCrumbsPaths]} />;

  return (
    <AppPage title={appPageTitle}>
      <PageTitle title={providerTitle} breadcrumbs={breadcrumbs} />
      <PageSection>
        <InstructionsPreRelease token={token} installer={installer} />
      </PageSection>
    </AppPage>
  );
};

// Wrapper component to choose which type of Install component to render
export const InstallComponentWrapper = (props: InstallComponentProps) => {
  const { componentChooser, propsData } = props;

  switch (componentChooser) {
    case 'instructionsChooser':
      return <InstallWithInstructionChooserWrapper {...propsData} />;
    case 'releaseInstructions':
      return <InstallWithReleaseInstructionsWrapper {...propsData} />;
    default:
      return <InstallWithOCPInstructionsWrapper {...propsData} />;
  }
};

// Loop through all Install component Routes and render required Install component
export const InstallRouteMap = (routes: Routes[]) =>
  routes.map((route: Routes) => <Route path={route.path} element={route.element} />);
