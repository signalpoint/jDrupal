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
 * Given a JS function name, this returns true if the function exists, false otherwise.
 * @param {String} name
 * @return {Boolean}
 */
jDrupal.functionExists = function(name) { return (eval('typeof ' + name) == 'function'); };

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

/**
 * The jDrupal Module constructor prototype skeleton, which doesn't do anything since all module's implement their own
 * constructors.
 * @constructor
 */
jDrupal.Module = function() {
  this.name = null;
};

/**
 * Given a module name, this returns true if the module is enabled, false otherwise.
 * @param {String} name The name of the module
 * @return {Boolean}
 */
jDrupal.moduleExists = function (name) {
  try {
    return typeof jDrupal.modules[name] !== 'undefined';
  }
  catch (error) { console.log('jDrupal.moduleExists - ' + error); }
};

/**
 * Determines which modules are implementing a hook. Returns an array with the names of the modules which are
 * implementing this hook. If no modules implement the hook, it returns false.
 * @param {String} hook
 * @return {Array}
 */
jDrupal.moduleImplements = function(hook) {
  try {
    var modules_that_implement = [];
    if (hook) {

        for (var module in jDrupal.modules) {
          if (jDrupal.modules.hasOwnProperty(module)) {
            if (jDrupal.functionExists(module + '_' + hook)) {
              modules_that_implement.push(module);
            }
          }
        }

    }
    if (modules_that_implement.length == 0) { return false; }
    return modules_that_implement;
  }
  catch (error) { console.log('jDrupal.moduleImplements - ' + error); }
};

/**
 * Given a module name and a hook name, this will invoke that module's hook and return the results of the invocation.
 * Any additional arguments will be sent along to the hook.
 * @param {String} module
 * @param {String} hook
 * @return {*}
 */
jDrupal.moduleInvoke = function(module, hook) {
  if (!jDrupal.moduleLoad(module)) { return; }
  var name = module + '_' + hook;
  if (!jDrupal.functionExists(name)) { return; }
  // Get the hook function, then remove the module name and hook from the
  // arguments. Then if there are no arguments, just call the hook directly,
  // otherwise call the hook and pass along all the arguments.
  var fn = window[name];
  var module_arguments = Array.prototype.slice.call(arguments);
  module_arguments.splice(0, 2);
  if (Object.getOwnPropertyNames(module_arguments).length == 0) { return fn(); }
  else { return fn.apply(null, module_arguments); }
};

/**
 * Given a hook name, this will invoke all modules that implement the hook. Any additional arguments will be sent along
 * to each of the hooks.
 * @param {String} hook
 * @return {Promise}
 */
jDrupal.moduleInvokeAll = function(hook) {
  var promises = [];

  // Copy the arguments and remove the hook name from the first index so the rest can be passed along to the hook.
  var module_arguments = Array.prototype.slice.call(arguments);
  module_arguments.splice(0, 1);

  // Figure out which modules are implementing this hook.
  var modules = [];
  for (var module in jDrupal.modules) {
    if (!jDrupal.modules.hasOwnProperty(module)) { continue; }
    if (!jDrupal.functionExists(module + '_' + hook)) { continue; }
    modules.push(module);
  }
  if (jDrupal.isEmpty(modules)) { return Promise.resolve(); }

  for (var i = 0; i < modules.length; i++) {
    // If there are no arguments, just call the hook directly, otherwise call the hook and pass along all the arguments.
    if (module_arguments.length == 0) {
      promises.push(jDrupal.moduleInvoke(modules[i], hook));
    }
    else {
      // Place the module name and hook name on the front of the arguments.
      module_arguments.unshift(modules[i], hook);
      promises.push(jDrupal.moduleInvoke.apply(null, module_arguments));
      module_arguments.splice(0, 2);
    }
  }

  return Promise.all(promises);
};

/**
 * Given a module name, this will return the module inside jDrupal.modules, or
 * false if it fails to find it.
 * @param {String} name
 * @return {Object|Boolean}
 */
jDrupal.moduleLoad = function(name) {
  try { return jDrupal.modules[name] ? jDrupal.modules[name] : false; }
  catch (error) { console.log('jDrupal.moduleLoad - ' + error); }
};

/**
 * Returns all active module JSON objects.
 * @returns {Object}
 */
