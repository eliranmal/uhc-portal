import React from 'react';
import { Formik } from 'formik';
import { useDispatch } from 'react-redux';

import { Form, ModalVariant } from '@patternfly/react-core';

import { DefaultIngressFieldsFormik } from '~/components/clusters/wizards/rosa/NetworkScreen/DefaultIngressFieldsFormik';
import ErrorBox from '~/components/common/ErrorBox';
import Modal from '~/components/common/Modal/Modal';
import { modalActions } from '~/components/common/Modal/ModalActions';
import modals from '~/components/common/Modal/modals';
import shouldShowModal from '~/components/common/Modal/ModalSelectors';
import { useEditClusterIngressMutation } from '~/queries/ClusterDetailsQueries/NetworkingTab/useEditClusterIngress';
import { useGlobalState } from '~/redux/hooks';
import { LoadBalancerFlavor } from '~/types/clusters_mgmt.v1/enums';
import { ErrorState } from '~/types/types';

import {
  ClusterRouters,
  excludedNamespacesAsString,
  routeSelectorsAsString,
} from '../../NetworkingSelector';

type EditApplicationIngressDialogProps = {
  hasSufficientIngressEditVersion?: boolean;
  canEditLoadBalancer?: boolean;
  canShowLoadBalancer?: boolean;
  isHypershiftCluster?: boolean;
  clusterRouters: ClusterRouters;
  clusterID?: string;
  region?: string;
  refreshCluster: () => void;
};

const EditApplicationIngressDialog: React.FC<EditApplicationIngressDialogProps> = ({
  refreshCluster,
  canShowLoadBalancer,
  hasSufficientIngressEditVersion,
  canEditLoadBalancer,
  isHypershiftCluster,
  clusterRouters,
  clusterID,
  region,
}) => {
  const {
    isPending,
    isError,
    error,
    mutate: editClusterIngress,
  } = useEditClusterIngressMutation(clusterID, region);
  const dispatch = useDispatch();
  const isOpen = useGlobalState((state) => shouldShowModal(state, modals.EDIT_APPLICATION_INGRESS));

  if (!isOpen) {
    return null;
  }
  const editRoutersError = isError ? (
    <ErrorBox
      message="Error editing application ingress"
      response={error as unknown as ErrorState}
    />
  ) : null;

  const onClose = () => {
    refreshCluster();
    dispatch(modalActions.closeModal());
  };

  const clusterRoutesTlsSecretRef = clusterRouters.default?.tlsSecretRef;
  const ingressProps = hasSufficientIngressEditVersion
    ? {
        defaultRouterSelectors: routeSelectorsAsString(clusterRouters.default?.routeSelectors),
        defaultRouterExcludedNamespacesFlag: excludedNamespacesAsString(
          clusterRouters.default?.excludedNamespaces,
        ),
        isDefaultRouterNamespaceOwnershipPolicyStrict:
          clusterRouters.default?.isNamespaceOwnershipPolicyStrict,
        isDefaultRouterWildcardPolicyAllowed: clusterRouters.default?.isWildcardPolicyAllowed,
        clusterRoutesTlsSecretRef,
        clusterRoutesHostname: clusterRouters.default?.hostname,
      }
    : undefined;

  return (
    <Formik
      initialValues={{
        private_default_router: clusterRouters.default?.isPrivate,
        is_nlb_load_balancer: clusterRouters.default?.loadBalancer === LoadBalancerFlavor.nlb,
        default_router_address: clusterRouters.default?.address,
        ...ingressProps,
      }}
      onSubmit={(values) => {
        const currentData = {
          ...clusterRouters,
        };
        const formData = { ...values };
        editClusterIngress(
          { formData, currentData },
          {
            onSuccess: () => {
              onClose();
            },
          },
        );
      }}
    >
      {({ dirty, errors, handleSubmit, values }) => (
        <Modal
          variant={ModalVariant.medium}
          primaryText="Save"
          secondaryText="Cancel"
          title="Edit application ingress"
          onClose={onClose}
          onPrimaryClick={handleSubmit as () => void}
          onSecondaryClick={onClose}
          isPending={isPending}
          isPrimaryDisabled={!errors || !dirty}
        >
          {editRoutersError}
          <Form>
            <DefaultIngressFieldsFormik
              isDay2
              hasSufficientIngressEditVersion={hasSufficientIngressEditVersion}
              canEditLoadBalancer={canEditLoadBalancer}
              canShowLoadBalancer={canShowLoadBalancer}
              areFieldsDisabled={isHypershiftCluster}
              isHypershiftCluster={isHypershiftCluster}
              values={values}
            />
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export default EditApplicationIngressDialog;
