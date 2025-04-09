import React from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Label,
  Split,
  SplitItem,
  Tooltip,
} from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons/dist/esm/icons/info-circle-icon';
import { StarIcon } from '@patternfly/react-icons/dist/esm/icons/star-icon';

import { versionRegEx } from '../../../../../../common/versionComparator';
import ExternalLink from '../../../../../common/ExternalLink';

const getReleaseNotesLink = (version) => {
  const { groups: parts } = versionRegEx.exec(version);
  const { major, minor, revision, patch } = parts;
  if (major !== '4' || patch !== undefined) {
    return null;
  }
  const docURL = `https://docs.redhat.com/en/documentation/openshift_container_platform/${major}.${minor}/html/release_notes/ocp-${major}-${minor}-release-notes.html#ocp-${major}-${minor}-${revision}`;
  return (
    <ExternalLink href={docURL} className="pf-c-button pf-m-link card-footer-button">
      View release notes
    </ExternalLink>
  );
};

const VersionAcknowledgementPopover = (version) => (
  <Tooltip
    content={`All clusters require an administrator acknowledgement before updating to OpenShift Container Platform ${version}`}
  >
    <Button variant="link" isInline aria-label="more information">
      <InfoCircleIcon />
    </Button>
  </Tooltip>
);

const VersionCard = (props) => {
  const {
    isSelected,
    isRecommended,
    version,
    onKeyDown,
    onClick,
    children,
    getUnMetClusterAcknowledgements,
  } = props;

  return (
    <Card
      className="version-card"
      id={version}
      onKeyDown={onKeyDown}
      onClick={onClick}
      isSelectableRaised
      isCompact
      isSelected={isSelected}
    >
      <CardTitle>
        <Split>
          <SplitItem>
            {version}{' '}
            {getUnMetClusterAcknowledgements(version).length > 0
              ? VersionAcknowledgementPopover(version)
              : null}
          </SplitItem>
          <SplitItem isFilled />
          {isRecommended && (
            <SplitItem>
              <Label color="blue" icon={<StarIcon />}>
                Recommended
              </Label>
            </SplitItem>
          )}
        </Split>
      </CardTitle>
      {children && <CardBody>{children}</CardBody>}
      <CardFooter>{getReleaseNotesLink(version)}</CardFooter>
    </Card>
  );
};

VersionCard.propTypes = {
  isSelected: PropTypes.bool,
  isRecommended: PropTypes.bool,
  version: PropTypes.string.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node,
  getUnMetClusterAcknowledgements: PropTypes.func,
};

VersionCard.defaultProps = {
  isRecommended: false,
};

export default VersionCard;