jDrupal.modulesLoad = function() { return jDrupal.modules; };

(function(send) {
  /**
   * Adds a pre process hook to all xhr request, and then continues with the call as usual.
   * @param {*} data
   */
  XMLHttpRequest.prototype.send = function(data) {
    var self = this;
    var alters = jDrupal.moduleInvokeAll('rest_pre_process', this, data);
    if (!alters) { send.call(this, data); }
    else { alters.then(function() { send.call(self, data); }); }
  };
})(XMLHttpRequest.prototype.send);

/**
 * Gets the X-CSRF-Token from Drupal.
 * @returns {Promise}
 */
jDrupal.token = function() {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.dg = {
      service: 'system',
      resource: 'token'
    };
    req.open('GET', jDrupal.restPath() + 'rest/session/token');
    req.onload = function() {
      if (req.status == 200) {
        var invoke = jDrupal.moduleInvokeAll('rest_post_process', req);
        if (!invoke) { resolve(req.response); }
        else { invoke.then(resolve(req.response));}
      }
      else { reject(req); }
    };
    req.onerror = function() { reject(Error("Network Error")); };
    req.send();
  });
};

/**
 * Connects to Drupal and sets the currentUser object.
 * @returns {Promise}
 */
jDrupal.connect = function() {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.dg = {
      service: 'system',
      resource: 'connect'
    };
    req.open('GET', jDrupal.restPath() + 'jdrupal/connect?_format=json');
    var connected = function() {
      jDrupal.connected = true;
      var result = JSON.parse(typeof req.responseText !== 'undefined' ? req.responseText : req.response);
      if (result.uid == 0) {
        jDrupal.setCurrentUser(jDrupal.userDefaults());
        resolve(result);
      }
      else {
        jDrupal.userLoad(result.uid).then(function(account) {
          jDrupal.setCurrentUser(account);
          resolve(result);
        });
      }
    };
    req.onload = function() {
      if (req.status != 200) { reject(req); return; }
      var invoke = jDrupal.moduleInvokeAll('rest_post_process', req);
      if (!invoke) { connected(); }
      else { invoke.then(connected); }
    };
    req.onerror = function() { reject(Error("Network Error")); };
    req.send();
  });
};

/**
 * Logs into Drupal, then makes a jDrupal.connect() call to properly set the currentUser object.
 * @param {String} name
 * @param {String} pass
 * @returns {Promise}
 */
jDrupal.userLogin = function(name, pass) {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.dg = {
      service: 'user',
      resource: 'login'
    };
    req.open('POST', jDrupal.restPath() + 'user/login?_format=json');
    req.setRequestHeader('Content-type', 'application/json');
    var connected = function() { jDrupal.connect().then(resolve); };
    req.onload = function() {
      if (req.status == 200) {
        var invoke = jDrupal.moduleInvokeAll('rest_post_process', req);
        if (!invoke) { connected(); }
        else { invoke.then(connected); }
      }
      else { reject(req); }
    };
    req.onerror = function() { reject(Error("Network Error")); };
    req.send(JSON.stringify({
      name: name,
      pass: pass
    }));
  });
};

/**
 * Logs out of Drupal, clears the currentUser object, then performs a jDrupal.connect() to properly set the currentUser
 * object.
 * @returns {Promise}
 */
jDrupal.userLogout = function() {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.dg = {
      service: 'user',
      resource: 'logout'
    };
    req.open('GET', jDrupal.restPath() + 'user/logout');
    req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    var connected = function() {
      jDrupal.setCurrentUser(jDrupal.userDefaults());
      jDrupal.connect().then(resolve);
    };
    req.onload = function() {
      if (req.status == 200 || req.status == 303) {
        var invoke = jDrupal.moduleInvokeAll('rest_post_process', req);
        if (!invoke) { connected(); }
        else { invoke.then(connected); }
      }
      else { reject(req); }
    };
    req.onerror = function() { reject(Error("Network Error")); };
    req.send();
  });
};

/**
 * ENTITY PROXY FUNCTIONS
 */

/**
 * Given an entity type and id, this will attempt to load the entity.
 * @param {String} entityType
 * @param {Number} entityID
 * @returns {Promise}
 */
