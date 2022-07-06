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

# This script is executed by a Jenkins job for each change request. If it
# doesn't succeed the change won't be merged.

node --version

#make \
#  app \
#  binaries

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
