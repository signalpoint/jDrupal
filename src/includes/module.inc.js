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
      for (var module in Drupal.modules) {
          if (function_exists(module + '_' + hook)) {
            modules_that_implement.push(module);
          }
      }
    }
    if (modules_that_implement.length == 0) { return false; }
    return modules_that_implement;
  }
  catch (error) {
    console.log('module_implements - ' + error);
  }
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
    if (drupalgap_module_load(module)) {
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
    return module_invocation_results;
  }
  catch (error) {
    console.log('module_invoke - ' + error);
  }
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
    if (Drupal.settings.debug) { console.log('module_invoke_all - ' + hook); }
    // Prepare the invocation results.
    module_invoke_results = new Array();
    // Copy the arguments and remove the hook name from the first index so the
    // rest can be passed along to the hook.
    var module_arguments = Array.prototype.slice.call(arguments);
    module_arguments.splice(0, 1);
    // Try to fire the hook in every module.
    module_invoke_continue = true;
    for (var name in Drupal.modules) {
      console.log(name);
      var function_name = name + '_' + hook;
      if (function_exists(function_name)) {
        console.log(function_name);
        // If there are no arguments, just call the hook directly,
        // otherwise call the hook and pass along all the arguments.
        var invocation_results = null;
        if (Object.getOwnPropertyNames(module_arguments).length == 0) {
          invocation_results = module_invoke(name, hook);
        }
        else {
          // Place the module name and hook name on the front of the
          // arguments.
          module_arguments.unshift(name, hook);
          var fn = window['module_invoke'];
          invocation_results = fn.apply(null, module_arguments);
          module_arguments.splice(0, 2);
        }
        if (typeof invocation_results !== 'undefined') {
          module_invoke_results.push(invocation_results);
        }
      }
    }
    return module_invoke_results;
  }
  catch (error) {
    console.log('module_invoke_all - ' + error);
  }
}

/**
 * Given a module name, this will return the module inside drupalgap.modules.
 * @param {String} name
 * @return {Object}
 */
function module_load(name) {
  try {
    return Drupal.modules[name];
  }
  catch (error) { alert('module_load - ' + error); }
}

