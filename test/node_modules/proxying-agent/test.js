var url = require('url');
var util = require('util');
var proxying = require('./index.js');

function http(options, cb) {
  if (typeof options === 'string') {
    options = {url: options};
  }
  if (typeof options.url === 'string') {
    options = util._extend(options, url.parse(options.url));
  }

  var proxyingOptions = {
    proxy: 'http://capdesigner:az!rpac@proxy.capriza.com:3128'
    // proxy: 'http://local.capriza.com:7678'
  };

  var secure = options.protocol === 'https:';
  var requestor = secure ? require('https') : require('http');
  options.method = options.method || 'GET';
  options.agent = new proxying.create(proxyingOptions, options.url);
  var req = requestor.request(options, function(res) {
    var data = '';
    res.on('data', function(d) {
      data += d;
    });
    res.on('end', function() {
      cb && cb(null, data, res);
    });
  });
  req.on('socket', function() {
    if (options.data) {
      req.write(options.data);
    }
    req.end();
  });
  req.on('error', function(err) {
    cb && cb(err.message);
  });
}

http('http://www.google.com/healthCheck', function(err, data, res) {
  console.log(err, data);
});



