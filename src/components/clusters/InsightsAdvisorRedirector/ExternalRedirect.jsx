import React from 'react';
import PropTypes from 'prop-types';

import { Bullseye, Spinner } from '@patternfly/react-core';

class ExternalRedirect extends React.Component {
  componentDidMount() {
    const { url } = this.props;
    window.location.replace(url);
  }

  render() {
    return (
      <Bullseye>
        <div className="pf-v5-u-text-align-center">
          <Spinner size="lg" aria-label="Loading..." />
        </div>
      </Bullseye>
    );
  }
}

ExternalRedirect.propTypes = {
  url: PropTypes.string.isRequired,
};

export default ExternalRedirect;
