// Initialize the jDrupal JSON object and run the bootstrap.
var jDrupal = {}; jDrupalInit();
jDrupal.sitePath = function() {
  return jDrupal.settings.sitePath;
};
jDrupal.basePath = function() {
  return jDrupal.settings.basePath;
};
jDrupal.restPath = function() {
  return this.sitePath() + this.basePath();
};

/**
 * Checks if we're ready to make a Services call.
 * @return {Boolean}
 */
jDrupal.isReady = function() {
  try {
    var result = true;
    if (jDrupal.isEmpty(jDrupal.sitePath())) {
      result = false;
      console.log('sitePath not set in jdrupal.settings.js');
    }
    return result;
  }
  catch (error) { console.log('jDrupal.isReady - ' + error); }
};

/**
 * Initializes the jDrupal JSON object.
 */
function jDrupalInit() {
  try {
    if (!jDrupal) { jDrupal = {}; }

    // General properties.
    jDrupal.csrf_token = false;
    jDrupal.sessid = null;
    jDrupal.modules = {};

  }
  catch (error) { console.log('jDrupalInit - ' + error); }
}

/**
 * Returns true if given value is empty. A generic way to test for emptiness.
 * @param {*} value
 * @return {Boolean}
 */
jDrupal.isEmpty = function(value) {
  try {
    if (typeof value === 'object') { return Object.keys(value).length === 0; }
    return (typeof value === 'undefined' || value === null || value == '');
  }
  catch (error) { console.log('jDrupal.isEmpty - ' + error); }
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
      case 201: title = 'Created'; break;
      case 204: title = 'No Content'; break;
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
}

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

jDrupal.Module = function() {

  this.name = null;

};

/**
 * Given a module name, this returns true if the module is enabled, false
 * otherwise.
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
 * Determines which modules are implementing a hook. Returns an array with the
 * names of the modules which are implementing this hook. If no modules
 * implement the hook, it returns false.
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
 * Given a module name and a hook name, this will invoke that module's hook.
 * @param {String} module
 * @param {String} hook
 * @return {*}
 */
jDrupal.moduleInvoke = function(module, hook) {
  try {
    var module_invocation_results = null;
    if (jDrupal.moduleLoad(module)) {
      var module_arguments = Array.prototype.slice.call(arguments);
      var function_name = module + '_' + hook;
      if (jDrupal.functionExists(function_name)) {
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
      var msg = 'jDrupal.moduleInvoke - failed to load: ' + module;
      console.log(msg);
    }
    return module_invocation_results;
  }
  catch (error) { console.log('jDrupal.moduleInvoke - ' + error); }
};

jDrupal._moduleInvokeResults = null;

/**
 * Given a hook name, this will invoke all modules that implement the hook.
 * @param {String} hook
 * @return {Array}
 */
jDrupal.moduleInvokeAll = function(hook) {
  try {

    // Prepare the invocation results.
    jDrupal._moduleInvokeResults = [];

    // Copy the arguments and remove the hook name from the first index so the
    // rest can be passed along to the hook.
    var module_arguments = Array.prototype.slice.call(arguments);
    module_arguments.splice(0, 1);

    // Figure out which modules are implementing this hook.
    var modules = [];
    for (var module in jDrupal.modules) {
      if (!jDrupal.modules.hasOwnProperty(module)) { continue; }
      if (!jDrupal.functionExists(module + '_' + hook)) { continue; }
      modules.push(module);
    }
    if (jDrupal.isEmpty(modules)) { return; }

    for (var i = 0; i < modules.length; i++) {
      // If there are no arguments, just call the hook directly,
      // otherwise call the hook and pass along all the arguments.
      var invocation_results = null;
      if (module_arguments.length == 0) {
        invocation_results = jDrupal.moduleInvoke(module, hook);
      }
      else {
        // Place the module name and hook name on the front of the
        // arguments.
        module_arguments.unshift(module, hook);
        var fn = window['jDrupal'].moduleInvoke;
        invocation_results = fn.apply(null, module_arguments);
        module_arguments.splice(0, 2);
      }
      if (typeof invocation_results !== 'undefined') {
        jDrupal._moduleInvokeResults.push(invocation_results);
      }
    }

    return jDrupal._moduleInvokeResults;
  }
  catch (error) { console.log('jDrupal.moduleInvokeAll - ' + error); }
};

/**
 * Given a module name, this will return the module inside jDrupal.modules, or
 * false if it fails to find it.
 * @param {String} name
 * @return {Object|Boolean}
 */
jDrupal.moduleLoad = function(name) {
  try {
    return jDrupal.modules[name];
  }
  catch (error) { console.log('jDrupal.moduleLoad - ' + error); }
};

jDrupal.modulesLoad = function() {
  return jDrupal.modules;
};

jDrupal.token = function() {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.open('GET', jDrupal.restPath() + 'rest/session/token');
    req.onload = function() {
      if (req.status == 200) { resolve(req.response); }
      else { reject(Error(req.statusText)); }
    };
    req.onerror = function() { reject(Error("Network Error")); };
    req.send();
  });
};
jDrupal.connect = function() {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.open('GET', jDrupal.restPath() + 'jdrupal/connect?_format=json');
    req.onload = function() {
      if (req.status != 200) { reject(Error(req.statusText)); return; }
      var result = JSON.parse(req.response);
      if (result.uid == 0) {
        jDrupalSetCurrentUser(jDrupalUserDefaults());
        resolve(result);
      }
      else {
        jDrupal.userLoad(result.uid).then(function(account) {
          jDrupalSetCurrentUser(account);
          resolve(result);
        });
      }
    };
    req.onerror = function() { reject(Error("Network Error")); };
    req.send();
  });
};
jDrupal.userLogin = function(name, pass) {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.open('POST', jDrupal.restPath() + 'user/login');
    req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    req.onload = function() {
      if (req.status == 200 || req.status == 303) {
        jDrupal.connect().then(resolve);
      }
      else { reject(Error(req.statusText)); }
    };
    req.onerror = function() { reject(Error("Network Error")); };
    var data = 'name=' + encodeURIComponent(name) +
      '&pass=' + encodeURIComponent(pass) +
      '&form_id=user_login_form';
    req.send(data);
  });
};
jDrupal.entityLoad = function(entity_type, entity_id) {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.open('GET', jDrupal.restPath() + entity_type + '/' + entity_id + '?_format=json');
    req.onload = function() {
      if (req.status == 200) {
        resolve(new jDrupal[jDrupal.ucfirst(entity_type)](JSON.parse(req.response)));
      }
      else { reject(Error(req.statusText)); }
    };
    req.onerror = function() { reject(Error("Network Error")); };
    req.send();
  });
};
jDrupal.commentLoad = function(cid) { return this.entityLoad('comment', cid); };
jDrupal.nodeLoad = function(nid) { return this.entityLoad('node', nid); };
jDrupal.userLoad = function(uid) { return this.entityLoad('user', uid); };
/**
 * Entity
 * @param {String} path
 * @constructor
 */
