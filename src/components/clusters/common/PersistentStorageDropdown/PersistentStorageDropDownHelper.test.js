import { filterPersistentStorageValuesByQuota } from './PersistentStorageDropDownHelper';

test('filterPersistentStorageValuesByQuota works without currentValue and with positive quota', () => {
  const remainingQuota = 500;
  const persistentStorageValues = [
    { unit: 'B', value: 100 * 2 ** 30 },
    { unit: 'B', value: 600 * 2 ** 30 },
    { unit: 'B', value: 1100 * 2 ** 30 },
  ];
  expect(
    filterPersistentStorageValuesByQuota(null, persistentStorageValues, remainingQuota),
  ).toEqual({
    values: [
      { unit: 'B', value: 100 * 2 ** 30 },
      { unit: 'B', value: 600 * 2 ** 30 },
    ],
  });
});

test('filterPersistentStorageValuesByQuota works without currentValue and with zero remaining quota', () => {
  const remainingQuota = 0;
  const persistentStorageValues = [
    { unit: 'B', value: 100 * 2 ** 30 },
    { unit: 'B', value: 600 * 2 ** 30 },
    { unit: 'B', value: 1100 * 2 ** 30 },
  ];

  expect(
    filterPersistentStorageValuesByQuota(null, persistentStorageValues, remainingQuota),
  ).toEqual({ values: [{ unit: 'B', value: 100 * 2 ** 30 }] });
});

test('filterPersistentStorageValuesByQuota works with currentValue and with zero remaining quota', () => {
  const remainingQuota = 0;
  const persistentStorageValues = [
    { unit: 'B', value: 100 * 2 ** 30 },
    { unit: 'B', value: 600 * 2 ** 30 },
    { unit: 'B', value: 1100 * 2 ** 30 },
  ];
  const currentValue = 644245094400; // 600 GiB
  expect(
    filterPersistentStorageValuesByQuota(currentValue, persistentStorageValues, remainingQuota),
  ).toEqual({
    values: [
      { unit: 'B', value: 100 * 2 ** 30 },
      { unit: 'B', value: 600 * 2 ** 30 },
    ],
  });
});

test('filterPersistentStorageValuesByQuota works with currentValue and with positive remaining quota', () => {
  const remainingQuota = 500;
  const persistentStorageValues = [
    { unit: 'B', value: 100 * 2 ** 30 },
    { unit: 'B', value: 600 * 2 ** 30 },
    { unit: 'B', value: 1100 * 2 ** 30 },
  ];
  const currentValue = 600 * 2 ** 30; // 600 GiB
  expect(
    filterPersistentStorageValuesByQuota(currentValue, persistentStorageValues, remainingQuota),
  ).toEqual({
    values: [
      { unit: 'B', value: 100 * 2 ** 30 },
      { unit: 'B', value: 600 * 2 ** 30 },
      { unit: 'B', value: 1100 * 2 ** 30 },
    ],
  });
});

test('filterPersistentStorageValuesByQuota returns only base value when backend provides invalid values', () => {
  const remainingQuota = 0;
  const persistentStorageValues = null;
  expect(
    filterPersistentStorageValuesByQuota(null, persistentStorageValues, remainingQuota),
  ).toEqual({ values: [{ unit: 'B', value: 100 * 2 ** 30 }] });
});
