/**
 * Login user.
 * @param {String} name
 * @param {String} pass
 * @param {Object} options
 */
jDrupal.userLogin = function(name, pass, options) {
  try {

    jDrupal.services.call({
      service: 'user',
      resource: 'login',
      method: 'POST',
      path: 'user/login',
      data: 'name=' + encodeURIComponent(name) +
      '&pass=' + encodeURIComponent(pass) +
      '&form_id=user_login_form',
      success: function(account) {
        try {

          // Since Drupal only returns a 200 OK to us, we don't have much
          // opportunity to make a decision here yet. So let's do a connect
          // call to get the current user id, then load the user's account.

          jDrupal.connect({
            success: function() {
              if (options.success) { options.success(); }
            },
            error: function(xhr, status, message) {
              console.log('jDrupalUserLogin -> jDrupalConnect | error');
              console.log(arguments);
            }
          });

          // Now that we are logged in, we need to get a new CSRF token...

        }
        catch (error) { console.log('jDrupal.userLogin - success - ' + error); }
      },
      error: function(xhr, status, message) {
        try {
          if (options.error) { options.error(xhr, status, message); }
        }
        catch (error) { console.log('jDrupal.userLogin - error - ' + error); }
      }
    });

  }
  catch (error) {
    console.log('jDrupal.userLogin - ' + error);
  }
};

/**
 * Logout current user.
 * @param {Object} options
 */
jDrupal.userLogout = function(options) {
  try {
    jDrupal.services.call({
      service: 'user',
      resource: 'logout',
      method: 'GET',
      path: 'user/logout',
      Accept: 'text/html',
      success: function(data) {
        try {

          // Now that we logged out, clear the user and sessid, then make a
          // fresh connection.

          jDrupalSetCurrentUser(jDrupalUserDefaults());

          //jDrupal.sessid = null;

          jDrupal.connect({
            success: function() {
              try {
                if (options.success) { options.success(); }
              }
              catch (error) {
                console.log(
                  'jDrupal.userLogout - connect - success - ' +
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
                  'jDrupal.userLogout - connect - error - ' +
                  error
                );
              }
            }
          });
        }
        catch (error) { console.log('jDrupal.userLogout - success - ' + error); }
      },
      error: function(xhr, status, message) {
        try {
          if (options.error) { options.error(xhr, status, message); }
        }
        catch (error) { console.log('jDrupal.userLogout - error - ' + error); }
      }
    });
  }
  catch (error) {
    console.log('jDrupal.userLogout - ' + error);
  }
};
