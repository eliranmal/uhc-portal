import React from 'react';

import { checkAccessibility, render, screen, userEvent } from '~/testUtils';

import { AcceptDeclineClusterTransferModal } from './AcceptDeclineTransferModal';

jest.mock('~/queries/ClusterActionsQueries/useClusterTransfer', () => ({
  useEditClusterTransfer: jest.fn(),
}));
const useClusterTransferMock = jest.requireMock(
  '~/queries/ClusterActionsQueries/useClusterTransfer',
);
const useEditClusterTransferMock = useClusterTransferMock.useEditClusterTransfer;

describe('<AcceptDeclineTransferModal />', () => {
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

    const { container } = render(<AcceptDeclineClusterTransferModal {...defaultProps} />);
    await checkAccessibility(container);
  });
  it('has expected button when modal is closed', async () => {
    useEditClusterTransferMock.mockReturnValue({
      isPending: false,
      isError: false,
      error: null,
      mutateEdit,
    });

    render(<AcceptDeclineClusterTransferModal {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Accept/Decline' })).toBeInTheDocument();
    // expect(screen.getByRole('button', { name: 'Decline Transfer' })).toBeInTheDocument();
    // expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });
  it('has expected buttons when modal is open', async () => {
    useEditClusterTransferMock.mockReturnValue({
      isPending: false,
      isError: false,
      error: null,
      mutateEdit,
    });

    render(<AcceptDeclineClusterTransferModal {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Accept/Decline' })).toBeInTheDocument();
    // click on button with Accept/Decline text
    await userEvent.click(screen.getByRole('button', { name: 'Accept/Decline' }));
    expect(screen.getByRole('button', { name: 'Accept Transfer' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Decline Transfer' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });
});
