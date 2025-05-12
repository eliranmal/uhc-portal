import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import AccessRequestPendingAlert, {
  AccessRequestPendingAlertProps,
} from '../AccessRequestPendingAlert';

describe('AccessRequestPendingAlert', () => {
  const AccessRequestPendingAlertWrapper = (props: AccessRequestPendingAlertProps) => (
    <AccessRequestPendingAlert {...props} />
  );

  it.each([[undefined], [0]])('%p total', (total: undefined | number) => {
    render(
      <div data-testid="parent-div">
        <AccessRequestPendingAlertWrapper total={total} />
      </div>,
    );
    expect(screen.getByTestId('parent-div').children.length).toBe(0);
  });

  it.each([[undefined], ['whateverthelink']])(
    'is accessible. %p link',
    async (link: undefined | string) => {
      // Act
      const { container } = render(<AccessRequestPendingAlertWrapper total={1} linkUrl={link} />);

      // Assert
      await checkAccessibility(container);
    },
  );

  describe('is properly rendering', () => {
    it.each([
      [1, /your organization has pending access request/i],
      [2, /your organization has pending access requests/i],
    ])('total %p', (total: number, expectedText: RegExp) => {
      // Act
      render(<AccessRequestPendingAlertWrapper total={total} />);

      // Assert
      expect(
        screen.getByRole('heading', {
          name: /warning alert: pending access requests/i,
        }),
      ).toBeInTheDocument();
      expect(screen.getByText(expectedText)).toBeInTheDocument();
      expect(
        screen.queryByRole('link', {
          name: /show pending requests/i,
        }),
      ).not.toBeInTheDocument();
    });

    it('with link', () => {
      render(<AccessRequestPendingAlertWrapper total={1} linkUrl="whatevertheurl" />);

      // Assert
      expect(
        screen.getByRole('link', {
          name: /show pending requests/i,
        }),
      ).toBeInTheDocument();
    });

    it('with single accessRequest', () => {
      render(
        <AccessRequestPendingAlertWrapper
          total={1}
          accessRequests={[{ subscription_id: '1mbpBkP1bZSqhiMeIhSdnQbj9sB' }]}
        />,
      );

      // Assert
      expect(
        screen.getByRole('link', {
          name: /1mbpBkP1bZSqhiMeIhSdnQbj9sB/i,
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('link', {
          name: /1mbpBkP1bZSqhiMeIhSdnQbj9sB/i,
        }),
      ).toHaveAttribute('href', '/openshift/details/s/1mbpBkP1bZSqhiMeIhSdnQbj9sB#accessRequest');
    });

    it('with multiple accessRequests', () => {
      render(
        <AccessRequestPendingAlertWrapper
          total={1}
          accessRequests={[
            { subscription_id: '1mbpBkP1bZSqhiMeIhSdnQbj9sB' },
            { subscription_id: 'aws-auto-update-20lqt8CJgwJbU' },
          ]}
        />,
      );

      // Assert
      expect(
        screen.getByRole('link', {
          name: /1mbpBkP1bZSqhiMeIhSdnQbj9sB/i,
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('link', {
          name: /1mbpBkP1bZSqhiMeIhSdnQbj9sB/i,
        }),
      ).toHaveAttribute('href', '/openshift/details/s/1mbpBkP1bZSqhiMeIhSdnQbj9sB#accessRequest');

      expect(
        screen.getByRole('link', {
          name: /aws-auto-update-20lqt8CJgwJbU/i,
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('link', {
          name: /aws-auto-update-20lqt8CJgwJbU/i,
        }),
      ).toHaveAttribute('href', '/openshift/details/s/aws-auto-update-20lqt8CJgwJbU#accessRequest');
    });
  });
});
