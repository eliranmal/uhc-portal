import React from 'react';

import { checkAccessibility, render, screen, userEvent } from '~/testUtils';

import { CancelClusterTransferModal } from './CancelClusterTransferModal';

jest.mock('~/queries/ClusterActionsQueries/useClusterTransfer', () => ({
  useEditClusterTransfer: jest.fn(),
}));
const useClusterTransferMock = jest.requireMock(
  '~/queries/ClusterActionsQueries/useClusterTransfer',
);
const useEditClusterTransferMock = useClusterTransferMock.useEditClusterTransfer;

describe('<CancelTransferModal />', () => {
  const defaultProps = {
    transferId: 'test-id',
    onClose: () => {},
    isOpen: true,
  };
  const mutateEdit = jest.fn();

  beforeEach(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is accessible', async () => {
    useEditClusterTransferMock.mockReturnValue({
      isPending: false,
      isError: false,
      error: null,
      mutateEdit,
    });

    const { container } = render(<CancelClusterTransferModal {...defaultProps} />);
    await checkAccessibility(container);
  });
  it('has expected buttons when modal is closed', async () => {
    useEditClusterTransferMock.mockReturnValue({
      isPending: false,
      isError: false,
      error: null,
      mutateEdit,
    });

    render(<CancelClusterTransferModal {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });
  it('has expected buttons when modal is open', async () => {
    useEditClusterTransferMock.mockReturnValue({
      isPending: false,
      isError: false,
      error: null,
      mutateEdit,
    });

    render(<CancelClusterTransferModal {...defaultProps} />);

    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.getByRole('button', { name: 'Cancel Transfer' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });
});
