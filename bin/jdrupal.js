// Initialize the Drupal JSON object.
var Drupal = Drupal || drupal_init();

/**
 * Init sessid to null.
 */
Drupal.sessid = null;

/**
 * Init csrf_token bool to false.
 */
Drupal.csrf_token = false;

/**
 * Initialize a Drupal user JSON object.
 */
Drupal.user = drupal_user_defaults();

/**
 * Given a JSON object or string, this will print it to the console.
 * @param {Object} data
 */
function dpm(data) {
  try {
    if (data) {
      if (typeof data === 'object') { console.log(JSON.stringify(data)); }
      else { console.log(data); }
    }
  }
  catch (error) { console.log('dpm - ' + error); }
}

/**
 * Returns a default JSON object for Drupal.
 * @return {Object}
 */
function drupal_init() {
  try {
    return {
      settings: {
        base_path: '/',
        cache: {
          entity: {
            enabled: false,
            expiration: 3600
          }
        },
        endpoint: '',
        file_public_path: 'sites/default/files',
        language_default: 'und',
        site_path: ''
      }
    };
  }
  catch (error) { console.log('drupal_init - ' + error); }
}

/**
 * Returns a default JSON object representing an anonymous Drupal user account.
 * @return {Object}
 */
function drupal_user_defaults() {
  try {
    return {
      'uid': '0',
      'roles': {'1': 'anonymous user'}
    };
  }
  catch (error) { console.log('drupal_user_defaults - ' + error); }
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
      case 500: title = 'Internal Server Error'; break;
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
  try {
    return (haystack.indexOf(needle) > -1);
  }
  catch (error) { console.log('in_array - ' + error); }
}

/**
 * Given an argument, this will return true if it is an int, false otherwise.
 * @param {Number} n
 * @return {Boolean}
 */
function is_int(n) {
  // Credit: http://stackoverflow.com/a/3886106/763010
  if (typeof n === 'string') {
    n = parseInt(n);
  }
  return typeof n === 'number' && n % 1 == 0;
}

/**
 * Get the default language from Drupal.settings.
 * @return {String}
 */
function language_default() {
  try {
    if (Drupal.settings.language_default &&
      Drupal.settings.language_default != '') {
      return Drupal.settings.language_default;
    }
    return 'und';
  }
  catch (error) { console.log('language_default - ' + error); }
}

/**
 * Javascript equivalent of php's time() function.
 * @return {Number}
 */
function time() {
  var d = new Date();
  return Math.floor(d / 1000);
}

/**
 * Given a string, this will change the first character to upper case and return
 * the new string.
 * @param {String} str
 * @return {String}
 */
