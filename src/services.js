/**
 * The Drupal services JSON object.
 */
Drupal.services = {};

/**
 * Drupal Services XMLHttpRequest Object.
 * @param {Object} options
 */
Drupal.services.call = function(options) {
  try {
    
    options.debug = false;

    // Make sure the settings have been provided for Services.
    if (!services_ready()) {
      var error = 'Set the site_path and endpoint on Drupal.settings!';
      options.error(null, null, error);
      return;
    }

    // Build the Request, URL and extract the HTTP method.
    var request = new XMLHttpRequest();
    var url = Drupal.settings.site_path +
              Drupal.settings.base_path + '?q=' +
              Drupal.settings.endpoint + '/' + options.path;
    var method = options.method.toUpperCase();
    console.log(method + ': ' + url);

    // Request Success Handler
    request.onload = function(e) {
      if (request.readyState == 4) {
        
        // BUild a human readable response title.
        var title = request.status + ' - ' +
          http_status_code_title(request.status);
          
        // 200 OK
        if (request.status == 200) {
          options.success(JSON.parse(request.responseText));
        }
        else {
          // Not OK...
          dpm(request);
          console.log(method + ': ' + url + ' - ' + title);
          if (request.responseText) { console.log(request.responseText); }
          else { dpm(request); }
          if (typeof options.error !== 'undefined') {
            var message = request.responseText;
            if (!message) { message = title; }
            options.error(request, request.status, message);
          }
        }
      }
      else {
        console.log('request.readyState = ' + request.readyState);
      }
    };

    // Generate Token and Make the Request.
    Drupal.services.csrf_token(method, url, request, {
        debug: options.debug,
        path: options.path,
        success: function(token) {

          // Open the request.
          request.open(method, url, true);

          // Set any headers.
          if (method == 'POST') {
            request.setRequestHeader(
              'Content-type',
              'application/x-www-form-urlencoded'
            );
          }
          else if (method == 'PUT') {
            request.setRequestHeader(
              'Content-type',
              'application/json'
            );
          }

          // Add the token to the header if we have one.
          if (token) {
            request.setRequestHeader('X-CSRF-Token', token);
          }
          if (typeof options.data !== 'undefined') {
            if (options.path != 'user/login.json') {
              console.log('sending: ' + options.data);
            }
            request.send(options.data);
          }
          else { request.send(null); }
        }
    });
  }
  catch (error) {
    console.log('Drupal.services.call - error - ' + error);
  }
};

/**
 * Drupal Services CSRF TOKEN
 * @param {String} method
 * @param {String} url
 * @param {Object} request
 * @param {Object} options
 */
Drupal.services.csrf_token = function(method, url, request, options) {
  try {
    var token = false;
    // Do we potentially need a token for this call? We most likely need one if
    // the call option's type is not one of these types.
    if (!in_array(method, ['GET', 'HEAD', 'OPTIONS', 'TRACE'])) {
      // Anonymous users don't need the CSRF token, unless we're calling system
      // connect, then we need to pass along the token if we have one.
      if (Drupal.user.uid == 0 && options.path != 'system/connect.json') {
        if (options.debug) {
          dpm('Anonymous user does not need token for this call!');
        }
        options.success(false);
        return;
      }
      // Is there a token available in local storage?
      token = window.localStorage.getItem('sessid');
      if (token && options.debug) {
        dpm('Loaded token from local storage!');
      }
      // If we don't already have a token, is there one on Drupal.sessid?
      if (!token && Drupal.sessid) {
        token = Drupal.sessid;
        if (options.debug) {
          dpm('Loaded token from Drupal JSON object!');
        }
      }
      // If we still don't have a token to use, let's grab one from Drupal.
      if (!token) {
        // Build the Request, URL and extract the HTTP method.
        var token_request = new XMLHttpRequest();
        var token_url = Drupal.settings.site_path +
                  Drupal.settings.base_path +
                  '?q=services/session/token';
        // Token Request Success Handler
        token_request.onload = function(e) {
          if (token_request.readyState == 4) {
            var title = token_request.status + ' - ' +
              http_status_code_title(token_request.status);
            if (token_request.status != 200) { // Not OK
              console.log(token_url + ' - ' + title);
              console.log(token_request.responseText);
            }
            else { // OK
              // Save the token to local storage as sessid, set Drupal.sessid
              // with the token, then return the token to the success function.
              if (options.debug) {
                dpm('Grabbed token from Drupal site!');
              }
              token = token_request.responseText;
              window.localStorage.setItem('sessid', token);
              Drupal.sessid = token;
              options.success(token);
            }
          }
          else {
            console.log(
              'token_request.readyState = ' + token_request.readyState
            );
          }
        };

        // Open the token request.
        token_request.open('GET', token_url, true);

        // Send the token request.
        token_request.send(null);
      }
      else {
        // We had a previous token available, let's use it.
        if (options.debug) {
          dpm('Previous token available, using it!');
        }
        Drupal.sessid = token;
        options.success(token);
      }
    }
    else {
      // This call's HTTP method doesn't need a token, so we return via the
      // success function.
      if (options.debug) {
        dpm('Method does not need token!');
      }
      options.success(false);
    }
  }
  catch (error) {
    console.log('Drupal.services.call - error - ' + error);
  }
};

/**
 * Checks if we're ready to make a Services call.
 * @return {Boolean}
 */
function services_ready() {
  var result = true;
  if (Drupal.settings.site_path == '' || Drupal.settings.endpoint == '') {
    result = false;
  }
  return result;
}

