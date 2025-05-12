import { LdapAttributes, OpenIdClaims } from '~/types/clusters_mgmt.v1';

import {
  generateIDPName,
  getCreateIDPRequestData,
  getGitHubTeamsAndOrgsData,
  getInitialValuesForEditing,
  getldapAttributes,
  getldapca,
  getOauthCallbackURL,
  getOpenIdClaims,
  IDPformValues,
  IDPNeedsOAuthURL,
  IDPObjectNames,
  IDPTypeNames,
  isEmptyReduxArray,
} from '../IdentityProvidersHelper';
import { IDPFormDataType } from '../model/IDPFormDataType';

import {
  bindPassFormData,
  bindPassFormDataExpected,
  claims,
  clientSecretFormData,
  clientSecretFormDataExpected,
  emailClaimsExpected,
  emailLdapAttributesExpected,
  githubFormDataOrganizations,
  githubFormDataOrganizationsExpected,
  githubFormDataTeams,
  githubFormDataTeamsExpected,
  gitHubOnlyOrgsData,
  gitHubOnlyOrgsDataExpected,
  gitHubTeamsAndOrgsData,
  gitHubTeamsAndOrgsDataExpected,
  githubTrimFormDataTeams,
  githubTrimFormDataTeamsExpected,
  gitlabFormData,
  gitlabFormDataExpected,
  gitlabTrimFormData,
  gitlabTrimFormDataExpected,
  googleFormData,
  googleFormDataExpected,
  htpassFormData,
  htpassFormDataExpected,
  htpassNoIdpFormData,
  htpassNoIdpFormDataExpected,
  ldapFormData,
  ldapFormDataExpected,
  nameClaimsExpected,
  nameLdapAttributesExpected,
  openIdFormData,
  openIdFormDataExpected,
  openIdTrimFormData,
  openIdTrimFormDataExpected,
  preferredUsernameClaimsExpected,
  preferredUsernameLdapAttributesExpected,
  providersExpectedFormData,
  providersFixtures,
} from './IdentityProvidersHelper.fixtures';

describe('generateIDPName()', () => {
  it('Returns IDP type name if the list is empty', () => {
    expect(generateIDPName('GithubIdentityProvider', [])).toEqual('GitHub');
    expect(generateIDPName('GoogleIdentityProvider', [])).toEqual('Google');
    expect(generateIDPName('OpenIDIdentityProvider', [])).toEqual('OpenID');
    expect(generateIDPName('LDAPIdentityProvider', [])).toEqual('LDAP');
    expect(generateIDPName('GitlabIdentityProvider', [])).toEqual('GitLab');
    expect(generateIDPName('HTPasswdIdentityProvider', [])).toEqual('htpasswd');
  });

  it('Returns IDP type name if the list only has IDPs with different names', () => {
    expect(
      generateIDPName('GithubIdentityProvider', [{ name: 'foo' }, { name: 'google' }]),
    ).toEqual('GitHub');
  });

  it('Returns GitHub-1 if the list only has one IDP with the name GitHub', () => {
    expect(
      generateIDPName('GithubIdentityProvider', [{ name: 'GitHub' }, { name: 'google' }]),
    ).toEqual('GitHub-1');
  });

  it('Returns IDP type GitHub-2 if the list only has IDPs GitHub, GitHub-1, GitHub-3', () => {
    expect(
      generateIDPName('GithubIdentityProvider', [
        { name: 'GitHub' },
        { name: 'GitHub-1' },
        { name: 'GitHub-3' },
      ]),
    ).toEqual('GitHub-2');
  });
});

describe('isEmptyArray()', () => {
  it('Returns False if at least one claim is present', () => {
    expect(
      isEmptyReduxArray(
        [
          { id: 1, openid_name: 'Test' },
          { id: 2, openid_name: 'Test2' },
        ],
        'openid_name',
      ),
    ).toEqual(false);
  });
  it('Returns true if all the claims is empty', () => {
    expect(
      isEmptyReduxArray(
        [
          { id: 1, openid_name: '' },
          { id: 2, openid_name: '' },
        ],
        'openid_name',
      ),
    ).toEqual(true);
  });
  it('Returns false for different identity provider type when the array is undefined', () => {
    expect(isEmptyReduxArray(undefined, 'openid_name')).toEqual(false);
  });
});

