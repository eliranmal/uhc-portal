import React from 'react';
import * as reactRedux from 'react-redux';

import * as useUpdateDeleteProtections from '~/queries/ClusterDetailsQueries/useUpdateDeleteProtection';
import { checkAccessibility, screen, withState } from '~/testUtils';

import DeleteProtectionModal from './DeleteProtectionModal';

jest.mock('react-redux', () => {
  const config = {
    __esModule: true,
    ...jest.requireActual('react-redux'),
  };
  return config;
});

const mockedUseUpdateDeleteProtections = jest.spyOn(
  useUpdateDeleteProtections,
  'useUpdateDeleteProtections',
);

describe('<DeleteProtectionModal />', () => {
  const onClose = jest.fn();
  const mutate = jest.fn();
  const reset = jest.fn();

  const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
  const mockedDispatch = jest.fn();
  useDispatchMock.mockReturnValue(mockedDispatch);

  const defaultProps = {
    onClose,
  };

  const defaultState = {
    modal: {
      data: {
        clusterID: 'myClusterId',
        protectionEnabled: false,
        region: 'myRegion',
      },
    },
  };

  const defaultResponse = {
    mutate,
    isSuccess: false,
    isPending: false,
    error: null,
    isError: false,
    data: undefined,
    reset,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is accessible', async () => {
    mockedUseUpdateDeleteProtections.mockReturnValue(defaultResponse);
    const { container } = withState(defaultState).render(
      <DeleteProtectionModal {...defaultProps} />,
    );
    await checkAccessibility(container);
  });

  it('displays an error message when enabling has failed', () => {
    mockedUseUpdateDeleteProtections.mockReturnValue({
      ...defaultResponse,
      isError: true,
      error: { errorMessage: 'I am an error', operationID: 'error_id' },
    });
    withState(defaultState).render(<DeleteProtectionModal {...defaultProps} />);
    expect(screen.getByText('Error enabling Delete Protection')).toBeInTheDocument();
    expect(screen.getByText('I am an error')).toBeInTheDocument();
  });

  it('displays an error message when disabling has failed', () => {
    const disablingState = {
      ...defaultState,
      modal: {
        ...defaultState.modal,
        data: { ...defaultState.modal.data, protectionEnabled: true },
      },
    };
    mockedUseUpdateDeleteProtections.mockReturnValue({
      ...defaultResponse,
      isError: true,
      error: { errorMessage: 'I am an error', operationID: 'error_id' },
    });
    withState(disablingState).render(<DeleteProtectionModal {...defaultProps} />);
    expect(screen.getByText('Error disabling Delete Protection')).toBeInTheDocument();
    expect(screen.getByText('I am an error')).toBeInTheDocument();
  });

  it('sends correct info to mutate function', async () => {
    expect(defaultState.modal.data.protectionEnabled).toBeFalsy();

    mockedUseUpdateDeleteProtections.mockReturnValue(defaultResponse);
    const { user } = withState(defaultState).render(<DeleteProtectionModal {...defaultProps} />);
    await user.click(screen.getByRole('button', { name: /Enable/i }));

    expect(mutate).toHaveBeenCalledWith({
      clusterID: 'myClusterId',
      region: 'myRegion',
      isProtected: true,
    });
  });

  it('closes the modal on cancel', async () => {
    expect(mockedDispatch).not.toHaveBeenCalled();
    mockedUseUpdateDeleteProtections.mockReturnValue(defaultResponse);
    const { user } = withState(defaultState).render(<DeleteProtectionModal {...defaultProps} />);
    await user.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onClose).not.toHaveBeenCalled();

    const dispatchProps = mockedDispatch.mock.calls[0][0];
    expect(dispatchProps.type).toEqual('CLOSE_MODAL');
  });

  it('closes the modal on submit success', () => {
    expect(onClose).not.toHaveBeenCalled();
    expect(mockedDispatch).not.toHaveBeenCalled();
    mockedUseUpdateDeleteProtections.mockReturnValue({
      ...defaultResponse,
      isSuccess: true,
    });
    withState(defaultState).render(<DeleteProtectionModal {...defaultProps} />);

    expect(onClose).toHaveBeenCalled();
    const dispatchProps = mockedDispatch.mock.calls[0][0];
    expect(dispatchProps.type).toEqual('CLOSE_MODAL');
  });
});
