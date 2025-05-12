import React from 'react';
import * as FileSaver from 'file-saver';

import { eventNames, ocmResourceType } from '~/common/analytics';
import * as useAnalytics from '~/hooks/useAnalytics';
import { render, screen } from '~/testUtils';

import DownloadPullSecret from '../DownloadPullSecret';

jest.mock('~/hooks/useAnalytics');
const useAnalyticsTrackMock = jest.fn();
jest.spyOn(useAnalytics, 'default').mockImplementation(() => useAnalyticsTrackMock);

jest.mock('file-saver', () => ({
  ...jest.requireActual('file-saver'),
  saveAs: jest.fn(),
}));

// jest.spyOn(FileSaver, 'saveAs').mockImplementation(() => fileSaverMock);

describe('DownloadPullSecret', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('check properties for token error', () => {
    render(
      <DownloadPullSecret
        pendoID="pendoID"
        token={{ pending: false, fulfilled: false, error: true }}
        text="whatever the text"
      />,
    );
    const button = screen.getByTestId('download-pull-secret') as any;
    expect(button).toHaveTextContent('whatever the text');
    expect(button.getAttribute('disabled')).toBe('');
  });

  it('check properties for no token error and no text', () => {
    render(<DownloadPullSecret pendoID="pendoID" token={{ auths: {} }} />);
    const button = screen.getByTestId('download-pull-secret') as any;
    expect(button).toHaveTextContent('Download pull secret');
    expect(button.getAttribute('disabled')).toBe(null);
  });

  it('onclick', async () => {
    const fileSaverMock = jest.spyOn(FileSaver, 'saveAs');

    const { user } = render(<DownloadPullSecret pendoID="pendoID" token={{ auths: {} }} />);
    const button = screen.getByTestId('download-pull-secret') as any;

    await user.click(button);
    expect(useAnalyticsTrackMock).toHaveBeenCalledTimes(1);
    expect(useAnalyticsTrackMock).toHaveBeenCalledWith(
      {
        deprecated_name: 'OCP-Copy-PullSecret',
        event: eventNames.FILE_DOWNLOADED,
        link_name: 'pull-secret',
        ocm_resource_type: ocmResourceType.ALL,
      },
      { path: 'pendoID' },
    );

    expect(fileSaverMock).toHaveBeenCalledTimes(1);
    expect(fileSaverMock).toHaveBeenCalledWith(new Blob(), 'pull-secret');
  });
});
