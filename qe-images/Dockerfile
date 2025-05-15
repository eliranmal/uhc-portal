# Start from Cypress included image
FROM quay.io/openshifttest/cypress-included:14.3.2

# Install curl and ROSA CLI dependencies
USER root

RUN apt-get update && \
    apt-get install -y curl && \
    curl -o rosa.tar.gz https://mirror.openshift.com/pub/openshift-v4/clients/rosa/latest/rosa-linux.tar.gz && \
    tar -xvf rosa.tar.gz && \
    mv rosa /usr/local/bin/rosa && \
    chmod +x /usr/local/bin/rosa && \
    rm rosa.tar.gz

RUN curl -s "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip -q awscliv2.zip && \
    ./aws/install && \
    rm -rf awscliv2.zip aws &&\
    aws --version

# Confirm installation (optional)
RUN rosa version
