import { useCallback } from 'react';

import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

import { getTrackEvent, TrackEvent, TrackEventOptions } from '~/common/analytics';

/** a convenience function that composes the track event parsing and the actual tracking. */
export interface Track {
  (event: TrackEvent, properties?: TrackEventOptions): void;
  (event: string, properties?: Record<string, any> | string): void;
}

/**
 * Provides a helper function for analytics track events.
 */
const useAnalytics = (): Track => {
  const { analytics } = useChrome();

  const track: Track = useCallback(
    (event, properties) => {
      if (typeof event === 'string') {
        analytics.track(event, typeof properties === 'string' ? { type: properties } : properties);
      } else {
        const eventObj = getTrackEvent(event, properties as TrackEventOptions);
        // https://segment.com/docs/connections/spec/track/
        analytics.track(eventObj.event, eventObj.properties);
      }
    },
    [analytics],
  );

  return track;
};

export default useAnalytics;
