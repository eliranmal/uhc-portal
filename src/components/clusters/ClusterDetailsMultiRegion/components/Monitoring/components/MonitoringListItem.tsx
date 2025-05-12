import React from 'react';

import {
  DataListCell,
  DataListContent,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  DataListToggle,
  Title,
} from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import { ExclamationTriangleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';

type MonitoringListItemProps = {
  title: string;
  numOfIssues: number | null;
  numOfWarnings?: number | null;
  toggle: (id: string) => void;
  expanded: string[];
  hasData: boolean;
  children: React.ReactNode;
};

const MonitoringListItem = ({
  title = '',
  numOfIssues,
  numOfWarnings,
  toggle,
  expanded,
  hasData,
  children,
}: MonitoringListItemProps) => {
  const id = title.replace(/\s+/g, '-').toLowerCase();

  const getSummary = () => {
    switch (true) {
      case !hasData:
        return (
          <>
            <ExclamationTriangleIcon className="status-icon warning" />
            <span>Metrics not available</span>
          </>
        );
      case numOfIssues && numOfIssues > 0:
        return (
          <>
            <ExclamationCircleIcon className="status-icon danger" />
            <span>
              {numOfIssues} discovered {numOfIssues === 1 ? 'issue' : 'issues'}
            </span>
          </>
        );
      case numOfWarnings && numOfWarnings > 0:
        return (
          <>
            <ExclamationTriangleIcon className="status-icon warning" />
            <span>
              {numOfWarnings} {numOfWarnings === 1 ? 'warning' : 'warnings'}
            </span>
          </>
        );
      default:
        return (
          <>
            <CheckCircleIcon className="status-icon success" />
            <span>{numOfIssues} discovered issues</span>
          </>
        );
    }
  };

  return (
    <DataListItem aria-labelledby={id} isExpanded={expanded.includes(id)}>
      <DataListItemRow>
        <DataListToggle
          onClick={() => toggle(id)}
          isExpanded={expanded.includes(id)}
          id={`${id}-toggle`}
          aria-controls={`${id}-toggle-expand`}
        />
        <DataListItemCells
          dataListCells={[
            <DataListCell key={`title-${id}`}>
              <Title headingLevel="h4" className="item-title">
                {title}
              </Title>
            </DataListCell>,
            <DataListCell key={`summary-${id}`} className="item-summary">
              {getSummary()}
            </DataListCell>,
          ]}
        />
      </DataListItemRow>
      <DataListContent
        aria-label="Primary Content Details"
        id={`${id}-expand`}
        isHidden={!expanded.includes(id)}
      >
        {children}
      </DataListContent>
    </DataListItem>
  );
};

export { MonitoringListItem };
