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
