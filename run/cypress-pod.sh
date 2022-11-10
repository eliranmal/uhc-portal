#!/bin/bash -e

# This script starts a podman pod that runs the Cypress tests.

# TODO: remove these!
export CYPRESS_TEST_WITHQUOTA_USER=ocm-selenium2
export CYPRESS_TEST_WITHQUOTA_PASSWORD=***REMOVED***
export ELECTRON_RUN_AS_NODE=1

# Check that the required environment variables are set:
if [ -z "${CYPRESS_TEST_WITHQUOTA_USER}" ]; then
  echo "Environment variable 'CYPRESS_TEST_WITHQUOTA_USER' is mandatory."
  exit 1
fi
if [ -z "${CYPRESS_TEST_WITHQUOTA_PASSWORD}" ]; then
  echo "Environment variable 'CYPRESS_TEST_WITHQUOTA_PASSWORD' is mandatory."
  exit 1
fi

cd "$(dirname "$(dirname "$0")")"  # repo root directory (above run/ that contains this script)

# yum install -y xorg-x11-server-Xvfb gtk2-devel gtk3-devel libnotify-devel GConf2 nss libXScrnSaver alsa-lib

# Check that the application has been built:
if [ ! -d "build" ]; then
  echo "Directory 'build' doesn't exist. Has the application been built?"
  echo "Make sure to run 'make app' before running this script."
  exit 1
fi

# Find the Jenkins build number that will be appended to the pod and container
# names, or else use the date if not running inside Jenkins:
build_number="${BUILD_NUMBER}"
if [ -z "${build_number}" ]; then
  build_number=$(date +%s)
fi

# When running in the Cypress environment we need to use images from
browser_image="quay.io/openshifttest/cypress-included:10.9.0"
proxy_image="quay.io/redhat-sd-devel/insights-proxy:3.2.1"
site_image="quay.io/app-sre/nginx:1.20.0"
if [ -z "${JENKINS_HOME}" ]; then
  site_image="docker.io/library/nginx:1.20.0"
fi

# Make sure that the pod is always removed:
function cleanup() {
  if [ ! -z "${pod_id}" ]; then
    # Collect the logs:
    if [ ! -z "${proxy_id}" ]; then
      podman logs "${proxy_id}" &> proxy.log
    fi
    if [ ! -z "${browser_id}" ]; then
      podman logs "${browser_id}" &> browser.log
    fi
    if [ ! -z "${site_id}" ]; then
      podman logs "${site_id}" &> site.log
    fi

    # Kill all the containers in the pod:
    podman pod rm --force "${pod_id}"

    # Remove the temporary site files:
    if [ ! -z "${site_conf}" ]; then
      rm "${site_conf}"
    fi
    if [ ! -z "${site_data}" ]; then
      rm -rf "${site_data}"
    fi
  fi
}
trap cleanup EXIT

# Create the initially empty pod and publish the Selenium browser and VNC ports
# to randomly selected host ports, so that we can run multiple instances of
# this pod simultaneously in the same host.
#
# Note that the containers inside this pod will only share the `net` namespace,
# so then can communicate with each other via the network. In particular they
# will not share the `ipc` namespace. This is necessary because otherwise it
# isn't possible to explicitly set the `/dev/shm` size for the container of the
# Selenium browser.
#
# Note also that all container will run with SELinux security labeling disable,
# so that they can read the volumes mapped from the host without having to
# relabel them.
pod_id=$(
  podman pod create \
    --name "cypress-${build_number}" \
    --add-host "qa.foo.redhat.com:127.0.0.1" \
    --add-host "prod.foo.redhat.com:127.0.0.1" \
    --add-host "registry-1.docker.io/v2/:127.0.0.0" \
    --publish "4444" \
    --publish "5900" \
    --share "net"
)

# Add to the pod the Insights proxy:
proxy_id=$(
  podman run \
    --pod "${pod_id}" \
    --name "proxy-${build_number}" \
    --env PLATFORM="linux" \
    --env CUSTOM_CONF="true" \
    --volume "${PWD}/profiles/local-frontend.js:/config/spandx.config.js" \
    --security-opt label="disable" \
    --detach \
    "${proxy_image}"
)

