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
  if (jDrupal.isEmpty(modules)) { return Promise.resolve(); }

  for (var i = 0; i < modules.length; i++) {
    // If there are no arguments, just call the hook directly,
    // otherwise call the hook and pass along all the arguments.
    var invocation_results = null;
    if (module_arguments.length == 0) {
      promises.push(jDrupal.moduleInvoke(modules[i], hook));
    }
    else {
      // Place the module name and hook name on the front of the
      // arguments.
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
