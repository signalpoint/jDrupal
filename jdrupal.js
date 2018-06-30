// Initialize the jDrupal JSON object and run the bootstrap, if necessary.
var jDrupal = {}; drupal_init();
// @deprecated The name Drupal will be removed in the future. Use jDrupal
// instead.
if (!Drupal) { var Drupal = jDrupal; }

/**
 * Initializes the jDrupal JSON object.
 */
function drupal_init() {
  try {
    if (!jDrupal) { jDrupal = {}; }

    // General properties.
    jDrupal.csrf_token = false;
    jDrupal.sessid = null;
    jDrupal.user = drupal_user_defaults();

    // Settings.
    jDrupal.settings = {
      app_directory: 'app',
      base_path: '/',
      cache: {
        entity: {
          enabled: false,
          expiration: 3600
        },
        views: {
          enabled: false,
          expiration: 3600
        }
      },
      debug: false,
      endpoint: '',
      file_public_path: 'sites/default/files',
      language_default: 'und',
      site_path: ''
    };
    // Includes. Although we no longer dynamically load the includes, we want
    // to place them each in their own JSON object, so we have an easy way to
    // access them.
    jDrupal.includes = {};
    jDrupal.includes['module'] = {};
    // Modules. Although we no longer dynamically load the core modules, we want
    // to place them each in their own JSON object, so we have an easy way to
    // access them.
    jDrupal.modules = {
      core: {},
      contrib: {},
      custom: {}
    };
    // Build a JSON object to house the entity service request queues. This is
    // used to prevent async calls to the same resource from piling up and
    // making duplicate requests.
    // @TODO - this needs to be dynamic, what about custom entity types?
    jDrupal.services_queue = {
      comment: {
        retrieve: {}
      },
      file: {
        retrieve: {}
      },
      node: {
        retrieve: {}
      },
      taxonomy_term: {
        retrieve: {}
      },
      taxonomy_vocabulary: {
        retrieve: {}
      },
      user: {
        retrieve: {}
      }
    };

    // Build a JSON object to house cache expiration indices.
    jDrupal.cache_expiration = window.localStorage.getItem('cache_expiration');
    if (!jDrupal.cache_expiration) {

      jDrupal.cache_expiration = {

        // Entities will expire by a key value (key timestamp) pair
        entities: {}

      };
    }
    else { jDrupal.cache_expiration = JSON.parse(jDrupal.cache_expiration); }

  }
  catch (error) { console.log('drupal_init - ' + error); }
}

/**
 * Equivalent to PHP's date function. You may optionally pass in a second int
 * timestamp argument (number of milliseconds since epoch, not the number of
 * seconds since the epoch) to format that particular time, otherwise it'll
 * default to the current time.
 * @param {String} format The format of the outputted date string.
 * @return {String}
 * @see http://php.net/manual/en/function.date.php
 */
function date(format) {
  try {
    // @TODO - create a github repo for this function.
    // Let's figure out the timestamp and date.
    var d = null;
    var timestamp = null;
    if (arguments[1]) {
      timestamp = arguments[1];
      if (typeof timestamp === 'string') { timestamp = parseInt(timestamp); }
      d = new Date(timestamp);
    }
    else {
      d = new Date();
      timestamp = d.getTime();
    }
    var result = '';
    var grab_next = false;
    for (var i = 0; i < format.length; i++) {
      var character = format.charAt(i);
      if (grab_next) {
          result += character;
          grab_next = false;
          continue;
      }
      switch (character) {

        // Escape character.
        case '\\':
          grab_next = true;
          break;

        /* DAY */

        // Day of the month, 2 digits with leading zeros: 01 to 31
        case 'd':
          var day = '' + d.getDate();
          if (day.length == 1) { day = '0' + day; }
          result += day;
          break;

        // A textual representation of a day, three letters: Mon through Sun
        case 'D':
          var day = d.getDay();
          switch (day) {
            case 0: result += 'Sun'; break;
            case 1: result += 'Mon'; break;
            case 2: result += 'Tue'; break;
            case 3: result += 'Wed'; break;
            case 4: result += 'Thu'; break;
            case 5: result += 'Fri'; break;
            case 6: result += 'Sat'; break;
          }
          break;

        // Day of the month without leading zeros: 1 to 31
        case 'j': result += d.getDate(); break;

        // A full textual representation of the day of the week: Sunday through
        // Saturday
        case 'l':
          var day = d.getDay();
          switch (day) {
            case 0: result += 'Sunday'; break;
            case 1: result += 'Monday'; break;
            case 2: result += 'Tuesday'; break;
            case 3: result += 'Wednesday'; break;
            case 4: result += 'Thursday'; break;
            case 5: result += 'Friday'; break;
            case 6: result += 'Saturday'; break;
          }
          break;

        // 1 (for Monday) through 7 (for Sunday)
        case 'N':
          result += d.getDay() + 1;
          break;

        // 0 (for Sunday) through 6 (for Saturday)
        case 'w':
          result += d.getDay();
          break;

        /* WEEK */

        /* MONTH */

        // A full textual representation of a month, such as January or March:
        // January through December
        case 'F':
          switch (d.getMonth()) {
            case 0: result += 'January'; break;
            case 1: result += 'February'; break;
            case 2: result += 'March'; break;
            case 3: result += 'April'; break;
            case 4: result += 'May'; break;
            case 5: result += 'June'; break;
            case 6: result += 'July'; break;
            case 7: result += 'August'; break;
            case 8: result += 'September'; break;
            case 9: result += 'October'; break;
            case 10: result += 'November'; break;
            case 11: result += 'December'; break;
          }
          break;

        // Numeric representation of a month, with leading zeros: 01 through 12
        case 'm':
          var month = '' + (d.getMonth() + 1);
          if (month.length == 1) { month = '0' + month; }
          result += month;
          break;

        // A short textual representation of a month, three letters
        case 'M':
          switch (d.getMonth()) {
            case 0: result += 'Jan'; break;
            case 1: result += 'Feb'; break;
            case 2: result += 'Mar'; break;
            case 3: result += 'Apr'; break;
            case 4: result += 'May'; break;
            case 5: result += 'Jun'; break;
            case 6: result += 'Jul'; break;
            case 7: result += 'Aug'; break;
            case 8: result += 'Sep'; break;
            case 9: result += 'Oct'; break;
            case 10: result += 'Nov'; break;
            case 11: result += 'Dec'; break;
          }
          break;

        /* YEAR */

        // A full numeric representation of a year, 4 digits.
        // Examples: 1999 or 2003
        case 'Y':
          result += d.getFullYear();
          break;

        /* TIME */

        // Lowercase Ante meridiem and Post meridiem: am or pm
        case 'a':
        // Uppercase Ante meridiem and Post meridiem: AM or PM
        case 'A':
          var hours = d.getHours();
          if (hours < 12) { result += 'am'; }
          else { result += 'pm'; }
          if (character == 'A') { result = result.toUpperCase(); }
          break;

        // 12-hour format of an hour without leading zeros: 1 through 12
        case 'g':
          var hours = d.getHours();
          if (hours == 0 || hours == 23) { hours = 12; }
          else { hours = hours % 12; }
          result += '' + hours;
          break;

        // 24-hour format of an hour without leading zeros: 0 through 23
        case 'G':
          var hours = '' + d.getHours();
          result += hours;
          break;

        // 12-hour format of an hour with leading zeros: 01 through 12
        case 'h':
          var hours = '' + (d.getHours() % 12);
          if (hours == '0') { hours = '12'; }
          else if (hours.length == 1) { hours = '0' + hours; }
          result += hours;
          break;

        // 24-hour format of an hour with leading zeros: 00 through 23
        case 'H':
          var hours = '' + d.getHours();
          if (hours.length == 1) { hours = '0' + hours; }
          result += hours;
          break;

        // Minutes with leading zeros: 00 to 59
        case 'i':
          var minutes = '' + d.getMinutes();
          if (minutes.length == 1) { minutes = '0' + minutes; }
          result += minutes;
          break;

        // Seconds with leading zeros: 00 to 59
        case 's':
          var seconds = '' + d.getSeconds();
          if (seconds.length == 1) { seconds = '0' + seconds; }
          result += seconds;
          break;

        default:
          // Any characters that we don't know how to process, just place them
          // onto the result.
          result += character;
          break;
      }
    }
    return result;
  }
  catch (error) { console.log('date - ' + error); }
}

