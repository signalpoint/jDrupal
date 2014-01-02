// Initialize the Drupal JSON object.
var Drupal = Drupal || drupal_init();

/**
 * Add additional properties to the Drupal JSON object.
 */
Drupal.sessid = null;

/**
 * Initialize a Drupal user JSON object.
 */
Drupal.user = drupal_user_defaults();

/**
 * Given a JSON object or string, this will print it to the console.
 * @param {Object} data
 */
function dpm(data) {
  if (data) {
    if (typeof data === 'object') { console.log(JSON.stringify(data)); }
    else { console.log(data); }
  }
}

/**
 * Returns a default JSON object for Drupal.
 * @return {Object}
 */
function drupal_init() {
  return {
    settings: {
      site_path: '',
      base_path: '/',
      language_default: 'und'
    }
  };
}

/**
 * Returns a default JSON object representing an anonymous Drupal user account.
 * @return {Object}
 */
function drupal_user_defaults() {
  return {
    'uid': '0',
    'roles': {'1': 'anonymous user'}
  };
}

/**
 * Given a JS function name, this returns true if the function exists in the
 * scope, false otherwise.
 * @param {String} name
 * @return {Boolean}
 */
function function_exists(name) {
  try {
    return (eval('typeof ' + name) == 'function');
  }
  catch (error) {
    alert('function_exists - ' + error);
  }
}

/**
 * Given an integer http status code, this will return the title of it.
 * @param {Number} status
 * @return {String} title
 */
function http_status_code_title(status) {
  try {
    var title = '';
    switch (status) {
      case 200: title = 'OK'; break;
      case 401: title = 'Unauthorized'; break;
      case 404: title = 'Not Found'; break;
      case 406: title = 'Not Acceptable'; break;
    }
    return title;
  }
  catch (error) {
    console.log('http_status_code_title - ' + error);
  }
}

/**
 * Checks if the needle string, is in the haystack array. Returns true if it is
 * found, false otherwise. Credit: http://stackoverflow.com/a/15276975/763010
 * @param {String} needle
 * @param {Array} haystack
 * @return {Boolean}
 */
function in_array(needle, haystack) {
  return (haystack.indexOf(needle) > -1);
}

/**
 * Get the default language from Drupal.settings.
 * @return {String}
 */
function language_default() {
  try {
    return Drupal.settings.language_default;
  }
  catch (error) { console.log('language_default - ' + error); }
}

/**
 * Loads a comment.
 * @param {Number} cid
 * @param {Object} options
 */
function comment_load(cid, options) {
  try {
    entity_load('comment', cid, options);
  }
  catch (error) { console.log('comment_load - ' + error); }
}

/**
 * Saves a comment.
 * @param {Object} comment
 * @param {Object} options
 */
function comment_save(comment, options) {
  try {
    entity_save('comment', null, comment, options);
  }
  catch (error) { console.log('comment_save - ' + error); }
}

/**
 * Assembles the data string used in Service calls.
 * @param {String} entity_type
 * @param {String} bundle
 * @param {Object} entity
 * @param {Object} options
 * @return {String} data
 */
function entity_assemble_data(entity_type, bundle, entity, options) {
  try {
    // TODO, this function is being replaced by sending JSON object directly
    // via Content-Type application/json. This will eventually go away.
    var data = '';
    for (var property in entity) {
      if (entity.hasOwnProperty(property)) {
        var type = typeof entity[property];
        // Assemble field items.
        if (type === 'object') {
          for (var language in entity[property]) {
            if (entity[property].hasOwnProperty(language)) {
              for (var delta in entity[property][language]) {
                if (entity[property][language].hasOwnProperty(delta)) {
                  for (var value in entity[property][language][delta]) {
                    if (
                      entity[property][language][delta].hasOwnProperty(value)) {
                      data += property +
                        '[' + language + '][' + delta + '][' + value + ']=' +
                        encodeURIComponent(
                          entity[property][language][delta][value]
                        ) + '&';
                    }
                  }
                }
              }
            }
          }
        }
        // Assemble flat properties.
        else {
          data += property + '=' + encodeURIComponent(entity[property]) + '&';
        }
      }
    }
    if (data != '') { data = data.substring(0, data.length - 1); }
    return data;
  }
  catch (error) { console.log('entity_assemble_data - ' + error); }
}

