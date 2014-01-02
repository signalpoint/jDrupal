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
        site_path: '',
        base_path: '/',
        language_default: 'und'
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
 * Get the default language from Drupal.settings.
 * @return {String}
 */
function language_default() {
  try {
    return Drupal.settings.language_default;
  }
  catch (error) { console.log('language_default - ' + error); }
}

