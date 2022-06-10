const config = {
  qaAuth: {
    username: 'ealfassa',
    password: 'redhat',
  },
  prodAuth: {
    username: Cypress.env('TEST_WITHQUOTA_USER'),
    password: Cypress.env('TEST_WITHQUOTA_PASSWORD'),
  },
};
const getAuthConfig = () => {
  if (Cypress.config().baseUrl === 'https://prod.foo.redhat.com:1337/openshift/') {
    // export CYPRESS_TEST_WITHQUOTA_USER=...
    expect(Cypress.env('TEST_WITHQUOTA_USER'), 'TEST_WITHQUOTA_USER').to.not.be.undefined;
    // export CYPRESS_TEST_WITHQUOTA_PASSWORD=...
    expect(Cypress.env('TEST_WITHQUOTA_PASSWORD', 'TEST_WITHQUOTA_PASSWORD')).to.not.be.undefined;
    return config.prodAuth;
  }
  return config.qaAuth;
};

exports.getAuthConfig = getAuthConfig;
