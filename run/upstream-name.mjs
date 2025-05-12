#!/usr/bin/env node

import { realpathSync } from 'fs';
import { simpleGit } from 'simple-git';
import { fileURLToPath } from 'url';

const upstreamRepoPattern = /.*github\.com[:/]RedHatInsights\/uhc-portal.*/;

export async function getUpstreamRemoteName(git) {
  const verbose = true;
  const remotes = await git.getRemotes(verbose);
  const remote = remotes.find((r) => r.refs.fetch.match(upstreamRepoPattern));
  if (remote) {
    return remote.name;
  }
  throw new Error('Missing remote for service/uhc-portal');
}

if (realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const git = simpleGit(process.cwd());
  console.log(await getUpstreamRemoteName(git));
}
