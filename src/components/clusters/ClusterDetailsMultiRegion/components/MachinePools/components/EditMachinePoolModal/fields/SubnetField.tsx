import * as React from 'react';
import { useField } from 'formik';

import { Alert, Spinner } from '@patternfly/react-core';

import { SubnetSelectField } from '~/components/clusters/common/SubnetSelectField';
import { useAWSVPCFromCluster } from '~/components/clusters/common/useAWSVPCFromCluster';
import { ClusterFromSubscription } from '~/types/types';

const fieldId = 'privateSubnetId';

const SubnetField = ({
  cluster,
  region,
}: {
  cluster: ClusterFromSubscription;
  region?: string;
}) => {
  const [inputField, metaField, { setValue }] = useField<string | undefined>(fieldId);
  const { clusterVpc, isLoading, hasError } = useAWSVPCFromCluster(cluster, region);
  const fieldProps = React.useMemo(
    () => ({
      input: {
        onChange: (subnetId: string | undefined) => {
          setValue(subnetId);
        },
        value: inputField.value,
        name: inputField.name,
      },
      meta: {
        error: metaField.touched ? metaField.error : undefined,
        touched: metaField.touched,
      },
    }),
    [inputField.value, inputField.name, metaField.error, metaField.touched, setValue],
  );

  if (isLoading) {
    return <Spinner size="md">Loading the cluster VPC</Spinner>;
  }

  if (!clusterVpc || hasError) {
    return (
      <Alert
        variant="danger"
        isInline
        isPlain
        title="Failed to load the machine pool VPC. Please try refreshing the page."
        className="pf-v5-u-mb-sm"
      />
    );
  }

  return (
    <SubnetSelectField
      name={fieldId}
      privacy="private"
      label="Private subnet name"
      isRequired
      selectedVPC={clusterVpc}
      {...fieldProps}
    />
  );
};

export default SubnetField;