jDrupal.Views = function(path) {
  this.path = path;
  this.results = null;
};

/**
 *
 * @returns {String|*}
 */
jDrupal.Views.prototype.getPath = function() {
  return this.path;
};

jDrupal.Views.prototype.getResults = function() {
  return this.results;
};

/**
 *
 */
jDrupal.Views.prototype.getView = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.open('GET', jDrupal.restPath() + self.getPath() + '?_format=json');
    req.onload = function() {
      if (req.status == 200) {
        self.results = JSON.parse(req.response);
        resolve();
      }
      else { reject(Error(req.statusText)); }
    };
    req.onerror = function() { reject(Error("Network Error")); };
    req.send();
  });
};

/**
 * @param {String} path
 * @param {Object} options
 */
jDrupal.viewsLoad = function(path) {
  return new Promise(function(resolve, reject) {
    var view = new jDrupal.Views(path);
    view.getView().then(function() {
      resolve(view);
    });
  });
};

/**
 * Entity
 * @param entityType
 * @param bundle
 * @param id
 * @constructor
 */
jDrupal.Entity = function(entityType, bundle, id) {

  this.entity = null;

  // @TODO these flat values need to be turned into arrays, e.g.
  // [ { value: 'foo'} ]
  this.bundle = bundle;
  this.entityID = id;

  this.entityKeys = {};
};

jDrupal.Entity.prototype.getEntityKey = function(key) {
  return typeof this.entityKeys[key] !== 'undefined' ?
    this.entityKeys[key] : null;
};
jDrupal.Entity.prototype.getEntityType = function() {
  return this.entityKeys['type'];
};
jDrupal.Entity.prototype.getBundle = function() {
  var bundle = this.getEntityKey('bundle');
  return typeof this.entity[bundle] !== 'undefined' ?
    this.entity[bundle][0].target_id : null;
};
jDrupal.Entity.prototype.id = function() {
  var id = this.getEntityKey('id');
  return typeof this.entity[id] !== 'undefined' ?
    this.entity[id][0].value : null;
};
jDrupal.Entity.prototype.isNew = function() {
  return !this.id();
};
jDrupal.Entity.prototype.stringify = function() {
  return JSON.stringify(this.entity);
};

