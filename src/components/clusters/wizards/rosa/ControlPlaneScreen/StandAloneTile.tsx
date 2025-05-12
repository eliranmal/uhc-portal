import React from 'react';

import { List, Text, TextVariants, Tile } from '@patternfly/react-core';

import { defaultMarginBottomSpacing, hypershiftValue, ListItem } from './ControlPlaneCommon';

type StandAloneTileProps = {
  handleChange: (string: hypershiftValue) => void;
  isSelected: boolean;
};

const StandAloneTile = ({ handleChange, isSelected }: StandAloneTileProps) => (
  <Tile
    title="Classic"
    isDisplayLarge
    isStacked
    isSelected={isSelected}
    onClick={() => handleChange('false')}
    className="controlPlaneScreenTile"
    data-testid="standalone-control-planes"
  >
    <Text component={TextVariants.p} className={defaultMarginBottomSpacing}>
      Run an OpenShift cluster with a coupled control and data plane, hosted on dedicated nodes with
      a shared network
    </Text>
    <List isPlain className={defaultMarginBottomSpacing}>
      <ListItem>Control plane resources are hosted in your own AWS account</ListItem>
      <ListItem>Full compliance certifications</ListItem>
      <ListItem>Red Hat SRE managed</ListItem>
    </List>
  </Tile>
);

export default StandAloneTile;