jDrupal.entityLoad = function(entityType, entityID) {
  var entity = new this[this.ucfirst(entityType)](entityID);
  return entity.load();
};

/**
 * Given a comment id, this will attempt to load the comment.
 * @param {Number} cid
 * @returns {Promise}
 */
jDrupal.commentLoad = function(cid) { return this.entityLoad('comment', cid); };

/**
 * Given a node id, this will attempt to load the node.
 * @param {Number} nid
 * @returns {Promise}
 */
jDrupal.nodeLoad = function(nid) { return this.entityLoad('node', nid); };

/**
 * Given a user id, this will attempt to load the account.
 * @param {Number} uid
 * @returns {Promise}
 */
jDrupal.userLoad = function(uid) { return this.entityLoad('user', uid); };

/**
 * Registers a new user.
 * @param {String} name
 * @param {String} pass
 * @param {String} mail
 * @returns {Promise}
 */
jDrupal.userRegister = function(name, pass, mail) {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.dg = {
      service: 'user',
      resource: 'register'
    };
    req.open('POST', jDrupal.restPath() + 'user/register?_format=json');
    req.setRequestHeader('Content-type', 'application/json');

    var connected = function() {
      jDrupal.connect().then(resolve);
    };
    req.onload = function() {
      if (req.status == 200) {
        var invoke = jDrupal.moduleInvokeAll('rest_post_process', req);
        if (!invoke) { connected(); }
        else { invoke.then(connected); }
      }
      else { reject(req); }
    };
    req.onerror = function() { reject(Error("Network Error")); };
    req.send(JSON.stringify({
      name: {value : name},
      pass: {value: pass},
      mail: {value: mail}
    }));
  });
};

/**
 * The Views constructor.
 * @param {String} path The path to the Views REST Export in Drupal.
 * @constructor
 */
jDrupal.Views = function(path) {
  this.path = path;
  this.results = null;
};

/**
 * Returns the path to the rest export.
 * @returns {String}
 */
jDrupal.Views.prototype.getPath = function() {
  return this.path;
};

/**
 * Returns the results, if any.
 * @returns {*}
 */
jDrupal.Views.prototype.getResults = function() {
  return this.results;
};

/**
 * Retrieves the Views' results from the Drupal site's rest export.
 * @returns {Promise}
 */
jDrupal.Views.prototype.getView = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.dg = {
      service: 'views',
      resource: null
    };
    req.open('GET', jDrupal.restPath() + self.getPath());
    var loaded = function() {
      self.results = JSON.parse(req.response);
      resolve();
    };
    req.onload = function() {
      if (req.status == 200) {
        var invoke = jDrupal.moduleInvokeAll('rest_post_process', req);
        if (!invoke) { loaded(); }
        else { invoke.then(loaded); }
      }
      else { reject(req); }
    };
    req.onerror = function() { reject(Error("Network Error")); };
    req.send();
  });
};

/**
 * Loads a view and fetches its results from the Drupal site.
 * @param {String} path
 */
jDrupal.viewsLoad = function(path) {
  return new Promise(function(resolve, reject) {
    var view = new jDrupal.Views(path);
    view.getView().then(function() {
      resolve(view);
    });
  });
};

// @TODO All "set" functions should return "this" for easy code chains.

/**
 * Given a entity type, bundle and id, this Creates a new jDrupal Entity object.
 * @param entityType
 * @param bundle
 * @param id
 * @constructor
 */
jDrupal.Entity = function(entityType, bundle, id) {

  // @TODO Allow an entity object to be passed in.

  this.entity = null;

  // @TODO these flat values need to be turned into arrays, e.g. [ { value: 'foo'} ]
  this.bundle = bundle;
  this.entityID = id;

  this.entityKeys = {};
};

/**
 *
 * @param prop
 * @param delta
 * @returns {*}
 */
jDrupal.Entity.prototype.get = function(prop, delta) {
  if (!this.entity || typeof this.entity[prop] === 'undefined') { return null; }
  return typeof delta !== 'undefined' ? this.entity[prop][delta] : this.entity[prop];
};

/**
 *
 * @param prop
 * @param delta
 * @param val
 */
jDrupal.Entity.prototype.set = function(prop, delta, val) {
  if (this.entity) {
    if (typeof delta !== 'undefined' && typeof this.entity[prop] !== 'undefined') {
      this.entity[prop][delta] = val;
    }
    else { this.entity[prop] = val; }
  }
};

