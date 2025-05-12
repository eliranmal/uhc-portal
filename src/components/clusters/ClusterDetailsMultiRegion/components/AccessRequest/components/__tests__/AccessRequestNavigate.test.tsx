import React from 'react';
import { To } from 'react-router-dom';

import { useFetchAccessRequest } from '~/queries/ClusterDetailsQueries/AccessRequestTab/useFetchAccessRequest';
import { checkAccessibility, render, screen } from '~/testUtils';

import AccessRequestNavigate from '../AccessRequestNavigate';

jest.mock('~/queries/ClusterDetailsQueries/AccessRequestTab/useFetchAccessRequest', () => ({
  useFetchAccessRequest: jest.fn(),
}));

jest.mock('~/components/App/LoadingPage', () => () => <div data-testid="loading-page-mock" />);
jest.mock('~/components/App/NotFoundError', () => () => <div data-testid="not-found-error-mock" />);
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Preserve other exports from react-router-dom
  useParams: () => ({
    id: 'id1',
  }),
  Navigate: ({ to, replace }: { to: To; replace?: boolean }) => (
    <>
      <div>to: {to.toString()}</div>
      <div>replace: {replace ? 'true' : 'false'}</div>
    </>
  ),
}));

const useFetchAccessRequestMock = useFetchAccessRequest as jest.Mock;

describe('AccessRequestNavigate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('is accessible', () => {
    it('when error', async () => {
      // Arrange
      useFetchAccessRequestMock.mockReturnValue({
        isError: true,
        isLoading: false,
        data: undefined,
      });

      // Act
      const { container } = render(<AccessRequestNavigate />);

      // Assert
      await checkAccessibility(container);
    });

    it('when empty state', async () => {
      // Arrange
      useFetchAccessRequestMock.mockReturnValue({});

      // Act
      const { container } = render(<AccessRequestNavigate />);

      // Assert
      await checkAccessibility(container);
    });
  });

  describe('is properly rendering', () => {
    it('when error', () => {
      // Arrange
      useFetchAccessRequestMock.mockReturnValue({
        isError: true,
        isLoading: false,
        data: undefined,
      });

      // Act
      render(<AccessRequestNavigate />);

      // Assert
      expect(screen.getByTestId('not-found-error-mock')).toBeInTheDocument();
    });

    it('when empty state', () => {
      // Arrange
      useFetchAccessRequestMock.mockReturnValue({ isLoading: true });

      // Act
      render(<AccessRequestNavigate />);

      // Assert
      expect(screen.getByTestId('loading-page-mock')).toBeInTheDocument();
    });

    it('when subscription id', () => {
      // Arrange
      useFetchAccessRequestMock.mockReturnValue({
        isLoading: false,
        isError: false,
        error: null,
        data: { subscription_id: 'subscriptionId1' },
      });

      // Act
      render(<AccessRequestNavigate />);

      // Assert
      expect(
        screen.getByText(/to: \/openshift\/details\/s\/subscriptionId1#accessrequest/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/replace: true/i)).toBeInTheDocument();
    });
  });
});
