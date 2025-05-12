import React from 'react';
import PropTypes from 'prop-types';

import { Icon } from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';
import { global_warning_color_100 as warningColor } from '@patternfly/react-tokens/dist/esm/global_warning_color_100';

import { Link } from '~/common/routing';

import { getHasUnMetClusterAcks } from '../UpgradeAcknowledgeHelpers';

import './UpgradeAcknowledgeWarningLink.scss';

const UpgradeAcknowledgeLink = (props) => {
  const { clusterId, cluster, schedules, upgradeGates } = props;

  const hasAcks = getHasUnMetClusterAcks(schedules, cluster, upgradeGates);

  return hasAcks ? (
    <Link
      to={`/details/${clusterId}#updateSettings`}
      className="ocm-upgrade-approval__required-link"
    >
      <Icon>
        <ExclamationTriangleIcon color={warningColor.value} />
      </Icon>
      <span className="pf-v5-u-screen-reader">Warning</span> Approval required
    </Link>
  ) : null;
};

UpgradeAcknowledgeLink.propTypes = {
  clusterId: PropTypes.string,
  cluster: PropTypes.object,
  schedules: PropTypes.object,
  upgradeGates: PropTypes.object,
};

export default UpgradeAcknowledgeLink;
