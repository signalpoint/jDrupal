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

    module_invoke_all('services_preprocess', options);

    // Build the Request, URL and extract the HTTP method.
    var request = new XMLHttpRequest();
    var url = Drupal.settings.site_path +
              Drupal.settings.base_path + '?q=';
    // Use an endpoint, unless someone passed in an empty string.
    if (typeof options.endpoint === 'undefined') {
      url += Drupal.settings.endpoint + '/';
    }
    else if (options.endpoint != '') {
      url += options.endpoint + '/';
    }
    url += options.path;
    var method = options.method.toUpperCase();
    if (Drupal.settings.debug) { console.log(method + ': ' + url); }

    // Request Success Handler
    request.onload = function(e) {
      try {
        if (request.readyState == 4) {
          // Build a human readable response title.
          var title = request.status + ' - ' +
            http_status_code_title(request.status);
          // 200 OK
          if (request.status == 200) {
            if (Drupal.settings.debug) { console.log('200 - OK'); }
            // Extract the JSON result, or throw an error if the response wasn't
            // JSON.
            var result = null;
            var response_header = request.getResponseHeader('Content-Type');
            if (response_header.indexOf('application/json') == -1) {
              console.log(
                'Drupal.services.call - ERROR - response header was ' +
                response_header + ' instead of application/json'
              );
              console.log(request.responseText);
            }
            else { result = JSON.parse(request.responseText); }
            // Give modules a chance to pre post process the results, send the
            // results to the success callback, then give modules a chance to
            // post process the results.
            module_invoke_all(
              'services_request_pre_postprocess_alter',
              options,
              result
            );
            options.success(result);
            module_invoke_all(
              'services_request_postprocess_alter',
              options,
              result
            );
            module_invoke_all('services_postprocess', options, result);
          }
          else {
            // Not OK...
            if (Drupal.settings.debug) {
              console.log(method + ': ' + url + ' - ' + title);
              console.log(request.responseText);
              console.log(request.getAllResponseHeaders());
            }
            if (request.responseText) { console.log(request.responseText); }
            else { dpm(request); }
            if (typeof options.error !== 'undefined') {
              var message = request.responseText || '';
              if (!message || message == '') { message = title; }
              options.error(request, request.status, message);
            }
            module_invoke_all('services_postprocess', options, request);
          }
        }
        else {
          console.log(
            'Drupal.services.call - request.readyState = ' + request.readyState
          );
        }
      }
      catch (error) {
        // Not OK...
        if (Drupal.settings.debug) {
          console.log(method + ' (ERROR): ' + url + ' - ' + title);
          console.log(request.responseText);
          console.log(request.getAllResponseHeaders());
        }
        console.log('Drupal.services.call - onload - ' + error);
      }
    };

    // Get the CSRF Token and Make the Request.
    services_get_csrf_token({
        debug: options.debug,
        success: function(token) {
          try {
            // Async, or sync? By default we'll use async if none is provided.
            var async = true;
            if (typeof options.async !== 'undefined' &&
              options.async === false) { async = false; }

            // Open the request.
            request.open(method, url, async);

            // Set any headers.
            if (method == 'POST') {
              var content_type = 'application/json';
              // The user login resource needs a url encoded data string.
              if (options.service == 'user' &&
                options.resource == 'login') {
                content_type = 'application/x-www-form-urlencoded';
              }
              request.setRequestHeader('Content-type', content_type);
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

            // Send the request with or without data.
            if (typeof options.data !== 'undefined') {
              // Print out debug information if debug is enabled. Don't print
              // out any sensitive debug data containing passwords.
              if (Drupal.settings.debug) {
                var show = true;
                if (options.service == 'user' &&
                  in_array(options.resource, ['login', 'create', 'update'])) {
                  show = false;
                }
                if (show) {
                  if (typeof options.data === 'object') {
                    console.log(JSON.stringify(options.data));
                  }
                  else { console.log(options.data); }
                }
              }
              request.send(options.data);
            }
            else { request.send(null); }

          }
          catch (error) {
            console.log(
              'Drupal.services.call - services_get_csrf_token - success - ' +
              error
            );
          }
        },
        error: function(xhr, status, message) {
          try {
            console.log(
              'Drupal.services.call - services_get_csrf_token - ' + message
            );
            if (options.error) { options.error(xhr, status, message); }
          }
          catch (error) {
            console.log(
              'Drupal.services.call - services_get_csrf_token - error - ' +
              error
            );
          }
        }
    });

  }
  catch (error) {
    console.log('Drupal.services.call - error - ' + error);
  }
};

/**
 * Gets the CSRF token from Services.
 * @param {Object} options
 */
function services_get_csrf_token(options) {
  try {

    var token;

    // Are we resetting the token?
    if (options.reset) { Drupal.sessid = null; }

    // Do we already have a token? If we do, return it the success callback.
    if (Drupal.sessid) { token = Drupal.sessid; }
    if (token) {
      if (options.success) { options.success(token); }
      return;
    }

    // We don't have a token, let's get it from Drupal...

    // Build the Request and URL.
    var token_request = new XMLHttpRequest();
    var token_url = Drupal.settings.site_path +
              Drupal.settings.base_path +
              '?q=services/session/token';

    // Token Request Success Handler
    token_request.onload = function(e) {
      try {
        if (token_request.readyState == 4) {
          var title = token_request.status + ' - ' +
            http_status_code_title(token_request.status);
          if (token_request.status != 200) { // Not OK
            console.log(token_url + ' - ' + title);
            console.log(token_request.responseText);
          }
          else { // OK
            // Set Drupal.sessid with the token, then return the token to the
            // success function.
            token = token_request.responseText;
            Drupal.sessid = token;
            if (options.success) { options.success(token); }
          }
        }
        else {
          console.log(
            'services_get_csrf_token - readyState - ' + token_request.readyState
          );
        }
      }
      catch (error) {
        console.log(
          'services_get_csrf_token - token_request. onload - ' + error
        );
      }
    };

    // Open the token request.
    token_request.open('GET', token_url, true);

    // Send the token request.
    token_request.send(null);
  }
  catch (error) { console.log('services_get_csrf_token - ' + error); }
}

/**
 * Checks if we're ready to make a Services call.
 * @return {Boolean}
 */
function services_ready() {
  try {
    var result = true;
    if (Drupal.settings.site_path == '') {
      result = false;
      console.log('jDrupal\'s Drupal.settings.site_path is not set!');
    }
    if (Drupal.settings.endpoint == '') {
      result = false;
      console.log('jDrupal\'s Drupal.settings.endpoint is not set!');
    }
    return result;
  }
  catch (error) { console.log('services_ready - ' + error); }
}

/**
 * Given the options for a service call, the service name and the resource name,
 * this will attach the names and their values as properties on the options.
 * @param {Object} options
 * @param {String} service
 * @param {String} resource
 */
function services_resource_defaults(options, service, resource) {
  try {
    if (!options.service) { options.service = service; }
    if (!options.resource) { options.resource = resource; }
  }
  catch (error) { console.log('services_resource_defaults - ' + error); }
}

