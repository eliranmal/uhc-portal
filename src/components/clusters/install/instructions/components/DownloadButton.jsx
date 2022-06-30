import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@patternfly/react-core';
import useAnalytics from '~/hooks/useAnalytics';
import { trackEvents } from '~/common/analytics';
import { tools } from '../../../../../common/installLinks.mjs';

const texts = {
  [tools.CRC]: 'Download OpenShift Local',
  [tools.OC]: 'Download command-line tools',
  [tools.X86INSTALLER]: 'Download installer',
  [tools.IBMZINSTALLER]: 'Download installer',
  [tools.PPCINSTALLER]: 'Download installer',
  [tools.ARMINSTALLER]: 'Download installer',
  [tools.MULTIINSTALLER]: 'Download installer',
  [tools.OCM]: 'Download ocm CLI',
  [tools.ROSA]: 'Download the ROSA CLI',
};

const DownloadButton = ({
  url,
  disabled = false,
  download = true,
  tool = tools.X86INSTALLER,
  pendoID,
  text = '',
  name = '',
}) => {
  const track = useAnalytics();
  const buttonText = text || texts[tool];
  const downloadProps = download
    ? { download: true }
    : { rel: 'noreferrer noopener', target: '_blank' };

  return (
    <Button
      component="a"
      href={url}
      variant="secondary"
      className={`download-button tool-${tool.toLowerCase()}`}
      onClick={() => {
        track(
          name || trackEvents[tool],
          name
            ? pendoID
            : {
                url,
                path: pendoID,
              },
        );
      }}
      disabled={!url || disabled}
      data-test-id={`download-btn-${tool}`}
      {...downloadProps}
    >
      {buttonText}
    </Button>
  );
};
DownloadButton.propTypes = {
  pendoID: PropTypes.string,
  url: PropTypes.string,
  disabled: PropTypes.bool,
  download: PropTypes.bool,
  tool: PropTypes.oneOf(Object.values(tools)),
  text: PropTypes.string,
  name: PropTypes.string,
};

export default DownloadButton;
