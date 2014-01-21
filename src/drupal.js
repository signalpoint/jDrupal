// Initialize the Drupal JSON object and run the bootstrap, if necessary.
var Drupal = {}; drupal_init();

/**
 * Initializes the Drupal JSON object.
 */
function drupal_init() {
  try {
    if (!Drupal) { Drupal = {}; }

    // General properties.
    Drupal.csrf_token = false;
    Drupal.sessid = null;
    Drupal.user = drupal_user_defaults();

    // Settings.
    Drupal.settings = {
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
    Drupal.includes = {};
    Drupal.includes['module'] = {};
    // Modules. Although we no longer dynamically load the core modules, we want
    // to place them each in their own JSON object, so we have an easy way to
    // access them.
    Drupal.modules = {
      core: {},
      contrib: {},
      custom: {}
    };
  }
  catch (error) { console.log('drupal_init - ' + error); }
}

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
    return (typeof value === 'undefined' || value === null || value == '');
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
    // @todo - this can be replaced by using the statusText propery on the XHR
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

