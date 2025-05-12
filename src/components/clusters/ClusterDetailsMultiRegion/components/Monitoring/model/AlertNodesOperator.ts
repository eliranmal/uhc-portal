import {
  AlertsMetricsData,
  CommonMetricsData,
  NodeMetricsData,
  OperatorMetricsData,
} from '../monitoringHelper';

type AlertNodesOperator = {
  alerts: AlertsMetricsData;
  nodes: NodeMetricsData;
  operators: OperatorMetricsData;
  resourceUsage: CommonMetricsData;
};

export { AlertNodesOperator };
