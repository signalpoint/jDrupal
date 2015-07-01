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
    // Build a JSON object to house the entity service request queues. This is
    // used to prevent async calls to the same resource from piling up and
    // making duplicate requests.
    // @TODO - this needs to be dynamic, what about custom entity types?
    Drupal.services_queue = {
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
    for (var i = 0; i < format.length; i++) {
      var character = format.charAt(i);
      switch (character) {

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
 * Given a module name, this returns true if the module is enabled, false
 * otherwise.
 * @param {String} name The name of the module
 * @return {Boolean}
 */
function module_exists(name) {
  try {
    var exists = false;
    if (typeof Drupal.modules.core[name] !== 'undefined') {
      exists = true;
    }
    else if (typeof Drupal.modules.contrib[name] !== 'undefined') {
      exists = true;
    }
    else if (typeof Drupal.modules.custom[name] !== 'undefined') {
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

