

# Continuous integration

## Konflux

We use [Konflux-CI][1] for building and running basic verification.  The team's namespace is 'ocm-ui-tenant', which hosts the ['ocm-ui' application][8].  This app contains the ['uhc-portal' build component][12], pointing at this code repo.

### Build pipelines

The FE app is built onto container images, which are pushed into the quay.io registry; PR changes are built via the ['pull-request' pipeline][3] and long-lived branches (e.g. 'main') – via the ['push' pipeline][4] (see ['pipeline runs'][9] in Konflux UI).  Both are stored in an [image repo under the redhat-user-workloads org][2].

Konflux will create [snapshots][5] that can be used for testing, and will create [releases][6] which will be stored in an [image repo under the redhat-services-prod org][7].  Konflux releases are just images that have been signed as suitable for deployment.

### Persisted configuration

Most of our Konflux configuration (e.g. component, release plans, user access) is persisted as yaml files in the [konflux-release-data][10] repository, and then parsed and displayed by Konflux UI.  

They are mainly found under _/tenants-config/.../ocm-ui-tenant/_ and _/config/.../ReleasePlanAdmission/ocm-ui/_.

To generate or update those files, use the scripts provided by konflux-release-data – see the [tenants-config readme][14] on the repo docs for more info.

### Our custom setup

Our repo declares a non-default pipeline-run config, which extends a remote pipeline config commonly used in HCC tenant-apps.  This config is equipped with an additional custom task for running source-code verification during build (e.g. unit-tests, linter).

See [docker-build-run-unit-tests][11] at the _RedHatInsights/konflux-pipelines_ repo.
 
### Getting help

Check out the [FAQ page][13] on the official docs.

To get further assistance, post an ask in the #konflux-users Slack channel.
   

## GitHub workflows

We use GH-workflows for various actions:

- Run E2E tests, which are written in Cypress and Playwright
- Check for broken external links
- Get latest changes from backend API specs

   
## General

In pull-requests authored by external contributors, some CI tasks require explicit action in order to run.  Specifically, Konflux build tasks, and GH-workflows for E2E-tests.

This is used as a precautionary measure, to prevent external contributors from potentially running malicious code in CI.

Once code-changes have been reviewed and are found to be safe, a repo member can explicitly trigger those workflows.  In Konflux pipelines this is done by adding a comment with the text _'/ok-to-test'_, and in GH-workflows, by adding the label _'safe to test'_.




[1]: https://konflux.pages.redhat.com/docs/users/index.html
[2]: https://quay.io/repository/redhat-user-workloads/ocm-ui-tenant/uhc-portal
[3]: https://github.com/RedHatInsights/uhc-portal/blob/main/.tekton/uhc-portal-pull-request.yaml
[4]: https://github.com/RedHatInsights/uhc-portal/blob/main/.tekton/uhc-portal-push.yaml
[5]: https://konflux-ui.apps.stone-prd-rh01.pg1f.p1.openshiftapps.com/ns/ocm-ui-tenant/applications/ocm-ui/snapshots
[6]: https://konflux-ui.apps.stone-prd-rh01.pg1f.p1.openshiftapps.com/ns/ocm-ui-tenant/applications/ocm-ui/releases
[7]: https://quay.io/repository/redhat-services-prod/ocm-ui-tenant/uhc-portal
[8]: https://konflux-ui.apps.stone-prd-rh01.pg1f.p1.openshiftapps.com/ns/ocm-ui-tenant/applications/ocm-ui/
[9]: https://konflux-ui.apps.stone-prd-rh01.pg1f.p1.openshiftapps.com/ns/ocm-ui-tenant/applications/ocm-ui/activity/pipelineruns
[10]: https://gitlab.cee.redhat.com/releng/konflux-release-data
[11]: https://github.com/RedHatInsights/konflux-pipelines/blob/main/pipelines/platform-ui/docker-build-run-unit-tests.yaml
[12]: https://konflux-ui.apps.stone-prd-rh01.pg1f.p1.openshiftapps.com/ns/ocm-ui-tenant/applications/ocm-ui/components/uhc-portal
[13]: https://konflux.pages.redhat.com/docs/users/faq/general-questions.html
[14]: https://gitlab.cee.redhat.com/releng/konflux-release-data/-/blob/main/tenants-config/README.md?ref_type=heads#add-or-update-a-tenant-namespace-with-the-helper-script
