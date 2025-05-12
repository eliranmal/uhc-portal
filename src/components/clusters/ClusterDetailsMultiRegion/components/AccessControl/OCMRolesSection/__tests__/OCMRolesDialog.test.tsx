import React from 'react';

import { knownProducts, ocmRoles } from '~/common/subscriptionTypes';
import modals from '~/components/common/Modal/modals';
import { useGlobalState } from '~/redux/hooks';
import { checkAccessibility, withState } from '~/testUtils';

import { OCMRolesDialog } from '../OCMRolesDialog';
import { OCMRolesRow } from '../OCMRolesRow';

import { row } from './OCMRolesDialog.fixture';

jest.mock('~/redux/hooks', () => ({
  useGlobalState: jest.fn(),
}));

const newCreationRolesRow = () => new OCMRolesRow(null, '0');
const newEditionRolesRow = () => new OCMRolesRow(row.data, '1');

const useGlobalStateMock = useGlobalState as jest.Mock;

describe('<OCMRolesDialog />', () => {
  useGlobalStateMock.mockReturnValue({ modal: { modalName: modals.OCM_ROLES } });
  const resetGrantOcmRoleMutation = jest.fn();
  const renderComponent = ({
    submit,
    rolesRow,
    productId,
    isGrantOcmRolePending,
    isGrantOcmRoleError,
    isGrantOcmRoleSuccess,
    grantOcmRoleError,
  }: {
    rolesRow: OCMRolesRow;
    submit?: () => void;
    productId?: string;
    isGrantOcmRolePending: boolean;
    isGrantOcmRoleError: boolean;
    isGrantOcmRoleSuccess: boolean;
    grantOcmRoleError: null;
  }) =>
    withState({ modal: { modalName: modals.OCM_ROLES } }).render(
      <OCMRolesDialog
        onSubmit={submit || jest.fn()}
        row={rolesRow}
        productId={productId}
        isGrantOcmRolePending={isGrantOcmRolePending}
        isGrantOcmRoleError={isGrantOcmRoleError}
        isGrantOcmRoleSuccess={isGrantOcmRoleSuccess}
        grantOcmRoleError={grantOcmRoleError}
        resetGrantOcmRoleMutation={resetGrantOcmRoleMutation}
      />,
    );

  describe('Creation mode', () => {
    it('should render correctly', async () => {
      const submit = jest.fn();
      const creationRolesRow = newCreationRolesRow();
      const { container, user, getByRole } = renderComponent({
        submit,
        rolesRow: creationRolesRow,
        isGrantOcmRolePending: false,
        isGrantOcmRoleError: false,
        isGrantOcmRoleSuccess: false,
        grantOcmRoleError: null,
      });
      expect(getByRole('heading')).toHaveTextContent('Grant role');
      expect(getByRole('textbox', { name: /username/i })).toHaveTextContent('');
      await user.type(getByRole('textbox', { name: /username/i }), 'user@example.com');
      await user.click(getByRole('button', { name: /grant role/i }));
      expect(submit).toHaveBeenCalledWith(
        creationRolesRow,
        'user@example.com',
        ocmRoles.CLUSTER_EDITOR.id,
      );
      await checkAccessibility(container);
    });

    it("should show all the roles that are not excluded for the cluster's product", async () => {
      const { user, getByRole, getByText } = renderComponent({
        rolesRow: newCreationRolesRow(),
        productId: 'product-that-has-no-role-exclusions',
        isGrantOcmRolePending: false,
        isGrantOcmRoleError: false,
        isGrantOcmRoleSuccess: false,
        grantOcmRoleError: null,
      });

      // Expand the menu to display all the roles
      await user.click(getByRole('button', { expanded: false }));

      expect(getByText(/^machine pool editor$/i)).toBeInTheDocument();
      expect(getByText(/^cluster autoscaler editor$/i)).toBeInTheDocument();
    });

    it("should hide the roles that are excluded for the cluster's product", async () => {
      const { user, getByRole, getByText, queryByText } = renderComponent({
        rolesRow: newCreationRolesRow(),
        productId: knownProducts.ROSA_HyperShift, // Does not allow cluster autoscaler role
        isGrantOcmRolePending: false,
        isGrantOcmRoleError: false,
        isGrantOcmRoleSuccess: false,
        grantOcmRoleError: null,
      });
      // Expand the menu to display all the roles
      await user.click(getByRole('button', { expanded: false }));

      expect(getByText(/^machine pool editor$/i)).toBeInTheDocument();
      expect(queryByText(/^cluster autoscaler editor$/i)).not.toBeInTheDocument();
    });
  });

  describe('Edition mode', () => {
    it('should render correctly', async () => {
      const rolesRow = newEditionRolesRow();
      const submit = jest.fn();
      const { user, getByText, getByRole } = renderComponent({
        submit,
        rolesRow,
        isGrantOcmRolePending: false,
        isGrantOcmRoleError: false,
        isGrantOcmRoleSuccess: false,
        grantOcmRoleError: null,
      });

      expect(getByRole('heading')).toHaveTextContent('Edit role');
      expect(getByRole('textbox', { name: /username/i })).toHaveValue('Doris Hudson');
      await user.click(getByText(/cluster viewer/i));
      await user.click(getByText(/^machine pool editor$/i));
      await user.click(getByRole('button', { name: /edit role/i }));

      expect(submit).toHaveBeenCalledWith(
        rolesRow,
        'Doris Hudson',
        ocmRoles.MACHINE_POOL_EDITOR.id,
      );
    });
  });
});
