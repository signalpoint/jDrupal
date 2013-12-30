/**
 * Add additional properties to the Drupal JSON object.
 */
Drupal.sessid = null;
Drupal.user = drupal_user_defaults();

/**
 * Given a JSON object or string, this will print it to the console.
 */
function dpm(data) {
  if (data) {
    if (typeof data === 'object') { console.log(JSON.stringify(data)); }
    else { console.log(data); }
  }
}

/**
 * Returns a default JSON object for Drupal.
 */
function drupal_init() {
  return {
    settings:{
      site_path:"",
      base_path:"/",
      language_default:"und"
    }
  };
}

/**
 * Returns a default JSON object representing an anonymous Drupal user account.
 */
function drupal_user_defaults() {
  return {
    "uid":"0",
    "roles":{"1":"anonymous user"}
  };
}

/**
 *
 */
function entity_assemble_data(entity_type, bundle, entity, options) {
  try {
    var data = '';
    for (var property in entity) {
      console.log(property);
      if (entity.hasOwnProperty(property)) {
        data += property + '=' + encodeURIComponent(entity[property]) + '&';
      }
    }
    if (data != '') { data = data.substring(0, data.length - 1); }
    return data;
  }
  catch (error) { console.log('entity_assemble_data - ' + error); }
}

/**
 *
 */
function entity_save(entity_type, bundle, entity, options) {
  try {
    switch(entity_type) {
      case 'node':
        if (!entity.language) { entity.language = language_default(); }
        if (!entity.nid) {
          node_create(entity, options);
        }
        else {
          node_update(entity, options);
        }
        break;
      default:
        console.log('WARNING: entity_save - unsupported type: ' + entity_type);
        break;
    }
  }
  catch (error) { console.log('entity_save - ' + error); }
}

/**
 * Given a JS function name, this returns true if the function exists in the
 * scope, false otherwise.
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
 */
function http_status_code_title(status) {
  try {
    var title = "";
    switch (status) {
      case 200: title = "OK"; break;
      case 401: title = "Unauthorized"; break;
      case 404: title = "Not Found"; break;
      case 406: title = "Not Acceptable"; break;
    }
    return title;  
  }
  catch (error) {
    console.log('http_status_code_title - ' + error);
  }
}

/**
 *
 */
function language_default() {
  try {
    return Drupal.settings.language_default;
  }
  catch (error) { console.log('language_default - ' + error); }
}

/**
 *
 */
function node_save(node, options) {
  try {
    entity_save('node', node.type, node, options);
  }
  catch (error) { console.log('entity_save - ' + error); }
}

/**
 * Checks if the needle string, is in the haystack array. Returns true if it is
 * found, false otherwise. Credit: http://stackoverflow.com/a/15276975/763010
 */
function in_array(needle, haystack) {
  return (haystack.indexOf(needle) > -1);
}

/***********************|
 *                      |
 * Drupal Services Core |
 *                      |
 ***********************/

Drupal.services = {};

/**
 *
 */
function entity_create(entity_type, bundle, entity, options) {
  try {
    Drupal.services.call({
        method:options.method,
        path:options.path,
        data:entity_assemble_data(entity_type, bundle, entity, options),
        success:function(data){
          options.success(data);
        }
    });
  }
  catch (error) { console.log('entity_create - ' + error); }
}

/**
 *
 */
function node_create(node, options) {
  try {
    options.method = "POST";
    options.path = "node.json";
    entity_create('node', node.type, node, options);
  }
  catch (error) { console.log('node_create - ' + error); }
}

// System Connect
function system_connect(options) {
  try {
    Drupal.services.call({
        method:"POST",
        path:"system/connect.json",
        success:function(data){
          Drupal.user = data.user;
          options.success(data);
        }
    });
  }
  catch (error) {
    console.log('system_connect - ' + error);
  }
}

// User Login
function user_login(options) {
  try {
    Drupal.services.call({
        method:"POST",
        path:"user/login.json",
        data:"username=" + encodeURIComponent(options.name) + 
             "&password=" + encodeURIComponent(options.pass),
        success:function(data){
          Drupal.user = data.user;
          // Now that we are logged in, we need to get a new CSRF token.
          var token_request = new XMLHttpRequest();
          var token_url = Drupal.settings.site_path +
                    Drupal.settings.base_path +
                    '?q=services/session/token';
          // Token Request Success Handler
          token_request.onload = function(e) {
            if (token_request.readyState == 4) {
              var title = token_request.status + " - " +
                http_status_code_title(token_request.status);
              if (token_request.status != 200) { // Not OK
                console.log('user_login - ' + token_url + ' - ' + title);
                console.log(token_request.responseText);
              }
              else { // OK
                // Save the token to local storage as sessid, set Drupal.sessid
                // with the token, then return the user login data to the
                // success function.
                //token = JSON.parse(token_request.responseText);
                token = token_request.responseText;
                window.localStorage.setItem('sessid', token);
                Drupal.sessid = token;
                dpm('got new token after user login: ' + token);
                options.success(data);
              }
            }
            else {
              console.log('user_login token_request.readyState = ' + token_request.readyState);
            }
          }
          
          // Open the token request.
          token_request.open('GET', token_url, true);
          
          // Send the token request.
          dpm('grabbing new token after user login...');
          token_request.send(null);
          
          //Drupal.sessid = data.sessid;
          //window.localStorage.setItem('sessid', data.sessid);
          //options.success(data);
        }
    });
  }
  catch (error) {
    console.log('user_login - ' + error);
  }
}
// User Logout
function user_logout(options) {
  try {
    Drupal.services.call({
        method:"POST",
        path:"user/logout.json",
        success:function(data){
          Drupal.user = drupal_user_defaults();
          Drupal.sessid = null;
          window.localStorage.removeItem('sessid');
          options.success(data);
        }
    });
  }
  catch (error) {
    console.log('user_login - ' + error);
  }
}
// User Register
function user_register(options) {
  try {
    Drupal.services.call({
        method:"POST",
        path:"user/register.json",
        data:"name=" + encodeURIComponent(options.name) + 
             "&mail=" + encodeURIComponent(options.mail),
        success:function(data){
          Drupal.user = data.user;
          options.success(data);
        }
    });
  }
  catch (error) {
    console.log('user_register - ' + error);
  }
}

