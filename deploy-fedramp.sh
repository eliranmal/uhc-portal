#!/bin/bash
#
# Copyright (c) 2025 Red Hat, Inc.
#
# Get the latest 5 commits from the uhc-portal-frontend-deploy repo

# Check there is a .env.fedramp file
if [ ! -f .env.fedramp ]; then
  echo "Please create a .env.fedramp file with the following content:"
  echo "UHC_PORTAL_BASE_URL='https://api.github.com/repos/<org>/<uhc-portal-repo>'"
  echo "BASE_FEDRAMP_URL='<url-to-fedramp-repo>'"
  exit 1
fi
source .env.fedramp

# Prompt the user to choose between "prod-stable" or "qa-stable"
echo "Please select the branch to use:"
select branch in "prod-stable" "qa-stable"; do
  if [[ -n "$branch" ]]; then
    echo "You have selected branch: $branch"
    break
  else
    echo "Invalid selection. Please try again."
  fi
done



REPO_URL="$UHC_PORTAL_BASE_URL/commits?sha=$branch&per_page=6"

# Fetch the latest 6 commits
commits=$(curl -s $REPO_URL | jq -r '.[] | "\(.sha) \(.commit.message)\n \(.commit.author.date)\n----------------"')
echo "Pulling latest hash from Repo URL: $REPO_URL"



echo "Latest 6 commits:"
echo "$commits"

# Save the commits to an array
commit_array=($(curl -s $REPO_URL | jq -r '.[] | "\(.sha)"'))

# Present an input menu to the user
echo "Please select a commit to use:"
select commit in "${commit_array[@]}"; do
  if [[ -n "$commit" ]]; then
    echo "You have selected commit: $commit"
    break
  else
    echo "Invalid selection. Please try again."
  fi
done

# Prompt user what environment they want to update: INT, Stage(master), or Prod
echo "Please select the environment to update:"
select env in "INT" "Stage" "Prod"; do
  if [[ -n "$env" ]]; then
    echo "You have selected environment: $env"
    break
  else
    echo "Invalid selection. Please try again."
  fi
done

#BASE_FEDRAMP_URL should be in the .env.fedramp file
INT_FILE="$BASE_FEDRAMP_URL/-/blob/int/applications.yaml?ref_type=heads"
STAGE_FILE="$BASE_FEDRAMP_URL/-/blob/master/applications.yaml?ref_type=heads"
PROD_FILE="$BASE_FEDRAMP_URL/-/blob/prod/applications.yaml?ref_type=heads"

echo "Opening file in browser..."

# Open the file in the browser
case $env in
  INT)
    echo $INT_FILE
    xdg-open $INT_FILE
    ;;
  Stage)
    echo $STAGE_FILE
    xdg-open $STAGE_FILE
    ;;
  Prod)
    echo $PROD_FILE
    xdg-open $PROD_FILE
    ;;
esac
echo "Use local web editor to change file"
echo "Edit 'openshift:' stanza to commit $commit in $env environment..."
echo "Make sure to update the target branch to a something like 'update-ocm-ui-to-<COMMIT-DATE>'"
echo "Then open new MR with title '[OCM-UI] Update $env to <COMMIT-DATE> $branch'"