/**
 * ENTITY LOADING...
 */

/**
 * Entity load.
 * @param options
 */
jDrupal.Entity.prototype.load = function(options) {
  try {
    var _entity = this;
    var entityType = this.getEntityType();
    jDrupal.services.call({
      method: 'GET',
      path: entityType + '/' + this.id(),
      service: entityType,
      resource: 'retrieve',
      _format: 'json',
      success: function(data) {
        _entity.entity = data;
        var invocationParams = {};
        invocationParams[_entity.id()] = _entity;
        //jDrupal.moduleInvokeAll('entity_load', invocationParams, options);
        if (options.success) { options.success(data); }
      },
      error: function(xhr, status, message) {
        if (options.error) { options.error(xhr, status, message); }
      }
    });

  }
  catch (error) {
    console.log('jDrupal.Entity.load - ' + error);
  }
};

/**
 * ENTITY SAVING...
 */

/**
 * Entity pre save.
 * @param options
 */
jDrupal.Entity.prototype.preSave = function(options) {
  options.success();
};

/**
 * Entity save.
 * @param options
 */
jDrupal.Entity.prototype.save = function(options) {

  // Set aside "this" entity.
  var _entity = this;

  // Invoke the pre-save.
  this.preSave({
    success: function() {

      try {

        var entityType = _entity.getEntityType();
        var method = null;
        var resource = null;
        var path = null;

        var isNew = _entity.isNew();

        // Save new entity.
        if (isNew) {

          method = 'POST';
          resource = 'create';
          path = 'entity/' + entityType;

        }

        // Update existing entity.
        else {

          method = 'PATCH';
          resource = 'update';
          path = entityType + '/' + _entity.id();

        }

        // Make the call...
        jDrupal.services.call({
          method: method,
          contentType: 'application/json',
          path: path,
          service: entityType,
          resource: resource,
          data: _entity.stringify(),
          success: function(data) {

            _entity.postSave(data, {
              success: function() {

                //if (!isNew) {
                //  _entity_local_storage_delete(entityType, entity.id());
                //}

                // Move along..
                if (options.success) {
                  if (isNew) { options.success(data); } // 201 - Created
                  else { options.success(); } // 204 - No Content
                }

              }
            });

          },
          error: function(xhr, status, message) {
            if (options.error) { options.error(xhr, status, message); }
          }
        });

      }
      catch (error) {
        console.log('jDrupal.Entity.save - ' + error);
      }

    }
  });

};

/**
 * Entity post save.
 * @param data
 * @param options
 */
jDrupal.Entity.prototype.postSave = function(data, options) {
  // For new entities, set their id's value.
  if (this.isNew()) {
    var parts = data.split('/');
    var entityID =
      this.entity[this.getEntityKey('id')] = [ {
        value: parts[parts.length - 1]
      }];
  }
  options.success();
};

/**
 * ENTITY DELETING...
 */

/**
 * Entity pre delete.
 * @param options
 */
jDrupal.Entity.prototype.preDelete = function(options) {
  options.success();
};

/**
 * Entity delete.
 * @param options
 */
jDrupal.Entity.prototype.delete = function(options) {

  // Set aside "this" entity.
  var _entity = this;

  // Invoke the pre-delete.
  this.preDelete({
    success: function() {

      try {

        var entityType = _entity.getEntityType();

        // Build the necessary data to send along with the DELETE request.
        var data = {};
        data[_entity.getEntityKey('bundle')] = [ {
          target_id: _entity.getBundle()
        }];

        jDrupal.services.call({
          method: 'DELETE',
          contentType: 'application/json',
          path: entityType + '/' + _entity.id(),
          service: entityType,
          resource: 'delete',
          entity_type: entityType,
          bundle: _entity.getBundle(),
          data: JSON.stringify(data),
          _format: 'json',
          success: function() {

            //_entity_local_storage_delete(entity_type, entity_id);

            // Invoke the post-delete.
            _entity.postDelete({
              success: function() {

                // Move along...
                if (options.success) {
                  options.success(); // 204 - No Content
                }

              }
            });

          },
          error: function(xhr, status, message) {
            if (options.error) { options.error(xhr, status, message); }
          }
        });

      }
      catch (error) {
        console.log('jDrupal.Entity.delete - ' + error);
      }

    }
  });

};

/**
 * Entity post delete.
 * @param options
 */
jDrupal.Entity.prototype.postDelete = function(options) {
  // Clear out the entity and succeed.
  this.entity = null;
  options.success();
};

/**
 * HELPERS
 */

/**
 *
 * @param obj
 * @param entityID_or_entity
 */