/**
 * Drupal Services XMLHttpRequest Object
 */
Drupal.services.call = function(options) {
  try {
    // Build the Request, URL and extract the HTTP method.
    var request = new XMLHttpRequest();
    var url = Drupal.settings.site_path + 
              Drupal.settings.base_path + '?q=' +
              Drupal.settings.endpoint + '/' + options.path;
    var method = options.method.toUpperCase();
    console.log(method + ': ' + url);
    
    // Request Success Handler
    request.onload = function(e) {
      if (request.readyState == 4) {
        var title = request.status + " - " +
          http_status_code_title(request.status);
        if (request.status != 200) { // Not OK
          console.log(url + " - " + title);
          console.log(request.responseText);
        }
        else { // OK
          options.success(JSON.parse(request.responseText));
        }
      }
      else {
        console.log('request.readyState = ' + request.readyState);
      }
    }
    
    // Generate Token and Make the Request.
    Drupal.services.csrf_token(method, url, request, {
        "path":options.path,
        success:function(token){
          
          // Open the request.
          request.open(method, url, true);
          
          // Set any headers.
          if (method == 'POST') {
            request.setRequestHeader(
              "Content-type",
              "application/x-www-form-urlencoded"
            );
          }
    
          if (token) {
            dpm('Adding token to header: ' + token);
            request.setRequestHeader("X-CSRF-Token", token);
          }
          if (typeof options.data !== 'undefined') {
            if (options.path != 'user/login.json') { console.log(options.data); }
            request.send(options.data);
          }
          else { request.send(null); }      
        }
    });
  }
  catch (error) {
    console.log('Drupal.services.call - error - ' + error);
  }
};

/**
 * Drupal Services CSRF TOKEN
 */
Drupal.services.csrf_token = function(method, url, request, options) {
  try {
    var token = false;
    // Do we potentially need a token for this call? We most likely need one if
    // the call option's type is not one of these types.
    if (!in_array(method, ['GET', 'HEAD', 'OPTIONS', 'TRACE'])) {
      // Anonymous users don't need the CSRF token, unless we're calling system
      // connect, then we need to pass along the token if we have one.
      if (Drupal.user.uid == 0 && options.path != 'system/connect.json') {
        dpm(method + ' - anonymous token not needed');
        options.success(false);
        return;
      }
      // Is there a token available in local storage?
      token = window.localStorage.getItem('sessid');
      if (token) {
        dpm('grabbed token from local storage: ' + token);
      }
      // If we don't already have a token, is there one on Drupal.sessid?
      if (!token && Drupal.sessid) {
        token = Drupal.sessid;
        dpm('Grabbed token from drupal: ' + token);
      }
      // If we still don't have a token to use, let's grab one from Drupal.
      if (!token) {
        // Build the Request, URL and extract the HTTP method.
        var token_request = new XMLHttpRequest();
        var token_url = Drupal.settings.site_path +
                  Drupal.settings.base_path +
                  '?q=services/session/token';
        // Token Request Success Handler
        token_request.onload = function(e) {
          if (token_request.readyState == 4) {
            var title = token_request.status + " - " +
              http_status_code_title(token_request.status);
            console.log('TOKEN REQUEST COMPLETE: ' + title);
            if (token_request.status != 200) { // Not OK
              console.log(token_url + " - " + title);
              console.log(token_request.responseText);
            }
            else { // OK
              // Save the token to local storage as sessid, set Drupal.sessid
              // with the token, then return the token to the success function.
              dpm(token_request.responseText);
              token = token_request.responseText;
              dpm('Grabbed a new token, saving it to local storage: ' + token);
              window.localStorage.setItem('sessid', token);
              Drupal.sessid = token;
              options.success(token);
            }
          }
          else {
            console.log('token_request.readyState = ' + token_request.readyState);
          }
        }
        
        // Open the token request.
        token_request.open('GET', token_url, true);
        
        // Send the token request.
        dpm(token_url + ' - previous token not available, grabbing one...');
        token_request.send(null);
      }
      else {
        // We had a previous token available, let's use it.
        dpm(method + ' - previous token available and being used');
        Drupal.sessid = token;
        options.success(token);
      }
    }
    else {
      dpm(method + ' - token not needed');
      // This call's HTTP method doesn't need a token, so we return via the
      // success function.
      options.success(false);
    }
  }
  catch (error) {
    console.log('Drupal.services.call - error - ' + error);
  }
};

