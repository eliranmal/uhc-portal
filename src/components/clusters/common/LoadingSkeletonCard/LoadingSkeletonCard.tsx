import React from 'react';

import { Card, CardBody, CardFooter, CardTitle, Skeleton } from '@patternfly/react-core';

type FontSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

interface LoadingSkeletonCardProps {
  titleFontSize?: FontSize;
  bodyFontSize?: FontSize;
  footerFontSize?: FontSize;
}

export const LoadingSkeletonCard = ({
  titleFontSize = 'md',
  bodyFontSize = 'lg',
  footerFontSize = 'md',
}: LoadingSkeletonCardProps) => (
  <Card>
    <CardTitle>
      <Skeleton fontSize={titleFontSize} screenreaderText="Loading..." />
    </CardTitle>
    <CardBody>
      <Skeleton fontSize={bodyFontSize} screenreaderText="Loading..." />
    </CardBody>
    <CardFooter>
      <Skeleton fontSize={footerFontSize} screenreaderText="Loading..." />
    </CardFooter>
  </Card>
);
