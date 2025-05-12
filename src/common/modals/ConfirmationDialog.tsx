import React, { ReactNode } from 'react';

import { Button, Modal } from '@patternfly/react-core';

type ConfirmationDialogProps = {
  title: string;
  content: ReactNode;
  primaryActionLabel?: string;
  primaryAction?: () => void;
  secondaryActionLabel?: string;
  secondaryAction?: () => void;
  variant?: 'small' | 'medium' | 'large' | 'default';
  closeCallback: () => void;
  isOpen?: boolean;
};

const ConfirmationDialog = ({
  title,
  content,
  primaryActionLabel = 'Confirm',
  primaryAction,
  secondaryActionLabel = 'Cancel',
  secondaryAction,
  isOpen = false,
  variant = 'small',
  closeCallback,
}: ConfirmationDialogProps) => {
  const handlePrimaryAction = () => {
    if (primaryAction) {
      primaryAction();
    }
    closeCallback();
  };

  const handleSecondaryAction = () => {
    if (secondaryAction) {
      secondaryAction();
    }
    closeCallback();
  };

  // otherwise keypress event could collide with parent modal in case of modal opening modal
  return isOpen ? (
    <Modal
      id="confirmation-dialog"
      title={title}
      onClose={closeCallback}
      variant={variant}
      isOpen
      actions={[
        <Button key="confirm" variant="primary" onClick={handlePrimaryAction}>
          {primaryActionLabel}
        </Button>,
        <Button key="cancel" variant="link" onClick={handleSecondaryAction}>
          {secondaryActionLabel}
        </Button>,
      ]}
    >
      {content}
    </Modal>
  ) : null;
};

export { ConfirmationDialog };
