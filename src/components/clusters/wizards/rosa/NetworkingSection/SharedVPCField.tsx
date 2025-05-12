import React from 'react';
import { Field } from 'formik';

import { Grid, GridItem, Text, TextContent, TextVariants } from '@patternfly/react-core';

import links from '~/common/installLinks.mjs';
import { required, validatePrivateHostedZoneId, validateRoleARN } from '~/common/validators';
import { useFormState } from '~/components/clusters/wizards/hooks';
import ExternalLink from '~/components/common/ExternalLink';
import Instruction from '~/components/common/Instruction';
import Instructions from '~/components/common/Instructions';
import { ReduxVerticalFormGroup } from '~/components/common/ReduxFormComponents_deprecated';

import { FieldId } from '../constants';

import SharedVPCDomainSelect from './SharedVPCDomainSelect';

type HostedZoneHelpTextProps = { domainName?: string };

const HostedZoneHelpText = ({ domainName }: HostedZoneHelpTextProps) => (
  <TextContent>
    <Text component={TextVariants.small} className="pf-v5-u-color-100">
      Enter the private hosted zone ID that&apos;s linked to the AWS owner account you want to use.
      The private hosted zone must have been created with
      <strong className="pf-v5-u-font-size-md"> {domainName} </strong>as the domain name.
      <ExternalLink href={links.AWS_CONSOLE_HOSTED_ZONES}> AWS console</ExternalLink>
    </Text>
  </TextContent>
);

type SharedVPCFieldProps = { hostedZoneDomainName?: string };

const SharedVPCField = ({ hostedZoneDomainName }: SharedVPCFieldProps) => {
  const { setFieldValue, setFieldTouched, getFieldProps, getFieldMeta } = useFormState();
  const baseDnsDomainFieldName = `${FieldId.SharedVpc}.base_dns_domain`;
  const hostedZoneIdFieldName = `${FieldId.SharedVpc}.hosted_zone_id`;
  const hostedZoneRoleArnFieldName = `${FieldId.SharedVpc}.hosted_zone_role_arn`;
  return (
    <Grid>
      <GridItem span={10}>
        <Instructions wide>
          <Instruction simple>
            <TextContent className="pf-v5-u-pb-md">
              <Text component={TextVariants.p}>
                Select an existing base DNS domain or reserve a new base DNS domain.
              </Text>
            </TextContent>

            <Field
              label="Base DNS domain"
              name={baseDnsDomainFieldName}
              validate={required}
              component={SharedVPCDomainSelect}
              isRequired
              input={{
                ...getFieldProps(baseDnsDomainFieldName),
                onChange: (value: string) => setFieldValue(baseDnsDomainFieldName, value),
              }}
              meta={getFieldMeta(baseDnsDomainFieldName)}
            />
          </Instruction>

          <Instruction simple>
            <TextContent className="pf-v5-u-pb-md">
              <Text component={TextVariants.p}>
                Associate your DNS domain with a private hosted zone.
              </Text>
            </TextContent>
            <Field
              label="Private hosted zone ID"
              name={hostedZoneIdFieldName}
              component={ReduxVerticalFormGroup}
              validate={validatePrivateHostedZoneId}
              showHelpTextOnError={false}
              helpText={<HostedZoneHelpText domainName={hostedZoneDomainName} />}
              isRequired
              input={{
                ...getFieldProps(hostedZoneIdFieldName),
                onChange: (_: React.FormEvent<HTMLInputElement>, value: string) => {
                  setFieldTouched(hostedZoneIdFieldName);
                  setFieldValue(hostedZoneIdFieldName, value);
                },
              }}
              meta={getFieldMeta(hostedZoneIdFieldName)}
            />
          </Instruction>

          <Instruction simple>
            <TextContent className="pf-v5-u-pb-md">
              <Text component={TextVariants.p}>Provide the role ARN for the existing VPC.</Text>
            </TextContent>
            <Field
              label="Shared VPC role"
              name={hostedZoneRoleArnFieldName}
              component={ReduxVerticalFormGroup}
              validate={validateRoleARN}
              isRequired
              input={{
                ...getFieldProps(hostedZoneRoleArnFieldName),
                onChange: (_: React.FormEvent<HTMLInputElement>, value: string) => {
                  setFieldTouched(hostedZoneRoleArnFieldName);
                  setFieldValue(hostedZoneRoleArnFieldName, value);
                },
              }}
              meta={getFieldMeta(hostedZoneRoleArnFieldName)}
            />
          </Instruction>
        </Instructions>
      </GridItem>
    </Grid>
  );
};

export default SharedVPCField;