# Add to the pod the Cypress runner.
#
# Note that the `/dev/shm` size is explicitly set to 2 GiB because that is what
# is recommended in the Selenium containers documentation. But apparently the
# container doesn't create any files in the `/dev/shm` directory, so this is
# probably not necessary.
echo "Starting cypress browser..."
browser_id=$(
  podman run \
    --pod "${pod_id}" \
    --name "browser-${build_number}" \
    --shm-size "2g" \
    --security-opt label="disable" \
    --detach \
    "${browser_image}"
)

# Create a temporary file for the configuration of the web server:
site_conf=$(mktemp)
cat > "${site_conf}" <<'.'
user root;
worker_processes 1;
pid /var/run/nginx.pid;
error_log /dev/stderr;

events {
  worker_connections 1024;
}

http {
  include /etc/nginx/mime.types;
  access_log /dev/stdout;
  server {
    listen 8001;
    location /apps/openshift {
      root /site;
    }
    location /openshift {
      root /site/openshift;
      # SPA - route everything to index.html
      try_files /index.html =404;
    }
  }
}
.

# Create a temporary directory for the content of the web site. The Insights
# proxy expects the static files in the `/apps/openshift` directory of the
# web site, and the index page served for anything below `/openshift` directory.
# In the development environment this is resolved by the Webpack development server,
# but we won't be using that. Instead we create that directory structure and
# use a simple web server that only handles static content.
site_data=$(mktemp -d)
mkdir "${site_data}/apps"
cp --recursive "build/openshift" "${site_data}/apps"
mkdir "${site_data}/openshift"
mv "${site_data}/apps/openshift/index.html" "${site_data}/openshift"

# Add to the pod the web server that serves the static content:
site_id=$(
  podman run \
    --pod "${pod_id}" \
    --name "site-${build_number}" \
    --volume "${site_conf}:/etc/nginx/nginx.conf" \
    --volume "${site_data}:/site" \
    --security-opt label="disable" \
    --detach \
    "${site_image}"
)

# Find out the host IP and port that was mapped to the control port of the
# browser:
browser_addr=$(podman port "${browser_id}" 4444)
browser_host=$(echo "${browser_addr}" | cut -d: -f1)
if [ "${browser_host}" = "0.0.0.0" ]; then
  browser_host="127.0.0.1"
fi
browser_port=$(echo "${browser_addr}" | cut -d: -f2)

# Find out the host IP and port tha was mapped to the VNC port of the browser:
vnc_addr=$(podman port "${browser_id}" 5900)
vnc_host=$(echo "${vnc_addr}" | cut -d: -f1)
if [ "${vnc_host}" = "0.0.0.0" ]; then
  vnc_host="127.0.0.1"
fi
vnc_port=$(echo "${vnc_addr}" | cut -d: -f2)

echo "browser_host:browser_port: '${browser_host}:${browser_port}'."
echo "VNC address is '${vnc_host}:${vnc_port}'."

# Run the tests:
# run/cypress-test.sh

# echo "Waiting on selenium browser..."
# yarn wait-on "http-get://${TEST_SELENIUM_WD_HOSTNAME}:${TEST_SELENIUM_WD_PORT}/wd/hub/status"
# echo "Selenium browser found!"

# If not running in Jenkins ask the user to continue before running the tests:
if [ -z "${JENKINS_HOME}" ]; then
  echo "browser_host:browser_port: '${browser_host}:${browser_port}'."
  echo "VNC address is '${vnc_host}:${vnc_port}'."
  echo "Press enter to run the tests."
  read
fi

podman run \
    --pod "${pod_id}" \
    --name "cyrpess-tests-${build_number}" \
    --shm-size "2g" \
    --security-opt label="disable" \
    --detach \
    "yarn run cypress-headless --spec './cypress/e2e/Downloads.js'"
