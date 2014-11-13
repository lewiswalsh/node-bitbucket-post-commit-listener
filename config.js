
   // BitBucket POST uri: http://domain_or_ip:<port>/<pathname>?<unique_var>&special_token=<special_token>

   // git_pulls are the BitBucket repo slug and the command to execute
   // use 'git -C /path/to/repo <action>' to specify a directory where the git operation should execute

   module.exports = {
      pathname      : 'bit-after-forward-slash',
      unique_var    : 'do-this-action',
      special_token : 'thisismytokenitshouldbelongandrandom',
      verbose       : false,
      port          : 1337,
      git_pulls     : {
                        'bitbucket-repo-slug'     : "git -C /path/to/repo pull",
                        'bitbucket-repo-slug-two' : "git -C /path/to/second/repo pull"
                      }
   };
