import React, { useEffect } from 'react';
import { AxiosResponse } from 'axios';
import { Field } from 'formik';

import {
  Alert,
  ClipboardCopy,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';

import { FieldId } from '~/components/clusters/wizards/common/constants';
import { useFormState } from '~/components/clusters/wizards/hooks';
import { useGetWifConfigs } from '~/components/clusters/wizards/osd/ClusterSettings/CloudProvider/GcpByocFields/WorkloadIdentityFederation/useWifConfigs';
import { WifConfigSelector } from '~/components/clusters/wizards/osd/ClusterSettings/CloudProvider/GcpByocFields/WorkloadIdentityFederation/WifConfigSelector';
import { WifConfig } from '~/components/clusters/wizards/osd/ClusterSettings/CloudProvider/tempWifTypes/WifConfig';
import { WifConfigList } from '~/components/clusters/wizards/osd/ClusterSettings/CloudProvider/types';
import ExternalLink from '~/components/common/ExternalLink';

export interface WorkloadIdentityFederationProps {
  getWifConfigsService: (projectId: string) => Promise<AxiosResponse<WifConfigList>>;
}

const WorkloadIdentityFederation = (props: WorkloadIdentityFederationProps) => {
  const { getWifConfigsService } = props;
  const { isLoading, wifConfigs, getWifConfigs, error } = useGetWifConfigs(getWifConfigsService);
  useEffect(() => {
    getWifConfigs('');
  }, [getWifConfigs]);

  const {
    setFieldValue,
    getFieldProps,
    getFieldMeta,
    values: { [FieldId.GcpWifConfig]: selectedGcpWifConfig },
  } = useFormState();

  const handleWifSelection = (id: string) => {
    const selection = (wifConfigs ?? []).find((config) => config.id === id);
    if (selection) {
      setFieldValue(FieldId.GcpWifConfig, selection, true);
    }
  };

  const validateWifConfig = (value?: WifConfig) =>
    value?.id ? undefined : 'Wif configuration is required';

  return (
    <Stack hasGutter>
      <StackItem>
        <TextContent>
          <Text component="h4">
            1. Create a new Workload Identity Federation (WIF) configuration
          </Text>

          <Text component={TextVariants.p}>
            Workload Identity Federation is a keyless authentication mechanism for calling Google
            Cloud APIs. It eliminates the maintenance and security burden associated with service
            account keys.
          </Text>
          <Text component={TextVariants.p}>
            Run the following <code>ocm</code> CLI command to create a Workload Identity Federation
            configuration (automatic mode)
          </Text>
        </TextContent>
      </StackItem>
      <StackItem>
        <ClipboardCopy
          data-testid="gcp-wif-command"
          isReadOnly
          hoverTip="Copy"
          clickTip="Copied"
          isCode
          isBlock
        >
          ocm gcp create wif-config --name $WIF_NAME --project $GCP_PROJECT_ID
        </ClipboardCopy>
      </StackItem>
      <StackItem>
        <TextContent>
          <Text component={TextVariants.small}>
            This command creates all the necessary resources for deploying OSD on GCP using only
            temporary credentials. You can also run the command in manual mode.{' '}
            <ExternalLink noIcon href="#">
              Learn more (link TBD)
            </ExternalLink>
            .
          </Text>
        </TextContent>
      </StackItem>
      <StackItem>
        <TextContent>
          <Text component="h4">2. Select configuration</Text>
        </TextContent>
      </StackItem>
      {error && (
        <StackItem>
          <Alert variant="danger" isInline title="Error retrieving WIF configurations" />
        </StackItem>
      )}
      <StackItem>
        <Field
          component={WifConfigSelector}
          name={FieldId.GcpWifConfig}
          input={{
            ...getFieldProps(FieldId.GcpWifConfig),
            onChange: handleWifSelection,
          }}
          meta={getFieldMeta(FieldId.GcpWifConfig)}
          onRefresh={() => getWifConfigs('')}
          isLoading={isLoading}
          validate={validateWifConfig}
          wifConfigs={wifConfigs ?? []}
          selectedWifConfigID={selectedGcpWifConfig?.id}
        />
      </StackItem>
    </Stack>
  );
};

export { WorkloadIdentityFederation };
