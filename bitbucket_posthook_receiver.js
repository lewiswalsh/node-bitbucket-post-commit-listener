
   // BitBucket POST hook receiver by Lewis Walsh <lewis@lewiswalsh.com>
   // BitBucket POST uri: http://domain_or_ip:<port>/<pathname>?<unique_var>&special_token=<special_token>

   var http   = require('http'); // HTTP server
   var url    = require('url'); // Parse the URL
   var exec   = require('child_process').exec; // Executes the GIT command
   var qs     = require('querystring'); // Parse the POST data
   var config = require('./config.js');

   function VERBOSEout(to_log){
      if(config.verbose){
         console.log(to_log);
      }
   }

   http.createServer(function(req, res){

      //VERBOSEout('Your URL: http://example.com:'+ config.port +'/'+ config.pathname +'?'+ config.unique_var +'&special_token='+ config.special_token);

      var pathname_match = false;
      var status_code    = 200;
      var output         = '';

      function setOutput(code, msg){
            VERBOSEout(code);
            VERBOSEout(msg);
         status_code = code;
         output      = msg;
      }

      if(req.method == 'POST'){ // Ensure POST
            VERBOSEout('POST method PASSED');

         var post_body = '';
         var url_parts = url.parse(req.url, true);
            VERBOSEout('[URL Parts]');
            VERBOSEout(url_parts);


         // Load the POST data
         req.on('data', function(chunk){
            post_body += chunk;
            
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (post_body.length > 1e6) { 
              // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
              req.connection.destroy();
            }
         });

         // Once POST data is fully loaded
         req.on('end', function(){
            var post_data  = JSON.parse(post_body);

               VERBOSEout('[POST body]');
               VERBOSEout(post_data);

               VERBOSEout('Pathname: '+ String(url_parts.pathname));
            if(String(url_parts.pathname) === '/'+config.pathname){
               pathname_match = true;
            }

            if(pathname_match){
               VERBOSEout('Pathname check PASSED');
               if(
                  url_parts.query.hasOwnProperty(config.unique_var)
                  && url_parts.query.hasOwnProperty('special_token')
               ){
                     VERBOSEout('URL parts check PASSED');
                  if(url_parts.query.special_token === config.special_token){
                        VERBOSEout('Token check PASSED');
                        VERBOSEout('repo to pull: '+ post_data.repository.name);
                        VERBOSEout('repo full_name: '+ post_data.repository.full_name);
                     setOutput(200, 'repo to pull: '+ post_data.repository.name);

                    // Check each change to see which branches were affected.
                    var branches = [];
                    
                    post_data['push'].changes.forEach(function(change) {
                      if (change.new.type == 'branch') {
                        branches.push(change.new.name);
                        VERBOSEout('Branch changed: '+ change.new.name);
                      }
                    });
                  
                    // Allow a branch wildcard eg teamname/reponame:*
                    branches.push('*');

                    //* Execute command on every branch that has a pull command
                    // in config.
                    branches.forEach(function(branch){
                      var pullConfigID = post_data.repository.full_name + ':' + branch;
                      if (config.git_pulls.hasOwnProperty(pullConfigID)){
                        VERBOSEout('Repo full_name in git_pulls check FOUND for ' + pullConfigID);
                        exec(config.git_pulls[pullConfigID], function(err, stdout, stderr){
                            if (err !== null){
                              console.error('exec error: ' + err + ' for ' + pullConfigID);
                              setOutput(500, 'There was an error');
                            }
                        });
                      }
                      else {
                        VERBOSEout('Repo full_name in git_pulls check NOT FOUND for ' + pullConfigID);
                      }
                      //*/
                    });
                    
                  } else {
                        VERBOSEout('Token check FAILED');
                     setOutput(401, 'not even close');
                  }
               } else {
                     VERBOSEout('URL parts check FAILE');
                  setOutput(401, "you didn't say the magic word");
               }
            } else {
                  VERBOSEout('Pathname check FAILED');
               setOutput(401, 'Access denied');
            }

            res.writeHead(status_code);
            res.write(output);
            res.end();

         });

      } else {
            VERBOSEout('POST method FAILED');
         res.writeHead(404);
         res.end();
      }

   }).listen(config.port);