/**
 * Delete an entity.
 * @param {String} entity_type
 * @param {Number} ids
 * @param {Object} options
 */
function entity_delete(entity_type, ids, options) {
  try {
    var function_name = entity_type + '_delete';
    if (function_exists(function_name)) {
      var fn = window[function_name];
      fn(ids, options);
    }
    else {
      console.log('WARNING: entity_delete - unsupported type: ' + entity_type);
    }
  }
  catch (error) { console.log('entity_delete - ' + error); }
}

/**
 * Loads an entity.
 * @param {String} entity_type
 * @param {Number} ids
 * @param {Object} options
 */
function entity_load(entity_type, ids, options) {
  try {
    var function_name = entity_type + '_retrieve';
    if (function_exists(function_name)) {
      var fn = window[function_name];
      fn(ids, options);
    }
    else {
      console.log('WARNING: entity_load - unsupported type: ' + entity_type);
    }
  }
  catch (error) { console.log('entity_load - ' + error); }
}

/**
 * Saves an entity.
 * @param {String} entity_type
 * @param {String} bundle
 * @param {Object} entity
 * @param {Object} options
 */
function entity_save(entity_type, bundle, entity, options) {
  try {
    var function_name;
    switch (entity_type) {
      case 'comment':
        if (!entity.cid) { function_name = 'comment_create'; }
        else { function_name = 'comment_update'; }
        break;
      case 'node':
        if (!entity.language) { entity.language = language_default(); }
        if (!entity.nid) { function_name = 'node_create'; }
        else { function_name = 'node_update'; }
        break;
      case 'user':
        if (!entity.uid) { function_name = 'user_create'; }
        else { function_name = 'user_update'; }
        break;
      case 'taxonomy_term':
        if (!entity.tid) { function_name = 'taxonomy_term_create'; }
        else { function_name = 'taxonomy_term_update'; }
        break;
      case 'taxonomy_vocabulary':
        if (!entity.vid) { function_name = 'taxonomy_vocabulary_create'; }
        else { function_name = 'taxonomy_vocabulary_update'; }
        break;
    }
    if (function_name && function_exists(function_name)) {
      var fn = window[function_name];
      fn(entity, options);
    }
    else {
      console.log('WARNING: entity_save - unsupported type: ' + entity_type);
    }
  }
  catch (error) { console.log('entity_save - ' + error); }
}

/**
 * Loads a node.
 * @param {Number} nid
 * @param {Object} options
 */
function node_load(nid, options) {
  try {
    entity_load('node', nid, options);
  }
  catch (error) { console.log('node_load - ' + error); }
}

/**
 * Saves a node.
 * @param {Object} node
 * @param {Object} options
 */
function node_save(node, options) {
  try {
    entity_save('node', node.type, node, options);
  }
  catch (error) { console.log('node_save - ' + error); }
}

/**
 * Loads a taxonomy term.
 * @param {Number} tid
 * @param {Object} options
 */
function taxonomy_term_load(tid, options) {
  try {
    entity_load('taxonomy_term', tid, options);
  }
  catch (error) { console.log('taxonomy_term_load - ' + error); }
}

/**
 * Saves a taxonomy term.
 * @param {Object} taxonomy_term
 * @param {Object} options
 */
function taxonomy_term_save(taxonomy_term, options) {
  try {
    entity_save('taxonomy_term', null, taxonomy_term, options);
  }
  catch (error) { console.log('taxonomy_term_save - ' + error); }
}