/**
 *
 * @param key
 * @returns {null}
 */
jDrupal.Entity.prototype.getEntityKey = function(key) {
  return typeof this.entityKeys[key] !== 'undefined' ?
    this.entityKeys[key] : null;
};

/**
 *
 * @returns {*}
 */
jDrupal.Entity.prototype.getEntityType = function() {
  return this.entityKeys['type'];
};

/**
 *
 * @returns {*}
 */
jDrupal.Entity.prototype.getBundle = function() {
  var bundle = this.getEntityKey('bundle');
  return typeof this.entity[bundle] !== 'undefined' ?
    this.entity[bundle][0].target_id : null;
};

/**
 *
 * @returns {null}
 */
jDrupal.Entity.prototype.id = function() {
  var id = this.getEntityKey('id');
  return typeof this.entity[id] !== 'undefined' ?
    this.entity[id][0].value : null;
};

/**
 *
 * @returns {*}
 */
jDrupal.Entity.prototype.language = function() {
  return this.entity.langcode[0].value;
};

/**
 *
 * @returns {boolean}
 */
jDrupal.Entity.prototype.isNew = function() {
  return !this.id();
};

/**
 *
 * @returns {null}
 */
jDrupal.Entity.prototype.label = function() {
  var label = this.getEntityKey('label');
  return typeof this.entity[label] !== 'undefined' ?
    this.entity[label][0].value : null;
};

/**
 * @returns {String}
 */
jDrupal.Entity.prototype.stringify = function() {
  return JSON.stringify(this.entity);
};

/**
 * ENTITY LOADING...
 */

/**
 *
 * @param options
 * @returns {Promise}
 */
jDrupal.Entity.prototype.preLoad = function(options) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
};

/**
 *
 * @returns {Promise}
 */
jDrupal.Entity.prototype.load = function() {
  try {
    var _entity = this;
    var entityType = _entity.getEntityType();
    return new Promise(function(resolve, reject) {

      _entity.preLoad().then(function() {

        var path = jDrupal.restPath() +
            entityType + '/' + _entity.id() + '?_format=json';
        var req = new XMLHttpRequest();
        req.dg = {
          service: entityType,
          resource: 'retrieve'
        };
        req.open('GET', path);
        var loaded = function() {
          _entity.entity = JSON.parse(req.response);
          _entity.postLoad(req).then(function() {
            resolve(_entity);
          });
        };
        req.onload = function() {
          if (req.status == 200) {
            var invoke = jDrupal.moduleInvokeAll('rest_post_process', req);
            if (!invoke) { loaded(); }
            else { invoke.then(loaded); }
          }
          else { reject(req); }
        };
        req.onerror = function() { reject(Error("Network Error")); };
        req.send();

      });


    });
  }
  catch (error) {
    console.log('jDrupal.Entity.load - ' + error);
  }
};

/**
 *
 * @param options
 * @returns {Promise}
 */
jDrupal.Entity.prototype.postLoad = function(options) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
};

/**
 * ENTITY SAVING...
 */

/**
 *
 * @param options
 * @returns {Promise}
 */
jDrupal.Entity.prototype.preSave = function(options) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
};

/**
 *
 * @returns {Promise}
 */
jDrupal.Entity.prototype.save = function() {

  var _entity = this;

  return new Promise(function(resolve, reject) {

    _entity.preSave().then(function() {

      jDrupal.token().then(function(token) {

        var entityType = _entity.getEntityType();
        var method = null;
        var resource = null;
        var path = null;
        var isNew = _entity.isNew();

        if (isNew) {
          method = 'POST';
          resource = 'create';
          path = 'entity/' + entityType;
        }
        else {
          method = 'PATCH';
          resource = 'update';
          path = entityType + '/' + _entity.id();
        }

        path += '?_format=json';

        var req = new XMLHttpRequest();
        req.dg = {
          service: entityType,
          resource: resource
        };
        req.open(method, jDrupal.restPath() + path);
        req.setRequestHeader('Content-type', 'application/json');
        req.setRequestHeader('X-CSRF-Token', token);
        req.onload = function() {
          _entity.postSave(req).then(function() {
            if (
              (method == 'POST' && req.status == 201) ||
              (method == 'PATCH' && req.status == 204) ||
              req.status == 200
            ) {
              var invoke = jDrupal.moduleInvokeAll('rest_post_process', req);
              if (!invoke) { resolve(req); }
              else { invoke.then(resolve(req));}
            }
            else { reject(req); }
          });

        };
        req.onerror = function() { reject(Error("Network Error")); };
        req.send(_entity.stringify());

      });

    });

  });

};

