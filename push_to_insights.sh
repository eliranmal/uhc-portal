#!/bin/bash -e
#
# Copyright (c) 2019 Red Hat, Inc.
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

# Based on https://github.com/RedHatInsights/insights-frontend-builder-common/blob/master/src/release.sh

# This script builds the OCM portal code and pushes it to the Insights
# deployment repositories. It is called via git hooks that trigger Jenkins jobs
# when code is merged to the 'master', 'candidate' or ' stable' branches.
#
# See app-interface for the job definition:
#
#  https://gitlab.cee.redhat.com/service/app-interface/blob/master/resources/jenkins/uhc/job-templates.yaml
#
# The script requires the following enviroment variables:
#
# PUSH_KEY - Base64 encoded SSH private key used to push to the Insights
# platform git repository. Available in Jenkins via Vault.
#
# This script expects either "stable", "staging" or "candidate" as the first paramter, specifying which branch to deploy


# URL of the Insights deployment repository for OCM:
export PUSH_URL="git@github.com:RedHatInsights/uhc-portal-frontend-deploy.git"

# Check the environment variables:
if [ -z "${PUSH_KEY}" ]; then
  echo "Insights push key hasn't been provided."
  echo "Make sure to set the 'PUSH_KEY' environment variable (base64)."
  exit 1
fi
if [ -z "${PUSH_URL}" ]; then
  echo "Insights push URL hasn't been provided."
  echo "Make sure to set the 'PUSH_URL' environment variable."
  exit 1
fi

# From this point, verbose logging is safe.
set -x

# The version should be the short git hash:
VERSION="$(git rev-parse --short HEAD)"
SUBJECT="$(git log --pretty=format:'%s' -n 1)"
COMMIT_DATE="$(git log --pretty=format:'%ci' -n 1)"

# sentry
SENTRY_STAGE_PROJECT="ocm-uhc-portal-stage"
SENTRY_STAGE_VERSION="$SENTRY_STAGE_PROJECT-$VERSION-insights"
SENTRY_PROD_PROJECT="ocm-uhc-portal"
SENTRY_PROD_VERSION="$SENTRY_PROD_PROJECT-$VERSION-insights"


function cleanup_secrets() {
  rm --force key ssh
}
trap cleanup_secrets EXIT

cleanup_secrets

# Save the push key:
printenv PUSH_KEY | base64 --decode > key
chmod u=r,g=,o= key

node --version
git --version
ssh -V
# The version of `git` in the Jenkins node didn't support the
# `GIT_SSH_COMMAND` environment variable, only `GIT_SSH`. So we had
# to generate a script that wraps the original `ssh` command and adds the
# required options, and then put it in the `GIT_SSH` environment variable.
# TODO: simplify this, now supports both: https://git-scm.com/docs/git/2.27.0#Documentation/git.txt-codeGITSSHcode
cat > ssh <<.
#!/bin/bash
exec /usr/bin/ssh \
-o User=git \
-o IdentityFile=${PWD}/key \
-o IdentitiesOnly=true \
\$@
.
chmod u=rx,g=,o= ssh
export GIT_SSH="${PWD}/ssh"

# Clone the target Insights deployment repository:
rm --recursive --force target
mkdir target
git clone \
  --depth 1 \
  --single-branch \
  --branch master \
  "${PUSH_URL}" \
  target

# This function pushes the contents of the `build` directory to a specific
# branch of the Insights repository.
function push_build {
  # Get the parameters:
  local branch="$1"
  echo "Pushing to Insights branch '${branch}'"

  # Fetch the target branch:
  pushd target
    git fetch \
      --depth 1 \
      origin "${branch}"
    git branch \
      "${branch}" \
      FETCH_HEAD
    git checkout \
      "${branch}"
  popd

  # Replace all the files in the target branch with the new build:
  rsync \
    --archive \
    --delete \
    --exclude=.git \
    dist/openshift/ \
    target/

  # Copy the Insights deployment jenkins file to the target
  cp insights-Jenkinsfile target/58231b16fdee45a03a4ee3cf94a9f2c3

  # Populate the app.info.json file with build information
  echo "{
    \"app_name\": \"OCM\",
    \"src_hash\": \"$VERSION\",
    \"src_branch\": \"$branch\",
    \"commit_date\": \"$COMMIT_DATE\"
  }" > target/app.info.json

  # Create a commit for the new build and push it:
  cat > message <<.
Update to ${VERSION}

${SUBJECT}
.
  pushd target
    git add \
      --force \
      ./*
    git commit \
      --all \
      --allow-empty \
      --file ../message \
      --author "OCM Team <ocm-feedback@redhat.com>"
    git push \
      origin \
      "${branch}:${branch}"
  popd
}

# Install dependencies:
echo "Installing dependencies"
rm -rf node_modules
yarn install

# $1 is the 'mode' arg', passed from the calling CI job ('ocm-portal-deploy'),
# to determine how environments map to branches.
# the current mapping, in the form mode-->branch, is:
# staging-->master, stable-->stable
# @see https://gitlab.cee.redhat.com/service/app-interface/-/blob/631986e77d955a5d27d8ee4ecb653b561875b87e/data/services/ocm/ui/cicd/jobs.yaml#L37-44
# @see https://gitlab.cee.redhat.com/service/app-interface/-/blob/631986e77d955a5d27d8ee4ecb653b561875b87e/resources/jenkins/ocm-ui/job-templates.yaml#L16

if [ "$1" == "staging" ]; then
    echo "running staging push"
    rm -rf dist
    yarn build:prod --env sentry-version="$SENTRY_STAGE_VERSION"
    yarn sentry:sourcemaps
    push_build "qa-stable"
    echo "staging branch is pushed to RedHatInsights/uhc-portal-frontend-deploy qa-stable branch"
    yarn sentry:release --auth-token $GLITCHTIP_TOKEN --project="$SENTRY_STAGE_PROJECT" files "$SENTRY_STAGE_VERSION" upload-sourcemaps dist/ --url-prefix "/apps"

elif [ "$1" == "stable" ]; then
    echo "running stable push"
    rm -rf dist
    yarn build:prod --env sentry-version="$SENTRY_PROD_VERSION"
    yarn sentry:sourcemaps
    push_build "prod-stable"
    echo "stable branch is  pushed to RedHatInsights/uhc-portal-frontend-deploy prod-stable branch"
    yarn sentry:release --auth-token $GLITCHTIP_TOKEN --project="$SENTRY_PROD_PROJECT" files "$SENTRY_PROD_VERSION" upload-sourcemaps dist/ --url-prefix "/apps"

else
    echo "mode (first param) must be one of: staging / stable"
    exit 1
fi
