// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';
import '@cypress/code-coverage/support';

// Alternatively you can use CommonJS syntax:
// require('./commands')

beforeEach(() => {
  cy.log('Configuring Cypress to catch all uncaught exceptions & unhandled promise rejections thrown from OCM app.');
  cy.on('uncaught:exception', (err, runnable) => {
    // return false to prevent the error from failing this test
    console.error(`Cypress caught exception: ${err.message}`);
    return false;
  });
});
