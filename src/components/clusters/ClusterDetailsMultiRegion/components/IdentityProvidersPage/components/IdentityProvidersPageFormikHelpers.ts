import * as Yup from 'yup';

import { FieldId } from '../constants';
import { IDPformValues, IDPTypeNames } from '../IdentityProvidersHelper';

export const IdentityProvidersPageFormInitialValues = (selectedIDP: string) => {
  const defaultIDP = IDPformValues.GITHUB;
  switch (selectedIDP) {
    case 'GithubIdentityProvider':
      return {
        [FieldId.TYPE]: selectedIDP || defaultIDP,
        [FieldId.MAPPING_METHOD]: 'claim',
        [FieldId.CLIENT_ID]: '',
        [FieldId.CLIENT_SECRET]: '',
        [FieldId.NAME]: '',
        [FieldId.HOSTNAME]: '',
        [FieldId.GITHUB_AUTH_MODE]: 'organizations',
        [FieldId.ORGANIZATIONS]: [''],
        [FieldId.TEAMS]: [''],
      };
    case 'GoogleIdentityProvider':
      return {
        [FieldId.TYPE]: selectedIDP || defaultIDP,
        [FieldId.MAPPING_METHOD]: 'claim',
        [FieldId.NAME]: '',
        [FieldId.CLIENT_ID]: '',
        [FieldId.CLIENT_SECRET]: '',
        [FieldId.HOSTED_DOMAIN]: '',
      };
    case 'OpenIDIdentityProvider':
      return {
        [FieldId.TYPE]: selectedIDP || defaultIDP,
        [FieldId.MAPPING_METHOD]: 'claim',
        [FieldId.NAME]: '',
        [FieldId.CLIENT_ID]: '',
        [FieldId.CLIENT_SECRET]: '',
        [FieldId.ISSUER]: '',
        [FieldId.OPENID_CA]: '',
        [FieldId.OPENID_EMAIL]: [''],
        [FieldId.OPENID_NAME]: [''],
        [FieldId.OPENID_PREFFERED_USERNAME]: [''],
        [FieldId.OPENID_EXTRA_SCOPES]: '',
      };
    case 'LDAPIdentityProvider':
      return {
        [FieldId.TYPE]: selectedIDP || defaultIDP,
        [FieldId.MAPPING_METHOD]: 'claim',
        [FieldId.NAME]: '',
        [FieldId.LDAP_CA]: '',
        [FieldId.LDAP_EMAIL]: [''],
        [FieldId.LDAP_ID]: [''],
        [FieldId.LDAP_INSECURE]: false,
        [FieldId.LDAP_NAME]: [''],
        [FieldId.LDAP_PREFFERED_USERNAME]: [''],
        [FieldId.LDAP_URL]: '',
      };
    case 'GitlabIdentityProvider':
      return {
        [FieldId.TYPE]: selectedIDP || defaultIDP,
        [FieldId.MAPPING_METHOD]: 'claim',
        [FieldId.NAME]: '',
        [FieldId.CLIENT_ID]: '',
        [FieldId.CLIENT_SECRET]: '',
        [FieldId.GITLAB_CA]: '',
        [FieldId.GITLAB_URL]: '',
      };
    default: // HTPasswdIdentityProvider
      return {
        [FieldId.TYPE]: selectedIDP || defaultIDP,
        [FieldId.NAME]: IDPTypeNames[selectedIDP],
        [FieldId.USERS]: [{ username: '', password: '', 'password-confirm': '' }],
      };
  }
};

export const IdentityProvidersPageValidationSchema = (selectedIDP: string) => {
  switch (selectedIDP) {
    case 'GithubIdentityProvider':
      return Yup.object({
        [FieldId.NAME]: Yup.string().required(),
        [FieldId.GITHUB_AUTH_MODE]: Yup.string(),
        [FieldId.ORGANIZATIONS]: Yup.array()
          .of(Yup.string())
          .test('at-least-one-filled', 'At least one field must be filled', (value, context) => {
            const { teams } = context.parent;
            const isOrganizationsFilled = value?.some((val) => val && val.trim() !== '');
            const isTeamsFilled = teams?.some((val: string) => val && val.trim() !== '');

            return isOrganizationsFilled || isTeamsFilled; // At least one must be filled
          }),
        [FieldId.TEAMS]: Yup.array()
          .of(Yup.string())
          .test('at-least-one-filled', 'At least one field must be filled', (value, context) => {
            const { organizations } = context.parent;
            const isTeamsFilled = value?.some((val) => val && val.trim() !== '');
            const isOrganizationsFilled = organizations?.some(
              (val: string) => val && val.trim() !== '',
            );

            return isTeamsFilled || isOrganizationsFilled; // At least one must be filled
          }),
      });
    case 'GoogleIdentityProvider':
      return Yup.object({
        [FieldId.NAME]: Yup.string().required(),
        [FieldId.CLIENT_ID]: Yup.string().required('Field is required'),
        [FieldId.CLIENT_SECRET]: Yup.string().required('Field is required'),
        [FieldId.HOSTED_DOMAIN]: Yup.string().required(),
      });
    case 'OpenIDIdentityProvider':
      return Yup.object({
        [FieldId.NAME]: Yup.string().required(),
        [FieldId.CLIENT_ID]: Yup.string().required('Field is required'),
        [FieldId.CLIENT_SECRET]: Yup.string().required('Field is required'),
        [FieldId.ISSUER]: Yup.string().required('Field is required'),
        [FieldId.OPENID_EMAIL]: Yup.array()
          .of(Yup.string())
          .test('at-least-one-filled', 'At least one field must be filled', (value) =>
            value?.some((val) => val !== undefined && val.trim() !== ''),
          ),
        [FieldId.OPENID_NAME]: Yup.array()
          .of(Yup.string())
          .test('at-least-one-filled', 'At least one field must be filled', (value) =>
            value?.some((val) => val !== undefined && val.trim() !== ''),
          ),
        [FieldId.OPENID_PREFFERED_USERNAME]: Yup.array()
          .of(Yup.string())
          .test('at-least-one-filled', 'At least one field must be filled', (value) =>
            value?.some((val) => val !== undefined && val.trim() !== ''),
          ),
      });
    case 'LDAPIdentityProvider':
      return Yup.object({
        [FieldId.NAME]: Yup.string().required(),
        [FieldId.LDAP_URL]: Yup.string().required(),
        [FieldId.LDAP_ID]: Yup.array()
          .of(Yup.string())
          .test('at-least-one-filled', 'At least one field must be filled', (value) =>
            value?.some((val) => val !== undefined && val.trim() !== ''),
          ),
      });
    case 'GitlabIdentityProvider':
      return Yup.object({
        [FieldId.NAME]: Yup.string().required(),
        [FieldId.CLIENT_ID]: Yup.string().required('Field is required'),
        [FieldId.CLIENT_SECRET]: Yup.string().required('Field is required'),
        [FieldId.GITLAB_URL]: Yup.string().required('Field is required'),
      });
    default: // HTPasswdIdentityProvider
      return Yup.object({
        [FieldId.NAME]: Yup.string().required(),
        [FieldId.USERS]: Yup.array().of(
          Yup.object().shape({
            [FieldId.USERNAME]: Yup.string().required('Username is required'),
            [FieldId.PASSWORD]: Yup.string().required('Password is required'),
            [FieldId.PASSWORD_CONFIRM]: Yup.string()
              .oneOf([Yup.ref(FieldId.PASSWORD), ''], 'Passwords must match')
              .required('Confirm password is required'),
          }),
        ),
      });
  }
};
