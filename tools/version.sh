#!/bin/sh

# ./version.sh path|minor|major

git config --global push.default simple
git config --global user.email "travis@travis-ci.org"
git config --global user.name "Travis CI"
git config credential.helper "store --file=.git/credentials"
echo "https://${GITHUB_API_KEY}:@github.com" > .git/credentials
npm version $1 -m "Create new version: %s [skip ci]"
