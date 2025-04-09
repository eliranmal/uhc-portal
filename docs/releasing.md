# :cookie: Release to Production


1. #### Verify Staging env' is ready to promote

   Ensure all phases of the Staging deployment queue are passing:

    - [`master` branch build-job][31] <sup>[1][footnotes]</sup>
    - [Qontract-reconcile pipeline][33]
    - [OpenShift-SaaS deployment pipeline][34]

   Check that the [daily QE smoke-test runs][32] have passed.


1. #### [Create a PR][30] to promote content from `master` to `stable`

   Use the link above, and append the release date to the PR title in human-readable form, e.g. _March 5, 2025_.

   Pander for reviewers, and follow the review process of the PR template.

   > :warning: Do not click the "Update branch" button, even if there's a message saying _"This branch is out of date with the base branch"_.


1. #### Merge content to `stable`, and note the merge-commit hash

   Once the PR is approved and all checkboxes under the Reviews section are checked, click "Merge pull request".

   After merging, find the comment saying _"\<user\> merged commit \<short-hash\> into ..."_, and click the short-hash link.  Grab the **full hash** from the URL (the last path segment), and save it for later use.

   **Example URL:**

   ```
                                                       |--- this bit is the full hash --------|
   https://github.com/RedHatInsights/uhc-portal/commit/18664d516206816f0c0837f3b2c3620c1d69cbc4
   ```


