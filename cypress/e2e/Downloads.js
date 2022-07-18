import Login from '../pageobjects/login.page';
import GlobalNav from '../pageobjects/GlobalNav.page';
import Downloads from '../pageobjects/Downloads.page';

const ROSARowTitle = 'Manage your Red Hat OpenShift Service on AWS';
const OCRowTitle = 'Create applications and manage OpenShift projects from the command line using the OpenShift client oc';
const HELMRowTitle = 'Define, install, and upgrade application packages as Helm charts using Helm';
const OSLocalTitle = 'Download and open the OpenShift Local';

describe('Downloads page', () => {
  before(() => {
    cy.visit('/');
    Login.isLoginPageUrl();
    Login.login();

    GlobalNav.navigateTo('Downloads');
    GlobalNav.closeSideBarNav();
    Downloads.isDownloadsPage();
  });

  it('can expand and collapse rows', () => {
    Downloads.isHiddenRowContaining(ROSARowTitle);

    Downloads.clickExpandableRow('(rosa)');
    Downloads.isVisibleRowContaining(ROSARowTitle);

    Downloads.clickExpandableRow('(rosa)');
    Downloads.isHiddenRowContaining(ROSARowTitle);
  });

  it('expand/collapse affects only selected category', () => {
    Downloads.isHiddenRowContaining(ROSARowTitle);
    Downloads.isHiddenRowContaining(OCRowTitle);
    Downloads.isHiddenRowContaining(HELMRowTitle);

    Downloads.filterByCategory('Command-line interface (CLI) tools');
    Downloads.clickExpandAll();
    Downloads.isVisibleRowContaining(ROSARowTitle);
    Downloads.isVisibleRowContaining(OCRowTitle);
    Downloads.rowDoesNotExist('expanded-row-helm');

    Downloads.filterByCategory('All categories');
    Downloads.isVisibleRowContaining(ROSARowTitle);
    Downloads.isVisibleRowContaining(OCRowTitle);
    Downloads.isHiddenRowContaining(HELMRowTitle);

    // Given mixed state, first click expands all.
    Downloads.clickExpandAll();
    Downloads.isVisibleRowContaining(ROSARowTitle);
    Downloads.isVisibleRowContaining(HELMRowTitle);

    // Once all expanded, second click collapses all.
    Downloads.clickCollapseAll();
    Downloads.isHiddenRowContaining(ROSARowTitle);
    Downloads.isHiddenRowContaining(OCRowTitle);
    Downloads.isHiddenRowContaining(HELMRowTitle);
  });

  it('selecting OS affects architecture options & href', () => {
    cy.getByTestId('os-dropdown-odo').select('Linux');

    Downloads.enabledDropdownOptions(
      'arch-dropdown-odo',
      ['x86_64', 'aarch64', 'ppc64le', 's390x'],
    );

    cy.getByTestId('download-btn-odo').invoke('attr', 'href')
      .should('equal', 'https://developers.redhat.com/content-gateway/rest/mirror/pub/openshift-v4/clients/odo/latest/odo-linux-amd64.tar.gz');

    cy.getByTestId('arch-dropdown-odo')
      .select('ppc64le');

    cy.getByTestId('download-btn-odo').invoke('attr', 'href')
      .should('equal', 'https://developers.redhat.com/content-gateway/rest/mirror/pub/openshift-v4/clients/odo/latest/odo-linux-ppc64le.tar.gz');

    // Only x86 available for Windows.
    cy.getByTestId('os-dropdown-odo')
      .select('Windows');

    Downloads.enabledDropdownOptions(
      'arch-dropdown-odo',
      ['x86_64'],
    );

    cy.getByTestId('arch-dropdown-odo').should('be.disabled');

    Downloads.allDropdownOptions(
      'arch-dropdown-odo',
      ['Select architecture', 'x86_64', 'aarch64', 'ppc64le', 's390x'],
    );

    cy.getByTestId('download-btn-odo').invoke('attr', 'href')
      .should('equal', 'https://developers.redhat.com/content-gateway/rest/mirror/pub/openshift-v4/clients/odo/latest/odo-windows-amd64.exe.zip');
  });

  it('selecting a category preserves OS & architecture of invisible sections', () => {
    cy.getByTestId('os-dropdown-helm')
      .select('Linux');

    cy.getByTestId('arch-dropdown-helm')
      .select('s390x');

    // OpenShift Local
    cy.getByTestId('os-dropdown-crc')
      .select('Windows');

    Downloads.filterByCategory('Tokens');

    Downloads.rowDoesNotExist('expanded-row-rosa');
    Downloads.rowDoesNotExist('expanded-row-helm');
    Downloads.rowDoesNotExist('expanded-row-crc');

    Downloads.filterByCategory('All categories');
    Downloads.clickExpandAll();

    Downloads.isVisibleRowContaining(ROSARowTitle);
    Downloads.isVisibleRowContaining(HELMRowTitle);
    Downloads.isVisibleRowContaining(OSLocalTitle);

    cy.getByTestId('os-dropdown-helm').should('have.value', 'linux');
    cy.getByTestId('arch-dropdown-helm').should('have.value', 's390x');
    // OpenShift Local
    cy.getByTestId('os-dropdown-crc').should('have.value', 'windows');
  });
});
