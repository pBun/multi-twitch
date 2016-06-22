var jsonp = function(url, callback, error) {

  var _this = this;
  var cbname = "fn" + Date.now();
  var script = document.createElement("script");
  url = url.replace('JSON_CALLBACK', cbname);
  script.src = url;
  window[cbname] = function(jsonData) {
      callback(jsonData);
      delete window[cbname];
  };

  document.head.appendChild(script);
  document.head.removeChild(script);

};

class TwitchAPI {

  constructor() {
    this.domain = 'https://api.twitch.tv/kraken/';

    // this._twitchAppID = 'eo7lzdc6ztvx2unetp7g34cnarh3148'; // dev
    this._twitchAppID = 'gq3qyn8174lwb4psnv6vmvb5lmoslrr';
  }

  buildQueryString(options) {
    options = options || {};
    var queryStringComponents = Object.keys(options).map(function(name) {
      if (options[name]) {
        return name + '=' + options[name];
      }
    });
    return '?' + queryStringComponents.join('&');
  }

  fixQueryString(url) {
    var queryString = url.split('?');
    var baseUrl = queryString.shift();
    if (queryString && queryString.length) {
      url = baseUrl + '?' + queryString.join('&');
    }
    return url;
  }

  get(request, options) {
    return new Promise((resolve, reject) => {
      options = options || {};
      options.client_id = this._twitchAppID;
      options.callback = 'JSON_CALLBACK';

      // work-around for twitch.tv api streams req not supporting client_id
      // https://github.com/justintv/Twitch-API/issues/334
      if (request === 'streams') {
        options['client_id'] = null;
      }

      var queryString = this.buildQueryString(options);

      // build final url
      var url = this.domain + request + queryString;

      // just in case user added a query string to the req
      url = this.fixQueryString(url);

      jsonp(url, function(data){
        if (data.error) {
          var errorMsg = '';
          if (data.status) {
            errorMsg += data.status + ' ';
          }
          if (data.error) {
            errorMsg += data.error + ': ';
          }
          if (data.message) {
            errorMsg += data.message + ' ';
          }
          errorMsg += '(' + url + ')';
          reject(errorMsg);
        }
        resolve(data);
      });
    });
  }
}


module.exports = TwitchAPI;
