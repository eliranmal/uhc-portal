import Login from '../pageobjects/login.page';
import TokenPages from '../pageobjects/Tokens.page';
import ClusterListPage from '../pageobjects/ClusterList.page';

describe('Token pages', () => {
  before(() => {
    cy.visit('/');
    Login.isLoginPageUrl();
    Login.login();

    ClusterListPage.isClusterListUrl();
    ClusterListPage.isReady();
  });

  it('rosa token page', () => {
    TokenPages.navigateToROSAToken();
    cy.contains('h1', 'OpenShift Cluster Manager API Token').should('exist');
    cy.getByTestId('load-token-btn').should('exist');

    /*
    Disabled to avoid hitting offline_session_limit_exceeded.

    button.click();

    expect(TokenPages.loadTokenButton()).not.toExist();
    expect(TokenPages.tokenBox()).toHaveValueContaining('eyJ');
    expect(TokenPages.commandBox()).toHaveValueContaining('rosa login --token="eyJ');
    */
  });

  it('ocm-cli token page', () => {
    TokenPages.navigateToOCMToken();
    cy.contains('h1', 'OpenShift Cluster Manager API Token').should('exist');
    cy.getByTestId('load-token-btn').should('exist');

    /*
    Disabled to avoid hitting offline_session_limit_exceeded.

    button.click();

    expect(TokenPages.loadTokenButton()).not.toExist();
    expect(TokenPages.tokenBox()).toHaveValueContaining('eyJ');
    expect(TokenPages.commandBox()).toHaveValueContaining('ocm login --token="eyJ');
    */
  });
});
