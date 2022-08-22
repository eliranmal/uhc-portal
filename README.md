# OCM UI

This repository contains the UI components for the OpenShift Cluster
Manager site.

The UI is a JavaScript application written in React and Redux.
Additionally it contains a helper development server, `backend`, written
in Go.

Slack channels: `#service-development` for OCM in general, `#ocm-osd-ui` for UI.

# Style

To promote consistency in the code base, OCM follows the JavaScript and React style guides produced
by airbnb.

[airbnb style guides](https://github.com/airbnb/javascript)

To guide and aid developers in style consistency, OCM uses eslint and
the eslint tools provided by airbnb.

[eslint](https://eslint.org/) [airbnb eslint
tools](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb)

To run the linter

```
    $ yarn lint
```

# Formatting

To promote consistency in the code base, OCM uses the [Prettier](https://prettier.io/) code formatter for Javascript and TypeScript files.

To run prettier on all files in the `src` directory:

```
    $ yarn prettier
```

To fix all formatting issues in all files in the `src` directory:

```
    $ yarn prettier:fix
```

If you need to have prettier run on a set of files, NPX can be used.

```
npx prettier --check <path to file or directory>
```

For example _npx prettier --check 'src/common/\**/*.{js,ts,jsx,tsx}'_ Note that you can use the `--write` flag instead of "check" to fix formatting issues.

NOTE: Staged javascript files from the `src` directory will be checked and fixed by Prettier at commit time via [Husky](https://typicode.github.io/husky/#/) and [lint-staged](https://github.com/okonet/lint-staged). If there are any formatting errors that cannot be fixed, the commit will not happen. The scripts that are run at commit time can be run at any time against staged files by running `npx lint-staged`.

## Local Linting

To use eslint tools locally (e.g. as part of your editor config), you
may need to follow the installation and usage instructions using global
installation.

[Installation
instructions](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb#eslint-config-airbnb-1)

# Building

To build the application install the `yarn` tool and then run these
commands:

```
yarn install
yarn build
```

# Insights "chrome"

As all apps under console.redhat.com, our app uses
[insights-chrome](https://github.com/RedHatInsights/insights-chrome).
(The term "chrome" refers to it being a thin wrapper, no relation to Google Chrome.)

It is responsible for rendering the header & menu around the main content,
and providing common services, like authentication or analytics.

It’s not a regular build dependency but is injected by CDN using [Edge
Side Includes](https://en.wikipedia.org/wiki/Edge_Side_Includes) tags.

To mimic this, as well as resulting URL structure, in development we
have two solutions:

- `yarn start` uses `noproxy` param to `webpack.config.js` which "cheats":
  it fetches the 2 ESI snippets once and inlines them in index.html at
  _build time_ (being a single-page app, we only need them in index.html).
  Such a build is OK for local dev but not for long-lived deploys.

- [insights-proxy](https://github.com/RedHatInsights/insights-proxy) is a
  heavier solution interpreting ESI on-the-fly, as the CDN would.
  Details below.

# Running locally

For a first time setup, run `make dev-env-setup`. This will ask for your `sudo` password, to add some entries to `/etc/hosts`

After initial setup, run `yarn install && yarn start`.

The UI will be available at https://prod.foo.redhat.com:1337/openshift/

By default, UI will use a real staging backend.
You can switch between real backends and mockserver (see below) at any time by
appending `?env=staging` / `?env=production` / `?env=mockdata` URL param.
(`src/config/` directory contains some more options, but they might not work.)

In development mode, analytics events are configured to be routed
to the [_OCM Web Portal_ development source on Segment](https://app.segment.com/redhat-devtools/sources/ocm_web_portal_dev/overview).
If you see them in the [production source](https://app.segment.com/redhat-devtools/sources/ocm_web_portal/overview) instead, reload the page once
(this will stick until local storage is cleared).

## Running Without a Real Backend (mock backend)

Sometimes the backend might be broken, but you still want to develop the
UI. Sometimes you want full control over responses UI is getting.
For this purpose we’ve created a basic mock server that sends mock
data. It doesn’t support all actions the real backend supports, but it
should allow you to run the UI and test basic read-only functionality.

Both `yarn start` and `yarn start-with-proxy` run `mockdata/mockserver.py`
in the background and arrange its proxying such that UI will access if given
`?env=mockdata` (synonim `?env=mockserver`) URL param.

### Preparing Data for Mock Backend

To capture data from a real cluster, run:

```
mockdata/record-real-cluster.sh $CLUSTER_SERVICE_ID
```

(as more APIs get added, the script may need additions...)

The mock backend serves the data stored in the files under the `mockdata/api` directory. There's an one-to-one mapping between API requests and the files. For example, for the request `GET /api/clusters_mgmt/v1/clusters`, the mock backend serves the file `api/clusters/mgmt/v1/clusters.json`.

The file contains JSON data which can be as simple as a single API response.

```json
{
  "kind": "ClusterList",
  "page": 1,
  "size": 14,
  "total": 14,
  "items": [
    ......
  ]
}
```

For multiple API responses, use an array. A `match` field in the special `_meta_` object is used to match a request to its response. Responses are matched in the order as they are set in the array. It is a match when the `_meta_` is missing or it does not contain the `match` field.

For example, this file contains two API responses. The backend returns the 1st one when the request method is POST. Otherwise, it returns the 2nd as the default.

```json
[
  {
    "_meta_": {
      "match": {
        "method": "POST",
      }
    },
    "kind": "Cluster",
    "id": "abcxyz",
    ......
  },
  {
    "kind": "ClusterList",
    "page": 1,
    "size": 14,
    "total": 14,
    "items": [
      ......
    ]
  }
]
```

The `match` field can have,

- `method` to match the HTTP method;

- `request_body` to match the request payload.

Multiple rules are combined using `AND`. For example, in order to match a `POST` request with the payload `{"action": "create", "resource_type": "Cluster"}`, use

```json
"_meta_": {
  "match": {
    "method": "POST",
    "request_body": {
      "action": "create",
      "resource_type": "Cluster"
    }
  }
},
```

An `inject` field can be added to `_meta_` to change the request behaviour,

- `delay` to add a delay for the request;

- `ams_error` to replace the response by an AMS error.

For example, using this `inject`, it takes 1s for the request to return an AMS error with error code 11.

```json
"_meta_": {
  "inject": {
    "delay": "1s",
    "ams_error": "11"
  }
},

------ response (duration 1s) ------
{
  "id": "11",
  "kind": "Error",
  "href": "/api/accounts_mgmt/v1/errors/11",
  "code": "ACCT-MGMT-11",
  "reason": "Error calling OCM Account Manager",
  "operation_id": "021187a5-5650-41ed-9027-27d6e9ed9075"
}
```
# Cypress tests

To make it easier for developers to write tests, we've started to switch to the Cypress testing framework - [https://www.cypress.io/](https://www.cypress.io/).

Cypress tests are stored in the `cypress/` directory. We use the "page objects" pattern, in `cypress/pageobjects` - these define selectors for various components.
Test cases are in `cypress/e2e`.

These instructions assume `yarn start` (or equivalent dev-env) is already running.  In another terminal:

You'll need credentials in environment variables - `CYPRESS_TEST_WITHQUOTA_USER` and `CYPRESS_TEST_WITHQUOTA_PASSWORD` (ask team members).

To launch the Cypress test runner:
```
  yarn cypress-open
```

To run Cypress in headless mode:
```
  yarn cypress-headless
```
To execute a specific test in headless mode:
```
yarn cypress-headless --spec 'cypress/e2e/RosaClusterWizard.js'
```

# Automated Selenium tests

## New style tests (webdriver.io)

To make it easier for developers to write tests, we've decided to switch to a javascript based testing framework - [webdriver.io](https://webdriver.io).

wdio tests are stored in the `selenium-js/` directory. We use the "page objects" pattern, in `selenium-js/pageobjects` - these define selectors for various components.
Test cases are in `selenium-js/specs`.

These instructions assume `yarn start` (or equivalent dev-env) is already running. In another terminal:

You'll need credentials in environment variables - `TEST_SELENIUM_WITHQUOTA_PASSWORD` and `TEST_SELENIUM_WITHQUOTA_USER` (ask team members).

Optionally export `SELENIUM_DEBUG=true` environment variable if you want to stop on failure to let you debug (otherwise, it writes a screenshot file and moves on).

Now you need to choose which WebDriver server to use:

- Recommended: a local driver, that opens a browser window directly on your screen.

  ```
  yarn selenium-with-chromedriver
  ```

  This starts a selenium control server on port 4444, and runs the tests accordingly.

  Extra argument will be passed on to `wdio` for example:

  ```
  yarn selenium-with-chromedriver --watch --spec selenium-js/specs/Downloads.js
  ```

- To use same browser as under CI, in a container:

  Optionally export `BROWSER=firefox` or `BROWSER=chrome`. Run `yarn selenium-with-vnc`.
  This starts a selenium control server on port 4444, and VNC server on port 5900, and runs the tests.

  Extra argument will be passed on to `wdio` for example:

  ```
  yarn selenium-with-vnc --watch --spec selenium-js/specs/Downloads.js
  ```

  Optional: to observe/debug the test, connect a VNC viewer to `localhost`, password is `secret`.
  If you have Vinagre (`sudo dnf install vinagre`), simply run `yarn selenium-viewer` in another terminal.

  - Actually in CI we use run/selenium-pod.sh that starts containers differently to avoid port conflicts for parallel CI.
    It also uses static nginx, which requires a full `yarn build` on every change — inconvenient for development.

The yarn commands are defined in package.json "scripts" section, some running scripts from run/ directory.

# Alternative option for running locally: insights-proxy

## The backend proxy

You will need to start the backend proxy server, which acts as a
proxy for the _OpenID_ and API services that are required by the
application.

To build the `backend` proxy server run the `binaries` target of the
_Makefile_:

```
make binaries
```

Before starting it make sure to have an offline access
token, either in the `UHC_TOKEN` environment variable or in the `token`
parameter of the configuration file:

    $ export UHC_TOKEN="eyJ..."
    $ ./backend

To obtain the access token go to the [token
page](https://console.redhat.com/openshift/token) and copy the _offline
access token_.

By default the backend proxy server will be available at
<http://localhost:8010>, and the default configuration of the
application is already prepared to use it.

If you need to change the configuration used by this backend proxy, then
create a YAML file.

By default, if nothing else is specified, the backend proxy will attempt to load the config file from the default location: `backend-config.yml`.

You can alsoand specify the config file with the `--config` command line
option:

    $ ./backend --config=my.yml

Or with the `BACKEND_CONFIG` environment variable:

    $ BACKEND_CONFIG="my.yml" ./backend

The content of this file should be something like this (or any subset of
it):

```yaml
listener:
  address: localhost:8010

keycloak:
  url: https://sso.redhat.com/auth/realms/redhat-external/protocol/openid-connect/token
  client_id: cloud-services
  client_secret: # empty by default

proxies:
  - prefix: /api/
    target: https://api.stage.openshift.com

token: eyJ... # default token for any user. Optional.
token_map: # map specific user names (in QA auth server) to access tokens. Optional.
  user1: eyJ...
  user2: eyJ...
```

Note that this `--config` option and the configuration file are
optional, the default configuration already uses `localhost`,
`sso.redhat.com` and port `8002`, and already forwards all API requests
to the staging environment.

If you need to use a service located in some other place, for example if
you need to use the clusters service deployed in your local environment,
you can add an additional proxy configuration:

```yaml
proxies:
  - prefix: /api/clusters_mgmt/
    target: https://api.127.0.0.1.nip.io
```

That will forward requests starting with `/api/clusters_mgmt/` to your
local clusters service, and the rest to the staging environment.

## Running insights-proxy

`make insights-proxy-setup` will autimatically clone/pull insights-proxy
under `run/insights-proxy` subdirectory and perform its setup
instructions (`patch-etc-hosts.sh`, `update.sh`). . Note that this
includes using `sudo` to patch you /etc/hosts.

This is a one-time setup process but safe to repeat if you want to
update the proxy.

Now you can use

    $ yarn insights-proxy

which waits for a backend to be serving (might not work otherwise), then
runs an `insightsproxy` container with our `profiles/local-frontend.js`
config, passing API requests to the backend (or mock server) described
above.

But more conveniently, use this to launch webpack-dev-server, mockserver.py,
and insights-proxy together:

    $ yarn start-with-proxy

This behaves similarly to `yarn start` — by default you'll access
real staging backed, but can override by appending `?env=staging` /
`?env=production` / `?env=mockdata` URL param.

You may set `RUNNER=podman` or `RUNNER=docker` env var to choose with
which tool containers will be updated/run.

- Some ways to kill insights-proxy "detach" the container instead of
  exiting. `yarn stop-insights-proxy` helps.

# Deploying

Each of the consoledot environments has a "beta" version; their original goal
was running same app code + beta insights-chrome code.
For OCM we're somewhat misusing prod-beta to also run different app code:

| uhc-portal branch | deployed env                                         | insights-chrome | default backend |
| ----------------- | ---------------------------------------------------- | --------------- | --------------- |
| `master`          | https://qaprodauth.console.redhat.com/beta/openshift | next version    | staging         |
| `master`          | https://qaprodauth.console.redhat.com/openshift      | stable version  | staging         |
| `candidate`       | https://console.redhat.com/beta/openshift            | next version    | production      |
| `stable`          | https://console.redhat.com/openshift                 | stable version  | production      |

On every update to the above branches, the code gets deployed into the relevant
enviroment(s) using the `push_to_insights.sh` script. This script is
called via git hooks. See the script for more details.

So for a regular weekly deploy, we open an merge request master -> candidate,
followed by candidate -> stable.

Use `./deploy_info.mjs` script to check which versions are now deployed.
If you want to monitor/debug the deploy jobs, `./deploy_info.mjs --json`
output has all the info you’ll need.

# Merge Request review

- For external contributors: If you need a merge request review, please message the OCM UI team at the `#ocm-osd-ui` slack channel.

- Code that changes behavior requires a test

- When you touch a component without tests add one

- Large merge requests should be resubmitted in smaller chunks

- Test broad changes locally
