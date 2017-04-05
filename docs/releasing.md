# Releasing 'afterwriting

  * Features are developed in separate branches
  * Switch to master before release
  * Make sure build is passing on https://travis-ci.org/ifrost/afterwriting-labs
  * Run `grunt update:patch/minor/major` to update the version and create `changes.log` file
  * Run `grunt build`
  * Do a smoke test in a browser
  * Run `grunt release` to merge change to `gh-pages` and push to github pages
  * Clear cache in CloudFlare
  * Add release notes to https://github.com/ifrost/afterwriting-labs/tags:
    * Title: vX.X.X (DD/MM/YYYY)
    * Add short description and list of changes from changes.log
