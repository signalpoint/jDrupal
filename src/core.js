// Initialize the jDrupal object.
var jDrupal = {};

/**
 * Initializes the jDrupal JSON object.
 */
jDrupal.init = function() {
  // General properties.
  jDrupal.csrf_token = false;
  jDrupal.sessid = null;
  jDrupal.modules = {};
  jDrupal.connected = false; // Will be equal to true after the system connect.
  jDrupal.settings = {
    sitePath: null,
    basePath: '/'
  };
};

// Init jDrupal.
jDrupal.init();

/**
 * Get or set a jDrupal configuration setting.
 * @param {String} name
 * @returns {*}
 */
jDrupal.config = function(name) {
  var value = typeof arguments[1] !== 'undefined' ? arguments[1] : null;
  if (value) {
    jDrupal.settings[name] = value;
    return;
  }
  return jDrupal.settings[name];
};

jDrupal.sitePath = function() {
  return jDrupal.settings.sitePath;
};
jDrupal.basePath = function() {
  return jDrupal.settings.basePath;
};
jDrupal.restPath = function() {
  return this.sitePath() + this.basePath();
};
jDrupal.path = function() {
  return this.restPath().substr(this.restPath().indexOf('://')+3).replace('localhost', '');
};

/**
 * Checks if we're ready to make a Services call.
 * @return {Boolean}
 */
jDrupal.isReady = function() {
  try {
    var ready = !jDrupal.isEmpty(jDrupal.sitePath());
    if (!ready) { console.log('sitePath not set in jdrupal.settings.js'); }
    return ready;
  }
  catch (error) { console.log('jDrupal.isReady - ' + error); }
};

/**
 * Returns true if given value is empty. A generic way to test for emptiness.
 * @param {*} value
 * @return {Boolean}
 */
jDrupal.isEmpty = function(value) {
    if (value !== null && typeof value === 'object') { return Object.keys(value).length === 0; }
    return (typeof value === 'undefined' || value === null || value == '');
};

/**
 * Given a JS function name, this returns true if the function exists in the
 * scope, false otherwise.
 * @param {String} name
 * @return {Boolean}
 */
jDrupal.functionExists = function(name) {
  try {
    return (eval('typeof ' + name) == 'function');
  }
  catch (error) {
    alert('jDrupal.functionExists - ' + error);
  }
};

/**
 * Checks if the needle string, is in the haystack array. Returns true if it is
 * found, false otherwise. Credit: http://stackoverflow.com/a/15276975/763010
 * @param {String|Number} needle
 * @param {Array} haystack
 * @return {Boolean}
 */
jDrupal.inArray = function (needle, haystack) {
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
  catch (error) { console.log('jDrupal.inArray - ' + error); }
};

/**
 * Given something, this will return true if it's an array, false otherwise.
 * @param {*} obj
 * @returns {boolean}
 * @see http://stackoverflow.com/a/1058753/763010
 */
jDrupal.isArray = function(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
};

/**
 * Given an argument, this will return true if it is an int, false otherwise.
 * @param {Number} n
 * @return {Boolean}
 */
jDrupal.isInt = function(n) {
  // @credit: http://stackoverflow.com/a/3886106/763010
  if (typeof n === 'string') { n = parseInt(n); }
  return typeof n === 'number' && n % 1 == 0;
};

/**
 * Checks if incoming variable is a Promise, returns true or false.
 * @param {Object} obj The variable to check.
 * @returns {boolean}
 */
jDrupal.isPromise = function(obj) { return Promise.resolve(obj) == obj; };

/**
 * Shuffle an array.
 * @see http://stackoverflow.com/a/12646864/763010
 * @param {Array} array
 * @return {Array}
 */
jDrupal.shuffle = function(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

/**
 * Javascript equivalent of php's time() function.
 * @returns {number}
 */
jDrupal.time = function() {
  var d = new Date();
  return Math.floor(d / 1000);
};

/**
 * Given a string, this will change the first character to lower case and return
 * the new string.
 * @param {String} str
 * @return {String}
 */
jDrupal.lcfirst = function(str) {
  str += '';
  var f = str.charAt(0).toLowerCase();
  return f + str.substr(1);
};

/**
 * Given a string, this will change the first character to upper case and return
 * the new string.
 * @param {String} str
 * @return {String}
 */
jDrupal.ucfirst = function(str) {
  // @credit http://kevin.vanzonneveld.net
  str += '';
  var f = str.charAt(0).toUpperCase();
  return f + str.substr(1);
};