/**
 *
 * @param xhr
 * @returns {Promise}
 */
jDrupal.Entity.prototype.postSave = function(xhr) {
  var self = this;
  return new Promise(function(resolve, reject) {
    // For new entities, grab their id from the Location response header.
    if (self.isNew() && xhr.getResponseHeader('Location')) {
      var parts = xhr.getResponseHeader('Location').split('/');
      var entityID =
        self.entity[self.getEntityKey('id')] = [ {
          value: parts[parts.length - 1]
        }];
    }
    resolve();
  });
};

/**
 * ENTITY DELETING...
 */

/**
 *
 * @param options
 * @returns {Promise}
 */
jDrupal.Entity.prototype.preDelete = function(options) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
};

/**
 *
 * @param options
 * @returns {Promise}
 */
jDrupal.Entity.prototype.delete = function(options) {

  // Set aside "this" entity.
  var _entity = this;

  return new Promise(function(resolve, reject) {

    _entity.preDelete().then(function() {

      jDrupal.token().then(function(token) {

        var entityType = _entity.getEntityType();
        var path = jDrupal.restPath() + entityType + '/' + _entity.id();
        var data = {};
        data[_entity.getEntityKey('bundle')] = [ {
          target_id: _entity.getBundle()
        }];
        var req = new XMLHttpRequest();
        req.dg = {
          service: entityType,
          resource: 'delete'
        };
        req.open('DELETE', path);
        req.setRequestHeader('Content-type', 'application/json');
        req.setRequestHeader('X-CSRF-Token', token);
        req.onload = function() {
          _entity.postDelete(req).then(function() {
            if (req.status == 204) {
              var invoke = jDrupal.moduleInvokeAll('rest_post_process', req);
              if (!invoke) { resolve(req); }
              else { invoke.then(resolve(req));}
            }
            else { reject(req); }
          });

        };
        req.onerror = function() { reject(Error("Network Error")); };
        req.send(JSON.stringify(data));

      });

    });

  });

};

/**
 *
 * @param options
 * @returns {Promise}
 */
jDrupal.Entity.prototype.postDelete = function(options) {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.entity = null;
    resolve();
  });
};

/**
 * HELPERS
 */

/**
 *
 * @param obj
 * @param entityID_or_entity
 */
jDrupal.entityConstructorPrep = function(obj, entityID_or_entity) {
  if (!entityID_or_entity) { }
  else if (typeof entityID_or_entity === 'object') {
    obj.entity = entityID_or_entity;
  }
  else {
    var id = obj.getEntityKey('id');
    var entity = {};
    entity[id]= [ { value: entityID_or_entity } ];
    obj.entity = entity;
  }
};

// @see https://api.drupal.org/api/drupal/core!modules!comment!src!Entity!Comment.php/class/Comment/8

/**
 * Given a comment id or JSON object, this Creates a new jDrupal Comment object.
 * @param {Number|Object} cid_or_comment
 * @constructor
 */
jDrupal.Comment = function(cid_or_comment) {

  // Set the entity keys.
  this.entityKeys['type'] = 'comment';
  this.entityKeys['bundle'] = 'comment_type';
  this.entityKeys['id'] = 'cid';
  this.entityKeys['label'] = 'subject';

  // Prep the entity.
  jDrupal.entityConstructorPrep(this, cid_or_comment);

};

/**
 * Extend the entity prototype.
 * @type {jDrupal.Entity}
 */
jDrupal.Comment.prototype = new jDrupal.Entity;

/**
 * Set the constructor.
 * @type {jDrupal.Comment|*}
 */
jDrupal.Comment.prototype.constructor = jDrupal.Comment;

/**
 * Returns the comment's subject.
 * @returns {*}
 */
