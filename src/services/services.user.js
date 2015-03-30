/**
 * Creates a user.
 * @param {Object} account
 * @param {Object} options
 */
function user_create(account, options) {
  try {
    services_resource_defaults(options, 'user', 'create');
    entity_create('user', null, account, options);
  }
  catch (error) { console.log('user_create - ' + error); }
}

/**
 * Retrieves a user.
 * @param {Number} ids
 * @param {Object} options
 */
function user_retrieve(ids, options) {
  try {
    services_resource_defaults(options, 'user', 'retrieve');
    entity_retrieve('user', ids, options);
  }
  catch (error) { console.log('user_retrieve - ' + error); }
}

/**
 * Updates a user.
 * @param {Object} account
 * @param {Object} options
 */
function user_update(account, options) {
  try {
    var mode = 'create';
    if (account.uid) { mode = 'update'; }
    services_resource_defaults(options, 'user', mode);
    entity_update('user', null, account, options);
  }
  catch (error) { console.log('user_update - ' + error); }
}

/**
 * Delete a user.
 * @param {Number} uid
 * @param {Object} options
 */
function user_delete(uid, options) {
  try {
    services_resource_defaults(options, 'user', 'create');
    entity_delete('user', uid, options);
  }
  catch (error) { console.log('user_delete - ' + error); }
}

/**
 * Perform a user index.
 * @param {Object} query
 * @param {Object} options
 */
function user_index(query, options) {
  try {
    services_resource_defaults(options, 'user', 'create');
    entity_index('user', query, options);
  }
  catch (error) { console.log('user_index - ' + error); }
}

/**
 * Registers a user.
 * @param {Object} account
 * @param {Object} options
 */
function user_register(account, options) {
  try {
    Drupal.services.call({
        service: 'user',
        resource: 'register',
        method: 'POST',
        path: 'user/register.json',
        data: JSON.stringify(account),
        success: function(data) {
          try {
            if (options.success) { options.success(data); }
          }
          catch (error) { console.log('user_register - success - ' + error); }
        },
        error: function(xhr, status, message) {
          try {
            if (options.error) { options.error(xhr, status, message); }
          }
          catch (error) { console.log('user_register - error - ' + error); }
        }
    });
  }
  catch (error) { console.log('user_retrieve - ' + error); }
}

/**
 * Login user.
 * @param {String} name
 * @param {String} pass
 * @param {Object} options
 */
function user_login(name, pass, options) {
  try {
    var valid = true;
    if (!name || typeof name !== 'string') {
      valid = false;
      console.log('user_login - invalid name');
    }
    if (!pass || typeof pass !== 'string') {
      valid = false;
      console.log('user_login - invalid pass');
    }
    if (!valid) {
      if (options.error) { options.error(null, 406, 'user_login - bad input'); }
      return;
    }
    Drupal.services.call({
        service: 'user',
        resource: 'login',
        method: 'POST',
        path: 'user/login.json',
        data: 'username=' + encodeURIComponent(name) +
             '&password=' + encodeURIComponent(pass),
        success: function(data) {
          try {
            // Now that we are logged in, we need to get a new CSRF token, and
            // then make a system connect call.
            Drupal.user = data.user;
            Drupal.sessid = null;
            services_get_csrf_token({
                success: function(token) {
                  try {
                    if (options.success) {
                      system_connect({
                          success: function(result) {
                            try {
                              if (options.success) { options.success(data); }
                            }
                            catch (error) {
                              console.log(
                                'user_login - system_connect - success - ' +
                                error
                              );
                            }
                          },
                          error: function(xhr, status, message) {
                            try {
                              if (options.error) {
                                options.error(xhr, status, message);
                              }
                            }
                            catch (error) {
                              console.log(
                                'user_login - system_connect - error - ' +
                                error
                              );
                            }
                          }
                      });
                    }
                  }
                  catch (error) {
                    console.log(
                      'user_login - services_get_csrf_token - success - ' +
                      error
                    );
                  }
                },
                error: function(xhr, status, message) {
                  console.log(
                    'user_login - services_get_csrf_token - error - ' +
                    message
                  );
                  if (options.error) { options.error(xhr, status, message); }
                }
            });
          }
          catch (error) { console.log('user_login - success - ' + error); }
        },
        error: function(xhr, status, message) {
          try {
            if (options.error) { options.error(xhr, status, message); }
          }
          catch (error) { console.log('user_login - error - ' + error); }
        }
    });
  }
  catch (error) {
    console.log('user_login - ' + error);
  }
}

/**
 * Logout current user.
 * @param {Object} options
 */
function user_logout(options) {
  try {
    Drupal.services.call({
        service: 'user',
        resource: 'logout',
        method: 'POST',
        path: 'user/logout.json',
        success: function(data) {
          try {
            // Now that we logged out, clear the sessid and call system connect.
            Drupal.user = drupal_user_defaults();
            Drupal.sessid = null;
            system_connect({
                success: function(result) {
                  try {
                    if (options.success) { options.success(data); }
                  }
                  catch (error) {
                    console.log(
                      'user_logout - system_connect - success - ' +
                      error
                    );
                  }
                },
                error: function(xhr, status, message) {
                  try {
                    if (options.error) { options.error(xhr, status, message); }
                  }
                  catch (error) {
                    console.log(
                      'user_logout - system_connect - error - ' +
                      error
                    );
                  }
                }
            });
          }
          catch (error) { console.log('user_logout - success - ' + error); }
        },
        error: function(xhr, status, message) {
          try {
            if (options.error) { options.error(xhr, status, message); }
          }
          catch (error) { console.log('user_logout - error - ' + error); }
        }
    });
  }
  catch (error) {
    console.log('user_login - ' + error);
  }
}

/**
 * The "request_new_password" service resource.
 * @param {String} name User name or e-mail address.
 * @param {Object} options
 */
function user_request_new_password(name, options) {
  try {
    if (typeof options.data === 'undefined') { options.data = { }; }
    options.data.name = name;
    options.data = JSON.stringify(options.data);
    options.method = 'POST';
    options.path = 'user/request_new_password.json';
    options.service = 'user';
    options.resource = 'request_new_password';
    Drupal.services.call(options);
  }
  catch (error) { console.log('user_request_new_password - ' + error); }
}

