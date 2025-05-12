// This is a helper function to sort a MachineType structure according to size and category.
import get from 'lodash/get';
import map from 'lodash/map';

import { parseValueWithUnit } from '~/common/units';

/**
 * Defines order and labels of groups to display to user.
 * The `name` corresponds to `category` field in machine_types API,
 * and to `generic_name` in quota_cost API.
 */
export const machineCategories = [
  { name: 'general_purpose', label: 'General purpose' },
  { name: 'memory_optimized', label: 'Memory optimized' },
  { name: 'compute_optimized', label: 'Compute optimized' },
  { name: 'storage_optimized', label: 'Storage optimized' },
  { name: 'network_optimized', label: 'Network optimized' },
  { name: 'burstable', label: 'Burstable' },
  { name: 'accelerated_computing', label: 'Accelerated computing' },
];

const categories = map(machineCategories, 'name');

function compareByMemory(a, b) {
  // sort by memory, ascending order
  const memoryBytesA = parseValueWithUnit(a.memory.value, a.memory.unit);
  const memoryBytesB = parseValueWithUnit(b.memory.value, b.memory.unit);
  return memoryBytesA - memoryBytesB;
}

function compareByCategoryMemoryCPU(a, b) {
  if (a.category === b.category) {
    // the categories are equal. Within the category, we need to sort by size.
    const memorySortResult = compareByMemory(a, b);
    if (memorySortResult === 0) {
      // sort by CPU if two machine types have the same amount of memory
      return a.cpu.value - b.cpu.value;
    }
    return memorySortResult;
  }
  return categories.indexOf(a.category) - categories.indexOf(b.category);
}

/**
 * mapping of sort function to cloud provider.
 * If we ever add new cloud providers that require custom sorting, they can be added here.
 */
const sortFuncs = {
  gcp: compareByCategoryMemoryCPU,
  aws: compareByCategoryMemoryCPU,
};

const sortMachineTypes = (machineTypes, cloudProviderID) =>
  [...get(machineTypes?.types, cloudProviderID, [])].sort(sortFuncs[cloudProviderID]);

export default sortMachineTypes;
