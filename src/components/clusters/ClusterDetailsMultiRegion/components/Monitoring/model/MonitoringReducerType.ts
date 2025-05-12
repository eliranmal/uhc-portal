// TODO: to refactor MonitoringReducer to TS
type MonitoringReducerType = {
  alerts: {
    data: any[];
    fulfilled: false;
    error: false;
    pending: false;
  };
  nodes: {
    data: any[];
    fulfilled: false;
    error: false;
    pending: false;
  };
  operators: {
    data: any[];
    fulfilled: false;
    error: false;
    pending: false;
  };
};

export { MonitoringReducerType };