1. #### Ensure the `stable` branch [build-job][14] <sup>[1][footnotes]</sup> completes successfully

   Or wait for a notification on [#ocm-ui-deploys][16].  It would look like this:

   > **sass notifier**  
   > [sd-uhc] OCM UI build stable - #6 Success after 16 min ([Open][20])


1. #### Update [_deploy.yml_ in app-interface][17] to bump the Production deployment-target <sup>[2][footnotes]</sup>

   In your app-interface fork, create a new topic branch from `master`.  
   Under the section `# Production Deployment`, update `ref` to the new full-hash from the release merge-commit.

   Commit and push changes, and create an MR against the upstream repo' ([example MR][9])

   Note that this MR will get merged automatically <sup>[3][footnotes]</sup>, once approvers post a `/lgtm` comment.  Also note, that **you** are on the approvers list, which means you can self-approve.


1. #### Ensure the [deployment pipeline][22] completes successfully

   Or wait for a notification on [#ocm-ui-deploys][16].  It'd look like this:

   > **sass notifier**  
   > 🟢 SaaS file uhc-portal deployment to environment insights-production: Success ([Open][19]). Reason: https://gitlab.cee.redhat.com/service/app-interface/commit/c69b541ba3e23e0e9787b7e780a937a9151212cf triggered by _openshift-saas-deploy-trigger-configs_

   For further verification, browse the [app.info.json file in Production][23], and ensure that `src_hash` matches the new merge-commit hash.


1. #### Run the _label-release-jira_ script:

   ```
   ./run/label-release-jira.mjs --jira-token <auth-token>
   ```

   This script will add labels ([`deployed-production`][12] and `ga-released-<date>`) to the released Jira tickets, to mark them available in production.

   > _:information_source: You can create an auth-token in [Jira, under Profile / Personal Access Tokens][29]_


1. #### Create a GitHub-release & release notes

   From the [Releases page][35], click _Draft a new release_.

   For the title, enter the release date in full, human-readable form, e.g. _March 5, 2025_.

   In the tag dropdown, enter tag name as date in abbreviated form, e.g. _mar-5-2025_, and choose _Create new tag on publish_.  Under _Previous tag_, select the previous release's tag.

   Click _Generate release notes_, and then _Publish release_.

   <img width="952" alt="Screenshot 2025-03-31 at 15 50 21" src="https://github.com/user-attachments/assets/ad114c49-fe2a-40d7-86dc-ae28b94e6c8d" />


1. #### Announce the release on the [#ocm-osd-ui][13] public slack forum

   Use this message (just update the Release Notes link to the latest release, before posting):

   > Hey all,
   >
   > A new release of OCM UI is now available in [production][24].  
   > See the [Release Notes][35].
   >
   > ⛵


<br/>

# :dart: Troubleshooting


### Deployment-pipeline is not running

The deployment-queue consists of two pipelines: [app-interface Qontract-reconcile][21] and [OpenShift-SaaS][22].

The [Qontract-reconcile][28] pipeline picks up changes to configs (templates) from app-interface, and introduces (applies) them to deployment clusters.  The OpenShift-SaaS pipeline then gets triggered in response, and does the actual publish to _console.redhat.com/openshift_.

Ensure the reconcile pipeline is working first, and if not, check that the MR to app-interface was merged properly.  If it was, try to revive the pipeline-run by triggering a new build in the `stable` build [job][14].

Otherwise, ping @emalka or someone from <abbr title="TODO - find the appropriate channel (is it #sd-appsre?)">#_____</abbr> for help.


<br/>

# :pencil2: Footnotes


_<sup>1</sup> This job will build the app in a container, and push a container-image to [quay.io/uhc-portal][15], tagging it with the short-hash (first few chars) of the relevant commit from its branch._

_<sup>2</sup> Updating this hash will trigger the deployment-queue, which publishes the newly built container-image to the Production env'._

_<sup>3</sup> App-interface offers "self-service" in many areas; it will spawn a bot on self-serviceable MRs, which will resolve the required reviewers ("approvers"), and post that list in a comment.  Once the MR gets a LGTM from every group on the approvers list, it will get merged.
For more details on self-service, see [User Content Approval Process][25] and [Granular Permission Model][26] on app-interface docs._






[9]: https://gitlab.cee.redhat.com/service/app-interface/-/merge_requests/116437
[12]: https://issues.redhat.com/issues/?jql=labels+%3D+deployed-production
[13]: https://redhat.enterprise.slack.com/archives/C01G3PL29SS
[14]: https://ci.int.devshift.net/job/RedHatInsights-uhc-portal-gh-build-stable/
[15]: https://quay.io/repository/app-sre/uhc-portal?tab=tags
[16]: https://redhat.enterprise.slack.com/archives/C03GKHGMX7U
[17]: https://gitlab.cee.redhat.com/service/app-interface/-/blob/master/data/services/ocm/ui/cicd/deploy.yml
[19]: https://console-openshift-console.***REMOVED***/k8s/ns/ocm-ui-pipelines/tekton.dev~v1~Pipeline/o-saas-deploy-uhc-portal/Runs?name=uhc-portal-insights-production
[20]: https://ci.int.devshift.net/job/RedHatInsights-uhc-portal-gh-build-stable/3/display/redirect
[21]: https://console-openshift-console.***REMOVED***/k8s/ns/ocm-ui-pipelines/tekton.dev~v1~Pipeline/o-saas-deploy-uhc-portal/Runs?name=uhc-portal-insights-production
[22]: https://***REMOVED***/k8s/ns/frontends/deployments/openshift-frontend
[23]: https://console.redhat.com/apps/openshift/app.info.json
[24]: https://console.redhat.com/openshift
[25]: https://gitlab.cee.redhat.com/service/app-interface/-/blob/master/docs/app-sre/continuous-delivery-in-app-interface.md?#user-content-approval-process
[26]: https://gitlab.cee.redhat.com/service/app-interface/-/blob/master/docs/app-sre/change-types.md#granular-permission-model.md
[28]: https://github.com/app-sre/qontract-reconcile
[29]: https://issues.redhat.com/secure/ViewProfile.jspa?selectedTab=com.atlassian.pats.pats-plugin:jira-user-personal-access-tokens
[30]: https://github.com/RedHatInsights/uhc-portal/compare/stable...master?template=release.md&quick_pull=1&title=Release%20to%20Production&body=
[31]: https://ci.int.devshift.net/job/RedHatInsights-uhc-portal-gh-build-master/
[32]: https://ci.int.devshift.net/job/RedHatInsights-uhc-portal-qe-gh-cypress-smoke/
[33]: https://console-openshift-console.***REMOVED***/k8s/ns/ocm-ui-pipelines/tekton.dev~v1~Pipeline/o-saas-deploy-uhc-portal/Runs?name=uhc-portal-insights-stage
[34]: https://***REMOVED***/k8s/ns/frontends/cloud.redhat.com~v1alpha1~Frontend/openshift/
[35]: https://github.com/RedHatInsights/uhc-portal/releases



[footnotes]: #pencil2-footnotes
[troubleshooting]: #dart-troubleshooting
