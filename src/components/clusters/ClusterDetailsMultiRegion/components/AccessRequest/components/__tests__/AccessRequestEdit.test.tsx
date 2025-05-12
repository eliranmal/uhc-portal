import React from 'react';
import { Formik, FormikValues } from 'formik';

import { act, checkAccessibility, render, screen } from '~/testUtils';
import { AccessRequestStatusState } from '~/types/access_transparency.v1';

import { AccessRequestFieldId } from '../../model/AccessRequestFieldId';
import AccessRequestEdit from '../AccessRequestEdit';

jest.mock('../AccessRequestDetails', () => () => <div>access request details mock</div>);

const buildTestComponent = (
  initialValues: FormikValues,
  children: React.ReactNode,
  onSubmit: () => void = jest.fn(),
  formValues = {},
) => (
  <Formik
    initialValues={{
      ...initialValues,
      ...formValues,
    }}
    onSubmit={onSubmit}
  >
    {children}
  </Formik>
);

describe('AccessRequestEdit', () => {
  describe('check accessibility', () => {
    it('is accessible empty content no rights', async () => {
      // Act
      const { container } = render(
        buildTestComponent({}, <AccessRequestEdit accessRequest={{}} />),
      );

      // Assert
      await checkAccessibility(container);
    });
    it('is accessible empty content with rights', async () => {
      // Act
      const { container } = render(
        buildTestComponent({}, <AccessRequestEdit accessRequest={{}} userDecisionRights />),
      );

      // Assert
      await checkAccessibility(container);
    });
  });

  describe('is properly rendering', () => {
    it('when no rights', () => {
      // Act
      render(
        buildTestComponent(
          {
            [AccessRequestFieldId.State]: AccessRequestStatusState.Approved,
            [AccessRequestFieldId.Justification]: '',
          },
          <AccessRequestEdit accessRequest={{}} />,
        ),
      );

      // Assert
      expect(screen.getByText(/access request details mock/i)).toBeInTheDocument();
      expect(
        screen.getByText(
          /the user has no rights for approving or denying the access request\. please contact cluster owner or organization admin\./i,
        ),
      ).toBeInTheDocument();
    });

    it('whith rights', async () => {
      // Act
      // eslint-disable-next-line testing-library/no-unnecessary-act
      await act(() => {
        render(
          buildTestComponent(
            {
              [AccessRequestFieldId.Justification]: '',
            },
            <AccessRequestEdit accessRequest={{}} userDecisionRights />,
          ),
        );
      });

      // Assert
      expect(screen.getByText(/access request details mock/i)).toBeInTheDocument();
      expect(
        screen.queryByText(
          /the user has no rights for approving or denying the access request\. please contact cluster owner or organization admin\./i,
        ),
      ).not.toBeInTheDocument();
      expect(screen.getByRole('radio', { name: /approve/i })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: /approve/i })).not.toHaveAttribute('checked');
      expect(screen.getByRole('radio', { name: /deny/i })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: /deny/i })).not.toHaveAttribute('checked');
      expect(
        screen.getByRole('textbox', { name: 'access request justification' }),
      ).toBeInTheDocument();
    });

    it('whith default values', async () => {
      // Act
      // eslint-disable-next-line testing-library/no-unnecessary-act
      await act(() => {
        render(
          buildTestComponent(
            {
              [AccessRequestFieldId.State]: AccessRequestStatusState.Approved,
              [AccessRequestFieldId.Justification]: 'whatever the justification',
            },
            <AccessRequestEdit accessRequest={{}} userDecisionRights />,
          ),
        );
      });

      // Assert
      expect(screen.getByText(/access request details mock/i)).toBeInTheDocument();
      expect(
        screen.queryByText(
          /the user has no rights for approving or denying the access request\. please contact cluster owner or organization admin\./i,
        ),
      ).not.toBeInTheDocument();
      expect(screen.getByRole('radio', { name: /approve/i })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: /approve/i })).toHaveAttribute('checked');
      expect(screen.getByRole('radio', { name: /deny/i })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: /deny/i })).not.toHaveAttribute('checked');
      expect(
        screen.getByRole('textbox', { name: 'access request justification' }),
      ).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: 'access request justification' })).toHaveValue(
        'whatever the justification',
      );
    });
  });
});
