import React, { useState } from 'react';
import { Field } from 'formik';

import { Alert, AlertActionLink, ExpandableSection } from '@patternfly/react-core';

import { SupportedFeature } from '~/common/featureCompatibility';
import links from '~/common/installLinks.mjs';
import { validateSecurityGroups } from '~/common/validators';
import { getIncompatibleVersionReason } from '~/common/versionCompatibility';
import EditSecurityGroups from '~/components/clusters/ClusterDetailsMultiRegion/components/SecurityGroups/EditSecurityGroups';
import SecurityGroupsEmptyAlert from '~/components/clusters/ClusterDetailsMultiRegion/components/SecurityGroups/SecurityGroupsEmptyAlert';
import { CheckboxField } from '~/components/clusters/wizards/form';
import { useFormState } from '~/components/clusters/wizards/hooks';
import { FieldId } from '~/components/clusters/wizards/osd/constants';
import { CloudVpc } from '~/types/clusters_mgmt.v1';

type SecurityGroupFieldProps = {
  selectedVPC: CloudVpc;
  label?: string;
  input: { onChange: (selectedGroupIds: string[]) => void; value: string[] };
  isHypershift: boolean;
};

const fieldId = 'securityGroups';

const SecurityGroupField = ({
  input: { onChange, value: selectedGroupIds },
  label,
  selectedVPC,
  isHypershift,
}: SecurityGroupFieldProps) => (
  <EditSecurityGroups
    label={label}
    selectedVPC={selectedVPC}
    selectedGroupIds={selectedGroupIds}
    isReadOnly={false}
    onChange={onChange}
    isHypershift={isHypershift}
  />
);

const SecurityGroupsSection = () => {
  const {
    values: {
      [FieldId.SelectedVpc]: selectedVPC,
      [FieldId.ClusterVersion]: version,
      [FieldId.SecurityGroups]: securityGroups,
    },
    getFieldProps,
    setFieldValue,
  } = useFormState();

  const { applyControlPlaneToAll } = securityGroups;
  const selectedGroups = applyControlPlaneToAll
    ? securityGroups.controlPlane
    : securityGroups.controlPlane.concat(securityGroups.infra).concat(securityGroups.worker);
  const [isExpanded, setIsExpanded] = useState<boolean>(selectedGroups.length > 0);

  if (!selectedVPC.id) {
    return null;
  }

  const setValue = (fieldName: string) => (value: string) => setFieldValue(fieldName, value);
  const onExpandToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const incompatibleReason = getIncompatibleVersionReason(
    SupportedFeature.SECURITY_GROUPS,
    version?.raw_id,
    { day1: true },
  );
  const showEmptyAlert =
    !incompatibleReason && (selectedVPC.aws_security_groups || []).length === 0;

  return (
    <ExpandableSection
      toggleText="Additional security groups"
      isExpanded={isExpanded}
      onToggle={onExpandToggle}
    >
      {incompatibleReason && <div>{incompatibleReason}</div>}
      {showEmptyAlert && <SecurityGroupsEmptyAlert />}
      {!incompatibleReason && !showEmptyAlert && (
        <>
          <Alert
            variant="info"
            isInline
            title="You cannot add or edit security groups associated with the control plane nodes, infrastructure nodes, or machine pools that were created by default during cluster creation."
            actionLinks={
              <>
                <AlertActionLink component="a" href={links.OSD_SECURITY_GROUPS} target="_blank">
                  View more information
                </AlertActionLink>
                <AlertActionLink
                  component="a"
                  href={links.AWS_CONSOLE_SECURITY_GROUPS}
                  target="_blank"
                >
                  AWS security groups console
                </AlertActionLink>
              </>
            }
          />
          <br />
          <Field
            component={CheckboxField}
            name={`${fieldId}.applyControlPlaneToAll`}
            label="Apply the same security groups to all node types (control plane, infrastructure, worker)"
            input={{
              ...getFieldProps(`${fieldId}.applyControlPlaneToAll`),
              onChange: (_event: React.FormEvent<HTMLInputElement>, checked: boolean) =>
                setFieldValue(`${fieldId}.applyControlPlaneToAll`, checked),
            }}
          />
          <Field
            component={SecurityGroupField}
            name={`${fieldId}.controlPlane`}
            label={applyControlPlaneToAll ? '' : 'Control plane nodes'}
            selectedVPC={selectedVPC}
            validate={(securityGroupIds: string[]) =>
              validateSecurityGroups(securityGroupIds, false)
            }
            input={{
              ...getFieldProps(`${fieldId}.controlPlane`),
              onChange: setValue(`${fieldId}.controlPlane`),
            }}
          />
          {!applyControlPlaneToAll && (
            <>
              <Field
                component={SecurityGroupField}
                name={`${fieldId}.infra`}
                label="Infrastructure nodes"
                selectedVPC={selectedVPC}
                validate={(securityGroupIds: string[]) =>
                  validateSecurityGroups(securityGroupIds, false)
                }
                input={{
                  ...getFieldProps(`${fieldId}.infra`),
                  onChange: setValue(`${fieldId}.infra`),
                }}
              />
              <Field
                component={SecurityGroupField}
                name={`${fieldId}.worker`}
                label="Worker nodes"
                selectedVPC={selectedVPC}
                validate={(securityGroupIds: string[]) =>
                  validateSecurityGroups(securityGroupIds, false)
                }
                input={{
                  ...getFieldProps(`${fieldId}.worker`),
                  onChange: setValue(`${fieldId}.worker`),
                }}
              />
            </>
          )}
        </>
      )}
    </ExpandableSection>
  );
};

export default SecurityGroupsSection;
