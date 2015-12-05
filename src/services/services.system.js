/**
 * System connect call.
 * @param {Object} options
 */
function jDrupal_connect(options) {
  try {

    var jDrupal_connect = {
      service: 'jdrupal',
      resource: 'connect',
      method: 'get',
      path: 'jdrupal/connect',
      _format: 'json',
      success: function(result) {
        try {
          options.success(result);
          return;
          // If the user is authenticated load their user account, otherwise
          // just proceed as an anonymous user.
          if (result.account.uid) {
            user_load(result.account.uid, {
                success: function(account) {
                  jDrupal.user = account;
                  if (options.success) { options.success(result); }
                }
            });
          }
          else if (options.success) { options.success(result); }
        }
        catch (error) { console.log('jDrupal_connect - success - ' + error); }
      },
      error: function(xhr, status, message) {
        try {
          if (options.error) { options.error(xhr, status, message); }
        }
        catch (error) { console.log('jDrupal_connect - error - ' + error); }
      }
    };

    jDrupal.services.call(jDrupal_connect);
    return;

    // If we don't have a token, grab one first.
    if (!jDrupal.csrf_token) {
      services_get_csrf_token({
          success: function(token) {
            try {
              if (options.debug) { console.log('Grabbed new token.'); }
              // Now that we have a token, make the system connect call.
              jDrupal.csrf_token = true;
              jDrupal.services.call(system_connect);
            }
            catch (error) {
              console.log(
                'jDrupal_connect - services_csrf_token - success - ' + message
              );
            }
          },
          error: function(xhr, status, message) {
            try {
              if (options.error) { options.error(xhr, status, message); }
            }
            catch (error) {
              console.log(
                'jDrupal_connect - services_csrf_token - error - ' + message
              );
            }
          }
      });
    }
    else {
      // We already have a token, make the system connect call.
      if (options.debug) { console.log('Token already available.'); }
      jDrupal.services.call(system_connect);
    }
  }
  catch (error) {
    console.log('jDrupal_connect - ' + error);
  }
}

