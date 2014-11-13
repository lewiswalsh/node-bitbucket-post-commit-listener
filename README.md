BitBucket POST Hook Receiver
============================

Simple nodeJS http service to listen for POST requests from BitBucket and execute `git pull` (or any other command) depending on the repo updated. For more on the POST hook see the [BitBucket POST hook management page](https://confluence.atlassian.com/display/BITBUCKET/POST+hook+management).

###Config.js
| Setting | Description |
| --- | --- |
| `pathname` | The path from the address root |
| `unique_var` | A unique GET var, make this some esoteric and hard to guess |
| `special_token` | A longish token to be passed to the listener |
| `verbose` | Output debug information to console (default: `false`) |
| `port` | The port the listener will be available on |
| `git_pulls` | See below |

####POST URI

`http://domain_or_ip:<port>/<pathname>?<unique_var>&special_token=<special_token>`

Example:
`http://example.com:1337/mylistener?doagitpull&special_token=gh028h489gh9fh49fh8942h8gh4`

####git_pulls
This is an object containing your Bitbucket repo slug and the command to execute in the event the slug is passed to listener. Set `verbose` to true to see the POST body from BitBucket.

For example

```javascript
git_pulls : {
   'my-repo-on-bitbucket' : 'git -C /var/www/mysite pull',
   'database-stuff'       : 'git -C /etc/database pull'
}
```

###Processes.json
This file is included to make working with [PM2](https://github.com/Unitech/pm2) immediately easy and simple. Use `pm2 start processes.json`
