import React from 'react';
import PropTypes from 'prop-types';

import { FormSelect, FormSelectOption } from '@patternfly/react-core';

class KMSKeyLocationComboBox extends React.Component {
  componentDidMount() {
    const { selectedRegion, input } = this.props;
    input.onChange(input.value || selectedRegion);
  }

  componentDidUpdate(prevProps) {
    const { selectedRegion, input } = this.props;
    if (prevProps.selectedRegion !== selectedRegion) {
      input.onChange(input.value || selectedRegion);
    }
  }

  render() {
    const { kmsRegionsArray, input } = this.props;
    const { onChange, ...restInput } = input;
    return (
      <FormSelect
        aria-label="KMS location"
        onChange={(_event, value) => onChange(value)}
        {...restInput}
      >
        {kmsRegionsArray.map((location) => (
          <FormSelectOption key={location} value={location} label={location} />
        ))}
      </FormSelect>
    );
  }
}
KMSKeyLocationComboBox.propTypes = {
  input: PropTypes.object.isRequired,
  kmsRegionsArray: PropTypes.array,
  selectedRegion: PropTypes.string,
};

export default KMSKeyLocationComboBox;
