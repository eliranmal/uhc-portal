import React, { useCallback } from 'react';

import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Flex,
  FlexItem,
  Icon,
  Title,
} from '@patternfly/react-core';
import CubeIcon from '@patternfly/react-icons/dist/esm/icons/cube-icon';

import { Link } from '~/common/routing';
import CreateManagedClusterTooltip from '~/components/common/CreateManagedClusterTooltip';
import InternalTrackingLink from '~/components/common/InternalTrackingLink';
import { useCanCreateManagedCluster } from '~/queries/ClusterDetailsQueries/useFetchActionsPermissions';

interface CreateClusterCardProps {
  linkComponentURL: string;
  title: string;
  bodyContent: string;
  createClusterBtnTitle: string;
}

export const CreateClusterCard = ({
  linkComponentURL,
  title,
  bodyContent,
  createClusterBtnTitle,
}: CreateClusterCardProps) => {
  const LinkComponent = useCallback(
    (props: any) => <Link data-testid="register-cluster" to={linkComponentURL} {...props} />,
    [linkComponentURL],
  );
  const { canCreateManagedCluster } = useCanCreateManagedCluster();

  const createClusterBtn = (
    <InternalTrackingLink
      isButton
      data-testid="register-cluster"
      variant="primary"
      to={linkComponentURL}
      component={LinkComponent}
      isAriaDisabled={!canCreateManagedCluster}
    >
      {createClusterBtnTitle}
    </InternalTrackingLink>
  );

  return (
    <Card>
      <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
        <FlexItem>
          <CardHeader>
            <CardTitle>
              <Title headingLevel="h3">
                <Icon size="md">
                  <CubeIcon className="pf-v5-u-mr-sm rosa-cube-icon" />
                </Icon>
                {title}
              </Title>
            </CardTitle>
          </CardHeader>
          <CardBody>{bodyContent}</CardBody>
          <CardFooter>
            <Flex>
              <FlexItem>
                {!canCreateManagedCluster ? (
                  <CreateManagedClusterTooltip>{createClusterBtn}</CreateManagedClusterTooltip>
                ) : (
                  createClusterBtn
                )}
              </FlexItem>
            </Flex>
          </CardFooter>
        </FlexItem>
      </Flex>
    </Card>
  );
};
