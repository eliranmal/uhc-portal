#!/usr/bin/env node
/* eslint-disable no-console */
import util from 'util';
import { execFile, execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

import listGitRemotes from 'list-git-remotes';
import JSON5 from 'json5';
import { quote } from 'shell-quote'; // only to be used for logging
import yargs from 'yargs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const execFilePromise = util.promisify(execFile);
const listGitRemotesPromise = util.promisify(listGitRemotes);

const flags = yargs
  .option('json', { description: 'Output detailed JSON.' })
  .option('short', { description: 'Output name & hash summary.' })
  .option('set-git-branches', { description: 'Create/update git branches.' })
  .option('git-graph', { description: 'Show git graph. Implies --set-git-branches.' })
  .version(false)
  .help(true).argv;

const getUpstreamRemote = async () => {
  const remoteUrls = await listGitRemotesPromise(__dirname);
  // eslint-disable-next-line no-restricted-syntax
  for (const remoteName of Object.keys(remoteUrls)) {
    if (remoteUrls[remoteName].match('.*github\\.com[:/]RedHatInsights/uhc-portal.*')) {
      return remoteName;
    }
  }
  throw new Error('missing remote for uhc-portal repo');
};

const assistedLibs = [
  'openshift-assisted-ui-lib',
  '@openshift-assisted/ui-lib',
  '@openshift-assisted/locales',
  'yup'
];

/** @callback getOpenshiftAssistedLibsVersionsFunc
 * @param {string} revision
 * @returns {string}
 */

/** @type {getOpenshiftAssistedLibsVersionsFunc} */
const getOpenshiftAssistedLibsVersions = async (revision) => {
  const r = await execFilePromise('git', ['cat-file', 'blob', `${revision}:package.json`]);
  try {
    const packument = JSON.parse(r.stdout);
    const { dependencies } = packument;
    const returnValue = [];
    assistedLibs.forEach((pkg) => {
      if (dependencies[pkg]) {
        returnValue.push(`${pkg}: ${dependencies[pkg]}`);
      }
    });
    return returnValue.join(', ');
  } catch {
    return `Failed to parse package.json in rev:${revision}`;
  }
};

// Helpers returning a promise, should resolve to an object containing *at least* .src_hash.

const gitRev = async (branchOrCommit) => {
  try {
    // Normalizes hash length to be unique in local repo.
    // Sometimes may differ from similar normalization by push_to_insights.sh at build time,
    // so good to apply to all hashes.
    const r = await execFilePromise('git', ['rev-parse', '--short', branchOrCommit]);
    return { src_hash: r.stdout.trimRight() };
  } catch (err) {
    return { ERROR: err };
  }
};

// app.info.json files generated in push_to_insights.sh & insights-Jenkinsfile
const appInfo = async (url) => {
  let body;
  try {
    // Using curl to respect system-installed CA certs on all platforms.
    const cmd = ['curl', '--silent', '--show-error', '--fail', '--location', url];
    body = (await execFilePromise(cmd[0], cmd.slice(1))).stdout;
    // Some contain a trailing comma, making it invalid JSON, so use JSON5.
    const data = JSON5.parse(body);

    const normalizedHash = await gitRev(data.src_hash);
    return { ...data, ...normalizedHash };
  } catch (err) {
    return { ERROR: err.stderr || err.toString(), body, url };
  }
};

const getEnvs = async (upstream) => {
  const envs = [
    // .info fields are promises, later replaced with their results..
    {
      name: `${upstream}/master`,
      comment: 'https://github.com/RedHatInsights/uhc-portal/commits/master',
      info: gitRev(`${upstream}/master`),
    },
    {
      name: 'build_pushed_master',
      ci_job: 'https://ci.int.devshift.net/job/ocm-portal-deploy-staging/',
      comment:
        'Build pushed to https://github.com/RedHatInsights/uhc-portal-frontend-deploy/commits/qa-stable',
      info: appInfo(
        'https://raw.githubusercontent.com/RedHatInsights/uhc-portal-frontend-deploy/qa-stable/app.info.json',
      ),
    },
    {
      name: 'live_consoledev_master',
      ci_job:
        'https://***REMOVED***/job/insights-frontend-deployer/job/uhc-portal-frontend-deploy/job/qa-stable/',
      comment: 'Live at https://console.dev.redhat.com/openshift/',
      info: appInfo('https://console.dev.redhat.com/apps/openshift/app.info.json'),
    },
    {
      name: `${upstream}/stable`,
      comment: 'https://github.com/RedHatInsights/uhc-portal/commits/stable',
      info: gitRev(`${upstream}/stable`),
    },
    {
      name: 'build_pushed_stable',
      ci_job: 'https://ci.int.devshift.net/job/ocm-portal-deploy-stable/',
      comment:
        'Build pushed to https://github.com/RedHatInsights/uhc-portal-frontend-deploy/commits/prod-stable',
      info: appInfo(
        'https://raw.githubusercontent.com/RedHatInsights/uhc-portal-frontend-deploy/prod-stable/app.info.json',
      ),
    },
    {
      name: 'live_stable',
      ci_job:
        'https://***REMOVED***/job/insights-frontend-deployer/job/uhc-portal-frontend-deploy/job/prod-stable/',
      comment: 'PRODUCTION - Live at https://console.redhat.com/openshift/',
      info: appInfo('https://console.redhat.com/apps/openshift/app.info.json'),
    },
  ];
  // Resolve all .info in parallel.
  return Promise.all(
    envs.map(async (e) => {
      let info = await e.info;
      if (info.src_hash) {
        info = {
          ...info,
          assisted_ui_lib_versions: await getOpenshiftAssistedLibsVersions(info.src_hash),
        };
      }
      return { ...e, info };
    }),
  );
};

const main = async () => {
  try {
    if (!flags.json && !flags.short && !flags.setGitBranches && !flags.gitGraph) {
      console.error("Enable at least one flag, or what's the point?");
      yargs.showHelp();
      return;
    }

    const upstream = await getUpstreamRemote();
    await execFilePromise('git', ['fetch', upstream]);
    const envs = await getEnvs(upstream);

    if (flags.json) {
      console.log(JSON.stringify(envs, null, 2));
    }

    const widestName = Math.max(...envs.map((e) => e.name.length));
    const widestHash = Math.max(...envs.map((e) => (e.info.src_hash || '').length));

    const compareToPrevEnv = async (prevEnv, nextEnv) => {
      const prevHash = prevEnv?.info?.src_hash;
      const nextHash = nextEnv?.info?.src_hash;
      if (prevHash && nextHash && prevHash !== nextHash) {
        const cmd = ['git', 'diff', '--shortstat', prevHash, nextHash];
        const out = (await execFilePromise(cmd[0], cmd.slice(1))).stdout.trim();
        console.log(`↕️  ${out || 'no diff'}`);
      }
    };

    if (flags.short) {
      let prevEnv = null;
      // I do want serial loops awaiting commands one by one, can't use forEach.
      /* eslint-disable no-await-in-loop */
      // eslint-disable-next-line no-restricted-syntax
      for (const e of envs) {
        await compareToPrevEnv(prevEnv, e);
        prevEnv = e;
        const paddedName = e.name.padStart(widestName, ' ');
        const paddedHash = (e.info.src_hash || '').padEnd(widestHash, ' ');
        if (e.info.src_hash) {
          console.log(`${paddedName} ${paddedHash}  [${e.info.assisted_ui_lib_versions}]`);
        } else {
          // Show details why data is missing.
          console.log(`${paddedName}    ### ${JSON.stringify(e.info)}`);
        }
      }
    }

    if (flags.setGitBranches || flags.gitGraph) {
      let prevEnv = null;
      // eslint-disable-next-line no-restricted-syntax
      for (const e of envs) {
        await compareToPrevEnv(prevEnv, e);
        prevEnv = e;
        const paddedName = e.name.padStart(widestName, ' ');
        const paddedHash = (e.info.src_hash || '').padEnd(widestHash, ' ');
        // Don't try overwriting branches taken from git like `upstream/master`
        // (would probably be a no-op but safer not to).
        if (!e.name.match('build_pushed_.*|live_.*')) {
          console.log(
            `#                  ${paddedName} ${paddedHash}    [${e.info.assisted_ui_lib_versions}]`,
          );
        } else if (e.info.src_hash) {
          const cmd = ['git', 'branch', '--force', e.name, e.info.src_hash];
          console.log(
            `git branch --force ${paddedName} ${paddedHash}  # [${e.info.assisted_ui_lib_versions}]`,
          );
          await execFilePromise(cmd[0], cmd.slice(1), { stdio: 'inherit' });
        } else {
          // Delete branch to avoid relying on stale data. Ignore error if already deleted.
          const cmd = ['git', 'branch', '-D', e.name];
          console.log(
            `git branch -D      ${paddedName}    ### MISSING INFO: ${JSON.stringify(e.info)}`,
          );
          await execFilePromise(cmd[0], cmd.slice(1), { stdio: 'inherit' }).catch(() => {});
          // In --git-graph mode, this will cause git to fail with `bad revision` error, but we
          // print the git command which you're free to edit if you really want a partial graph.
        }
      }
    }

    if (flags.gitGraph) {
      const cmd = [
        'env',
        'GIT_PAGER=',
        'git',
        'log',
        ...envs.map((e) => e.name),
        // Limit graph scope by omitting everything including 2 prod deploys ago.
        '--not',
        'live_stable~2',
        '--graph',
        // TODO: want MR merges, not internal merge commits done while working on MR content.
        //   `[Mm]erge .* into '?(master|stable).*` captures most of those.
        //   BUT must show all merges FROM master, even if done locally with edited message -
        //   these tell us which content is already deployed.
        // Also include cherry-picks (not using --merges flag which would omit them).
        '--extended-regexp',
        '--grep=[Mm]erge|[Cc]herry',
        // %C: color, %h: hash, %d: (decorations).
        // %s subject "Merge branch ...", start %b body on same line to conserve vertical space.
        // %w: indents following lines of body.
        '--pretty=%C(auto)%cs %H%d %C(dim)%s — %C(auto)%w(0,0,10)%b',
        '--color=always',
        // End of revisions, start of paths. This improves git error messages
        // from 'ambiguous argument ... or path not in the working tree' to 'bad revision'.
        '--',
      ];
      console.log(quote(cmd));
      console.log('');
      execFileSync(cmd[0], cmd.slice(1), { stdio: 'inherit' });
    }
  } catch (err) {
    console.error(err);
  }
};

main();
