/**
 * The jDrupal services JSON object.
 */
jDrupal.services = {};

/**
 * Drupal Services XMLHttpRequest Object.
 * @param {Object} options
 */
jDrupal.services.call = function(options) {
  try {

    options.debug = false;

    // Make sure the settings have been provided for Services.
    if (!services_ready()) {
      var error = 'Set the site_path and endpoint on jDrupal.settings!';
      options.error(null, null, error);
      return;
    }

    module_invoke_all('services_preprocess', options);

    // Build the Request, URL and extract the HTTP method.
    var request = new XMLHttpRequest();
    var url = jDrupal.settings.site_path +
              jDrupal.settings.base_path + '?q=';
    // Use an endpoint, unless someone passed in an empty string.
    if (typeof options.endpoint === 'undefined') { url += jDrupal.settings.endpoint + '/'; }
    else if (options.endpoint != '') { url += options.endpoint + '/'; }
    url += options.path;
    var method = options.method.toUpperCase();
    if (jDrupal.settings.debug) { console.log(method + ': ' + url); }

    // Watch for net::ERR_CONNECTION_REFUSED and other oddities.
    request.onreadystatechange = function() {
      if (request.readyState == 4 && request.status == 0) {
        if (options.error) { options.error(request, 0, 'xhr network status problem'); }
      }
    };

    // Request Success Handler
    request.onload = function(e) {
      try {
        if (request.readyState == 4) {
          // Build a human readable response title.
          var title = request.status + ' - ' + request.statusText;
          // 200 OK
          if (request.status == 200) {
            if (jDrupal.settings.debug) { console.log('200 - OK'); }
            // Extract the JSON result, or throw an error if the response wasn't
            // JSON.

            // Extract the JSON result if the server sent back JSON, otherwise
            // hand back the response as is.
            var result = null;
            var response_header = request.getResponseHeader('Content-Type');
            if (response_header.indexOf('application/json') != -1) {
              result = JSON.parse(request.responseText);
            }
            else { result = request.responseText; }

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
            console.log(method + ': ' + url + ' - ' + title);
            if (jDrupal.settings.debug) {
              if (!in_array(request.status, [403, 503])) { console.log(request.responseText); }
              console.log(request.getAllResponseHeaders());
            }
            if (typeof options.error !== 'undefined') {
              var message = request.responseText || '';
              if (!message || message == '') { message = title; }
              options.error(request, request.status, message);
            }
            module_invoke_all('services_postprocess', options, request);
          }
        }
        else {
          console.log('jDrupal.services.call - request.readyState = ' + request.readyState);
        }
      }
      catch (error) {
        // Not OK...
        if (jDrupal.settings.debug) {
          console.log(method + ': ' + url + ' - ' + request.statusText);
          console.log(request.responseText);
          console.log(request.getAllResponseHeaders());
        }
        console.log('jDrupal.services.call - onload - ' + error);
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

            // Determine content type header, if necessary.
            var contentType = null;
            if (method == 'POST') {
              contentType = 'application/json';
              // The user login resource needs a url encoded data string.
              if (options.service == 'user' &&
                options.resource == 'login') {
                contentType = 'application/x-www-form-urlencoded';
              }
            }
            else if (method == 'PUT') { contentType = 'application/json'; }

            // Anyone overriding the content type?
            if (options.contentType) { contentType = options.contentType; }

            // Set the content type on the header, if we have one.
            if (contentType) {
              request.setRequestHeader('Content-type', contentType);
            }

            // Add the token to the header if we have one.
            if (token) {
              request.setRequestHeader('X-CSRF-Token', token);
            }

            // Any timeout handling?
            if (options.timeout) {
              request.timeout = options.timeout;
              if (options.ontimeout) { request.ontimeout = options.ontimeout; }
            }

            var hasData = typeof options.data !== 'undefined';

            // For any POST calls, make sure there is at minimum some empty data.
            if (method == 'POST' && !hasData) {
              options.data = JSON.stringify('');
              hasData = true;
            }

            // Send the request with or without data.
            if (hasData) {
              // Print out debug information if debug is enabled. Don't print
              // out any sensitive debug data containing passwords.
              if (jDrupal.settings.debug) {
                var show = true;
                if (
                    (options.service == 'user' && in_array(options.resource, ['login', 'create', 'update'])) ||
                    (options.service == 'file' && options.resource == 'create')
                ) { show = false; }
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
              'jDrupal.services.call - services_get_csrf_token - success - ' +
              error
            );
          }
        },
        error: function(xhr, status, message) {
          try {
            if (options.error) { options.error(xhr, status, message); }
          }
          catch (error) {
            console.log(
              'jDrupal.services.call - services_get_csrf_token - error - ' +
              error
            );
          }
        }
    });

  }
  catch (error) {
    console.log('jDrupal.services.call - error - ' + error);
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
    if (options.reset) { jDrupal.sessid = null; }

    // Do we already have a token? If we do, return it to the success callback.
    if (jDrupal.sessid) { token = jDrupal.sessid; }
    if (token) {
      if (options.success) { options.success(token); }
      return;
    }

    // We don't have a token, let's get it from Drupal...

    // Build the Request and URL.
    var token_request = new XMLHttpRequest();
    options.token_url = jDrupal.settings.site_path + jDrupal.settings.base_path + '?q=services/session/token';

    module_invoke_all('csrf_token_preprocess', options);

    // Watch for net::ERR_CONNECTION_REFUSED and other oddities.
    token_request.onreadystatechange = function() {
      if (token_request.readyState == 4 && token_request.status == 0) {
        if (options.error) { options.error(token_request, 0, 'xhr network status problem for csrf token'); }
      }
    };

    // Token Request Success Handler
    token_request.onload = function(e) {
      try {
        if (token_request.readyState == 4) {
          var title = token_request.status + ' - ' +
            http_status_code_title(token_request.status);
          if (token_request.status != 200) { // Not OK
            if (options.error) { options.error(token_request, token_request.status, token_request.responseText); }
          }
          else { // OK
            // Set jDrupal.sessid with the token, then return the token to the success function.
            token = token_request.responseText.trim();
            jDrupal.sessid = token;
            if (options.success) { options.success(token); }
          }
        }
        else {
          console.log('services_get_csrf_token - readyState - ' + token_request.readyState);
        }
      }
      catch (error) {
        console.log('services_get_csrf_token - token_request. onload - ' + error);
      }
    };

    // Open the token request.
    token_request.open('GET', options.token_url, true);

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
    if (jDrupal.settings.site_path == '') {
      result = false;
      console.log('jDrupal\'s jDrupal.settings.site_path is not set!');
    }
    if (jDrupal.settings.endpoint == '') {
      result = false;
      console.log('jDrupal\'s jDrupal.settings.endpoint is not set!');
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
  if (!options.service) { options.service = service; }
  if (!options.resource) { options.resource = resource; }
}

/**
 * Returns true if the entity_id is already queued for the service resource,
 * false otherwise.
 * @param {String} service
 * @param {String} resource
 * @param {Number} entity_id
 * @param {String} callback_type
 * @return {Boolean}
 */
function _services_queue_already_queued(service, resource, entity_id, callback_type) {
  try {
    var queued = false;
    if (typeof jDrupal.services_queue[service][resource][entity_id] !== 'undefined') {
      var queue = jDrupal.services_queue[service][resource][entity_id];
      if (queue[callback_type].length != 0) { queued = true; }
    }
    return queued;
  }
  catch (error) { console.log('_services_queue_already_queued - ' + error); }
}

/**
 * Adds an entity id to the service resource queue.
 * @param {String} service
 * @param {String} resource
 * @param {Number} entity_id
 */
function _services_queue_add_to_queue(service, resource, entity_id) {
  try {
    jDrupal.services_queue[service][resource][entity_id] = {
      entity_id: entity_id,
      success: [],
      error: []
    };
  }
  catch (error) { console.log('_services_queue_add_to_queue - ' + error); }
}

/**
 * An internal function used to reset a services callback queue for a given entity CRUD op.
 * @param {String} entity_type
 * @param {String} resource - create, retrieve, update, delete, index, etc
 * @param {Number} entity_id
 * @param {String} callback_type - success or error
 * @private
 */
function _services_queue_clear(entity_type, resource, entity_id, callback_type) {
  try {
    jDrupal.services_queue[entity_type]['retrieve'][entity_id][callback_type] = [];
  }
  catch (error) { console.log('_services_queue_clear - ' + error); }
}

/**
 * Removes an entity id from the service resource queue.
 * @param {String} service
 * @param {String} resource
 * @param {Number} entity_id
 */
function _services_queue_remove_from_queue(service, resource, entity_id) {
  console.log('WARNING: services_queue_remove_from_queue() not done yet!');
}

/**
 * Adds a callback function to the service resource queue.
 * @param {String} service
 * @param {String} resource
 * @param {Number} entity_id
 * @param {String} callback_type
 * @param {Function} callback
 */
function _services_queue_callback_add(service, resource, entity_id, callback_type, callback) {
  try {
    jDrupal.services_queue[service][resource][entity_id][callback_type].push(
      callback
    );
  }
  catch (error) { console.log('_services_queue_callback_add - ' + error); }
}

/**
 * Returns the number of callback functions for the service resource queue.
 * @param {String} service
 * @param {String} resource
 * @param {Number} entity_id
 * @param {String} callback_type
 * @return {Number}
 */
function _services_queue_callback_count(service, resource, entity_id,
  callback_type) {
  try {
    var length =
      jDrupal.services_queue[service][resource][entity_id][callback_type].length;
    return length;
  }
  catch (error) { console.log('_services_queue_callback_count - ' + error); }
}