describe('getOauthCallbackURL()', () => {
  const idpName = 'my-idp-name';
  const clusterUrls = {
    console: 'https://console-openshift-console.apps.test-liza.wiex.s1.devshift.org',
    api: 'https://api.test-api-liza.wiex.s1.devshift.org',
  };

  it('Returns empty if the parameters are also empty', () => {
    expect(getOauthCallbackURL({ console: '', api: clusterUrls.api }, idpName, false)).toEqual('');
    expect(getOauthCallbackURL({ console: clusterUrls.console, api: '' }, idpName, true)).toEqual(
      '',
    );
  });

  it('Uses the console url and updates the base name with the oauth URL for non-Hypershift clusters', () => {
    expect(getOauthCallbackURL(clusterUrls, idpName, false)).toEqual(
      'https://oauth-openshift.apps.test-liza.wiex.s1.devshift.org/oauth2callback/my-idp-name',
    );
  });

  it('Uses the console url and updates the base name with the oauth URL for non-Hypershift clusters. Url ending with /', () => {
    expect(
      getOauthCallbackURL(
        { ...clusterUrls, console: `${clusterUrls.console}/`, api: `${clusterUrls.api}/` },
        idpName,
        false,
      ),
    ).toEqual(
      'https://oauth-openshift.apps.test-liza.wiex.s1.devshift.org/oauth2callback/my-idp-name',
    );
  });

  it('Uses the API url and updates the base name for Hypershift clusters', () => {
    expect(getOauthCallbackURL(clusterUrls, idpName, true)).toEqual(
      'https://oauth.test-api-liza.wiex.s1.devshift.org/oauth2callback/my-idp-name',
    );
  });

  it('Removes the API Url port for Hypershift clusters if IDP is not OPENID', () => {
    const withPort = {
      ...clusterUrls,
      api: 'https://api.test-liza.wiex.s1.devshift.org:456',
    };
    expect(getOauthCallbackURL(withPort, idpName, true)).toEqual(
      'https://oauth.test-liza.wiex.s1.devshift.org/oauth2callback/my-idp-name',
    );
  });

  it('Leaves the API Url port for Hypershift clusters if IDP is OPENID', () => {
    const withPort = {
      ...clusterUrls,
      api: 'https://api.test-liza.wiex.s1.devshift.org:456',
    };
    expect(getOauthCallbackURL(withPort, IDPTypeNames[IDPformValues.OPENID], true)).toEqual(
      'https://oauth.test-liza.wiex.s1.devshift.org:456/oauth2callback/OpenID',
    );
  });
});

describe('IDPNeedsOAuthURL', () => {
  it.each([
    ['when undefined', undefined, true],
    ['when empty', '', true],
    ['when whatever', 'whatever', true],
    ['IDPformValues.LDAP', IDPformValues.LDAP, false],
    ['IDPformValues.HTPASSWD', IDPformValues.HTPASSWD, false],
  ])('Returns correct data %p', (title, idpType, expected) =>
    expect(IDPNeedsOAuthURL(idpType)).toBe(expected),
  );
});

describe('getldapca', () => {
  it.each([
    ['when empty', {}, undefined],
    ['when ldap_ca', { ldap_ca: ' ldap ca ' }, 'ldap ca'],
    ['when ldap_ca & ldap_insecure', { ldap_ca: ' ldap ca ', ldap_insecure: true }, ''],
    [
      'when ldap_ca & ldap_insecure false',
      { ldap_ca: ' ldap ca ', ldap_insecure: false },
      'ldap ca',
    ],
    ['when ldap_ca', { ldap_ca: false }, false],
  ])('%p', (title, formData: IDPFormDataType, expected) =>
    expect(getldapca(formData)).toBe(expected),
  );
});

