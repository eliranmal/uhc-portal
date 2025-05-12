import React from 'react';

import {
  Alert,
  AlertVariant,
  ButtonVariant,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Grid,
  GridItem,
  PageSection,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextList,
  TextListItem,
  TextVariants,
  Title,
} from '@patternfly/react-core';

import links from '~/common/installLinks.mjs';
import { AppPage } from '~/components/App/AppPage';
import Breadcrumbs from '~/components/common/Breadcrumbs';
import ExternalLink from '~/components/common/ExternalLink';
import Instruction from '~/components/common/Instruction';
import Instructions from '~/components/common/Instructions';
import PageTitle from '~/components/common/PageTitle';

import StepCreateNetwork from './StepCreateAWSAccountRoles/StepCreateNetwork';
import StepCreateAWSAccountRoles from './StepCreateAWSAccountRoles';
import StepDownloadROSACli from './StepDownloadROSACli';
import WithCLICard from './WithCLICard';
import WithTerraformCard from './WithTerraformCard';
import WithWizardCard from './WithWizardCard';

import '../createROSAWizard.scss';

export const productName = 'Red Hat OpenShift Service on AWS';
const title = (productName: string = '') => `Set up ${productName} (ROSA)`;

const breadcrumbs = (
  <Breadcrumbs
    path={[
      { label: 'Cluster List' },
      { label: 'Cluster Type', path: '/create' },
      { label: 'Set up ROSA' },
    ]}
  />
);

const CreateRosaGetStarted = () => (
  <AppPage>
    <PageTitle breadcrumbs={breadcrumbs} title={title(productName)}>
      <TextContent className="pf-v5-u-mt-md pf-v5-u-mb-md">
        <Text component={TextVariants.p}>
          Deploy fully operational and managed Red Hat OpenShift clusters while leveraging the full
          breadth and depth of AWS using ROSA.
        </Text>
        <Text component={TextVariants.p}>
          Learn more about <ExternalLink href={links.WHAT_IS_ROSA}>ROSA</ExternalLink> or{' '}
          <ExternalLink href={links.ROSA_COMMUNITY_SLACK}>Slack us</ExternalLink>
        </Text>
      </TextContent>
      <Alert
        variant={AlertVariant.info}
        isInline
        id="env-override-message"
        component="h2"
        title={<>ROSA in AWS GovCloud (US) with FedRAMP</>}
      >
        <ExternalLink data-testid="rosa-aws-fedramp" href={links.ROSA_AWS_FEDRAMP}>
          Learn more about ROSA in AWS GovCloud (US) with FedRAMP
        </ExternalLink>
        or start the onboarding process with the
        <ExternalLink
          data-testid="fedramp-access-request-form"
          href={links.FEDRAMP_ACCESS_REQUEST_FORM}
        >
          FedRAMP access request form
        </ExternalLink>
      </Alert>
    </PageTitle>
    <PageSection>
      <Stack hasGutter>
        {/* ************ Start of AWS prerequisites section ***************** */}
        <StackItem>
          <Card>
            <CardTitle>
              <Title headingLevel="h2">Complete AWS prerequisites</Title>
            </CardTitle>
            <CardBody>
              <TextContent>
                <Title headingLevel="h3">Have you prepared your AWS account?</Title>
                <Text component={TextVariants.p}>
                  Make sure your AWS account is set up for ROSA deployment. If you&apos;ve already
                  set it up, you can continue to the ROSA prerequisites.
                </Text>

                <Grid hasGutter span={10}>
                  <GridItem span={4}>
                    <TextList>
                      <TextListItem>Enable AWS</TextListItem>
                      <TextListItem>Configure Elastic Load Balancer (ELB)</TextListItem>
                    </TextList>
                  </GridItem>

                  <GridItem span={6}>
                    <TextList>
                      <TextListItem>
                        Set up a VPC for ROSA HCP clusters (optional for ROSA classic clusters)
                      </TextListItem>
                      <TextListItem>Verify your quotas on AWS console</TextListItem>
                    </TextList>
                  </GridItem>
                </Grid>

                <ExternalLink
                  className="pf-v5-u-mt-md"
                  href={links.AWS_CONSOLE_ROSA_HOME_GET_STARTED}
                  isButton
                  variant={ButtonVariant.secondary}
                >
                  Open AWS Console
                </ExternalLink>
              </TextContent>
            </CardBody>
          </Card>
        </StackItem>
        <StackItem>
          <Card>
            <CardBody>
              <Split className="pf-v5-u-mb-lg">
                <SplitItem isFilled>
                  <Title headingLevel="h2">Complete ROSA prerequisites</Title>
                </SplitItem>
                <SplitItem>
                  <ExternalLink href={links.AWS_ROSA_GET_STARTED}>
                    More information on ROSA setup
                  </ExternalLink>
                </SplitItem>
              </Split>

              {/* ************* START OF PREREQ STEPS ******************* */}
              <Instructions wide>
                <Instruction simple>
                  <StepDownloadROSACli />
                </Instruction>

                <Instruction simple>
                  <StepCreateAWSAccountRoles />
                </Instruction>

                <Instruction simple>
                  <StepCreateNetwork />
                </Instruction>
              </Instructions>
            </CardBody>
          </Card>
        </StackItem>
        {/* ************ Start of Deploy the cluster and setup access cards ***************** */}
        <StackItem>
          <Card>
            <CardHeader className="rosa-get-started">
              <CardTitle>
                <Title headingLevel="h2" size="xl">
                  Deploy the cluster and set up access
                </Title>
                <Text component={TextVariants.p} className="pf-v5-u-font-weight-normal">
                  Select a deployment method
                </Text>
              </CardTitle>
            </CardHeader>

            <CardBody>
              <Grid hasGutter>
                <GridItem span={4}>
                  <WithCLICard />
                </GridItem>
                <GridItem span={4}>
                  <WithWizardCard />
                </GridItem>
                <GridItem span={4}>
                  <WithTerraformCard />
                </GridItem>
              </Grid>
            </CardBody>
          </Card>
        </StackItem>
      </Stack>
    </PageSection>
  </AppPage>
);

export default CreateRosaGetStarted;
