import { CloudAccount, Contract, ContractDimension } from '~/types/accounts_mgmt.v1';

const resources = ['control_plane', 'four_vcpu_hour'];

// For a contract to be valid as a BillingContract, it must include dimensions
export type BillingContract = Contract & Required<Pick<Contract, 'dimensions'>>;

const getContract = (cloudAccount: CloudAccount): BillingContract | null => {
  const { contracts } = cloudAccount;
  if (!contracts || contracts.length === 0) {
    return null;
  }
  const contract = contracts[0];
  const dimensions = contract.dimensions || [];
  const isBillingContract = dimensions.some(
    (dimension: ContractDimension) =>
      resources.includes(dimension.name || '') && Number(dimension.value || 0) > 0,
  );
  return isBillingContract ? (contract as BillingContract) : null;
};

const getDimensionValue = (dimensions: ContractDimension[], resource: string) =>
  dimensions.find((dimension: ContractDimension) => dimension?.name === resource)?.value || 0;

export { getContract, getDimensionValue };
