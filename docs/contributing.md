# Contributing

## Table of contents

- [Insights "Chrome" Architecture](#insights-chrome-architecture)
- [Code Style](#code-style)
  - [Linting](#linting)
  - [Formatting](#formatting)
- [Testing](#testing)
  - [Unit tests](#unit-tests)
  - [End-to-end tests](#end-to-end-tests)
- [OpenAPI types definitions](#openapi-types-definitions)
- [Storybook](#storybook)
- [Merge request review](#merge-request-review)

## Insights "Chrome" Architecture

As all apps under console.redhat.com, our app uses [insights-chrome](https://github.com/RedHatInsights/insights-chrome).
(The term "chrome" refers to it being a thin wrapper, no relation to Google Chrome.)

It is responsible for rendering the header & menu around the main content, and providing common services, like authentication or analytics.

It’s not a regular build dependency but is injected by CDN using [EdgeSide Includes](https://en.wikipedia.org/wiki/Edge_Side_Includes) tags.

To mimic this, as well as resulting URL structure, in development you can run `yarn start`. It uses `noproxy` param to `webpack.config.js` which "cheats":
it fetches the 2 ESI snippets once and inlines them in index.html at _build time_ (being a single-page app, we only need them in index.html).
Such a build is OK for local dev but not for long-lived deploys.

## Code Style

To promote consistency in the code base, OCM follows the JavaScript and React [style guides produced
by airbnb](https://github.com/airbnb/javascript).

To guide and aid developers in style consistency, OCM uses [eslint](https://eslint.org/) and
the [airbnb eslint
tools](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb).

### Linting

To run the linter:

```
yarn lint
```

Note that this command will also run the formatter. See next chapter for more info.

### Formatting

To promote consistency in the code base, OCM uses the [Prettier](https://prettier.io/) code formatter for Javascript and TypeScript files.

To run prettier on all files in the `src` directory:

```
yarn prettier
```

To fix all formatting issues in all files in the `src` directory:

```
yarn prettier:fix
```

If you need to have prettier run on a set of files, NPX can be used.

```
npx prettier --check <path to file or directory>
```

For example `npx prettier --check 'src/common/\**/*.{js,ts,jsx,tsx}'`. Note that you can use the `--write` flag instead of "check" to fix formatting issues.

NOTE: Staged javascript files from the `src` directory will be checked and fixed by Prettier at commit time via [Husky](https://typicode.github.io/husky/#/) and [lint-staged](https://github.com/okonet/lint-staged). If there are any formatting errors that cannot be fixed, the commit will not happen. The scripts that are run at commit time can be run at any time against staged files by running `npx lint-staged`.

## Testing

### Unit tests

To run the tests:

```
yarn test
```

Unit tests are written using [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro).

Jest will use all available cores to spawn workers while running tests. This can cause your local machine to become unresponsive.
You can run tests with a reduced amount of cpu usage by using:

```
yarn test-local
```

See the [unit test guidelines](./unit-testing.md) for in-depth guidance on writing tests.

### End-to-end tests

End-to-end tests are written using [Cypress](https://www.cypress.io/).

You can read more in the [dedicated `README`](../cypress/README.md) inside the `/cypress` folder.

## OpenAPI types definitions

Types generated from OpenAPI spec files are located in the `src/types` folder.

You can read more about generating new types in the [dedicated README](../openapi/README.md).

## Storybook

A storybook is available to document UI elements, implement PoCs and run components in isolation.

To run storybook:

```
yarn storybook
```

Storybook will be available locally at `http://localhost:6006/`.


A component’s stories are defined in a story file that lives alongside the component file. The story file is for development-only, and it won't be included in the production bundle.
When adding a component to storybook, please create stories in separate files using the `.stories.tsx` suffix. For example, to add stories to a component named "MySelect.tsx", create a separate `MySelect.stories.tsx` file in the same folder.

You can have a look at storybook docs for more info about [how to write stories](https://storybook.js.org/docs/writing-stories).

## Merge Request review

- For external contributors: If you need a merge request review, please message the OCM UI team at the `#ocm-osd-ui` slack channel.

- Code that changes behavior requires a test

- When you touch a component without tests add one

- Large merge requests should be resubmitted in smaller chunks

- Test broad changes locally
