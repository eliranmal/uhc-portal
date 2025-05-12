/* global module */

const APP_ID = 'openshift';
const API_PORT = 8010;
const routes = {};

routes[`${APP_ID}`] = { host: 'http://localhost:8001' };
routes[`apps/${APP_ID}`] = { host: 'http://localhost:8001' };

// In staging/production, insights API is proxied through the UI domain e.g.
// https://console.dev.redhat.com/api/insights-results-aggregator/v2/clusters/f460563c-...
// whereas other OCM backends are served on distinct domain e.g.
// https://api.stage.openshift.com/api/accounts_mgmt/v1/subscriptions/1jbePckZxQsxay3nKXV4D2...
//
// Under mockdata/api/ dir, we got away with mixing both meanings. (see config/mockserver.json)
routes['/mockdata/api'] = { host: `http://localhost:${API_PORT}` };

module.exports = { routes };
