import React from 'react';

import { checkAccessibility, render } from '~/testUtils';

import { MonitoringListItem } from '../components/MonitoringListItem';

describe('<MonitoringListItem />', () => {
  const toggle = jest.fn();
  it('is accessible', async () => {
    const { container } = render(
      <ul>
        <MonitoringListItem
          title="myTitle"
          toggle={toggle}
          expanded={['1']}
          hasData
          numOfIssues={null}
        >
          <p>ComponentChildren</p>
        </MonitoringListItem>
      </ul>,
    );
    await checkAccessibility(container);
  });
});