/**
 * Loads a taxonomy vocabulary.
 * @param {Number} vid
 * @param {Object} options
 */
function taxonomy_vocabulary_load(vid, options) {
  try {
    entity_load('taxonomy_vocabulary', vid, options);
  }
  catch (error) { console.log('taxonomy_vocabulary_load - ' + error); }
}

/**
 * Saves a taxonomy vocabulary.
 * @param {Object} taxonomy_vocabulary
 * @param {Object} options
 */
function taxonomy_vocabulary_save(taxonomy_vocabulary, options) {
  try {
    entity_save('taxonomy_vocabulary', null, taxonomy_vocabulary, options);
  }
  catch (error) { console.log('taxonomy_vocabulary_save - ' + error); }
}

/**
 * Loads a user account.
 * @param {Number} uid
 * @param {Object} options
 */
function user_load(uid, options) {
  try {
    entity_load('user', uid, options);
  }
  catch (error) { console.log('user_load - ' + error); }
}

/**
 * Generates a random user password.
 * @return {String}
 */
function user_password() {
  try {
    // credit: http://stackoverflow.com/a/1349426/763010
    var length = 10;
    if (arguments[0]) { length = arguments[0]; }
    var password = '';
    var possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz23456789';
    for (var i = 0; i < length; i++) {
      password += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return password;
  }
  catch (error) { console.log('user_password - ' + error); }
}

/**
 * Saves a user account.
 * @param {Object} account
 * @param {Object} options
 */
function user_save(account, options) {
  try {
    entity_save('user', null, account, options);
  }
  catch (error) { console.log('user_save - ' + error); }
}

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
              if (typeof options.data === 'object') {
                console.log(JSON.stringify(options.data));
              }
              else {
                console.log(options.data);
              }
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

/**
 * Creates a comment.
 * @param {Object} comment
 * @param {Object} options
 */
function comment_create(comment, options) {
  try {
    options.method = 'POST';
    options.path = 'comment.json';
    entity_create('comment', null, comment, options);
  }
  catch (error) { console.log('comment_create - ' + error); }
}

/**
 * Retrieves a comment.
 * @param {Number} ids
 * @param {Object} options
 */
function comment_retrieve(ids, options) {
  try {
    options.method = 'GET';
    options.path = 'comment/' + ids + '.json';
    entity_retrieve('comment', ids, options);
  }
  catch (error) { console.log('comment_retrieve - ' + error); }
}

/**
 * Update a comment.
 * @param {Object} comment
 * @param {Object} options
 */
function comment_update(comment, options) {
  try {
    options.method = 'PUT';
    options.path = 'comment/' + comment.cid + '.json';
    entity_update('comment', null, comment, options);
  }
  catch (error) { console.log('comment_update - ' + error); }
}

/**
 * Delete a comment.
 * @param {Number} cid
 * @param {Object} options
 */
function comment_delete(cid, options) {
  try {
    Drupal.services.call({
        method: 'DELETE',
        path: 'comment/' + cid + '.json',
        success: function(data) {
          if (options.success) { options.success(data); }
        },
        error: function(xhr, status, message) {
          if (options.error) { options.error(xhr, status, message); }
        }
    });
  }
  catch (error) { console.log('comment_delete - ' + error); }
}

/**
 * Perform a comment index.
 * @param {Object} query
 * @param {Object} options
 */
function comment_index(query, options) {
  try {
    entity_index('comment', query, options);
  }
  catch (error) { console.log('comment_index - ' + error); }
}

/**
 * Creates an entity.
 * @param {String} entity_type
 * @param {String} bundle
 * @param {Object} entity
 * @param {Object} options
 */
function entity_create(entity_type, bundle, entity, options) {
  try {
    Drupal.services.call({
        method: options.method,
        path: options.path,
        data: entity_assemble_data(entity_type, bundle, entity, options),
        success: function(data) {
          if (options.success) { options.success(data); }
        },
        error: function(xhr, status, message) {
          if (options.error) { options.error(xhr, status, message); }
        }
    });
  }
  catch (error) { console.log('entity_create - ' + error); }
}

/**
 * Retrieves an entity.
 * @param {String} entity_type
 * @param {Number} ids
 * @param {Object} options
 */
function entity_retrieve(entity_type, ids, options) {
  try {
    Drupal.services.call({
        method: options.method,
        path: options.path,
        success: function(data) {
          if (options.success) { options.success(data); }
        },
        error: function(xhr, status, message) {
          if (options.error) { options.error(xhr, status, message); }
        }
    });
  }
  catch (error) { console.log('entity_retrieve - ' + error); }
}

/**
 * Updates an entity.
 * @param {String} entity_type
 * @param {String} bundle
 * @param {Object} entity
 * @param {Object} options
 */
function entity_update(entity_type, bundle, entity, options) {
  try {
    // Wrap entities, except for taxonomy.
    var entity_wrapper = {};
    if (entity_type == 'taxonomy_term' ||
      entity_type == 'taxonomy_vocabulary' ||
      entity_type == 'user') {
      entity_wrapper = entity;
    }
    else { entity_wrapper[entity_type] = entity; }
    Drupal.services.call({
        method: options.method,
        path: options.path,
        //data: entity_assemble_data(entity_type, bundle, entity, options),
        data: JSON.stringify(entity_wrapper),
        success: function(data) {
          if (options.success) { options.success(data); }
        },
        error: function(xhr, status, message) {
          if (options.error) { options.error(xhr, status, message); }
        }
    });
  }
  catch (error) { console.log('entity_update - ' + error); }
}

/**
 * Performs an entity index.
 * @param {String} entity_type
 * @param {String} query
 * @param {Object} options
 */
function entity_index(entity_type, query, options) {
  try {
    var query_string;
    if (typeof query === 'object') {
      query_string = entity_index_build_query_string(query);
    }
    else if (typeof query === 'string') {
      query_string = query;
    }
    if (query_string) { query_string = '&' + query_string; }
    else { query_string = ''; }
    Drupal.services.call({
        method: 'GET',
        path: entity_type + '.json' + query_string,
        /*data: JSON.stringify(query),*/
        /*data:query,*/
        success: function(result) {
          if (options.success) { options.success(result); }
        },
        error: function(xhr, status, message) {
          if (options.error) { options.error(xhr, status, message); }
        }
    });
  }
  catch (error) { console.log('entity_index - ' + error); }
}
/**
 * Builds a query string from a query object for an entity index resource.
 * @param {Object} query
 * @return {String}
 */
function entity_index_build_query_string(query) {
  try {
    var result = '';
    if (!query) { return result; }
    if (query.fields) { // array
      var fields = '';
      for (var i = 0; i < query.fields.length; i++) {
        fields += encodeURIComponent(query.fields[i]) + ',';
      }
      if (fields != '') {
        fields = 'fields=' + fields.substring(0, fields.length - 1);
        result += fields + '&';
      }
    }
    if (query.parameters) { // object
      var parameters = '';
      for (var parameter in query.parameters) {
          if (query.parameters.hasOwnProperty(parameter)) {
            var key = encodeURIComponent(parameter);
            var value = encodeURIComponent(query.parameters[parameter]);
            parameters += 'parameters[' + key + ']=' + value + '&';
          }
      }
      if (parameters != '') {
        parameters = parameters.substring(0, parameters.length - 1);
        result += parameters + '&';
      }
    }
    if (typeof query.page !== 'undefined') { // int
      result += 'page=' + encodeURIComponent(query.page) + '&';
    }
    if (typeof query.page_size !== 'undefined') { // int
      result += 'page_size=' + encodeURIComponent(query.page_size) + '&';
    }
    return result.substring(0, result.length - 1);
  }
  catch (error) { console.log('entity_index_build_query_string - ' + error); }
}

/**
 * Creates a node.
 * @param {Object} node
 * @param {Object} options
 */
function node_create(node, options) {
  try {
    options.method = 'POST';
    options.path = 'node.json';
    entity_create('node', node.type, node, options);
  }
  catch (error) { console.log('node_create - ' + error); }
}

/**
 * Retrieves a node.
 * @param {Number} ids
 * @param {Object} options
 */
function node_retrieve(ids, options) {
  try {
    options.method = 'GET';
    options.path = 'node/' + ids + '.json';
    entity_retrieve('node', ids, options);
  }
  catch (error) { console.log('node_retrieve - ' + error); }
}

/**
 * Update a node.
 * @param {Object} node
 * @param {Object} options
 */
function node_update(node, options) {
  try {
    options.method = 'PUT';
    options.path = 'node/' + node.nid + '.json';
    entity_update('node', node.type, node, options);
  }
  catch (error) { console.log('node_update - ' + error); }
}

/**
 * Delete a node.
 * @param {Number} nid
 * @param {Object} options
 */
function node_delete(nid, options) {
  try {
    Drupal.services.call({
        method: 'DELETE',
        path: 'node/' + nid + '.json',
        success: function(data) {
          if (options.success) { options.success(data); }
        },
        error: function(xhr, status, message) {
          if (options.error) { options.error(xhr, status, message); }
        }
    });
  }
  catch (error) { console.log('node_delete - ' + error); }
}

/**
 * Perform a node index.
 * @param {Object} query
 * @param {Object} options
 */
function node_index(query, options) {
  try {
    entity_index('node', query, options);
  }
  catch (error) { console.log('node_index - ' + error); }
}

/**
 * System connect call.
 * @param {Object} options
 */
function system_connect(options) {
  try {
    Drupal.services.call({
        method: 'POST',
        path: 'system/connect.json',
        success: function(data) {
          Drupal.user = data.user;
          if (options.success) { options.success(data); }
        },
        error: function(xhr, status, message) {
          if (options.error) { options.error(xhr, status, message); }
        }
    });
  }
  catch (error) {
    console.log('system_connect - ' + error);
  }
}

/**
 * Creates a taxonomy term.
 * @param {Object} taxonomy_term
 * @param {Object} options
 */
function taxonomy_term_create(taxonomy_term, options) {
  try {
    options.method = 'POST';
    options.path = 'taxonomy_term.json';
    entity_create('taxonomy_term', null, taxonomy_term, options);
  }
  catch (error) { console.log('taxonomy_term_create - ' + error); }
}

/**
 * Retrieves a taxonomy term.
 * @param {Number} ids
 * @param {Object} options
 */
function taxonomy_term_retrieve(ids, options) {
  try {
    options.method = 'GET';
    options.path = 'taxonomy_term/' + ids + '.json';
    entity_retrieve('taxonomy_term', ids, options);
  }
  catch (error) { console.log('taxonomy_term_retrieve - ' + error); }
}

/**
 * Update a taxonomy term.
 * @param {Object} taxonomy_term
 * @param {Object} options
 */
function taxonomy_term_update(taxonomy_term, options) {
  try {
    options.method = 'PUT';
    options.path = 'taxonomy_term/' + taxonomy_term.tid + '.json';
    entity_update('taxonomy_term', null, taxonomy_term, options);
  }
  catch (error) { console.log('taxonomy_term_update - ' + error); }
}

/**
 * Delete a taxonomy term.
 * @param {Number} tid
 * @param {Object} options
 */
function taxonomy_term_delete(tid, options) {
  try {
    // TODO - this should be replaced with a call to entity_delete().
    Drupal.services.call({
        method: 'DELETE',
        path: 'taxonomy_term/' + tid + '.json',
        success: function(data) {
          if (options.success) { options.success(data); }
        },
        error: function(xhr, status, message) {
          if (options.error) { options.error(xhr, status, message); }
        }
    });
  }
  catch (error) { console.log('taxonomy_term_delete - ' + error); }
}

/**
 * Perform a taxonomy_term index.
 * @param {Object} query
 * @param {Object} options
 */
function taxonomy_term_index(query, options) {
  try {
    entity_index('taxonomy_term', query, options);
  }
  catch (error) { console.log('taxonomy_term_index - ' + error); }
}

/**
 * Creates a taxonomy vocabulary.
 * @param {Object} taxonomy_vocabulary
 * @param {Object} options
 */
function taxonomy_vocabulary_create(taxonomy_vocabulary, options) {
  try {
    options.method = 'POST';
    options.path = 'taxonomy_vocabulary.json';
    if (!taxonomy_vocabulary.machine_name && taxonomy_vocabulary.name) {
      taxonomy_vocabulary.machine_name =
        taxonomy_vocabulary.name.toLowerCase().replace(' ', '_');
    }
    entity_create('taxonomy_vocabulary', null, taxonomy_vocabulary, options);
  }
  catch (error) { console.log('taxonomy_vocabulary_create - ' + error); }
}

/**
 * Retrieves a comment.
 * @param {Number} ids
 * @param {Object} options
 */
function taxonomy_vocabulary_retrieve(ids, options) {
  try {
    options.method = 'GET';
    options.path = 'taxonomy_vocabulary/' + ids + '.json';
    entity_retrieve('taxonomy_vocabulary', ids, options);
  }
  catch (error) { console.log('taxonomy_vocabulary_retrieve - ' + error); }
}

/**
 * Update a taxonomy vocabulary.
 * @param {Object} taxonomy_vocabulary
 * @param {Object} options
 */
function taxonomy_vocabulary_update(taxonomy_vocabulary, options) {
  try {
    // We need to make sure a machine_name was provided, otherwise it seems the
    // Services module will update a vocabulary and clear out its machine_name
    // if we don't provide it.
    if (!taxonomy_vocabulary.machine_name ||
      taxonomy_vocabulary.machine_name == '') {
      var message = 'taxonomy_vocabulary_update - missing machine_name';
      console.log(message);
      if (options.error) {
        options.error(null, 406, message);
      }
      return;
    }
    options.method = 'PUT';
    options.path = 'taxonomy_vocabulary/' + taxonomy_vocabulary.vid + '.json';
    entity_update('taxonomy_vocabulary', null, taxonomy_vocabulary, options);
  }
  catch (error) { console.log('taxonomy_vocabulary_update - ' + error); }
}

/**
 * Delete a taxonomy vocabulary.
 * @param {Number} vid
 * @param {Object} options
 */
function taxonomy_vocabulary_delete(vid, options) {
  try {
    Drupal.services.call({
        method: 'DELETE',
        path: 'taxonomy_vocabulary/' + vid + '.json',
        success: function(data) {
          if (options.success) { options.success(data); }
        },
        error: function(xhr, status, message) {
          if (options.error) { options.error(xhr, status, message); }
        }
    });
  }
  catch (error) { console.log('taxonomy_vocabulary_delete - ' + error); }
}

/**
 * Perform a taxonomy_vocabulary index.
 * @param {Object} query
 * @param {Object} options
 */
function taxonomy_vocabulary_index(query, options) {
  try {
    entity_index('taxonomy_vocabulary', query, options);
  }
  catch (error) { console.log('taxonomy_vocabulary_index - ' + error); }
}

/**
 * Creates a user.
 * @param {Object} account
 * @param {Object} options
 */
function user_create(account, options) {
  try {
    options.method = 'POST';
    options.path = 'user.json';
    entity_create('user', null, account, options);
  }
  catch (error) { console.log('user_create - ' + error); }
}

/**
 * Retrieves a user.
 * @param {Number} ids
 * @param {Object} options
 */
function user_retrieve(ids, options) {
  try {
    options.method = 'GET';
    options.path = 'user/' + ids + '.json';
    entity_retrieve('user', ids, options);
  }
  catch (error) { console.log('user_retrieve - ' + error); }
}

/**
 * Registers a user.
 * @param {Object} account
 * @param {Object} options
 */
function user_register(account, options) {
  try {
    // TODO - it seems the user register resource only likes data string... ?
    Drupal.services.call({
        method: 'POST',
        path: 'user/register.json',
        data: entity_assemble_data('user', null, account, options),
        //data: JSON.stringify({'account':account}), // wrapper
        //data: JSON.stringify(account),
        success: function(data) {
          if (options.success) { options.success(data); }
        },
        error: function(xhr, status, message) {
          if (status == 406) {
            console.log(
              'user_register - Already logged in, cannot register user!'
            );
          }
          if (options.error) { options.error(xhr, status, message); }
        }
    });
  }
  catch (error) { console.log('user_retrieve - ' + error); }
}

/**
 * Updates a user.
 * @param {Object} account
 * @param {Object} options
 */
function user_update(account, options) {
  try {
    options.method = 'PUT';
    options.path = 'user/' + account.uid + '.json';
    entity_update('user', null, account, options);
  }
  catch (error) { console.log('user_update - ' + error); }
}

/**
 * Delete a user.
 * @param {Number} uid
 * @param {Object} options
 */
function user_delete(uid, options) {
  try {
    Drupal.services.call({
        method: 'DELETE',
        path: 'user/' + uid + '.json',
        success: function(data) {
          if (options.success) { options.success(data); }
        },
        error: function(xhr, status, message) {
          if (options.error) { options.error(xhr, status, message); }
        }
    });
  }
  catch (error) { console.log('user_delete - ' + error); }
}

/**
 * Perform a user index.
 * @param {Object} query
 * @param {Object} options
 */
function user_index(query, options) {
  try {
    entity_index('user', query, options);
  }
  catch (error) { console.log('user_index - ' + error); }
}

/**
 * Login user.
 * @param {String} name
 * @param {String} pass
 * @param {Object} options
 */
function user_login(name, pass, options) {
  try {
    Drupal.services.call({
        method: 'POST',
        path: 'user/login.json',
        data: 'username=' + encodeURIComponent(name) +
             '&password=' + encodeURIComponent(pass),
        success: function(data) {
          Drupal.user = data.user;
          // Now that we are logged in, we need to get a new CSRF token.
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
                console.log('user_login - ' + token_url + ' - ' + title);
                console.log(token_request.responseText);
              }
              else { // OK
                // Save the token to local storage as sessid, set Drupal.sessid
                // with the token, then return the user login data to the
                // success function.
                //token = JSON.parse(token_request.responseText);
                token = token_request.responseText;
                window.localStorage.setItem('sessid', token);
                Drupal.sessid = token;
                if (options.success) { options.success(data); }
              }
            }
            else {
              console.log(
                'user_login token_request.readyState = ' +
                token_request.readyState
              );
            }
          };

          // Open the token request.
          token_request.open('GET', token_url, true);

          // Send the token request.
          token_request.send(null);
        },
        error: function(xhr, status, message) {
          if (options.error) { options.error(xhr, status, message); }
        }
    });
  }
  catch (error) {
    console.log('user_login - ' + error);
  }
}

/**
 * Logout current user.
 * @param {Object} options
 */
function user_logout(options) {
  try {
    Drupal.services.call({
        method: 'POST',
        path: 'user/logout.json',
        success: function(data) {
          Drupal.user = drupal_user_defaults();
          Drupal.sessid = null;
          window.localStorage.removeItem('sessid');
          if (options.success) { options.success(data); }
        },
        error: function(xhr, status, message) {
          if (options.error) { options.error(xhr, status, message); }
        }
    });
  }
  catch (error) {
    console.log('user_login - ' + error);
  }
}

