import get from 'lodash/get';

const minValueSelector = (isMultiAz, isByoc) => {
  const multiAzNodes = isByoc ? 3 : 9;
  const singleAzNodes = isByoc ? 2 : 4;

  return isMultiAz
    ? {
        value: multiAzNodes,
        validationMsg: `At least ${multiAzNodes} nodes are required for multiple availability zone cluster.`,
      }
    : {
        value: singleAzNodes,
        validationMsg: `At least ${singleAzNodes} nodes are required`,
      };
};

const shouldShowLoadBalancerAlert = (state, formQuota) => {
  const { data } = state.modal;
  const modalQuota = get(data, 'load_balancer_quota', 0);
  if (formQuota && modalQuota) {
    return modalQuota > parseInt(formQuota, 10);
  }
  return false;
};

const shouldShowStorageQuotaAlert = (state, formQuota) => {
  const { data } = state.modal;
  const modalQuota = get(data, 'storage_quota.value', 0);
  if (formQuota && modalQuota) {
    return modalQuota > parseInt(formQuota, 10);
  }
  return false;
};

export { minValueSelector, shouldShowStorageQuotaAlert, shouldShowLoadBalancerAlert };
