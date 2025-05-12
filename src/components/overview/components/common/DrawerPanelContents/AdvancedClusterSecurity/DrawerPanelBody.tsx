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

const AdvancedClusterSecurityDrawerPanelBody = (
  <Stack hasGutter className="drawer-panel-content-body">
    <StackItem>
      <TextContent>
        <Text component={TextVariants.p}>
          Security shouldn’t be an afterthought. Build, deploy, and run your cloud-native
          applications with more security and protect your platform using Advanced Cluster Security
          for Kubernetes.
        </Text>
        <Text component={TextVariants.p}>
          Conduct security sooner by automating DevSecOps and mitigating security issues early in
          the container lifecycle.
        </Text>
      </TextContent>
    </StackItem>

    <StackItem>
      <YoutubePlayer videoID="lFBFW3HmgsA" />
      <TextContent>
        <Text component={TextVariants.small}>Video duration 2:21</Text>
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
            <b>Lower operational cost:</b> Reduce cost by catching and fixing a security issue in
            the development stage.
          </TextListItem>
          <TextListItem>
            <b>Reduce operational risk:</b> Align security and infrastructure to reduce application
            downtime using built-in Kubernetes capabilities.
          </TextListItem>
          <TextListItem>
            <b>Ensure compliance standards:</b> Enable compliance with built-in checks for critical
            security standards and regulations.
          </TextListItem>
          <TextListItem>
            <b>Find threats quicker:</b> Detect and respond to threats, such as:
          </TextListItem>
          <TextList>
            {[
              'Unauthorized access',
              'Cryptomining',
              'Privilege escalation',
              'Lateral movement',
            ].map((item) => (
              <TextListItem data-testid="threat-example-list-item">{item}</TextListItem>
            ))}
          </TextList>
        </TextList>
      </TextContent>
    </StackItem>
    <StackItem>
      <Title headingLevel="h3" data-testid="drawer-panel-content-use-cases-title">
        Use cases:
      </Title>
    </StackItem>
    <StackItem>
      <TextContent>
        <TextList isPlain>
          <TextListItem>
            <b>Supply chain security:</b> Provide developers with security context in their existing
            workflows and integrate security into your CI/CD pipelines and image registries.
          </TextListItem>
          <TextListItem>
            <b>Infrastructure security:</b> Maintain security and prevent insecure access and
            authorizations with existing role-based access (RBAC) rules and hardening your
            organization’s environment.
          </TextListItem>
          <TextListItem>
            <b>Workload security:</b> Prevent high-risk workloads from being deployed or run using
            out-of-the-box deploy-time and runtime policies and monitor known good behavior to
            configure custom policies and alerts.
          </TextListItem>
        </TextList>
      </TextContent>
    </StackItem>

    <StackItem className="drawer-panel-content__learn-more">
      <ExternalLink
        data-testid="learn-more-about-advanced-cluster-security-drawer-panel-content-link"
        href="https://catalog.redhat.com/software/container-stacks/detail/60eefc88ee05ae7c5b8f041c"
      >
        Learn more about Advanced Cluster Security
      </ExternalLink>
    </StackItem>
  </Stack>
);

export { AdvancedClusterSecurityDrawerPanelBody };
