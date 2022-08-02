/* eslint-disable class-methods-use-this */
import Page from './page';
import { getAuthConfig } from './authConfig';

class Login extends Page {
  get inputUsername() { return 'input[name="username"]'; }

  get inputPassword() { return 'input[name="password"]'; }

  clickNextBtn = () => cy.get('button').contains('Next').should('be.visible').click();

  clickSubmitBtn = () => cy.get('button[type="submit"]').should('be.visible').click();

  isLoginPageUrl = () => cy.url().should('include', 'auth/realms/redhat-external/protocol/openid-connect');

  isPasswordScreen = () => cy.contains('h1', 'Log in to your Red Hat account').should('be.visible');

  login() {
    const { username, password } = getAuthConfig();
    cy.get(this.inputUsername).first().type(username); // there are 2 hidden username fields?!
    this.clickNextBtn();
    this.isPasswordScreen();
    cy.get(this.inputPassword).type(password);
    this.clickSubmitBtn();
    this.closePendoIfShowing();
    this.closeCookieConsentIfShowing();
  }

  closePendoIfShowing() {
    // This might not work, it takes time for Pendo to pop up.
    const closePendoGuideBtn = '._pendo-close-guide';
    cy.get('body').then(($body) => {
      cy.pause();
      if ($body.find(closePendoGuideBtn).length) {
        cy.get(closePendoGuideBtn)
          .should('be.visible')
          .click();
        cy.get(closePendoGuideBtn)
          .should('not.be.visible');
      }
    });
  }

  closeCookieConsentIfShowing() {
    const closeCookieConsentBtn = 'button#truste-consent-button';
    cy.get('body').then(($body) => {
      if ($body.find(closeCookieConsentBtn).length) {
        cy.get(closeCookieConsentBtn)
          .should('be.visible')
          .click();
        cy.get(closeCookieConsentBtn)
          .should('not.be.visible');
      }
    });
  }
}
export default new Login();
