#!/bin/bash

set -o nounset
set -o errexit
set -o pipefail

IMAGE_TAG="14.3.2"
IMAGE_REGISTRY="quay.io"
IMAGE_REPOSITORY="app-sre/ocmui-cypress-tests"
CONTAINER_FILE_PATH="${PWD}/qe-images"

# Set the directory for docker configuration:
DOCKER_CONFIG="${PWD}/.docker"

# Log in to the image registry:
if [ -z "${QUAY_USER}" ]; then
  echo "The 'quay.io' push user name hasn't been provided."
  echo "Make sure to set the 'QUAY_USER' environment variable."
  exit 1
fi
if [ -z "${QUAY_TOKEN}" ]; then
  echo "The 'quay.io' push token hasn't been provided."
  echo "Make sure to set the 'QUAY_TOKEN' environment variable."
  exit 1
fi

# Set up the docker config directory
mkdir -p "${DOCKER_CONFIG}"

# Login to Quay image registry
podman login -u "${QUAY_USER}" --password-stdin <<< "${QUAY_TOKEN}" quay.io

# Push the image:
echo "Quay.io user and token is set, will push images to $IMAGE_REPOSITORY"
podman build -t "${IMAGE_REGISTRY}/${IMAGE_REPOSITORY}:${IMAGE_TAG}" $CONTAINER_FILE_PATH
podman push "${IMAGE_REGISTRY}/${IMAGE_REPOSITORY}:${IMAGE_TAG}"


