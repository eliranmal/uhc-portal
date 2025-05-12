import React from 'react';
import classNames from 'classnames';
import { Field } from 'formik';

import { FormGroup } from '@patternfly/react-core';

import {
  checkRouteSelectors,
  validateNamespacesList,
  validateTlsHostname,
  validateTlsSecretName,
} from '~/common/validators';
import {
  ExcludedNamespacesHelpText,
  ExcludedNamespacesPopover,
} from '~/components/clusters/ClusterDetailsMultiRegion/components/Networking/components/ApplicationIngressCard/ExcludedNamespacesPopover';
import { NamespaceOwnerPolicyPopover } from '~/components/clusters/ClusterDetailsMultiRegion/components/Networking/components/ApplicationIngressCard/NamespaceOwnerPolicyPopover';
import {
  RouteSelectorsHelpText,
  RouteSelectorsPopover,
} from '~/components/clusters/ClusterDetailsMultiRegion/components/Networking/components/ApplicationIngressCard/RouteSelectorsPopover';
import { WildcardPolicyPopover } from '~/components/clusters/ClusterDetailsMultiRegion/components/Networking/components/ApplicationIngressCard/WildcardsPolicyPopover';
import { LoadBalancerFlavorLabel } from '~/components/clusters/ClusterDetailsMultiRegion/components/Networking/components/constants';
import LoadBalancerPopover from '~/components/clusters/ClusterDetailsMultiRegion/components/Networking/components/LoadBalancerPopover';
import {
  ReduxCheckbox,
  ReduxVerticalFormGroup,
} from '~/components/common/ReduxFormComponents_deprecated';
import { LoadBalancerFlavor } from '~/types/clusters_mgmt.v1/enums';

type DefaultIngressFieldsProps = {
  className?: string;
  areFieldsDisabled?: boolean;
  hasSufficientIngressEditVersion?: boolean;
  isDay2?: boolean;
  canEditLoadBalancer?: boolean;
  canShowLoadBalancer?: boolean;
  isHypershiftCluster?: boolean;
};

export const DefaultIngressFields: React.FC<DefaultIngressFieldsProps> = ({
  className,
  areFieldsDisabled,
  isDay2,
  hasSufficientIngressEditVersion,
  canEditLoadBalancer,
  canShowLoadBalancer,
  isHypershiftCluster,
}) => (
  <>
    {isDay2 && (
      <FormGroup
        fieldId="default_router_address"
        label="Default application router"
        isStack
        isRequired
      >
        {/* @ts-ignore */}
        <Field
          component={ReduxVerticalFormGroup}
          name="default_router_address"
          type="text"
          disabled
          helpText="Address of application routes."
        />
        {/* @ts-ignore */}
        <Field
          component={ReduxCheckbox}
          name="private_default_router"
          label="Make router private"
        />
      </FormGroup>
    )}

    {hasSufficientIngressEditVersion && !isHypershiftCluster && (
      <FormGroup className={className} label="Route selector" labelIcon={<RouteSelectorsPopover />}>
        {/* @ts-ignore */}
        <Field
          component={ReduxVerticalFormGroup}
          name="defaultRouterSelectors"
          data-testid="router-selectors"
          type="text"
          validate={checkRouteSelectors}
          disabled={areFieldsDisabled}
          helpText={RouteSelectorsHelpText}
          showHelpTextOnError={false}
        />
      </FormGroup>
    )}

    {hasSufficientIngressEditVersion && !isHypershiftCluster && (
      <FormGroup
        className={className}
        label="Excluded namespaces"
        labelIcon={<ExcludedNamespacesPopover />}
      >
        {/* @ts-ignore */}
        <Field
          component={ReduxVerticalFormGroup}
          name="defaultRouterExcludedNamespacesFlag"
          data-testid="excluded-namespaces"
          type="text"
          validate={validateNamespacesList}
          disabled={areFieldsDisabled}
          helpText={ExcludedNamespacesHelpText}
          showHelpTextOnError={false}
        />
      </FormGroup>
    )}

    {isDay2 && hasSufficientIngressEditVersion && !isHypershiftCluster && (
      <>
        <FormGroup className={className} label="TLS Secret name">
          {/* @ts-ignore */}
          <Field
            component={ReduxVerticalFormGroup}
            name="clusterRoutesTlsSecretRef"
            type="text"
            validate={validateTlsSecretName}
            disabled={areFieldsDisabled}
            helpText="The name of a secret holding custom TLS certificate, in the openshift-config namespace. Optional."
            showHelpTextOnError={false}
          />
        </FormGroup>

        {/* TODO: provide link to documentation once it is written */}
        <FormGroup className={className} label="Hostname">
          {/* @ts-ignore */}
          <Field
            component={ReduxVerticalFormGroup}
            name="clusterRoutesHostname"
            type="text"
            validate={validateTlsHostname}
            disabled={areFieldsDisabled}
            helpText="The cluster routes hostname the TLS certificate is issued for."
            showHelpTextOnError={false}
          />
        </FormGroup>
      </>
    )}

    {hasSufficientIngressEditVersion && !isHypershiftCluster && (
      <FormGroup
        className={className}
        fieldId="isDefaultRouterNamespaceOwnershipPolicyStrict"
        label="Namespace ownership policy"
        labelIcon={<NamespaceOwnerPolicyPopover />}
      >
        {/* @ts-ignore */}
        <Field
          id="isDefaultRouterNamespaceOwnershipPolicyStrict"
          component={ReduxCheckbox}
          name="isDefaultRouterNamespaceOwnershipPolicyStrict"
          disabled={areFieldsDisabled}
          label="Strict"
          labelOff="Inter-namespace ownership allowed"
          isSwitch
        />
      </FormGroup>
    )}

    {hasSufficientIngressEditVersion && !isHypershiftCluster && (
      <FormGroup
        className={className}
        fieldId="isDefaultRouterWildcardPolicyAllowed"
        label="Wildcard policy"
        labelIcon={<WildcardPolicyPopover />}
      >
        {/* @ts-ignore */}
        <Field
          id="isDefaultRouterWildcardPolicyAllowed"
          component={ReduxCheckbox}
          name="isDefaultRouterWildcardPolicyAllowed"
          disabled={areFieldsDisabled}
          label="Allowed"
          labelOff="Disallowed"
          isSwitch
        />
      </FormGroup>
    )}

    {canShowLoadBalancer && !isHypershiftCluster && (
      <FormGroup
        fieldId="load_balancer_group"
        label="Load balancer type"
        className={classNames('pf-v5-u-pb-md', className)}
        labelIcon={<LoadBalancerPopover />}
      >
        {/* @ts-ignore */}
        <Field
          id="load_balancer_group"
          component={ReduxCheckbox}
          name="is_nlb_load_balancer"
          disabled={!canEditLoadBalancer}
          label={LoadBalancerFlavorLabel[LoadBalancerFlavor.nlb]}
          labelOff={LoadBalancerFlavorLabel[LoadBalancerFlavor.classic]}
          isSwitch
        />
      </FormGroup>
    )}
  </>
);
