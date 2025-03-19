import React from 'react';
import PropTypes from 'prop-types';

import { Form, Grid, GridItem, Title } from '@patternfly/react-core';

import { getAllSubnetFieldNames } from '~/common/vpcHelpers';
import { emptyAWSSubnet } from '~/components/clusters/wizards/common/constants';
import { useFormState } from '~/components/clusters/wizards/hooks';

import { FieldId } from '../constants';

import InstallToVPC from './InstallToVPC';

function VPCScreen({ privateLinkSelected }) {
  const {
    setFieldValue,
    setFieldTouched,
    values: {
      [FieldId.ClusterName]: clusterName,
      [FieldId.ClusterVersion]: version,
      [FieldId.SharedVpc]: sharedVpcSettings,
      [FieldId.SelectedVpc]: selectedVPC,
      [FieldId.MachinePoolsSubnets]: machinePoolsSubnets,
      [FieldId.MultiAz]: multiAzField,
      [FieldId.Region]: selectedRegion,
      [FieldId.CloudProvider]: cloudProviderID,
      [FieldId.Hypershift]: isHypershift,
    },
  } = useFormState();
  const isSharedVpcSelected = sharedVpcSettings?.is_selected || false;
  const hostedZoneDomainName = isSharedVpcSelected
    ? `${clusterName}.${sharedVpcSettings.base_dns_domain || '<selected-base-domain>'}`
    : undefined;
  const selectedAZs = machinePoolsSubnets?.map((subnet) => subnet.availabilityZone);
  const isMultiAz = multiAzField === 'true';
  const openshiftVersion = version.raw_id;
  const isHypershiftSelected = isHypershift === 'true';

  React.useEffect(() => {
    if (!selectedVPC.id) {
      const subnetReset = [emptyAWSSubnet()];

      if (isMultiAz) {
        subnetReset.push(emptyAWSSubnet());
        subnetReset.push(emptyAWSSubnet());
      }
      setFieldValue('machinePoolsSubnets', subnetReset);

      // Prevent the validation errors from showing - fields have been reset
      const untouchFields = getAllSubnetFieldNames(isMultiAz);
      // Fails sometimes if we only touch the main "machinePoolsSubnets"
      untouchFields.forEach((field) => {
        setFieldTouched(field, false);
      });
    }
  }, [setFieldValue, setFieldTouched, isMultiAz, selectedVPC]);

  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault();
        return false;
      }}
    >
      <Grid hasGutter>
        <GridItem>
          <Title headingLevel="h3">Virtual Private Cloud (VPC) subnet settings</Title>
        </GridItem>

        <InstallToVPC
          isMultiAz={isMultiAz}
          selectedRegion={selectedRegion}
          selectedVPC={selectedVPC}
          selectedAZs={selectedAZs}
          openshiftVersion={openshiftVersion}
          isSharedVpcSelected={isSharedVpcSelected}
          privateLinkSelected={privateLinkSelected}
          hostedZoneDomainName={hostedZoneDomainName}
          cloudProviderID={cloudProviderID}
          isHypershiftSelected={isHypershiftSelected}
        />
      </Grid>
    </Form>
  );
}

VPCScreen.propTypes = {
  privateLinkSelected: PropTypes.bool,
};

export default VPCScreen;
