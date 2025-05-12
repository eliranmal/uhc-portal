import React from 'react';
import { Field } from 'formik';

import { Alert, AlertVariant, Spinner } from '@patternfly/react-core';

import { SupportedFeature } from '~/common/featureCompatibility';
import { validateSecurityGroups } from '~/common/validators';
import { getIncompatibleVersionReason } from '~/common/versionCompatibility';
import EditSecurityGroups from '~/components/clusters/ClusterDetailsMultiRegion/components/SecurityGroups/EditSecurityGroups';
import SecurityGroupsEmptyAlert from '~/components/clusters/ClusterDetailsMultiRegion/components/SecurityGroups/SecurityGroupsEmptyAlert';
import SecurityGroupsNoChangeAlert from '~/components/clusters/ClusterDetailsMultiRegion/components/SecurityGroups/SecurityGroupsNoChangeAlert';
import { isHypershiftCluster, isROSA } from '~/components/clusters/common/clusterStates';
import { useAWSVPCFromCluster } from '~/components/clusters/common/useAWSVPCFromCluster';
import { FieldId } from '~/components/clusters/wizards/common';
import { useFormState } from '~/components/clusters/wizards/hooks';
import { ClusterFromSubscription } from '~/types/types';

export interface EditSecurityGroupsFieldProps {
  cluster: ClusterFromSubscription;
  isReadOnly: boolean;
}

const EditSecurityGroupsField = ({ cluster, isReadOnly }: EditSecurityGroupsFieldProps) => {
  const {
    values: { [FieldId.SecurityGroupIds]: selectedGroupIds },
    setFieldValue,
    setFieldTouched,
  } = useFormState();

  const { clusterVpc, isLoading, errorReason } = useAWSVPCFromCluster(cluster);

  if (isLoading) {
    return <Spinner aria-label="Loading...">Loading security groups</Spinner>;
  }

  if (!clusterVpc) {
    return (
      <Alert variant={AlertVariant.warning} title="Could not load the cluster's VPC" isInline>
        {errorReason || 'Please try refreshing the machine pool details'}
      </Alert>
    );
  }
  if ((clusterVpc.aws_security_groups || []).length === 0) {
    return <SecurityGroupsEmptyAlert />;
  }

  const isHypershift = isHypershiftCluster(cluster);
  const incompatibleReason = getIncompatibleVersionReason(
    SupportedFeature.SECURITY_GROUPS,
    cluster.openshift_version,
    { day2: true, isHypershift },
  );
  return incompatibleReason ? (
    <Alert variant={AlertVariant.warning} title={incompatibleReason} isInline />
  ) : (
    <>
      <SecurityGroupsNoChangeAlert isRosa={isROSA(cluster)} />
      <Field
        component={EditSecurityGroups}
        name={FieldId.SecurityGroupIds}
        onChange={(values: string[]) => {
          setFieldValue(FieldId.SecurityGroupIds, values, true);
          setFieldTouched(FieldId.SecurityGroupIds, true, false);
        }}
        validate={(securityGroupIds: string[]) =>
          validateSecurityGroups(securityGroupIds, isHypershift)
        }
        selectedVPC={clusterVpc}
        isReadOnly={isReadOnly}
        selectedGroupIds={selectedGroupIds}
        isHypershift={isHypershift}
      />
    </>
  );
};

export default EditSecurityGroupsField;
