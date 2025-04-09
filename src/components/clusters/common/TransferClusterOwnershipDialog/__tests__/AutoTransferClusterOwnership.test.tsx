import React from 'react';
import * as reactRedux from 'react-redux';

import getClusterName from '~/common/getClusterName';
import { useGlobalState } from '~/redux/hooks';
import { render, screen } from '~/testUtils';

import AutoTransferClusterOwnershipForm from '../AutoTransferClusterOwnershipForm';

jest.mock('~/redux/hooks', () => ({
  useGlobalState: jest.fn(),
}));

jest.mock('react-redux', () => {
  const config = {
    __esModule: true,
    ...jest.requireActual('react-redux'),
  };
  return config;
});

jest.mock('~/common/getClusterName', () => jest.fn());
jest.mock(
  '~/queries/ClusterDetailsQueries/AccessControlTab/ClusterTransferOwnership/useFetchClusterTransfer',
  () => ({ useFetchClusterTransfer: jest.fn() }),
);
jest.mock('~/queries/ClusterActionsQueries/useClusterTransfer', () => ({
  useCreateClusterTransfer: jest.fn(),
  useEditClusterTransfer: jest.fn(),
}));
const useClusterTransferMock = jest.requireMock(
  '~/queries/ClusterActionsQueries/useClusterTransfer',
);
const useFetchClusterTransferMock = jest.requireMock(
  '~/queries/ClusterDetailsQueries/AccessControlTab/ClusterTransferOwnership/useFetchClusterTransfer',
);
const useEditClusterTransferMock = useClusterTransferMock.useEditClusterTransfer;
const useCreateClusterTransferMock = useClusterTransferMock.useCreateClusterTransfer;
const useFetchTransferMock = useFetchClusterTransferMock.useFetchClusterTransfer;

const useGlobalStateMock = useGlobalState as jest.Mock;
const getClusterNameMock = getClusterName as jest.Mock;

const username = 'testuser';

describe('<AutoTransferClusterOwnershipForm />', () => {
  const onClose = jest.fn();
  const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
  const mockedDispatch = jest.fn();
  const mutateCreate = jest.fn();
  const mutateEdit = jest.fn();
  const reset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useDispatchMock.mockReturnValue(mockedDispatch);
  });

  it('should show modal for initiating transfer', async () => {
    useCreateClusterTransferMock.mockReturnValue({
      isPending: false,
      isError: false,
      error: null,
      mutateCreate,
      isSuccess: true,
      data: undefined,
      reset,
    });
    useEditClusterTransferMock.mockReturnValue({
      isPending: false,
      isError: false,
      error: null,
      mutateEdit,
    });
    useFetchTransferMock.mockReturnValue({
      data: {
        items: [],
      },
      isLoading: false,
      isError: false,
      error: null,
      isFetching: false,
    });

    useGlobalStateMock.mockReturnValue(username);
    getClusterNameMock.mockReturnValue('test');

    render(<AutoTransferClusterOwnershipForm onClose={onClose} />);

    expect(await screen.findByText('Transfer ownership of test')).toBeInTheDocument();
  });

  it('should show form for transferring cluster and initiate button should be disabled', async () => {
    useGlobalStateMock.mockReturnValueOnce(username);

    useCreateClusterTransferMock.mockReturnValue({
      isPending: false,
      isError: false,
      error: null,
      mutateCreate,
      isSuccess: true,
      data: undefined,
      reset,
    });
    useEditClusterTransferMock.mockReturnValue({
      isPending: false,
      isError: false,
      error: null,
      mutateEdit,
    });
    useFetchTransferMock.mockReturnValue({
      data: {
        items: [],
      },
      isLoading: false,
      isError: false,
      error: null,
      isFetching: false,
    });

    render(<AutoTransferClusterOwnershipForm onClose={onClose} />);

    // Assert
    expect(await screen.findByText('Username')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Initiate transfer' })).toBeDisabled();
  });
});
