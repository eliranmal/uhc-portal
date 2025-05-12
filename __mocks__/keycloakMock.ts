export interface KeycloakConfig {}

export interface KeycloakInitOptions {}

export interface KeycloakLoginOptions {}

class Keycloak {
  config: KeycloakConfig | string;

  constructor(config: KeycloakConfig | string) {
    this.config = config;
  }

  // eslint-disable-next-line class-methods-use-this
  init = (_initOptions?: KeycloakInitOptions): Promise<boolean> =>
    new Promise((resolve) => {
      resolve(true);
    });

  // eslint-disable-next-line class-methods-use-this
  createLoginUrl = (_options?: KeycloakLoginOptions): Promise<string> =>
    new Promise((resolve) => {
      resolve('src');
    });
}

export default Keycloak;
