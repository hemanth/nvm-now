'use strict';
const http = require('http');
const fetch = require('isomorphic-fetch');
const NVM_SCRIPT_URL = `https://raw.githubusercontent.com/creationix/nvm`;
const NVM_PACKG_URL = `https://raw.githubusercontent.com/creationix/nvm/master/package.json`;

var server = http.createServer((request, resp) => {

    // forget favicon for now.
    if (request.url === '/favicon.ico') {
      resp.writeHead(200, {'Content-Type': 'image/x-icon'} );
      resp.end();
      return;
    }

    // landing page
    if (request.url === '/') {
      // fetch the latest version of nvm
      fetch(NVM_PACKG_URL)
      .then(response => response.json())
      .then(pkgInfo => {
        //fetch and respond
        fetch(`${NVM_SCRIPT_URL}/v${pkgInfo.version}/install.sh`)
        .then(response => {
          // send headers
          const headers = {};
          headers['Content-Type'] = 'text/plain';
          resp.writeHead(200, headers);
          return response.text();
        })
        .then(data => resp.end(data))
        .catch(error => resp.end(JSON.stringify({ error: error.toString()})));
      })
      .catch(error => {
          resp.end(JSON.stringify({ error: error.toString()}));
        }); 
    } 
      
});

var port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Server running at http://127.0.0.1/ on port ${port}`));


