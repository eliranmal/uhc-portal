import React from 'react';
import * as reactRedux from 'react-redux';

import * as useDeleteHtpasswdUser from '~/queries/ClusterDetailsQueries/AccessControlTab/UserQueries/useDeleteHtpasswdUser';
import * as useGlobalState from '~/redux/hooks/useGlobalState';
import { checkAccessibility, screen, withState } from '~/testUtils';

import DeleteHtpasswdUserDialog from './DeleteHtpasswdUserDialog';

jest.mock('react-redux', () => {
  const config = {
    __esModule: true,
    ...jest.requireActual('react-redux'),
  };
  return config;
});

jest.mock('~/redux/hooks/useGlobalState', () => ({
  useGlobalState: jest.fn(),
}));

const mockedUseDeleteHtpasswdUser = jest.spyOn(useDeleteHtpasswdUser, 'useDeleteHtpasswdUser');
const mockedUseGlobalState = jest.spyOn(useGlobalState, 'useGlobalState');

describe('<DeleteHtpasswdUserDialog />', () => {
  const refreshHtpasswdUsers = jest.fn();
  const mutate = jest.fn();
  const reset = jest.fn();
  const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
  const mockedDispatch = jest.fn();
  useDispatchMock.mockReturnValue(mockedDispatch);

  const defaultProps = {
    refreshHtpasswdUsers,
  };

  const defaultUseDeleteHtpasswdUserResponse = {
    isSuccess: false,
    error: { isLoading: false, isError: false, error: {} },
    isError: false,
    isPending: false,
    mutate,
    reset,
  };

  const defaultReduxState = {
    modal: {
      data: {
        clusterId: 'mockedClusterID',
        idpId: 'mockedIdpId',
        idpName: 'mockedIdpName',
        htpasswdUserId: 'mockedHtpasswdUserId',
        htpasswdUserName: 'mockedHtpasswdUserName',
        region: 'aws.ap-southeast-1.stage',
      },
    },
  };

  const checkForNoCalls = () => {
    expect(refreshHtpasswdUsers).not.toHaveBeenCalled();
    expect(mockedDispatch).not.toHaveBeenCalled();
    expect(mutate).not.toHaveBeenCalled();
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is accessible', async () => {
    // @ts-ignore
    mockedUseDeleteHtpasswdUser.mockReturnValue(defaultUseDeleteHtpasswdUserResponse);
    mockedUseGlobalState.mockReturnValueOnce(true);

    const { container } = withState(defaultReduxState).render(
      <DeleteHtpasswdUserDialog {...defaultProps} />,
    );

    await checkAccessibility(container);
  });

  // skipping as a mocking issue is occuring
  it.skip('does not call onClose prop when cancelled (using cancel button)', async () => {
    // @ts-ignore
    mockedUseDeleteHtpasswdUser.mockReturnValue(defaultUseDeleteHtpasswdUserResponse);
    mockedUseGlobalState.mockReturnValueOnce(true);

    const { user } = withState(defaultReduxState).render(
      <DeleteHtpasswdUserDialog {...defaultProps} />,
    );

    checkForNoCalls();

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(refreshHtpasswdUsers).not.toHaveBeenCalled();
    expect(mockedDispatch).toHaveBeenCalled();
    expect(mockedDispatch.mock.calls[0][0].type).toEqual('CLOSE_MODAL');
    expect(mutate).not.toHaveBeenCalled();
  });

  it('closes the modal on success', async () => {
    const newUseDeleteHtpasswdUserResponse = {
      ...defaultUseDeleteHtpasswdUserResponse,
      isSuccess: true,
      reset,
    };
    mockedUseGlobalState.mockReturnValueOnce(true);
    // @ts-ignore
    mockedUseDeleteHtpasswdUser.mockReturnValue(newUseDeleteHtpasswdUserResponse);

    checkForNoCalls();

    withState(defaultReduxState).render(<DeleteHtpasswdUserDialog {...defaultProps} />);
    expect(mockedDispatch).toHaveBeenCalled();
    expect(mockedDispatch.mock.calls[0][0].type).toEqual('CLOSE_MODAL');
    expect(refreshHtpasswdUsers).toHaveBeenCalled();
  });
});
