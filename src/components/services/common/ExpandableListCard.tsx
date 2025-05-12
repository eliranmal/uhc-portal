import React from 'react';

import {
  Card,
  ExpandableSection,
  List,
  ListItem,
  Text,
  TextVariants,
} from '@patternfly/react-core';

import { ExpandalbeContents } from '../servicePageData/expandableContentsData';

interface ExpandableListCardProps {
  items: ExpandalbeContents[];
}

export const ExpandableListCard = ({ items }: ExpandableListCardProps) => (
  <Card>
    <List isPlain isBordered>
      {items.map(({ title, contents }) => (
        <ListItem className="rosa-expandable-list-item" key={title}>
          <ExpandableSection
            className="rosa-expandable-section"
            toggleContent={<Text component={TextVariants.h3}>{title}</Text>}
            displaySize="lg"
          >
            {contents}
          </ExpandableSection>
        </ListItem>
      ))}
    </List>
  </Card>
);
