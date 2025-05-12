import apiRequest from '~/services/apiRequest';

import config from '../config';
import type { OverviewResponse } from '../types/insights-results-aggregator.v1';
import type { ReportData } from '../types/insights-results-aggregator.v2';

/* osd_eligible set to true returns only rules that are
dedicated for managed (not only OSD) clusters */
const getClusterInsights = (clusterId: string) =>
  apiRequest.get<{
    report?: {
      data?: Array<ReportData>;
      meta?: {
        count?: number;
        ['last_checked_at']?: string;
      };
    };
    status?: string;
  }>(`/cluster/${clusterId}/reports`, {
    baseURL: `${config.configData.insightsGateway}/insights-results-aggregator/v2`,
  });

const getOrganizationInsights = () =>
  apiRequest.get<OverviewResponse>('/org_overview', {
    baseURL: `${config.configData.insightsGateway}/insights-results-aggregator/v1`,
  });

const insigthsService = {
  getClusterInsights,
  getOrganizationInsights,
};

export default insigthsService;