/**
 * Given a JSON object or string, this will print it to the console. It accepts
 * an optional boolean as second argument, if it is false the output sent to the
 * console will not use pretty printing in a Chrome/Ripple environment.
 * @param {Object} data
 */
function dpm(data) {
  try {

    if (typeof data !== 'undefined') {
      if (typeof parent.window.ripple === 'function') {
        if (typeof arguments[1] !== 'undefined' && arguments[1] == false) {
          console.log(JSON.stringify(data));
        }
        else {
          console.log(data);
        }
      }
      else if (typeof data === 'object') { console.log(JSON.stringify(data)); }
      if (data == '') { console.log('<empty-string>'); }
      else { console.log(data); }
    }
    else { console.log('<undefined>'); }

    // Show the caller name.
    //var caller = arguments.callee.caller.name + '()';
    //console.log(caller);

  }
  catch (error) { console.log('dpm - ' + error); }
}

/**
 * Returns a default JSON object representing an anonymous Drupal user account.
 * @return {Object}
 */
function drupal_user_defaults() {
  try {
    return {
      uid: '0',
      roles: {'1': 'anonymous user'},
      permissions: []
    };
  }
  catch (error) { console.log('drupal_user_defaults - ' + error); }
}

/**
 * Returns true if given value is empty. A generic way to test for emptiness.
 * @param {*} value
 * @return {Boolean}
 */