jDrupal.Comment.prototype.getSubject = function() {
  return this.entity.subject[0].value;
};

/**
 * Set's the comment's subject.
 * @returns {*}
 */
jDrupal.Comment.prototype.setSubject = function(subject) {
  try {
    this.entity.subject[0].value = subject;
  }
  catch (e) { console.log('jDrupal.Comment.setSubject - ' + e); }
};

/**
 * OVERRIDES
 */

jDrupal.Comment.prototype.preSave = function(options) {
  return new Promise(function(resolve, reject) {
    // Remove protected fields.
    //var protected_fields = [
    //  'cid'
    //];
    //for (var i = 0; i < protected_fields.length; i++) {
    //  delete this.entity[protected_fields[i]];
    //}
    resolve();
  });
};

/**
 *
 */
jDrupal.Comment.prototype.stringify = function() {

  try {

    if (!this.isNew()) {
      var entityClone = JSON.parse(JSON.stringify(this.entity));
      // Remove protected fields.

      // @see CommentAccessControlHandler.php

      //$read_only_fields = array(
      //  'hostname',
      //  'changed',
      //  'cid',
      //  'thread',
      //);
      //// These fields can be edited during comment creation.
      //$create_only_fields = [
      //  'comment_type',
      //  'uuid',
      //  'entity_id',
      //  'entity_type',
      //  'field_name',
      //  'pid',
      //];

      var protected_fields = [
        'hostname',
        'changed',
        'cid',
        'thread',
        //'comment_type', // 403, but causes an error, bug in Drupal?
        'uuid',
        'entity_id',
        'entity_type',
        'pid',
        'field_name',
        'created',


        //'langcode',
        //'default_langcode',
        //'uid',


        //'status',
        'name', // @TODO we could probably send these fields if they weren't empty
        'mail',
        'homepage'

      ];
      for (var i = 0; i < protected_fields.length; i++) {
        if (typeof entityClone[protected_fields[i]] !== 'undefined') {
          delete entityClone[protected_fields[i]];
        }
      }
      return JSON.stringify(entityClone);
    }
    return JSON.stringify(this.entity);

  }
  catch (error) {
    console.log('jDrupal.Comment.stringify - ' + error);
  }

};


// @see https://api.drupal.org/api/drupal/core!modules!node!src!Entity!Node.php/class/Node/8

/**
 * Given a node id or JSON object, this Creates a new jDrupal Node object.
 * @param {Number|Object} nid_or_node
 * @constructor
 */
jDrupal.Node = function(nid_or_node) {

  // Set the entity keys.
  this.entityKeys['type'] = 'node';
  this.entityKeys['bundle'] = 'type';
  this.entityKeys['id'] = 'nid';
  this.entityKeys['label'] = 'title';

  // Prep the entity.
  jDrupal.entityConstructorPrep(this, nid_or_node);

  // Set default values.
  if (this.entity) {
    if (!this.entity.title) {
      this.entity.title = [ { value: '' }];
    }
  }

};

/**
 * Extend the entity prototype.
 * @type {jDrupal.Entity}
 */
jDrupal.Node.prototype = new jDrupal.Entity;

/**
 * Set the constructor.
 * @type {jDrupal.Node|*}
 */
jDrupal.Node.prototype.constructor = jDrupal.Node;

/**
 *
 * @returns {*}
 */
jDrupal.Node.prototype.getTitle = function() { return this.label(); };

/**
 *
 * @returns {*}
 */
jDrupal.Node.prototype.setTitle = function(title) {
  try {
    this.entity.title[0].value = title;
  }
  catch (e) { console.log('jDrupal.Node.setTitle - ' + e); }
};

/**
 *
 * @returns {*}
 */
jDrupal.Node.prototype.getType = function() {
  return this.getBundle();
};


/**
 *
 * @returns {*}
 */
jDrupal.Node.prototype.getCreatedTime = function() {
  return this.entity.created[0].value;
};

/**
 *
 * @returns {*}
 */
jDrupal.Node.prototype.isPromoted = function() {
  return this.entity.promote[0].value;
};

/**
 *
 * @returns {*}
 */
jDrupal.Node.prototype.isPublished = function() {
  return this.entity.status[0].value;
};

/**
 *
 * @returns {*}
 */
