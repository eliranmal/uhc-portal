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

const OpenShiftVirtualizationPanelBody = (
  <Stack hasGutter className="drawer-panel-content-body">
    <StackItem>
      <TextContent>
        <Text component={TextVariants.p}>
          Transition your virtual machines to a modern hybrid cloud application platform. Run your
          VMs alongside containers using the same set of tools and processes.
        </Text>
      </TextContent>
    </StackItem>

    <StackItem>
      <YoutubePlayer videoID="ZplrufNY9cY" />
      <TextContent>
        <Text component={TextVariants.small}>Video duration: 2:08</Text>
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
            <strong>Faster deployment times:</strong> When you run your workloads on a consistent
            platform, you streamline application development and deployment, accelerating time to
            market.
          </TextListItem>
          <TextListItem>
            <strong>Enhanced developer productivity:</strong> Harness the simplicity and speed of a
            modern hybrid application platform and enable self-service.
          </TextListItem>
          <TextListItem>
            <strong>Manage from 1 platform:</strong> With a single platform for VMs, containers, and
            serverless workloads, you can simplify your operations and standardize infrastructure
            deployment.
          </TextListItem>
        </TextList>
      </TextContent>
    </StackItem>
    <StackItem>
      <Title headingLevel="h3" data-testid="drawer-panel-content-capabilities-title">
        Migrating your VMs
      </Title>
    </StackItem>
    <StackItem>
      <TextContent>
        <TextList isPlain>
          <TextListItem>
            You can quickly and easily migrate your VMs from VMware vSphere to OpenShift
            Virtualization using the Migration Toolkit for Virtualization (MTV). You must have
            OpenShift Virtualization Operator installed to use MTV.
          </TextListItem>
        </TextList>
      </TextContent>
    </StackItem>
    <StackItem className="drawer-panel-content__learn-more">
      <ExternalLink
        data-testid="learn-more-about-redhat-openshift-virtualization-drawer-panel-content-link"
        href="https://docs.redhat.com/en/documentation/migration_toolkit_for_virtualization/2.0/html/installing_and_using_the_migration_toolkit_for_virtualization/about-mtv_mtv#mtv-resources-and-services_mtv"
      >
        Learn more about Migration Toolkit for Virtualization
      </ExternalLink>
    </StackItem>

    <StackItem>
      <Title headingLevel="h3" data-testid="drawer-panel-content-clouds-and-platforms-title">
        Manage your cluster and applications
      </Title>
    </StackItem>
    <StackItem>
      <TextContent>
        <Text component={TextVariants.p}>
          Using Red Hat Advanced Cluster Management for Kubernetes (RHACM), you can manage any
          Kubernetes cluster in your fleet. Using the self-service cluster deployment that
          automatically delivers applications, you can reduce operational costs.
        </Text>
      </TextContent>
    </StackItem>

    <StackItem className="drawer-panel-content__learn-more">
      <ExternalLink
        data-testid="learn-more-about-redhat-acm-drawer-panel-content-link"
        href="https://www.redhat.com/en/technologies/management/advanced-cluster-management?sc_cid=7013a000003ScmnAAC&gad_source=1"
      >
        Learn more about Red Hat Advanced Cluster Management for Kubernetes
      </ExternalLink>
    </StackItem>
  </Stack>
);

export { OpenShiftVirtualizationPanelBody };
