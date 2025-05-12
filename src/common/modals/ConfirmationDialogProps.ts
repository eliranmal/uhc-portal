import { ReactNode } from 'react';

type ConfirmationDialogProps = {
  title: string;
  content: ReactNode;
  primaryActionLabel?: string;
  primaryAction?: () => void;
  secondaryActionLabel?: string;
  secondaryAction?: () => void;
  variant?: 'small' | 'medium' | 'large' | 'default';
  onClose?: () => void;
  isOpen?: boolean;
};

export { ConfirmationDialogProps };