// @TODO every function should live in the jDrupal namespace!
function jDrupalEntityConstructorPrep(obj, entityID_or_entity) {
  try {
    if (typeof entityID_or_entity === 'object') {
      obj.entity = entityID_or_entity;
    }
    else {
      var id = obj.getEntityKey('id');
      var entity = {};
      entity[id]= [ { value: entityID_or_entity } ];
      obj.entity = entity;
    }
  }
  catch (error) { console.log('jDrupalEntityConstructorPrep - ' + error); }
}











/**
 * Parses an entity id and returns it as an integer (not a string).
 * @param {*} entity_id
 * @return {Number}
 */
function entity_id_parse(entity_id) {
  try {
    var id = entity_id;
    if (typeof id === 'string') { id = parseInt(entity_id); }
    return id;
  }
  catch (error) { console.log('entity_id_parse - ' + error); }
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
    if (!jDrupal.isInt(ids)) {
      // @TODO - if an array of ints is sent in, call entity_index() instead.
      var msg = 'entity_load(' + entity_type + ') - only single ids supported!';
      console.log(msg);
      return;
    }
    var entity_id = ids;
    // Convert the id to an int, if it's a string.
    entity_id = entity_id_parse(entity_id);
    // If this entity is already queued for retrieval, set the success and
    // error callbacks aside, and return. Unless entity caching is enabled and
    // we have a copy of the entity in local storage, then send it to the
    // provided success callback.
    if (_services_queue_already_queued(
      entity_type,
      'retrieve',
      entity_id,
      'success'
    )) {
      if (jDrupal.settings.cache.entity.enabled) {
        entity = _entity_local_storage_load(entity_type, entity_id, options);
        if (entity) {
          if (options.success) { options.success(entity); }
          return;
        }
      }
      if (typeof options.success !== 'undefined') {
        _services_queue_callback_add(
          entity_type,
          'retrieve',
          entity_id,
          'success',
          options.success
        );
      }
      if (typeof options.error !== 'undefined') {
        _services_queue_callback_add(
          entity_type,
          'retrieve',
          entity_id,
          'error',
          options.error
        );
      }
      return;
    }

    // This entity has not been queued for retrieval, queue it and its callback.
    _services_queue_add_to_queue(entity_type, 'retrieve', entity_id);
    _services_queue_callback_add(
      entity_type,
      'retrieve',
      entity_id,
      'success',
      options.success
    );

    // If entity caching is enabled, try to load the entity from local storage.
    // If a copy is available in local storage, send it to the success callback.
    var entity = false;
    if (jDrupal.settings.cache.entity.enabled) {
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
          if (jDrupal.settings.cache.entity &&
              jDrupal.settings.cache.entity.enabled) {
            // Set the expiration time as a property on the entity that can be
            // used later.
            if (jDrupal.settings.cache.entity.expiration !== 'undefined') {
              var expiration = jDrupal.time() + jDrupal.settings.cache.entity.expiration;
              if (jDrupal.settings.cache.entity.expiration == 0) {
                expiration = 0;
              }
              entity.expiration = expiration;
            }
            // Save the entity to local storage.
            _entity_local_storage_save(entity_type, entity_id, entity);
          }
          // Send the entity back to the queued callback(s).
          var _success_callbacks =
            jDrupal.services_queue[entity_type]['retrieve'][entity_id].success;
          for (var i = 0; i < _success_callbacks.length; i++) {
            _success_callbacks[i](entity);
          }
          // Clear out the success callbacks.
          jDrupal.services_queue[entity_type]['retrieve'][entity_id].success =
            [];
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
    if (jDrupal.functionExists(function_name)) {
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
      // retrieval from jDrupal. Otherwise return the local storage entity copy.
      if (typeof entity.expiration !== 'undefined' &&
          entity.expiration != 0 &&
          jDrupal.time() > entity.expiration) {
        _entity_local_storage_delete(entity_type, entity_id);
        entity = false;
      }
      else {
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
        // Is anyone declaring the primary key for this entity type?
        var function_name = entity_type + '_primary_key';
        if (jDrupal.functionExists(function_name)) {
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
 * Given a Location header for an entity from a 201 response, this will return
 * the entity id.
 * @param {String} location
 * @return {Number}
 */
function entity_id_from_location(location) {
  try {
    return location.split('/').pop();
  }
  catch (error) { console.log('entity_id_from_location - ' + error); }
}


// @see https://api.drupal.org/api/drupal/core!modules!comment!src!Entity!Comment.php/class/Comment/8

/**
 * Comment
 * @param {Number|Object} cid_or_comment
 * @constructor
 */
jDrupal.Comment = function(cid_or_comment) {

  // Set the entity keys.
  this.entityKeys['type'] = 'comment';
  this.entityKeys['bundle'] = 'comment_type';
  this.entityKeys['id'] = 'cid';

  // Prep the entity.
  jDrupalEntityConstructorPrep(this, cid_or_comment);

};

// Extend the entity prototype.
jDrupal.Comment.prototype = new jDrupal.Entity;
jDrupal.Comment.prototype.constructor = jDrupal.Comment;

/**
 *
 * @returns {*}
 */
jDrupal.Comment.prototype.getSubject = function() {
  return this.entity.subject[0].value;
};

/**
 *
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
  try {

    // Remove protected fields.
    //var protected_fields = [
    //  'cid'
    //];
    //for (var i = 0; i < protected_fields.length; i++) {
    //  delete this.entity[protected_fields[i]];
    //}

    // Continue along...
    options.success();
  }
  catch (error) {
    console.log('jDrupal.Comment.preSave - ' + error);
  }

};

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

/**
 * PROXIES
 */

/**
 *
 * @param cid
 * @param options
 * @returns {jDrupal.Comment}
 */
//jDrupal.commentLoad = function(cid, options) {
//  var comment = new jDrupal.Comment(cid);
//  comment.load(options);
//  return comment;
//};


// @see https://api.drupal.org/api/drupal/core!modules!node!src!Entity!Node.php/class/Node/8

/**
 * Node
 * @param {Number|Object} nid_or_node
 * @constructor
 */
jDrupal.Node = function(nid_or_node) {

  // Set the entity keys.
  this.entityKeys['type'] = 'node';
  this.entityKeys['bundle'] = 'type';
  this.entityKeys['id'] = 'nid';

  // Prep the entity.
  jDrupalEntityConstructorPrep(this, nid_or_node);

  // Set default values.
  if (!this.entity.title) {
    this.entity.title = [ { value: '' }];
  }

};

// Extend the entity prototype.
jDrupal.Node.prototype = new jDrupal.Entity;
jDrupal.Node.prototype.constructor = jDrupal.Node;

/**
 *
 * @returns {*}
 */
jDrupal.Node.prototype.getTitle = function() {
  return this.entity.title[0].value;
};

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

jDrupal.Node.prototype.preSave = function(options) {
  try {

    // Remove protected fields.
    var protected_fields = [
      'changed',
      'revision_timestamp',
      'revision_uid'
    ];
    for (var i = 0; i < protected_fields.length; i++) {
      delete this.entity[protected_fields[i]];
    }

    // Continue along...
    options.success();
  }
  catch (error) {
    console.log('jDrupal.Node.preSave - ' + error);
  }

};

/**
 * PROXIES
 */

/**
 *
 * @param nid
 * @param options
 * @returns {jDrupal.Node}
 */
//jDrupal.nodeLoad = function(nid, options) {
//  var node = new jDrupal.Node(nid);
//  node.load(options);
//  return node;
//};



/**
 * User
 * @param {Number|Object} uid_or_account
 * @constructor
 * @see https://api.drupal.org/api/drupal/core!modules!user!src!Entity!User.php/class/User/8
 */
jDrupal.User = function(uid_or_account) {

  // Set the entity keys.
  this.entityKeys['type'] = 'user';
  this.entityKeys['bundle'] = 'user';
  this.entityKeys['id'] = 'uid';

  // Prep the entity.
  jDrupalEntityConstructorPrep(this, uid_or_account);

  // Set default values.

};

// Extend the entity prototype.
jDrupal.User.prototype = new jDrupal.Entity;
jDrupal.User.prototype.constructor = jDrupal.User;

/**
 *
 * @returns {*}
 */
jDrupal.User.prototype.getAccountName = function() {
  return this.entity.name[0].value;
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
 *
 * @param uid
 * @param options
 * @returns {jDrupal.User}
 */
//jDrupal.userLoad = function(uid, options) {
//  var account = new jDrupal.User(uid);
//  account.load(options);
//  return account;
//};

/**
 * HELPERS
 */

/**
 *
 * @returns {jDrupal.User}
 */
function jDrupalUserDefaults() {
  return new jDrupal.User({
    uid: [ { value: 0 } ],
    roles: [ { target_id: 'anonymous' }]
  });
}

/**
 * Sets the current user account object.
 * @param {Object} account
 */
function jDrupalSetCurrentUser(account) {
  jDrupal._currentUser = account;
}

/**
 * Generates a random user password.
 * @return {String}
 */
jDrupal.userPassword = function() {
  try {
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
  }
  catch (error) { console.log('jDrupal.userPassword - ' + error); }
};
