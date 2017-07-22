# Releasing 'afterwriting

# Developing new features
  
  * Features are developed in separate branches
  * Create a pull request to master
  * Merge pull request - new version will be created and tagged in master
  * Add release notes to https://github.com/ifrost/afterwriting-labs/tags:
    * Title: vX.X.X (DD/MM/YYYY)
    * Add short description and list of changes from Travis logs

# Releasing
  * Create pull request master -> release
  * Merge pull request -> tagged version will be released to gh-pages and npm
  * Clear cache in CloudFlare
