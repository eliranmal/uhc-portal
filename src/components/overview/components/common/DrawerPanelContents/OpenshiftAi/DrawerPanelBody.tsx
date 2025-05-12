import React from 'react';

import {
  Stack,
  StackItem,
  Text,
  TextContent,
  TextList,
  TextListItem,
  TextVariants,
  Title,
} from '@patternfly/react-core';

import ExternalLink from '~/components/common/ExternalLink';
import { YoutubePlayer } from '~/components/common/YoutubePlayer/YoutubePlayer';

const OpenShiftAiDrawerPanelBody = (
  <Stack hasGutter className="drawer-panel-content-body">
    <StackItem>
      <TextContent>
        <Text component={TextVariants.p}>
          Build, train, tune, and deploy AI models at scale across hybrid cloud environments with
          Red Hat OpenShift AI, an AI platform.
        </Text>
      </TextContent>
    </StackItem>

    <StackItem>
      <YoutubePlayer videoID="JGesQwL-lkg" />
      <TextContent>
        <Text component={TextVariants.small}>Video duration 5:26</Text>
      </TextContent>
    </StackItem>

    <StackItem>
      <Title headingLevel="h3" data-testid="drawer-panel-content-benefits-title">
        Benefits
      </Title>
    </StackItem>
    <StackItem>
      <TextContent>
        <TextList isPlain>
          <TextListItem>
            <b>Innovate faster:</b> Iterate and experiment quickly with a single platform for the
            entire AI platform. No need to switch between different tools.
          </TextListItem>
          <TextListItem>
            <b>Scale easily:</b> Built on Kubernetes, OpenShift AI allows for easy scaling of AI
            workloads.
          </TextListItem>
          <TextListItem>
            <b>Enhance collaboration:</b> Bring together your data scientist, operations, and
            developer teams in a unified AI platform.
          </TextListItem>
        </TextList>
      </TextContent>
    </StackItem>
    <StackItem>
      <Title headingLevel="h3" data-testid="drawer-panel-content-capabilities-title">
        Capabilities
      </Title>
    </StackItem>
    <StackItem>
      <TextContent>
        <TextList isPlain>
          <TextListItem>
            <b>Model training- projects:</b> Organize model development files, data connections, and
            other artifacts needed for a given project. Projects can be shared with specific
            permissions to enable collaboration with colleagues.
          </TextListItem>
          <TextListItem>
            <b>Model training- distributed workloads:</b> Leverage multiple cluster nodes
            simultaneously for faster, more efficient model training. It can be used for both
            predictive AI training and GenAI training.
          </TextListItem>
          <TextListItem>
            <b>Notebook images:</b> Choose from a default set of pre-configured notebook images or
            use your own custom notebook images.
          </TextListItem>
          <TextListItem>
            <b>Model serving:</b> Data scientists can deploy trained machine-learning models to
            serve intelligent applications in production. You have control over how this serving is
            performed.
          </TextListItem>
          <TextListItem>
            <b>Accelerators:</b> Scale your work, reduce latency, and increase productivity with
            NVIDIA graphics processing units (GPUs) or Habana Gaudi devices.
          </TextListItem>
        </TextList>
      </TextContent>
    </StackItem>

    <StackItem>
      <Title headingLevel="h3" data-testid="drawer-panel-content-clouds-and-platforms-title">
        Clouds and platforms
      </Title>
    </StackItem>
    <StackItem>
      <TextContent>
        <Text component={TextVariants.p}>
          You can choose where to develop and deploy your models. Red Hat OpenShift AI lets you
          choose the environment that best suits your needs from:
        </Text>
      </TextContent>
    </StackItem>
    <StackItem>
      <TextContent>
        <Text component={TextVariants.p}>On-premise (including disconnected environments)</Text>
      </TextContent>
    </StackItem>
    <StackItem>
      <TextContent>
        <Text component={TextVariants.p}>Any major public cloud, such as:</Text>
      </TextContent>
    </StackItem>
    <StackItem>
      <TextContent>
        <TextList>
          {[
            'Microsoft Azure Kubernetes Service (AKS)',
            'Google Cloud Platform (GCP)',
            'Amazon Web Services (AWS)',
            'IBM Cloud Platform',
          ].map((item) => (
            <TextListItem data-testid="major-public-cloud-list-item">{item}</TextListItem>
          ))}
        </TextList>
      </TextContent>
    </StackItem>

    <StackItem className="drawer-panel-content__learn-more">
      <ExternalLink
        data-testid="learn-more-about-redhat-openshift-ai-drawer-panel-content-link"
        href="https://catalog.redhat.com/software/container-stacks/detail/63b85b573112fe5a95ee9a3a"
      >
        Learn more about Red Hat OpenShift AI
      </ExternalLink>
    </StackItem>
  </Stack>
);

export { OpenShiftAiDrawerPanelBody };
