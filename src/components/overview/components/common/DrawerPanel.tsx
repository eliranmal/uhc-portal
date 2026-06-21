import React from 'react';

import {
  Divider,
  DrawerActions,
  DrawerCloseButton,
  DrawerContentBody,
  DrawerHead,
} from '@patternfly/react-core';

import { DrawerPanelContentNode } from './DrawerPanelContent';

type DrawerPanelProps = {
  content: DrawerPanelContentNode;
  onClose: () => void;
};

const DrawerPanel = ({ content, onClose }: DrawerPanelProps) => {
  const handleClose = () => {
    onClose?.();
  };

  return (
    <>
      <DrawerHead>
        {content?.head}
        <DrawerActions>
          <DrawerCloseButton onClick={handleClose} data-testid="drawer-close-button" />
        </DrawerActions>
      </DrawerHead>
      <Divider component="div" data-testid="drawer-panel-divider" />
      <DrawerContentBody hasPadding>{content?.body}</DrawerContentBody>
    </>
  );
};

export default DrawerPanel;
