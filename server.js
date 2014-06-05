var http = require("http"),
  static = require('node-static'),
  url = require('url'),
  rq = require('request'),
  path = require('path');

// Setting environment variables
// see https://www.npmjs.org/package/envy
var config = require("envy").load(__dirname +'/node.config.json');

var file = new static.Server('./');


function onRequest(request, response) {
  console.log("Request received.");
  var pathname = url.parse(request.url).pathname;
  console.log("Pathname: "+pathname);

  if (pathname === "/proxy") {
    var query = url.parse(request.url,true).query;
    if (query.url !== undefined) {
      rq.get(query.url, function (error, res, body) {
        if (!error && res.statusCode == 200) {
          response.writeHead(200, {"Access-Control-Allow-Origin": "*"});
          response.end(body);
          console.log("Proxied => " + query.url);
        }
        else {
          console.log(error);
        }
      });
    }
    else {
      console("/proxy missing url parameter.");
    }
  }
  else {
    file.serve(request, response);
  }
  console.log("Response ended.");
}

http.createServer(onRequest).listen(config.port);
console.log(process.env.NODE_ENV + " server has started at port " + config.port + ".");