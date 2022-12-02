#!/bin/bash -ex
#
# Copyright (c) 2018 Red Hat, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

export QUAY_USER=dtaylor113
export QUAY_TOKEN=***REMOVED***

# This script is executed by a Jenkins job for each change request. If it
# doesn't succeed the change won't be merged.

# Log in to the image registry. This is needed because some of the images used
# for the Selenium tests (the `nginx` image in particular) are private.
set -x
if [ -z "${QUAY_USER}" ]; then
  echo "Environment variable 'QUAY_USER' is mandatory."
  exit 1
fi
if [ -z "${QUAY_TOKEN}" ]; then
  echo "Environment variable 'QUAY_TOKEN' is mandatory."
  exit 1
fi
podman login -u "${QUAY_USER}" -p "${QUAY_TOKEN}" quay.io

# Run the checks:

# mockdata checked first because really fast
mockdata/regenerate-clusters.json.sh
if ! git diff --exit-code --stat mockdata/api/clusters_mgmt/v1/clusters.json mockdata/api/accounts_mgmt/v1/subscriptions.json; then
  set +x
  echo 'ERROR: Generated collection jsons out of date. ^^^'
  echo '       => Run `mockdata/regenerate-clusters.json.sh` locally and commit the changes.'
  exit 1
fi

node --version

# In CI we use selenium-standalone containers, don't need local chromedriver
export CHROMEDRIVER_SKIP_DOWNLOAD=true

make \
  js-lint \
  app \
  test \
  binaries

export FORCE_COLOR=1

# Run the Selenium tests. If they get stuck, stop after realistic time. Jenkins
# aborting after 30 minutes is wasteful and doesn't give our `cleanup` function
# enough time to clean up.
timeout \
  --signal "TERM" \
  --kill-after "2m" \
  "10m" \
  "run/cypress-pod.sh"

make \
  go-lint