jDrupal.Node.prototype.isSticky = function() {
  return this.entity.sticky[0].value;
};

/**
 * OVERRIDES
 */

/**
 *
 * @param options
 * @returns {Promise}
 */
jDrupal.Node.prototype.preSave = function(options) {
  var self = this;
  return new Promise(function(resolve, reject) {
    // Remove protected fields.
    var protected_fields = [
      'changed',
      'revision_timestamp',
      'revision_uid'
    ];
    for (var i = 0; i < protected_fields.length; i++) {
      delete self.entity[protected_fields[i]];
    }
    resolve();
  });
};



// @see https://api.drupal.org/api/drupal/core!modules!user!src!Entity!User.php/class/User/8

/**
 * Given a user id or JSON object, this Creates a new jDrupal User object.
 * @param {Number|Object} uid_or_account
 * @constructor
 */
jDrupal.User = function(uid_or_account) {

  // Set the entity keys.
  this.entityKeys['type'] = 'user';
  this.entityKeys['bundle'] = 'user';
  this.entityKeys['id'] = 'uid';
  this.entityKeys['label'] = 'name';

  // Prep the entity.
  jDrupal.entityConstructorPrep(this, uid_or_account);

};

/**
 * Extend the entity prototype.
 * @type {jDrupal.Entity}
 */
jDrupal.User.prototype = new jDrupal.Entity;

/**
 * Set the constructor.
 * @type {jDrupal.User|*}
 */
jDrupal.User.prototype.constructor = jDrupal.User;

/**
 *
 * @returns {*}
 */
jDrupal.User.prototype.getAccountName = function() { return this.label(); };

jDrupal.User.prototype.getRoles = function() {
  var _roles = this.entity.roles;
  var roles = [];
  for (var i = 0; i < this.entity.roles.length; i++) {
    roles.push(this.entity.roles[i].target_id)
  }
  return roles;
};

jDrupal.User.prototype.hasRole = function(role) {
  return jDrupal.inArray(role, this.getRoles());
};

/**
 *
 * @returns {boolean}
 */
jDrupal.User.prototype.isAnonymous = function() {
  return this.id() == 0;
};

/**
 *
 * @returns {boolean}
 */
jDrupal.User.prototype.isAuthenticated = function() {
  return !this.isAnonymous();
};

/**
 * PROXIES
 */

//jDrupal.userPrepare = function(uid) {
//  return new jDrupal.User({
//
//  });
//};

/**
 * Gets the current user account object.
 * @returns {Object}
 */
jDrupal.currentUser = function() {
  return jDrupal._currentUser;
};

/**
 * OVERRIDES
 */

/**
 *
 * @param options
 * @returns {Promise}
 */
jDrupal.User.prototype.postLoad = function(options) {
  var self = this;
  return new Promise(function(ok, err) {
    // @TODO it appears in drupal 8.0.3 it stopped returning roles to us.... so we make a default.
    if (!self.entity.roles) { self.entity.roles = [ { target_id: 'authenticated' }]; }
    ok();
  });
};

/**
 * HELPERS
 */

/**
 *
 * @returns {jDrupal.User}
 */
jDrupal.userDefaults = function() {
  return new jDrupal.User({
    uid: [ { value: 0 } ],
    roles: [ { target_id: 'anonymous' }]
  });
};

/**
 * Sets the current user account object.
 * @param {Object} account
 */
jDrupal.setCurrentUser = function(account) {

  // For some reason Drupal 8 (and/or the jDrupal module), doesn't return to us the authenticated user role if the
  // user is in fact authenticated (and this may only effect admins and/or uid #1). We'll add the authenticated
  // user role object to the account object so role checking can be more consistent.
  if (account.isAuthenticated() && !jDrupal.inArray('authenticated', account.getRoles())) {
    account.entity.roles.push({ target_id: 'authenticated' });
  }

  // Set the account object onto the jDrupal object.
  jDrupal._currentUser = account;

};

/**
 * Generates a random user password.
 * @return {String}
 */
jDrupal.userPassword = function() {
  // @credit http://stackoverflow.com/a/1349426/763010
  var length = 10;
  if (arguments[0]) { length = arguments[0]; }
  var password = '';
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz23456789';
  for (var i = 0; i < length; i++) {
    password += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return password;
};
