// Duplicate this sample config file, and rename the copy "config.js".
//
// BitBucket POST uri: http://domain_or_ip:<port>/<pathname>?<unique_var>&special_token=<special_token>

// git_pulls is a key : value array as follows:
// - key: The BitBucket repo name, then a colon, then the repository branch name. A branch wildcard * is
//   also valid here. The repo name is easily found by examining at the repository's Bitbucket URL.
// - value: the command to execute, when something is pushed to the repo:branch specified in the key
//
// use 'git -C /path/to/repo <action>' to specify a directory where the git operation should execute

module.exports = {
  pathname      : 'bit-after-forward-slash',
  unique_var    : 'do-this-action',
  special_token : 'thisismytokenitshouldbelongandrandom',
  verbose       : false,
  port          : 1337,
  git_pulls     : {
                    'bitbucket-repo-name:branchname' : "git -C /path/to/repo pull",
                    'bitbucket-repo2-name:*'         : "git -C /path/to/second/repo pull"
                  }
};
