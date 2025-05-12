export const grantsDataAggregator = (grants, roles) => {
  const getDisplayName = (grantedRoleId) => {
    const foundRole = roles?.find((role) => role.id === grantedRoleId);

    return foundRole ? foundRole.displayName : grantedRoleId;
  };

  return grants?.map((grant) => ({
    id: grant.id,
    user_arn: grant.user_arn,
    state: grant.state,
    state_description: grant.state_description,
    console_url: grant.console_url,
    roleName: getDisplayName(grant.role.id),
  }));
};