describe('getCreateIDPRequestData', () => {
  it.each([
    ['github teams', githubFormDataTeams, githubFormDataTeamsExpected],
    ['github organizations', githubFormDataOrganizations, githubFormDataOrganizationsExpected],
    ['github trim', githubTrimFormDataTeams, githubTrimFormDataTeamsExpected],
    ['google', googleFormData, googleFormDataExpected],
    ['openid', openIdFormData, openIdFormDataExpected],
    ['openid trim', openIdTrimFormData, openIdTrimFormDataExpected],
    ['ldap', ldapFormData, ldapFormDataExpected],
    ['gitlab', gitlabFormData, gitlabFormDataExpected],
    ['gitlab trim', gitlabTrimFormData, gitlabTrimFormDataExpected],
    ['htpass', htpassFormData, htpassFormDataExpected],
    ['CLIENT_SECRET', clientSecretFormData, clientSecretFormDataExpected],
    ['BIND_PASSWORD', bindPassFormData, bindPassFormDataExpected],
    ['no idpId', htpassNoIdpFormData, htpassNoIdpFormDataExpected],
  ])('%p', (title, formData, expected) =>
    expect(getCreateIDPRequestData(formData)).toStrictEqual(expected),
  );
});

describe('getOpenIdClaims', () => {
  it.each([
    ['name', claims, 'name', nameClaimsExpected],
    ['email', claims, 'email', emailClaimsExpected],
    ['preferred_username', claims, 'preferred_username', preferredUsernameClaimsExpected],
    ['not existing one', claims, 'whatever', []],
    ['none', {}, 'none', []],
    ['undefined', undefined, 'none', []],
  ])('%p', (title, claims, type, expected) =>
    expect(getOpenIdClaims(claims, type as keyof OpenIdClaims)).toStrictEqual(expected),
  );
});

describe('getldapAttributes', () => {
  it.each([
    ['name', 'name', nameLdapAttributesExpected],
    ['email', 'email', emailLdapAttributesExpected],
    ['preferred_username', 'preferred_username', preferredUsernameLdapAttributesExpected],
    ['not existing one', 'whatever', []],
    ['none', 'none', []],
  ])('%p', (title, type, expected) =>
    expect(getldapAttributes(claims, type as keyof LdapAttributes)).toStrictEqual(expected),
  );
});

describe('getGitHubTeamsAndOrgsData', () => {
  it.each([
    ['teams and organizations', gitHubTeamsAndOrgsData, gitHubTeamsAndOrgsDataExpected],
    ['only organizations', gitHubOnlyOrgsData, gitHubOnlyOrgsDataExpected],
    ['neither teams or organizations', {}, []],
  ])('%p', (title, type, expected) =>
    expect(getGitHubTeamsAndOrgsData(type)).toStrictEqual(expected),
  );
});

describe('getInitialValuesForEditing', () => {
  it.each([
    [
      'OpenID',
      providersFixtures[0],
      IDPObjectNames[IDPformValues.OPENID],
      providersExpectedFormData[0],
    ],
    [
      'Gitlab',
      providersFixtures[1],
      IDPObjectNames[IDPformValues.GITLAB],
      providersExpectedFormData[1],
    ],
    [
      'Google',
      providersFixtures[2],
      IDPObjectNames[IDPformValues.GOOGLE],
      providersExpectedFormData[2],
    ],
    [
      'GitHub',
      providersFixtures[3],
      IDPObjectNames[IDPformValues.GITHUB],
      providersExpectedFormData[3],
    ],
    [
      'LDAP',
      providersFixtures[4],
      IDPObjectNames[IDPformValues.LDAP],
      providersExpectedFormData[4],
    ],
  ])('returns proper form values for %p', (title, provider, type, expected) =>
    expect(getInitialValuesForEditing(provider, type)).toStrictEqual(expected),
  );
});
