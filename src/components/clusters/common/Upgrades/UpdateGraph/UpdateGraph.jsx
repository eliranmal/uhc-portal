import React from 'react';
import PropTypes from 'prop-types';

import { InfoCircleIcon } from '@patternfly/react-icons/dist/esm/icons/info-circle-icon';

import MinorVersionUpgradeConfirm from '../MinorVersionUpgradeConfirm';
import UpgradeAcknowledgeWarning from '../UpgradeAcknowledge/UpgradeAcknowledgeWarning';

import './UpdateGraph.scss';

const GraphContainer = ({ children }) => (
  <div className="ocm-upgrade-graph-container">{children}</div>
);

const GraphLine = ({ children }) => <li className="ocm-upgrade-graph-line">{children}</li>;

const GraphPath = ({ children }) => <ul className="ocm-upgrade-graph-path">{children}</ul>;

const VersionLabel = ({ children }) => (
  <span className="ocm-upgrade-graph-version">{children}</span>
);

const VersionDot = ({ current }) => (
  <div className={`ocm-upgrade-graph-version-dot ${current ? 'ocm-upgrade-current' : ''}`} />
);

const UpdateGraph = ({
  currentVersion,
  updateVersion,
  hasMore,
  upgradeGates,
  schedules,
  cluster,
  isHypershift,
  isSTSEnabled,
}) => (
  <div className="ocm-upgrade-graph">
    <GraphContainer>
      <GraphPath current>
        <GraphLine>
          <VersionLabel>{currentVersion}</VersionLabel>
          <VersionDot current />
        </GraphLine>
        {updateVersion && (
          <>
            <GraphLine />
            <GraphLine>
              <VersionLabel>{updateVersion}</VersionLabel>
              <VersionDot />
            </GraphLine>
          </>
        )}
      </GraphPath>
    </GraphContainer>
    {hasMore && (
      <div className="ocm-upgrade-additional-versions-available">
        <InfoCircleIcon />
        {`Additional versions available between ${currentVersion} and ${updateVersion}`}
      </div>
    )}
    <UpgradeAcknowledgeWarning
      isPlain
      isInfo
      showConfirm
      showUpgradeWarning
      schedules={schedules}
      upgradeGates={upgradeGates}
      cluster={cluster}
      isHypershift={isHypershift}
      isSTSEnabled={isSTSEnabled}
    />
    <MinorVersionUpgradeConfirm
      upgradeGates={upgradeGates}
      schedules={schedules}
      cluster={cluster}
    />
  </div>
);

GraphPath.propTypes = {
  children: PropTypes.node,
};

GraphContainer.propTypes = {
  children: PropTypes.node,
};

GraphLine.propTypes = {
  children: PropTypes.node,
};

VersionLabel.propTypes = {
  children: PropTypes.node,
};

VersionDot.propTypes = {
  current: PropTypes.bool,
};

UpdateGraph.propTypes = {
  currentVersion: PropTypes.node,
  updateVersion: PropTypes.node,
  hasMore: PropTypes.bool,
  isHypershift: PropTypes.bool,
  isSTSEnabled: PropTypes.bool,
  upgradeGates: PropTypes.object,
  schedules: PropTypes.object,
  cluster: PropTypes.object,
};

export default UpdateGraph;
