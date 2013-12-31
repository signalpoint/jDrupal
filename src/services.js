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
        var title = request.status + ' - ' +
          http_status_code_title(request.status);
        if (request.status != 200) { // Not OK
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
        else { // OK
          options.success(JSON.parse(request.responseText));
        }
      }
      else {
        console.log('request.readyState = ' + request.readyState);
      }
    };

    // Generate Token and Make the Request.
    Drupal.services.csrf_token(method, url, request, {
        'path': options.path,
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

          if (token) {
            dpm('Adding token to header: ' + token);
            request.setRequestHeader('X-CSRF-Token', token);
          }
          if (typeof options.data !== 'undefined') {
            if (options.path != 'user/login.json') {
              console.log(options.data);
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
        dpm(method + ' - anonymous token not needed');
        options.success(false);
        return;
      }
      // Is there a token available in local storage?
      token = window.localStorage.getItem('sessid');
      if (token) {
        dpm('grabbed token from local storage: ' + token);
      }
      // If we don't already have a token, is there one on Drupal.sessid?
      if (!token && Drupal.sessid) {
        token = Drupal.sessid;
        dpm('Grabbed token from drupal: ' + token);
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
            console.log('TOKEN REQUEST COMPLETE: ' + title);
            if (token_request.status != 200) { // Not OK
              console.log(token_url + ' - ' + title);
              console.log(token_request.responseText);
            }
            else { // OK
              // Save the token to local storage as sessid, set Drupal.sessid
              // with the token, then return the token to the success function.
              dpm(token_request.responseText);
              token = token_request.responseText;
              dpm('Grabbed a new token, saving it to local storage: ' + token);
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
        dpm(token_url + ' - previous token not available, grabbing one...');
        token_request.send(null);
      }
      else {
        // We had a previous token available, let's use it.
        dpm('previous token available and being used');
        Drupal.sessid = token;
        options.success(token);
      }
    }
    else {
      dpm(method + ' - token not needed');
      // This call's HTTP method doesn't need a token, so we return via the
      // success function.
      options.success(false);
    }
  }
  catch (error) {
    console.log('Drupal.services.call - error - ' + error);
  }
};

