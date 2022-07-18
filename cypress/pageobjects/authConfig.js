const config = {
  prodAuth: {
    username: Cypress.env('TEST_WITHQUOTA_USER'),
    password: Cypress.env('TEST_WITHQUOTA_PASSWORD'),
  },
};
const getAuthConfig = () => {
  // export CYPRESS_TEST_WITHQUOTA_USER=...
  expect(Cypress.env('TEST_WITHQUOTA_USER'), 'TEST_WITHQUOTA_USER').to.not.be.undefined;
  // export CYPRESS_TEST_WITHQUOTA_PASSWORD=...
  expect(Cypress.env('TEST_WITHQUOTA_PASSWORD', 'TEST_WITHQUOTA_PASSWORD')).to.not.be.undefined;
  return config.prodAuth;
};

exports.getAuthConfig = getAuthConfig;
