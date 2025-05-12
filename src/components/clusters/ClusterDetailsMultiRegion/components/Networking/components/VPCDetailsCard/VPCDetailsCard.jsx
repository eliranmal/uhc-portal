import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Label,
  LabelGroup,
  Title,
} from '@patternfly/react-core';

import { stringToArray } from '~/common/helpers';
import modals from '~/components/common/Modal/modals';
import { isRestrictedEnv } from '~/restrictedEnv';

import { modalActions } from '../../../../../../common/Modal/ModalActions';
import EditClusterWideProxyDialog from '../EditClusterWideProxyDialog';

import './VPCDetailsCard.scss';

const VPCDetailsCard = ({ cluster }) => {
  const dispatch = useDispatch();

  const privateLink = cluster.aws?.private_link;

  const httpProxyUrl = cluster.proxy?.http_proxy;
  const httpsProxyUrl = cluster.proxy?.https_proxy;
  const noProxyDomains = stringToArray(cluster.proxy?.no_proxy);
  const additionalTrustBundle = cluster.additional_trust_bundle;
  const gcpVPCName = cluster.gcp_network?.vpc_name;
  const isBYOVPC = cluster.aws?.subnet_ids || cluster.gcp_network;
  const gcpPrivateServiceConnect = cluster.gcp?.private_service_connect?.service_attachment_subnet;

  const region = cluster.subscription?.rh_region_id;

  const isPrivateLinkInitialized = typeof privateLink !== 'undefined';

  const handleEditClusterProxy = () => {
    dispatch(modalActions.openModal(modals.EDIT_CLUSTER_WIDE_PROXY));
  };

  const renderNoProxyDomains = noProxyDomains
    ? noProxyDomains.map((domain) => (
        <Label isCompact color="blue">
          {domain}
        </Label>
      ))
    : 'N/A';

  if (!isBYOVPC) return null;

  return (
    <Card className="ocm-c-networking-vpc-details__card">
      <CardTitle>
        <Title headingLevel="h2" className="card-title">
          Virtual Private Cloud (VPC)
        </Title>
      </CardTitle>
      <CardBody className="ocm-c-networking-vpc-details__card--body pf-v5-l-stack pf-m-gutter">
        {gcpVPCName || isPrivateLinkInitialized || gcpPrivateServiceConnect ? (
          <>
            <Title headingLevel="h3" className="pf-v5-l-stack__item">
              VPC Details
            </Title>
            <DescriptionList
              isHorizontal
              className="pf-v5-l-stack__item pf-m-auto-column-widths details-card-dl"
            >
              {gcpVPCName ? (
                <DescriptionListGroup>
                  <DescriptionListTerm>VPC name</DescriptionListTerm>
                  <DescriptionListDescription>{gcpVPCName}</DescriptionListDescription>
                </DescriptionListGroup>
              ) : null}
              {isPrivateLinkInitialized ? (
                <DescriptionListGroup>
                  <DescriptionListTerm>PrivateLink</DescriptionListTerm>
                  <DescriptionListDescription>
                    {privateLink ? 'Enabled' : 'Disabled'}
                  </DescriptionListDescription>
                </DescriptionListGroup>
              ) : null}
              {gcpPrivateServiceConnect ? (
                <DescriptionListGroup>
                  <DescriptionListTerm>Private Service Connect Subnet</DescriptionListTerm>
                  <DescriptionListDescription>
                    {gcpPrivateServiceConnect}
                  </DescriptionListDescription>
                </DescriptionListGroup>
              ) : null}
            </DescriptionList>
          </>
        ) : null}
        <Title headingLevel="h3" className="pf-v5-l-stack__item --">
          Cluster-wide Proxy
        </Title>
        <DescriptionList isHorizontal className="pf-v5-l-stack__item details-card-dl">
          <DescriptionListGroup>
            <DescriptionListTerm>HTTP proxy URL</DescriptionListTerm>
            <DescriptionListDescription>{httpProxyUrl || 'N/A'}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>HTTPS proxy URL</DescriptionListTerm>
            <DescriptionListDescription>{httpsProxyUrl || 'N/A'}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Additional trust bundle</DescriptionListTerm>
            <DescriptionListDescription>
              {(additionalTrustBundle === 'REDACTED' ? 'Uploaded' : additionalTrustBundle) || 'N/A'}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>No Proxy domains</DescriptionListTerm>
            <DescriptionListDescription>
              <LabelGroup isCompact>{renderNoProxyDomains}</LabelGroup>
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
        <EditClusterWideProxyDialog region={region} cluster={cluster} />
      </CardBody>
      {!isRestrictedEnv() && (
        <CardFooter>
          <Button variant="secondary" onClick={handleEditClusterProxy}>
            Edit cluster-wide proxy
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

VPCDetailsCard.propTypes = {
  cluster: PropTypes.object.isRequired,
};

export default VPCDetailsCard;