function ucfirst(str) {
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   bugfixed by: Onno Marsman
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: ucfirst('kevin van zonneveld');
  // *     returns 1: 'Kevin van zonneveld'
  str += '';
  var f = str.charAt(0).toUpperCase();
  return f + str.substr(1);
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
 * Given an entity type and the entity id, this will return the local storage
 * key to be used when saving/loading the entity from local storage.
 * @param {String} entity_type
 * @param {Number} id
 * @return {String}
 */
function entity_local_storage_key(entity_type, id) {
  try {
    return entity_type + '_' + id;
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Loads an entity.
 * @param {String} entity_type
 * @param {Number} ids
 * @param {Object} options
 */
function entity_load(entity_type, ids, options) {
  try {
    if (!is_int(ids)) {
      // @todo - if an array of ints is sent in, call entity_index() instead.
      alert('entity_load(' + entity_type + ') - only single ids supported!');
      return;
    }
    var entity_id = ids;
    // If entity caching is enabled, try to load the entity from local storage.
    // If a copy is available in local storage, send it to the success callback.
    var entity = false;
    if (Drupal.settings.cache.entity && Drupal.settings.cache.entity.enabled) {
      entity = _entity_local_storage_load(entity_type, entity_id, options);
      if (entity) {
        if (options.success) { options.success(entity); }
        return;
      }
    }

    // Verify the entity type is supported.
    if (!in_array(entity_type, entity_types())) {
      var message = 'WARNING: entity_load - unsupported type: ' + entity_type;
      console.log(message);
      if (options.error) { options.error(null, null, message); }
      return;
    }

    // We didn't load the entity from local storage. Let's grab it from the
    // Drupal server instead. First, let's build the call options.
    var primary_key = entity_primary_key(entity_type);
    var call_options = {
      success: function(data) {
        try {
          // Set the entity equal to the returned data.
          entity = data;
          // Is entity caching enabled?
          if (Drupal.settings.cache.entity &&
              Drupal.settings.cache.entity.enabled) {
            // Set the expiration time as a property on the entity that can be
            // used later.
            if (Drupal.settings.cache.entity.expiration !== 'undefined') {
              var expiration = time() + Drupal.settings.cache.entity.expiration;
              if (Drupal.settings.cache.entity.expiration == 0) {
                expiration = 0;
              }
              entity.expiration = expiration;
            }
            // Save the entity to local storage.
            _entity_local_storage_save(entity_type, entity_id, entity);
          }
          // Send the entity back to the caller's success callback function.
          if (options.success) { options.success(entity); }
        }
        catch (error) {
          console.log('entity_load - success - ' + error);
        }
      },
      error: function(xhr, status, message) {
        try {
          if (options.error) { options.error(xhr, status, message); }
        }
        catch (error) {
          console.log('entity_load - error - ' + error);
        }
      }
    };

    // Finally, determine the entity's retrieve function and call it.
    var function_name = entity_type + '_retrieve';
    if (function_exists(function_name)) {
      call_options[primary_key] = entity_id;
      var fn = window[function_name];
      fn(ids, call_options);
    }
    else {
      console.log('WARNING: ' + function_name + '() does not exist!');
    }
  }
  catch (error) { console.log('entity_load - ' + error); }
}

/**
 * An internal function used by entity_load() to attempt loading an entity
 * from local storage.
 * @param {String} entity_type
 * @param {Number} entity_id
 * @param {Object} options
 * @return {Object}
 */
function _entity_local_storage_load(entity_type, entity_id, options) {
  try {
    var entity = false;
    // Process options if necessary.
    if (options) {
      // If we are resetting, remove the item from localStorage.
      if (options.reset) {
        _entity_local_storage_delete(entity_type, entity_id);
      }
    }
    // Attempt to load the entity from local storage.
    var local_storage_key = entity_local_storage_key(entity_type, entity_id);
    entity = window.localStorage.getItem(local_storage_key);
    if (entity) {
      entity = JSON.parse(entity);
      // We successfully loaded the entity from local storage. If it expired
      // remove it from local storage then continue onward with the entity
      // retrieval from Drupal. Otherwise return the local storage entity copy.
      if (typeof entity.expiration !== 'undefined' &&
          entity.expiration != 0 &&
          time() > entity.expiration) {
        _entity_local_storage_delete(entity_type, entity_id);
        entity = false;
      }
      else {

        // @todo - this code belongs to DrupalGap! Figure out how to bring the
        // idea of DrupalGap modules into jDrupal that way jDrupal can provide
        // a hook for DrupalGap to take care of this code!

        // The entity has not yet expired. If the current page options
        // indicate reloadingPage is true (and the reset option wasn't set to
        // false) then we'll grab a fresh copy of the entity from Drupal.
        // If the page is reloading and the developer didn't call for a reset,
        // then just return the cached copy.
        if (drupalgap && drupalgap.page.options &&
          drupalgap.page.options.reloadingPage) {
          // Reloading page... cached entity is still valid.
          if (typeof drupalgap.page.options.reset !== 'undefined' &&
            drupalgap.page.options.reset == false) {
            // We were told to not reset it, so we'll use the cached copy.
            return entity;
          }
          else {
            // Remove the entity from local storage and reset it.
            _entity_local_storage_delete(entity_type, entity_id);
            entity = false;
          }
        }
      }
    }
    return entity;
  }
  catch (error) { console.log('_entity_load_from_local_storage - ' + error); }
}

/**
 * An internal function used to save an entity to local storage.
 * @param {String} entity_type
 * @param {Number} entity_id
 * @param {Object} entity
 */
function _entity_local_storage_save(entity_type, entity_id, entity) {
  try {
    window.localStorage.setItem(
      entity_local_storage_key(entity_type, entity_id),
      JSON.stringify(entity)
    );
  }
  catch (error) { console.log('_entity_local_storage_save - ' + error); }
}

/**
 * An internal function used to delete an entity from local storage.
 * @param {String} entity_type
 * @param {Number} entity_id
 */
function _entity_local_storage_delete(entity_type, entity_id) {
  try {
    var storage_key = entity_local_storage_key(
      entity_type,
      entity_id
    );
    window.localStorage.removeItem(storage_key);
  }
  catch (error) { console.log('_entity_local_storage_delete - ' + error); }
}

/**
 * Returns an entity type's primary key.
 * @param {String} entity_type
 * @return {String}
 */
function entity_primary_key(entity_type) {
  try {
    var key;
    switch (entity_type) {
      case 'comment': key = 'cid'; break;
      case 'file': key = 'fid'; break;
      case 'node': key = 'nid'; break;
      case 'taxonomy_term': key = 'tid'; break;
      case 'taxonomy_vocabulary': key = 'vid'; break;
      case 'user': key = 'uid'; break;
      default:
        console.log(
          'entity_primary_key - unsupported entity type (' + entity_type + ')'
        );
        break;
    }
    return key;
  }
  catch (error) { console.log('entity_primary_key - ' + error); }
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
 * Returns an array of entity type names.
 * @return {Array}
 */
function entity_types() {
  try {
    return [
      'comment',
      'file',
      'node',
      'taxonomy_term',
      'taxonomy_vocabulary',
      'user'
    ];
  }
  catch (error) { console.log('entity_types - ' + error); }
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
      try {
        if (request.readyState == 4) {
          // Build a human readable response title.
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
              var message = request.responseText || '';
              if (!message || message == '') { message = title; }
              options.error(request, request.status, message);
            }
          }
        }
        else {
          console.log(
            'Drupal.services.call - request.readyState = ' + request.readyState
          );
        }
      }
      catch (error) {
        console.log('Drupal.services.call - onload - ' + error);
      }
    };

    // Get the CSRF Token and Make the Request.
    services_get_csrf_token({
        debug: options.debug,
        success: function(token) {
          try {
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
    if (options.reset) {
      Drupal.sessid = null;
    }

    // Do we already have a token? If we do, return it the success callback.
    if (Drupal.sessid) {
      token = Drupal.sessid;
      if (options.debug) { dpm('Loaded token from Drupal JSON object!'); }
    }
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
            if (options.debug) { dpm('Grabbed token from Drupal site!'); }
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
 * Creates a comment.
 * @param {Object} comment
 * @param {Object} options
 */
function comment_create(comment, options) {
  try {
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
    entity_delete('comment', cid, options);
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
        method: 'POST',
        path: entity_type + '.json',
        data: entity_assemble_data(entity_type, bundle, entity, options),
        success: function(data) {
          try {
            if (options.success) { options.success(data); }
          }
          catch (error) { console.log('entity_create - success - ' + error); }
        },
        error: function(xhr, status, message) {
          try {
            if (options.error) { options.error(xhr, status, message); }
          }
          catch (error) { console.log('entity_create - error - ' + error); }
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
        method: 'GET',
        path: entity_type + '/' + ids + '.json',
        success: function(data) {
          try {
            if (options.success) { options.success(data); }
          }
          catch (error) { console.log('entity_retrieve - success - ' + error); }
        },
        error: function(xhr, status, message) {
          try {
            if (options.error) { options.error(xhr, status, message); }
          }
          catch (error) { console.log('entity_retrieve - error - ' + error); }
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
    var entity_wrapper = _entity_wrap(entity_type, entity);
    var primary_key = entity_primary_key(entity_type);
    Drupal.services.call({
        method: 'PUT',
        path: entity_type + '/' + entity[primary_key] + '.json',
        data: JSON.stringify(entity_wrapper),
        success: function(data) {
          try {
            _entity_local_storage_delete(entity_type, entity[primary_key]);
            if (options.success) { options.success(data); }
          }
          catch (error) { console.log('entity_update - success - ' + error); }
        },
        error: function(xhr, status, message) {
          try {
            if (options.error) { options.error(xhr, status, message); }
          }
          catch (error) { console.log('entity_update - error - ' + error); }
        }
    });
  }
  catch (error) { console.log('entity_update - ' + error); }
}

/**
 * Deletes an entity.
 * @param {String} entity_type
 * @param {Number} entity_id
 * @param {Object} options
 */
function entity_delete(entity_type, entity_id, options) {
  try {
    Drupal.services.call({
        method: 'DELETE',
        path: entity_type + '/' + entity_id + '.json',
        success: function(data) {
          try {
            _entity_local_storage_delete(entity_type, entity_id);
            if (options.success) { options.success(data); }
          }
          catch (error) { console.log('entity_delete - success - ' + error); }
        },
        error: function(xhr, status, message) {
          try {
            if (options.error) { options.error(xhr, status, message); }
          }
          catch (error) { console.log('entity_delete - error - ' + error); }
        }
    });
  }
  catch (error) { console.log('entity_delete - ' + error); }
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
        success: function(result) {
          try {
            if (options.success) { options.success(result); }
          }
          catch (error) { console.log('entity_index - success - ' + error); }
        },
        error: function(xhr, status, message) {
          try {
            if (options.error) { options.error(xhr, status, message); }
          }
          catch (error) { console.log('entity_index - error - ' + error); }
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
 * Wraps an entity in a JSON object, keyed by its type.
 * @param {String} entity_type
 * @param {Object} entity
 * @return {String}
 */
function _entity_wrap(entity_type, entity) {
  try {
    // We don't wrap taxonomy or users.
    var entity_wrapper = {};
    if (entity_type == 'taxonomy_term' ||
      entity_type == 'taxonomy_vocabulary' ||
      entity_type == 'user') {
      entity_wrapper = entity;
    }
    else { entity_wrapper[entity_type] = entity; }
    return entity_wrapper;
  }
  catch (error) { console.log('_entity_wrap - ' + error); }
}

/**
 * Creates a node.
 * @param {Object} node
 * @param {Object} options
 */
function node_create(node, options) {
  try {
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
    entity_delete('node', nid, options);
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

    // Build a system connect object.
    var system_connect = {
      method: 'POST',
      path: 'system/connect.json',
      success: function(data) {
        try {
          Drupal.user = data.user;
          if (options.success) { options.success(data); }
        }
        catch (error) { console.log('system_connect - success - ' + error); }
      },
      error: function(xhr, status, message) {
        try {
          if (options.error) { options.error(xhr, status, message); }
        }
        catch (error) { console.log('system_connect - error - ' + error); }
      }
    };

    // If we don't have a token, grab one first.
    if (!Drupal.csrf_token) {
      services_get_csrf_token({
          success: function(token) {
            try {
              if (options.debug) { console.log('Grabbed new token.'); }
              // Now that we have a token, make the system connect call.
              Drupal.csrf_token = true;
              Drupal.services.call(system_connect);
            }
            catch (error) {
              console.log(
                'system_connect - services_csrf_token - success - ' + message
              );
            }
          },
          error: function(xhr, status, message) {
            try {
              if (options.error) { options.error(xhr, status, message); }
            }
            catch (error) {
              console.log(
                'system_connect - services_csrf_token - error - ' + message
              );
            }
          }
      });
    }
    else {
      // We already have a token, make the system connect call.
      if (options.debug) { console.log('Token already available.'); }
      Drupal.services.call(system_connect);
    }
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
    entity_delete('taxonomy_term', tid, options);
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
    // Set a default machine name if one wasn't provided.
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
    entity_delete('taxonomy_vocabulary', vid, options);
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
    entity_retrieve('user', ids, options);
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
    entity_delete('user', uid, options);
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
 * Registers a user.
 * @param {Object} account
 * @param {Object} options
 */
function user_register(account, options) {
  try {
    // TODO - it seems the user register resource only likes data strings... ?
    Drupal.services.call({
        method: 'POST',
        path: 'user/register.json',
        data: entity_assemble_data('user', null, account, options),
        success: function(data) {
          try {
            if (options.success) { options.success(data); }
          }
          catch (error) { console.log('user_register - success - ' + error); }
        },
        error: function(xhr, status, message) {
          try {
            if (status == 406) {
              console.log(
                'user_register - Already logged in, cannot register user!'
              );
            }
            if (options.error) { options.error(xhr, status, message); }
          }
          catch (error) { console.log('user_register - error - ' + error); }
        }
    });
  }
  catch (error) { console.log('user_retrieve - ' + error); }
}

/**
 * Login user.
 * @param {String} name
 * @param {String} pass
 * @param {Object} options
 */
function user_login(name, pass, options) {
  try {
    var valid = true;
    if (!name || typeof name !== 'string') {
      valid = false;
      console.log('user_login - invalid name');
    }
    if (!pass || typeof pass !== 'string') {
      valid = false;
      console.log('user_login - invalid pass');
    }
    if (!valid) {
      if (options.error) { options.error(null, 406, 'user_login - bad input'); }
      return;
    }
    Drupal.services.call({
        method: 'POST',
        path: 'user/login.json',
        data: 'username=' + encodeURIComponent(name) +
             '&password=' + encodeURIComponent(pass),
        success: function(data) {
          try {
            // Now that we are logged in, we need to get a new CSRF token.
            Drupal.user = data.user;
            Drupal.sessid = null;
            services_get_csrf_token({
                success: function(token) {
                  try {
                    if (options.success) { options.success(data); }
                  }
                  catch (error) {
                    console.log(
                      'user_login - services_get_csrf_token - success - ' +
                      error
                    );
                  }
                },
                error: function(xhr, status, message) {
                  console.log(
                    'user_login - services_get_csrf_token - error - ' +
                    message
                  );
                  if (options.error) { options.error(xhr, status, message); }
                }
            });
          }
          catch (error) { console.log('user_login - success - ' + error); }
        },
        error: function(xhr, status, message) {
          try {
            if (options.error) { options.error(xhr, status, message); }
          }
          catch (error) { console.log('user_login - error - ' + error); }
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
          try {
            // Now that we logged out, clear the sessid and call system connect.
            Drupal.user = drupal_user_defaults();
            Drupal.sessid = null;
            system_connect({
                success: function(result) {
                  try {
                    if (options.success) { options.success(data); }
                  }
                  catch (error) {
                    console.log(
                      'user_logout - system_connect - success - ' +
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
                      'user_logout - system_connect - error - ' +
                      error
                    );
                  }
                }
            });
          }
          catch (error) { console.log('user_logout - success - ' + error); }
        },
        error: function(xhr, status, message) {
          try {
            if (options.error) { options.error(xhr, status, message); }
          }
          catch (error) { console.log('user_logout - error - ' + error); }
        }
    });
  }
  catch (error) {
    console.log('user_login - ' + error);
  }
}