function empty(value) {
  try {
    if (value === null) { return true; }
    if (typeof value === 'object') { return Object.keys(value).length === 0; }
    return (typeof value === 'undefined' || value == '');
  }
  catch (error) { console.log('empty - ' + error); }
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
    // @todo - this can be replaced by using the statusText property on the XHR
    // object.
    //https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#Properties
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
 * @param {String|Number} needle
 * @param {Array} haystack
 * @return {Boolean}
 */
function in_array(needle, haystack) {
  try {
    if (typeof haystack === 'undefined') { return false; }
    if (typeof needle === 'string') { return (haystack.indexOf(needle) > -1); }
    else {
      var found = false;
      for (var i = 0; i < haystack.length; i++) {
        if (haystack[i] == needle) {
          found = true;
          break;
        }
      }
      return found;
    }
  }
  catch (error) { console.log('in_array - ' + error); }
}

/**
 * Given something, this will return true if it's an array, false otherwise.
 * @param {*} obj
 * @returns {boolean}
 * @see http://stackoverflow.com/a/1058753/763010
 */
function is_array(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}

/**
 * Given an argument, this will return true if it is an int, false otherwise.
 * @param {Number} n
 * @return {Boolean}
 */
function is_int(n) {
  // Credit: http://stackoverflow.com/a/3886106/763010
  if (typeof n === 'string') { n = parseInt(n); }
  return typeof n === 'number' && n % 1 == 0;
}

/**
 * Get the default language from jDrupal.settings.
 * @return {String}
 */
function language_default() {
  try {
    if (jDrupal.settings.language_default &&
      jDrupal.settings.language_default != '') {
      return jDrupal.settings.language_default;
    }
    return 'und';
  }
  catch (error) { console.log('language_default - ' + error); }
}

/**
 * Given a module name, this returns true if the module is enabled, false
 * otherwise.
 * @param {String} name The name of the module
 * @return {Boolean}
 */
function module_exists(name) {
  try {
    var exists = false;
    if (typeof jDrupal.modules.core[name] !== 'undefined') {
      exists = true;
    }
    else if (typeof jDrupal.modules.contrib[name] !== 'undefined') {
      exists = true;
    }
    else if (typeof jDrupal.modules.custom[name] !== 'undefined') {
      exists = true;
    }
    return exists;
  }
  catch (error) { console.log('module_exists - ' + error); }
}

/**
 * Shuffle an array.
 * @see http://stackoverflow.com/a/12646864/763010
 * @param {Array} array
 * @return {Array}
 */
function shuffle(array) {
  try {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }
  catch (error) { console.log('shuffle - ' + error); }
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
  // @see http://kevin.vanzonneveld.net
  // + original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // + bugfixed by: Onno Marsman
  // + improved by: Brett Zamir (http://brett-zamir.me)
  str += '';
  var f = str.charAt(0).toUpperCase();
  return f + str.substr(1);
}

/**
 * Determines which modules are implementing a hook. Returns an array with the
 * names of the modules which are implementing this hook. If no modules
 * implement the hook, it returns false.
 * @param {String} hook
 * @return {Array}
 */
function module_implements(hook) {
  try {
    var modules_that_implement = [];
    if (hook) {
      var bundles = module_types();
      for (var i = 0; i < bundles.length; i++) {
        var bundle = bundles[i];
        for (var module in jDrupal.modules[bundle]) {
          if (jDrupal.modules[bundle].hasOwnProperty(module)) {
            if (function_exists(module + '_' + hook)) {
              modules_that_implement.push(module);
            }
          }
        }
      }
    }
    if (modules_that_implement.length == 0) { return false; }
    return modules_that_implement;
  }
  catch (error) { console.log('module_implements - ' + error); }
}

/**
 * Given a module name and a hook name, this will invoke that module's hook.
 * @param {String} module
 * @param {String} hook
 * @return {*}
 */
function module_invoke(module, hook) {
  try {
    var module_invocation_results = null;
    if (module_load(module)) {
      var module_arguments = Array.prototype.slice.call(arguments);
      var function_name = module + '_' + hook;
      if (function_exists(function_name)) {
        // Get the hook function.
        var fn = window[function_name];
        // Remove the module name and hook from the arguments.
        module_arguments.splice(0, 2);
        // If there are no arguments, just call the hook directly, otherwise
        // call the hook and pass along all the arguments.
        if (Object.getOwnPropertyNames(module_arguments).length == 0) {
          module_invocation_results = fn();
        }
        else { module_invocation_results = fn.apply(null, module_arguments); }
      }
    }
    else {
      console.log(
        'WARNING: module_invoke() - Failed to load module: ' + module
      );
    }
    return module_invocation_results;
  }
  catch (error) { console.log('module_invoke - ' + error); }
}

var module_invoke_results = null;
var module_invoke_continue = null;
/**
 * Given a hook name, this will invoke all modules that implement the hook.
 * @param {String} hook
 * @return {Array}
 */
function module_invoke_all(hook) {
  try {
    // Prepare the invocation results.
    module_invoke_results = new Array();
    // Copy the arguments and remove the hook name from the first index so the
    // rest can be passed along to the hook.
    var module_arguments = Array.prototype.slice.call(arguments);
    module_arguments.splice(0, 1);
    // Try to fire the hook in every module.
    module_invoke_continue = true;
    var bundles = module_types();
    for (var i = 0; i < bundles.length; i++) {
      var bundle = bundles[i];
      for (var module in jDrupal.modules[bundle]) {
        if (jDrupal.modules[bundle].hasOwnProperty(module)) {
          var function_name = module + '_' + hook;
          if (function_exists(function_name)) {
            // If there are no arguments, just call the hook directly,
            // otherwise call the hook and pass along all the arguments.
            var invocation_results = null;
            if (module_arguments.length == 0) {
              invocation_results = module_invoke(module, hook);
            }
            else {
              // Place the module name and hook name on the front of the
              // arguments.
              module_arguments.unshift(module, hook);
              var fn = window['module_invoke'];
              invocation_results = fn.apply(null, module_arguments);
              module_arguments.splice(0, 2);
            }
            if (typeof invocation_results !== 'undefined') {
              module_invoke_results.push(invocation_results);
            }
          }
        }
      }
    }
    return module_invoke_results;
  }
  catch (error) { console.log('module_invoke_all - ' + error); }
}

/**
 * Given a module name, this will return the module inside jDrupal.modules, or
 * false if it fails to find it.
 * @param {String} name
 * @return {Object|Boolean}
 */
function module_load(name) {
  try {
    var bundles = module_types();
    for (var i = 0; i < bundles.length; i++) {
      var bundle = bundles[i];
      if (jDrupal.modules[bundle][name]) {
        return jDrupal.modules[bundle][name];
      }
    }
    return false;
  }
  catch (error) { console.log('module_load - ' + error); }
}

/**
 * Initializes and returns a JSON object template that all modules should use
 * when declaring themselves.
 * @param {String} name
 * @return {Object}
 */
function module_object_template(name) {
  try {
    return { 'name': name };
  }
  catch (error) { console.log('module_object_template - ' + error); }
}

/**
 * Returns an array of module type names.
 * @return {Array}
 */
function module_types() {
  try {
    return ['core', 'contrib', 'custom'];
  }
  catch (error) { console.log('module_types - ' + error); }
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
 * Checks if an entity has at least one item for a given field name. Optionally pass in a
 * language code and/or delta value, otherwise they default to 'und' and 0 respectively.
 * @param {Object} entity
 * @param {String} fieldName
 * @param {String} language
 * @param {Number} delta
 * @returns {Boolean}
 */
jDrupal.fieldHasItem = function(entity, fieldName, language, delta) {
  if (!language) { language = language_default(); }
  if (typeof delta === 'undefined') { delta = 0; }
  return entity[fieldName] &&
      entity[fieldName][language] &&
      entity[fieldName][language].length &&
      entity[fieldName][language][delta];
};

/**
 * Gets an item from an entity given field name. Optionally pass in a language code and/or
 * delta value, otherwise they default to 'und' and 0 respectively.
 * @param {Object} entity
 * @param {String} fieldName
 * @param {String} language
 * @param {Number} delta
 * @returns {*}
 */
jDrupal.fieldGetItem = function(entity, fieldName, language, delta) {
  if (!language) { language = language_default(); }
  if (typeof delta === 'undefined') { delta = 0; }
  return entity[fieldName][language][delta];
};

/**
 * Given an entity and field name, this will return how many items are on the field. Optionally
 * pass in a language code otherwise it defaults to 'und'.
 * @param {Object} entity
 * @param {String} fieldName
 * @param {String} language
 * @returns {Number}
 */
jDrupal.fieldGetItemCount = function(entity, fieldName, language) {
  return !language ?
      jDrupal.fieldGetItems(entity, fieldName).length :
      jDrupal.fieldGetItems(entity, fieldName, language).length;
};

/**
 * Gets items from an entity given a field name. Optionally pass in a language code otherwise
 * it defaults to 'und'.
 * @param {Object} entity
 * @param {String} fieldName
 * @param {String} language
 * @returns {*}
 */
jDrupal.fieldGetItems = function(entity, fieldName, language) {
  if (!language) { language = language_default(); }
  return entity[fieldName][language];
};

/**
 * Sets an item's property on an entity given a field and property name.
 * @param {Object} entity The entity object.
 * @param {String} fieldName The field name on the entity.
 * @param {String|null} propertyName The property name to set, usually 'value',  or null to set the entire
 *   item (advanced users, don't forget language code and delta value).
 * @param {*} value The value to set.
 * @param {String} language Optional language code, defaults to 'und'
 * @param {Number} delta Optional delta value, defaults to 0
 */
jDrupal.fieldSetItem = function(entity, fieldName, propertyName, value, language, delta) {
  if (!language) { language = language_default(); }
  if (typeof delta === 'undefined') { delta = 0; }
  if (!entity[fieldName]) { entity[fieldName] = {}; }
  if (propertyName) {
    if (!entity[fieldName][language]) { entity[fieldName][language] = []; }
    if (!entity[fieldName][language][delta]) { entity[fieldName][language][delta] = {}; }
    entity[fieldName][language][delta][propertyName] = value;
  }
  else { entity[fieldName][language][delta] = value; }
};

/**
 * Returns an array of entity type machine names configured with Services Entity in settings.js
 * @returns {Array}
 */
function services_entity_types() {
  var entityTypes = [];
  if (jDrupal.services_entity && jDrupal.services_entity.types) {
    for (var entityType in jDrupal.services_entity.types) {
      if (!jDrupal.services_entity.types.hasOwnProperty(entityType)) { continue; }
      entityTypes.push(entityType);
    }
  }
  return entityTypes;
}

/**
 * Readies the jDrupal.services_queue object with Services Entity configuration.
 */
function _services_entity_queue_init() {
  for (var entityType in jDrupal.services_entity.types) {
    if (!jDrupal.services_entity.types.hasOwnProperty(entityType)) { continue; }
    if (jDrupal.services_queue[entityType]) { continue; }
    jDrupal.services_queue[entityType] = {
      retrieve: {}
    };
  }
}

/**
 * Given an entity type and entity, this will return the bundle name as a
 * string for the given entity, or null if the bundle is N/A.
 * @param {String} entity_type The entity type.
 * @param {Object} entity The entity JSON object.
 * @return {*}
 */
function entity_get_bundle(entity_type, entity) {
  try {
    // @TODO This isn't dynamic at all.
    var bundle = null;
    switch (entity_type) {
      case 'node': bundle = entity.type; break;
      case 'taxonomy_term': bundle = entity.vid; break;
      case 'comment':
      case 'file':
      case 'user':
      case 'taxonomy_vocabulary':
        // These entity types don't have a bundle.
        break;
      default:
        if (in_array(entity_type, services_entity_types())) { return entity.type; }
        var msg = 'WARNING: entity_get_bundle - unsupported entity type (' +
          entity_type + ')';
        console.log(msg);
        break;
    }
    return bundle;
  }
  catch (error) { console.log('entity_get_bundle - ' + error); }
}

function entity_get_bundle_name(entity_type) {
  // @TODO Should be dynamic.
  var bundle = null;
  switch (entity_type) {
    case 'node': return 'type'; break;
    case 'taxonomy_term': return 'vid'; break;
    case 'comment': // @TODO comment has a node bundle, kind of
    case 'file':
    case 'user':
    case 'taxonomy_vocabulary':
    default:
      if (in_array(entity_type, services_entity_types())) { return 'type'; }
      return null;
      break;
  }
}

/**
 * Parses an entity id and returns it as an integer (not a string).
 * @param {*} entity_id
 * @return {Number}
 */
function entity_id_parse(entity_id) { return typeof entity_id === 'string' ? parseInt(entity_id) : entity_id; }

/**
 * Given an entity type and the entity id, this will return the local storage
 * key to be used when saving/loading the entity from local storage.
 * @param {String} entity_type
 * @param {Number} id
 * @return {String}
 */
function entity_local_storage_key(entity_type, id) { return entity_type + '_' + id; }

/**
 * A placeholder function used to provide a local storage key for entity index
 * queries.
 * @param {String} path
 * @return {String}
 */
function entity_index_local_storage_key(path) { return path; }

/**
 * Loads an entity.
 * @param {String} entity_type
 * @param {Number|Array} ids
 * @param {Object} options
 */
function entity_load(entity_type, ids, options) {
  try {
    var servicesEntityType = in_array(entity_type, services_entity_types());
    if (servicesEntityType) { _services_entity_queue_init(); }

    // If an array of entity ids was passed in, use the entity index resource to load them all.
    if (is_array(ids)) {
      var query = {
        parameters: {},
        options: {
          entity_load: true
        }
      };
      query.parameters[entity_primary_key(entity_type)] = ids.join(',');
      window[entity_type + '_index'](query, options);
      return;
    }

    // A single id was passed in, convert the id to an int, if it's a string.
    var entity_id = ids;
    entity_id = entity_id_parse(entity_id);

    var caching_enabled = entity_caching_enabled(entity_type);

    // If this entity is already queued for retrieval, set the success and
    // error callbacks aside, and return. Unless entity caching is enabled and
    // we have a copy of the entity in local storage, then send it to the
    // provided success callback.
    if (_services_queue_already_queued(entity_type, 'retrieve', entity_id, 'success')) {
      if (caching_enabled) {
        entity = _entity_local_storage_load(entity_type, entity_id, options);
        if (entity) {
          if (options.success) { options.success(entity); }
          return;
        }
      }
      if (typeof options.success !== 'undefined') {
        _services_queue_callback_add(entity_type, 'retrieve', entity_id, 'success', options.success);
      }
      if (typeof options.error !== 'undefined') {
        _services_queue_callback_add(entity_type, 'retrieve', entity_id, 'error', options.error);
      }
      return;
    }

    // This entity has not been queued for retrieval, queue it and its callback.
    _services_queue_add_to_queue(entity_type, 'retrieve', entity_id);
    _services_queue_callback_add(entity_type, 'retrieve', entity_id, 'success', options.success);

    // If entity caching is enabled, try to load the entity from local storage.
    // If a copy is available in local storage, bubble it to the success callback(s).
    var entity = false;
    if (caching_enabled) {
      entity = _entity_local_storage_load(entity_type, entity_id, options);
      if (entity) {
        _entity_callback_bubble(entity_type, entity_id, entity);
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

          // If entity caching is enabled, set its expiration time and save it to local storage.
          if (entity_caching_enabled(entity_type, entity_get_bundle(entity_type, entity))) {
            _entity_set_expiration_time(entity_type, entity);
            _entity_local_storage_save(entity_type, entity_id, entity);
          }

          _entity_callback_bubble(entity_type, entity_id, entity);

        }
        catch (error) { console.log('entity_load - success - ' + error); }
      },
      error: function(xhr, status, message) {
        try {
          // Since we had a problem loading the entity, clear out the success queue.
          _services_queue_clear(entity_type, 'retrieve', entity_id, 'success');
          // Pass along the error if anyone wants to handle it.
          if (options.error) { options.error(xhr, status, message); }
        }
        catch (error) { console.log('entity_load - error - ' + error); }
      }
    };

    // Finally, determine the entity's retrieve function and call it.

    var function_name = !servicesEntityType ? entity_type + '_retrieve' : 'entity_retrieve';
    if (function_exists(function_name)) {
      call_options[primary_key] = entity_id;
      var fn = window[function_name];
      if (servicesEntityType) {
        services_resource_defaults(call_options, entity_type, 'retrieve');
        fn(entity_type, ids, call_options);
      }
      else { fn(ids, call_options); }
    }
    else { console.log('WARNING: ' + function_name + '() does not exist!'); }
  }
  catch (error) { console.log('entity_load - ' + error); }
}

function _entity_callback_bubble(entity_type, entity_id, entity) {
  // Send the entity back to the queued callback(s), then clear out the callbacks.
  var _success_callbacks = jDrupal.services_queue[entity_type]['retrieve'][entity_id].success;
  for (var i = 0; i < _success_callbacks.length; i++) { _success_callbacks[i](entity); }
  _services_queue_clear(entity_type, 'retrieve', entity_id, 'success');
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
      if (entity_has_expired(entity_type, entity)) {
        _entity_local_storage_delete(entity_type, entity_id);
        entity = false;
      }
      else {

        // @TODO - this code belongs to DrupalGap! Figure out how to bring the
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
            drupalgap.page.options.reset === false) {
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
  catch (error) { console.log('_entity_local_storage_load - ' + error); }
}

/**
 * An internal function used to save an entity to local storage.
 * @param {String} entity_type
 * @param {Number} entity_id
 * @param {Object} entity
 */
function _entity_local_storage_save(entity_type, entity_id, entity) {
  try {
    var key = entity_local_storage_key(entity_type, entity_id);
    window.localStorage.setItem(key, JSON.stringify(entity));
    if (typeof jDrupal.cache_expiration.entities === 'undefined') { jDrupal.cache_expiration.entities = {}; }
    jDrupal.cache_expiration.entities[key] = entity.expiration;
    window.localStorage.setItem('cache_expiration', JSON.stringify(jDrupal.cache_expiration));
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
          if (in_array(entity_type, services_entity_types())) { return 'id'; }
        // Is anyone declaring the primary key for this entity type?
        var function_name = entity_type + '_primary_key';
        if (function_exists(function_name)) {
          var fn = window[function_name];
          key = fn(entity_type);
        }
        else {
          var msg = 'entity_primary_key - unsupported entity type (' +
            entity_type + ') - to add support, declare ' + function_name +
            '() and have it return the primary key column name as a string';
          console.log(msg);
        }
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
      case 'file':
        function_name = 'file_create';
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
      default:
        if (in_array(entity_type, services_entity_types())) {
          function_name = !entity[entity_primary_key(entity_type)] ? 'entity_create' : 'entity_update';
          window[function_name](entity_type, bundle, entity, options);
          return;
        }
        break;
    }
    if (function_name && function_exists(function_name)) {
      var fn = window[function_name];
      fn(entity, options);
    }
    else { console.log('WARNING: entity_save - unsupported type: ' + entity_type); }
  }
  catch (error) { console.log('entity_save - ' + error); }
}

/**
 * Returns true or false depending on whether caching is enabled or not. You
 * may optionally pass in an entity type as the first argument, and optionally
 * pass in a bundle name as a second argument to see if that particular cache
 * is enabled.
 * @return {Boolean}
 */
function entity_caching_enabled() {
  try {

    // First make sure entity caching is at least defined, then
    // make sure it's enabled.
    if (
      typeof jDrupal.settings.cache === 'undefined' ||
      typeof jDrupal.settings.cache.entity === 'undefined' ||
      !jDrupal.settings.cache.entity.enabled
    ) { return false; }

    // Entity caching is enabled globally...

    // Did they provide an entity type? If not, caching is enabled.
    var entity_type = arguments[0];
    if (!entity_type) { return true; }

    // Are there any entity type caching configs present? If not, caching is enabled.
    if (
        !jDrupal.settings.cache.entity.entity_types ||
        !jDrupal.settings.cache.entity.entity_types[entity_type]
    ) { return true; }

    // Grab the cache config for this entity type.
    var cache = jDrupal.settings.cache.entity.entity_types[entity_type];

    // Is caching explicitly disabled for this entity type?
    var entity_type_caching_disabled = typeof cache.enabled !== 'undefined' && cache.enabled === false;
    if (entity_type_caching_disabled) { return false; }

    // Did they provide a bundle? If not, then this entity type's caching is
    // enabled.
    var bundle = arguments[1];
    if (!bundle) { return true; }

    // Is caching explicitly disabled for this bundle?
    if (typeof cache.bundles !== 'undefined' && typeof cache.bundles[bundle] !== 'undefined') {
      return typeof cache.bundles[bundle].enabled !== 'undefined' ?
          cache.bundles[bundle].enabled : cache.enabled;
    }

    // We didn't prove caching to be disabled, so it must be enabled.
    return true;
  }
  catch (error) { console.log('entity_caching_enabled - ' + error); }
}

/**
 *
 * @param entity_type
 * @param entity
 */
function entity_has_expired(entity_type, entity) {
  return typeof entity.expiration !== 'undefined' && entity.expiration != 0 && time() > entity.expiration;
}

/**
 * Looks for expired entities and remove them from local storage.
 */
function entity_clean_local_storage() {
  if (!jDrupal.cache_expiration.entities) { return; }
  for (var key in jDrupal.cache_expiration.entities) {
    if (!jDrupal.cache_expiration.entities.hasOwnProperty(key)) { continue; }
    var expiration = jDrupal.cache_expiration.entities[key];
    if (expiration > time()) { continue; }
    delete jDrupal.cache_expiration.entities[key];
    var parts = key.split('_');
    var entity_type = parts[0];
    var entity_id = parts[1];
    _entity_local_storage_delete(entity_type, entity_id);
    window.localStorage.setItem('cache_expiration', JSON.stringify(jDrupal.cache_expiration));
  }
}

/**
 * An internal function used to get the expiration time for entities.
 * @param entity_type
 * @param entity
 * @returns {null|Number}
 * @private
 */
function _entity_get_expiration_time(entity_type, entity) {
  try {
    var expiration = null;
    var bundle = entity_get_bundle(entity_type, entity);
    if (entity_caching_enabled(entity_type, bundle)) {
      var expiration = 0;
      var cache = jDrupal.settings.cache;
      if (cache.entity.expiration !== 'undefined') {
        expiration = cache.entity.expiration;
      }
      if (cache.entity.entity_types !== 'undefined') {
        if (
            cache.entity.entity_types[entity_type] &&
            typeof cache.entity.entity_types[entity_type].expiration !== 'undefined'
        ) { expiration = cache.entity.entity_types[entity_type].expiration; }
        if (
            bundle &&
            cache.entity.entity_types[entity_type] &&
            cache.entity.entity_types[entity_type].bundles &&
            cache.entity.entity_types[entity_type].bundles[bundle] &&
            typeof cache.entity.entity_types[entity_type].bundles[bundle].expiration !== 'undefined'
        ) { expiration = cache.entity.entity_types[entity_type].bundles[bundle].expiration; }
      }
    }
    if (expiration) { expiration += time(); }
    return expiration;
  }
  catch (error) { console.log('_entity_get_expiration_time - ' + error); }
}

/**
 * An internal function used to set the expiration time onto a given entity.
 * @param {String} entity_type The entity type.
 * @param {Object} entity The entity object.
 */
function _entity_set_expiration_time(entity_type, entity) {
  try {
    entity.expiration = _entity_get_expiration_time(entity_type, entity);
  }
  catch (error) { console.log('_entity_set_expiration_time - ' + error); }
}

/**
 * Returns an array of entity type names.
 * @return {Array}
 */
function entity_types() {
  // Start with core entity types.
  var entityTypes = [
    'comment',
    'file',
    'node',
    'taxonomy_term',
    'taxonomy_vocabulary',
    'user'
  ];
  // Append and Services Entity types.
  var servicesEntityTypes = services_entity_types();
  if (servicesEntityTypes.length) {
    entityTypes.push.apply(entityTypes, servicesEntityTypes);
  }
  return entityTypes;
}

/**
 * An internal function used by entity_index() to attempt loading a specific
 * query's results from local storage.
 * @param {String} entity_type
 * @param {String} path The URL path used by entity_index(), used as the cache
 *  key.
 * @param {Object} options
 * @return {Object}
 */
function _entity_index_local_storage_load(entity_type, path, options) {
  try {
    var _entity_index = false;
    // Process options if necessary.
    if (options) {
      // If we are resetting, remove the item from localStorage.
      if (options.reset) {
        _entity_index_local_storage_delete(path);
      }
    }
    // Attempt to load the entity_index from local storage.
    var local_storage_key = entity_index_local_storage_key(path);
    _entity_index = window.localStorage.getItem(local_storage_key);
    if (_entity_index) {
      _entity_index = JSON.parse(_entity_index);
      // We successfully loaded the entity_index result ids from local storage.
      // If it expired remove it from local storage then continue onward with
      // the entity_index retrieval from Drupal. Otherwise return the local
      // storage entity_index copy.
      if (typeof _entity_index.expiration !== 'undefined' &&
          _entity_index.expiration != 0 &&
          time() > _entity_index.expiration) {
        _entity_index_local_storage_delete(path);
        _entity_index = false;
      }
      else {
        // The entity_index has not yet expired, so pull each entity out of
        // local storage, add them to the result array, and return the array.
        var result = [];
        for (var i = 0; i < _entity_index.entity_ids.length; i++) {
          result.push(
            _entity_local_storage_load(
              entity_type,
              _entity_index.entity_ids[i],
              options
            )
          );
        }
        _entity_index = result;
      }
    }
    return _entity_index;
  }
  catch (error) { console.log('_entity_index_local_storage_load - ' + error); }
}

/**
 * An internal function used to save an entity_index result entity ids to
 * local storage.
 * @param {String} entity_type
 * @param {String} path
 * @param {Object} result
 */
function _entity_index_local_storage_save(entity_type, path, result) {
  try {
    var index = {
      entity_type: entity_type,
      expiration: _entity_get_expiration_time(),
      entity_ids: []
    };
    for (var i = 0; i < result.length; i++) {
      index.entity_ids.push(result[i][entity_primary_key(entity_type)]);
    }
    window.localStorage.setItem(
      entity_index_local_storage_key(path),
      JSON.stringify(index)
    );
  }
  catch (error) { console.log('_entity_index_local_storage_save - ' + error); }
}

/**
 * An internal function used to delete an entity_index from local storage.
 * @param {String} path
 */
function _entity_index_local_storage_delete(path) {
  try {
    var storage_key = entity_index_local_storage_key(path);
    window.localStorage.removeItem(storage_key);
  }
  catch (error) {
    console.log('_entity_index_local_storage_delete - ' + error);
  }
}

/**
 * Loads a file, given a file id.
 * @param {Number} fid
 * @param {Object} options
 */
function file_load(fid, options) {
  try {
    entity_load('file', fid, options);
  }
  catch (error) { console.log('file_load - ' + error); }
}

/**
 * Saves a file.
 * @param {Object} file
 * @param {Object} options
 */
function file_save(file, options) {
  try {
    entity_save('file', null, file, options);
  }
  catch (error) { console.log('file_save - ' + error); }
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


/**
 * Creates a comment.
 * @param {Object} comment
 * @param {Object} options
 */
function comment_create(comment, options) {
  try {
    services_resource_defaults(options, 'comment', 'create');
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
    services_resource_defaults(options, 'comment', 'retrieve');
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
    services_resource_defaults(options, 'comment', 'update');
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
    services_resource_defaults(options, 'comment', 'delete');
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
    services_resource_defaults(options, 'comment', 'index');
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
    var path = entity_type + '.json';
    if (in_array(entity_type, services_entity_types())) { path = 'entity_' + path; }
    jDrupal.services.call({
        method: 'POST',
        async: options.async,
        path: path,
        service: options.service,
        resource: options.resource,
        entity_type: entity_type,
        bundle: bundle,
        data: JSON.stringify(entity),
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
    var path = entity_type + '/' + ids + '.json';
    if (in_array(entity_type, services_entity_types())) { path = 'entity_' + path; }
    jDrupal.services.call({
        method: 'GET',
        path: path,
        service: options.service,
        resource: options.resource,
        entity_type: entity_type,
        entity_id: ids,
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
    var primary_key = entity_primary_key(entity_type);
    var path = entity_type + '/' + entity[primary_key] + '.json';
    if (in_array(entity_type, services_entity_types())) {
      path = 'entity_' + path;
      data = entity;
    }
    else { data = _entity_wrap(entity_type, entity); }
    jDrupal.services.call({
        method: 'PUT',
        path: path,
        service: options.service,
        resource: options.resource,
        entity_type: entity_type,
        entity_id: entity[entity_primary_key(entity_type)],
        bundle: bundle,
        data: JSON.stringify(data),
        success: function(result) {
          try {
            _entity_local_storage_delete(entity_type, entity[primary_key]);
            if (options.success) { options.success(result); }
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
    var path = entity_type + '/' + entity_id + '.json';
    if (in_array(entity_type, services_entity_types())) { path = 'entity_' + path; }
    jDrupal.services.call({
        method: 'DELETE',
        path: path,
        service: options.service,
        resource: options.resource,
        entity_type: entity_type,
        entity_id: entity_id,
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

    // Build the query string and path to the index resource.
    var query_string;
    if (typeof query === 'object') {
      query_string = entity_index_build_query_string(query);
    }
    else if (typeof query === 'string') {
      query_string = query;
    }
    if (query_string) { query_string = '&' + query_string; }
    else { query_string = ''; }
    var path = entity_type + '.json' + query_string;
    if (in_array(entity_type, services_entity_types())) { path = 'entity_' + path; }

    // If entity caching is enabled, try to load the index results from local
    // storage and return them instead.
    var caching_enabled = entity_caching_enabled(entity_type);
    if (caching_enabled) {
      var result = _entity_index_local_storage_load(entity_type, path, {});
      if (result && options.success) {
        options.success(result);
        return;
      }
    }

    // Ask Drupal for an index on the entity(ies). Attach the query to the
    // options object so pre/post process hook implementations can have access
    // to it.
    jDrupal.services.call({
        method: 'GET',
        path: path,
        service: options.service,
        resource: options.resource,
        entity_type: entity_type,
        query: query,
        success: function(result) {
          try {
            if (options.success) {

              // If entity caching is enabled and we fully loaded the entities,
              // iterate over each entity and save them to local storage, then
              // set aside this index path so the same query can easily be
              // reloaded later.
              if (
                caching_enabled &&
                query.options &&
                query.options.entity_load
              ) {
                for (var i = 0; i < result.length; i++) {
                  var entity = result[i];
                  _entity_set_expiration_time(entity);
                  _entity_local_storage_save(
                    entity_type,
                    result[i][entity_primary_key(entity_type)],
                    entity
                  );
                }
                _entity_index_local_storage_save(entity_type, path, result);
              }

              // Send along the results.
              options.success(result);
            }
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
    if (query.parameters_op) { // object
      var parameters_op = '';
      for (var parameter_op in query.parameters_op) {
          if (query.parameters_op.hasOwnProperty(parameter_op)) {
            var key = encodeURIComponent(parameter_op);
            var value = encodeURIComponent(query.parameters_op[parameter_op]);
            // @TODO remove double compatability upon resolution of #2537968 on
            // drupal.org
            parameters_op += 'parameters_op[' + key + ']=' + value + '&';
            parameters_op +=
              'options[parameters_op][' + key + ']=' + value + '&';
          }
      }
      if (parameters_op != '') {
        parameters_op = parameters_op.substring(0, parameters_op.length - 1);
        result += parameters_op + '&';
      }
    }
    if (query.orderby) {
      var orderby = '';
      for (var column in query.orderby) {
          if (!query.orderby.hasOwnProperty(column)) { continue; }
          var key = encodeURIComponent(column);
          var value = encodeURIComponent(query.orderby[column]);
          // @TODO remove double compatability upon resolution of #2537968 on
          // drupal.org
          orderby += 'orderby[' + key + ']=' + value + '&';
          orderby += 'options[orderby][' + key + ']=' + value + '&';
      }
      if (orderby != '') {
        orderby = orderby.substring(0, orderby.length - 1);
        result += orderby + '&';
      }
    }
    if (query.options) {
      var options = '';
      for (var option in query.options) {
          if (!query.options.hasOwnProperty(option)) { continue; }
          var _option = query.options[option];
          if (typeof _option === 'object') {
            for (var column in _option) {
              if (!_option.hasOwnProperty(column)) { continue; }
              var key = encodeURIComponent(column);
              var value = encodeURIComponent(_option[column]);
              options += 'options[' + option + '][' + key + ']=' + value + '&';
            }
          }
          else {
            var value = encodeURIComponent(_option);
            options += 'options[' + option + ']=' + value + '&';
          }
      }
      if (options != '') {
        options = options.substring(0, options.length - 1);
        result += options + '&';
      }
    }
    if (typeof query.page !== 'undefined') { // int
      result += 'page=' + encodeURIComponent(query.page) + '&';
    }
    if (typeof query.page_size !== 'undefined') { // int
      var msg =
        'WARNING query.page_size is deprecated, use query.pagesize instead!';
      console.log(msg);
      result += 'pagesize=' + encodeURIComponent(query.page_size) + '&';
    }
    else if (typeof query.pagesize !== 'undefined') { // int
      result += 'pagesize=' + encodeURIComponent(query.pagesize) + '&';
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
    // We don't wrap comments, taxonomy, users or commerce entities.
    var entity_wrapper = {};
    if (entity_type == 'comment' || entity_type == 'taxonomy_term' ||
      entity_type == 'taxonomy_vocabulary' ||
      entity_type == 'user' || entity_type.indexOf('commerce') != -1) {
      entity_wrapper = entity;
    }
    else { entity_wrapper[entity_type] = entity; }
    return entity_wrapper;
  }
  catch (error) { console.log('_entity_wrap - ' + error); }
}


/**
 * Creates a file.
 * @param {Object} file
 * @param {Object} options
 */
function file_create(file, options) {
  try {
    services_resource_defaults(options, 'file', 'create');
    entity_create('file', null, file, options);
  }
  catch (error) { console.log('file_create - ' + error); }
}

/**
 * Retrieves a file.
 * @param {Number} ids
 * @param {Object} options
 */
function file_retrieve(ids, options) {
  try {
    services_resource_defaults(options, 'file', 'retrieve');
    entity_retrieve('file', ids, options);
  }
  catch (error) { console.log('file_retrieve - ' + error); }
}

/**
 * Delete a file.
 * @param {Number} fid
 * @param {Object} options
 */
function file_delete(fid, options) {
  try {
    services_resource_defaults(options, 'file', 'delete');
    entity_delete('file', fid, options);
  }
  catch (error) { console.log('file_delete - ' + error); }
}

/**
 * Creates a node.
 * @param {Object} node
 * @param {Object} options
 */
function node_create(node, options) {
  try {
    services_resource_defaults(options, 'node', 'create');
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
    services_resource_defaults(options, 'node', 'retrieve');
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
    services_resource_defaults(options, 'node', 'update');
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
    services_resource_defaults(options, 'node', 'delete');
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
    services_resource_defaults(options, 'node', 'index');
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
      service: 'system',
      resource: 'connect',
      method: 'POST',
      path: 'system/connect.json',
      success: function(data) {
        try {
          jDrupal.user = data.user;
          if (options.success) { options.success(data); }
        }
        catch (error) {
          console.log(error.stack);
          console.log('system_connect - success - ' + error);
        }
      },
      error: function(xhr, status, message) {
        try {
          if (options.error) { options.error(xhr, status, message); }
        }
        catch (error) { console.log('system_connect - error - ' + error); }
      }
    };

    // If we don't have a token, grab one first.
    if (!jDrupal.csrf_token) {
      services_get_csrf_token({
          success: function(token) {
            try {
              if (options.debug) { console.log('Grabbed new token.'); }
              // Now that we have a token, make the system connect call.
              jDrupal.csrf_token = true;
              jDrupal.services.call(system_connect);
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
      jDrupal.services.call(system_connect);
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
    services_resource_defaults(options, 'taxonomy_term', 'create');
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
    services_resource_defaults(options, 'taxonomy_term', 'retrieve');
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
    services_resource_defaults(options, 'taxonomy_term', 'update');
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
    services_resource_defaults(options, 'taxonomy_term', 'delete');
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
    services_resource_defaults(options, 'taxonomy_term', 'index');
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
    services_resource_defaults(options, 'taxonomy_vocabulary', 'create');
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
    services_resource_defaults(options, 'taxonomy_vocabulary', 'retrieve');
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
    services_resource_defaults(options, 'taxonomy_vocabulary', 'update');
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
    services_resource_defaults(options, 'taxonomy_vocabulary', 'delete');
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
    services_resource_defaults(options, 'taxonomy_vocabulary', 'index');
    entity_index('taxonomy_vocabulary', query, options);
  }
  catch (error) { console.log('taxonomy_vocabulary_index - ' + error); }
}

/**
 * @see https://api.drupal.org/api/drupal/modules!taxonomy!taxonomy.module/function/taxonomy_get_tree/7
 */
function taxonomy_get_tree(vid, parent, max_depth, load_entities, options) {
  try {
    var parent = arguments[1] ? arguments[1] : 0;
    var max_depth = arguments[2] ? arguments[2] : null;
    var load_entities = arguments[3] ? arguments[3] : false;
    options.method = 'POST';
    options.path = 'taxonomy_vocabulary/getTree.json';
    options.service = 'taxonomy_vocabulary';
    options.resource = 'get_tree';
    options.data = JSON.stringify({
        vid: vid,
        parent: parent,
        max_depth: max_depth,
        load_entities: load_entities
    });
    jDrupal.services.call(options);
  }
  catch (error) { console.log('taxonomy_get_tree - ' + error); }
}


/**
 * Creates a user.
 * @param {Object} account
 * @param {Object} options
 */
function user_create(account, options) {
  try {
    services_resource_defaults(options, 'user', 'create');
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
    services_resource_defaults(options, 'user', 'retrieve');
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
    var mode = 'create';
    if (account.uid) { mode = 'update'; }
    services_resource_defaults(options, 'user', mode);
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
    services_resource_defaults(options, 'user', 'create');
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
    services_resource_defaults(options, 'user', 'create');
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
    jDrupal.services.call({
        service: 'user',
        resource: 'register',
        method: 'POST',
        path: 'user/register.json',
        data: JSON.stringify(account),
        success: function(data) {
          try {
            if (options.success) { options.success(data); }
          }
          catch (error) { console.log('user_register - success - ' + error); }
        },
        error: function(xhr, status, message) {
          try {
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
    jDrupal.services.call({
        service: 'user',
        resource: 'login',
        method: 'POST',
        path: 'user/login.json',
        data: 'username=' + encodeURIComponent(name) +
             '&password=' + encodeURIComponent(pass),
        success: function(data) {
          try {
            // Now that we are logged in, we need to get a new CSRF token, and
            // then make a system connect call.
            jDrupal.user = data.user;
            jDrupal.sessid = null;
            services_get_csrf_token({
                success: function(token) {
                  try {
                    if (options.success) {
                      system_connect({
                          success: function(result) {
                            try {
                              if (options.success) { options.success(data); }
                            }
                            catch (error) {
                              console.log(
                                'user_login - system_connect - success - ' +
                                error
                              );
                            }
                          },
                          error: function(xhr, status, message) {
                            try {
                              if (options.error) {
                                options.error(xhr, status, message);
                              }
                            }
                            catch (error) {
                              console.log(
                                'user_login - system_connect - error - ' +
                                error
                              );
                            }
                          }
                      });
                    }
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
    jDrupal.services.call({
        service: 'user',
        resource: 'logout',
        method: 'POST',
        path: 'user/logout.json',
        success: function(data) {
          try {
            // Now that we logged out, clear the sessid and call system connect.
            jDrupal.user = drupal_user_defaults();
            jDrupal.sessid = null;
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

/**
 * The "request_new_password" service resource.
 * @param {String} name User name or e-mail address.
 * @param {Object} options
 */
function user_request_new_password(name, options) {
  try {
    if (typeof options.data === 'undefined') { options.data = { }; }
    options.data.name = name;
    options.data = JSON.stringify(options.data);
    options.method = 'POST';
    options.path = 'user/request_new_password.json';
    options.service = 'user';
    options.resource = 'request_new_password';
    jDrupal.services.call(options);
  }
  catch (error) { console.log('user_request_new_password - ' + error); }
}

