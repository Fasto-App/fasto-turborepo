#!/bin/sh

branch="$(git rev-parse --abbrev-ref HEAD)"

if [ "$branch" = "main" ] || [ "$branch" = "development" ]; then
  echo "You can't commit directly to $branch branch"
  exit 1
fi

echo "All Good, branch is clean"
