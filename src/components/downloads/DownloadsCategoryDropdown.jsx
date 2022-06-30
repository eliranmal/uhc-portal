import React from 'react';
import PropTypes from 'prop-types';
import { FormSelect, FormSelectOption } from '@patternfly/react-core';

import { downloadsCategories } from './downloadsStructure';

const DownloadsCategoryDropdown = ({ selectedCategory, setCategory }) => (
  <FormSelect
    aria-label="Select category"
    value={selectedCategory}
    onChange={setCategory}
    data-test-id="downloads-category-dropdown"
  >
    {downloadsCategories.map(c => (
      <FormSelectOption key={c.key} value={c.key} label={c.title} />
    ))}
  </FormSelect>
);
DownloadsCategoryDropdown.propTypes = {
  selectedCategory: PropTypes.oneOf(downloadsCategories.map((c) => c.key)).isRequired,
  setCategory: PropTypes.func.isRequired,
};

export default DownloadsCategoryDropdown;
