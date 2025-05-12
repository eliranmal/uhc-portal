import React from 'react';
import PropTypes from 'prop-types';

import { FormGroup, Radio } from '@patternfly/react-core';

class ReduxFormRadioGroup extends React.Component {
  state = { value: null };

  handleChange = (_, event) => {
    const { value } = event.currentTarget;
    this.setState({ value });
    const { name, onChange } = this.props;
    onChange(name, value);
  };

  render() {
    const { name, items, onChange, isDisabled = false, ...formGroupProps } = this.props;
    const { value } = this.state;

    return (
      <FormGroup {...formGroupProps}>
        {items.map((item) => (
          <Radio
            isChecked={value === null ? item.isChecked === true : value === item.value}
            onChange={(event, _) => this.handleChange(_, event)}
            value={item.value}
            label={item.label}
            isDisabled={isDisabled}
            name={`${name}:${item.value}`}
            id={`${name}:${item.value}`}
            key={`${name}:${item.value}`}
          />
        ))}
      </FormGroup>
    );
  }
}

ReduxFormRadioGroup.propTypes = {
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.element]).isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.element]).isRequired,
      value: PropTypes.string.isRequired,
      isChecked: PropTypes.bool,
    }),
  ).isRequired,
  isDisabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

export default ReduxFormRadioGroup;
