/**
 * System connect call.
 * @param {Object} options
 */
function jdrupal_connect(options) {
  try {


    var jdrupal_connect = {
      service: 'jdrupal',
      resource: 'connect',
      method: 'GET',
      path: 'jdrupal/connect',
      success: function(result) {
        try {
          // If the user is authenticated load their user account, otherwise
          // just proceed as an anonymous user.
          if (result.account.uid) {
            user_load(result.account.uid, {
                success: function(account) {
                  Drupal.user = account;
                  if (options.success) { options.success(result); }
                }
            });
            Drupal.user.name = [{ value: result.account.name }];
          }
          else if (options.success) { options.success(result); }

        }
        catch (error) { console.log('jdrupal_connect - success - ' + error); }
      },
      error: function(xhr, status, message) {
        try {
          if (options.error) { options.error(xhr, status, message); }
        }
        catch (error) { console.log('jdrupal_connect - error - ' + error); }
      }
    };

    Drupal.services.call(jdrupal_connect);
    return;

    // If we don't have a token, grab one first.
    if (!Drupal.csrf_token) {
      services_get_csrf_token({
          success: function(token) {
            try {
              if (options.debug) { console.log('Grabbed new token.'); }
              // Now that we have a token, make the system connect call.
              Drupal.csrf_token = true;
              Drupal.services.call(system_connect);
            }
            catch (error) {
              console.log(
                'jdrupal_connect - services_csrf_token - success - ' + message
              );
            }
          },
          error: function(xhr, status, message) {
            try {
              if (options.error) { options.error(xhr, status, message); }
            }
            catch (error) {
              console.log(
                'jdrupal_connect - services_csrf_token - error - ' + message
              );
            }
          }
      });
    }
    else {
      // We already have a token, make the system connect call.
      if (options.debug) { console.log('Token already available.'); }
      Drupal.services.call(system_connect);
    }
  }
  catch (error) {
    console.log('jdrupal_connect - ' + error);
  }
}

