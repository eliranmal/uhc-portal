import React from 'react';

import { Skeleton, Title } from '@patternfly/react-core';

import { Report } from '~/components/dashboard/CostCard/models/Report';

import CostBreakdownSummaryChart from './components/CostBreakdownSummaryChart';
import { getTotal } from './utils/CostBreakdownSummaryUtils';

import '../CostBreakdownCard.scss';

const CHART_HEIGHT = 185;
const CHART_WIDTH = 350;

type CostBreakdownSummaryProps = {
  report: Report;
};

const CostBreakdownSummary = ({ report }: CostBreakdownSummaryProps) =>
  !report.fulfilled ? (
    <Skeleton fontSize="md" screenreaderText="Loading..." />
  ) : (
    <>
      <Title className="ocm--cost-title" size="md" headingLevel="h2">
        Total cost
        <span className="ocm--cost-total"> {getTotal(report)}</span>
      </Title>
      <div style={{ maxHeight: CHART_HEIGHT, maxWidth: CHART_WIDTH }}>
        <CostBreakdownSummaryChart report={report} height={CHART_HEIGHT} width={CHART_WIDTH} />
      </div>
    </>
  );

export default CostBreakdownSummary;
