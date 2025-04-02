import * as React from 'react';
import { useField } from 'formik';

import { Spinner } from '@patternfly/react-core';

import { SubnetSelectField } from '~/components/clusters/common/SubnetSelectField';
import { useAWSVPCFromCluster } from '~/components/clusters/common/useAWSVPCFromCluster';
import { ClusterFromSubscription } from '~/types/types';

import { RefreshClusterVPCAlert } from '../../common/RefreshClusterVPCAlert';

const fieldId = 'privateSubnetId';

const SubnetField = ({
  cluster,
  region,
}: {
  cluster: ClusterFromSubscription;
  region?: string;
}) => {
  const [inputField, metaField, { setValue }] = useField<string | undefined>(fieldId);
  const { clusterVpc, isLoading, hasError, refreshVPC } = useAWSVPCFromCluster(cluster, region);
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

  switch (true) {
    case isLoading === true:
      return <Spinner size="md">Loading the cluster VPC</Spinner>;
    case !clusterVpc || hasError:
      return <RefreshClusterVPCAlert isLoading={isLoading} refreshVPC={refreshVPC} />;
    default:
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
  }
};

export { SubnetField };
