import { filterLoadBalancerValuesByQuota } from './LoadBalancersDropdownHelper';

test('filterLoadBalancerValuesByQuota works without currentValue and with positive quota', () => {
  const remainingQuota = 4;
  const loadBalancerValues = [0, 4, 8];
  expect(filterLoadBalancerValuesByQuota(null, loadBalancerValues, remainingQuota)).toEqual({
    values: [0, 4],
  });
});

test('filterLoadBalancerValuesByQuota works without currentValue and with zero remaining quota', () => {
  const remainingQuota = 0;
  const loadBalancerValues = [0, 4, 8];
  expect(filterLoadBalancerValuesByQuota(null, loadBalancerValues, remainingQuota)).toEqual({
    values: [0],
  });
});

test('filterLoadBalancerValuesByQuota works with currentValue and with zero remaining quota', () => {
  const remainingQuota = 0;
  const loadBalancerValues = [0, 4, 8, 12];
  const currentValue = 8;
  expect(filterLoadBalancerValuesByQuota(currentValue, loadBalancerValues, remainingQuota)).toEqual(
    { values: [0, 4, 8] },
  );
});

test('filterLoadBalancerValuesByQuota works with currentValue and with positive remaining quota', () => {
  const remainingQuota = 4;
  const loadBalancerValues = [0, 4, 8, 12];
  const currentValue = 8;
  expect(filterLoadBalancerValuesByQuota(currentValue, loadBalancerValues, remainingQuota)).toEqual(
    { values: [0, 4, 8, 12] },
  );
});
test('filterLoadBalancerValuesByQuota returns empty list when provided with bad input', () => {
  const remainingQuota = 4;
  const loadBalancerValues = null;
  const currentValue = 8;
  expect(filterLoadBalancerValuesByQuota(currentValue, loadBalancerValues, remainingQuota)).toEqual(
    { values: [] },
  );
});
