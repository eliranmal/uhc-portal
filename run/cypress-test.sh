#!/bin/bash
# Run cypress tests.

set -e -u -o pipefail

cd "$(dirname "$0")"

if [ -z "${CYPRESS_TEST_WITHQUOTA_USER-}" -o -z "${CYPRESS_TEST_WITHQUOTA_PASSWORD-}" ]; then
  echo "Error: CYPRESS_TEST_WITHQUOTA_USER and CYPRESS_TEST_WITHQUOTA_PASSWORD env vars are required."
  exit 2
fi

# JavaScript tests

# yarn run wdio --hostname="${TEST_SELENIUM_WD_HOSTNAME}" --port="${TEST_SELENIUM_WD_PORT}" "$@"
# yarn start &
# yarn wait-on "https://prod.foo.redhat.com:1337/"
yarn run e2e-test-prod-headless --spec './cypress/e2e/Tokens.js'
