import React from 'react';
import { Field } from 'formik';

import { Alert, AlertActionLink, AlertVariant } from '@patternfly/react-core';

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

import { RefreshClusterVPCAlert } from '../../../common/RefreshClusterVPCAlert';

import { EditSecurityGroupsFieldLoading } from './EditSecurityGroupsFieldLoading';

interface EditSecurityGroupsFieldProps {
  cluster: ClusterFromSubscription;
  isReadOnly: boolean;
}

const EditSecurityGroupsField = ({ cluster, isReadOnly }: EditSecurityGroupsFieldProps) => {
  const {
    values: { [FieldId.SecurityGroupIds]: selectedGroupIds },
    setFieldValue,
    setFieldTouched,
  } = useFormState();

  const { clusterVpc, isLoading, errorReason, refreshVPC } = useAWSVPCFromCluster(cluster);

  const isHypershift = isHypershiftCluster(cluster);

  const incompatibleReason = getIncompatibleVersionReason(
    SupportedFeature.SECURITY_GROUPS,
    cluster.openshift_version,
    { day2: true, isHypershift },
  );

  switch (true) {
    case isLoading === true:
      return <EditSecurityGroupsFieldLoading />;
    case clusterVpc === undefined:
      return (
        <RefreshClusterVPCAlert
          isLoading={isLoading}
          refreshVPC={refreshVPC}
          errorReason={errorReason}
        />
      );
    case (clusterVpc?.aws_security_groups || []).length === 0:
      return <SecurityGroupsEmptyAlert refreshVPCCallback={refreshVPC} />;
    case incompatibleReason?.trim().length > 0:
      return (
        <Alert variant={AlertVariant.warning} title={incompatibleReason} isInline>
          <AlertActionLink onClick={refreshVPC}>Refresh Security Groups</AlertActionLink>
        </Alert>
      );
    default:
      return (
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
            refreshVPCCallback={refreshVPC}
            isVPCLoading={isLoading}
          />
        </>
      );
  }
};

export default EditSecurityGroupsField;
