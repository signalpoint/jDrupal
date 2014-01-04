/**
 * System connect call.
 * @param {Object} options
 */
function system_connect(options) {
  try {

    // Build a system connect object.
    var system_connect = {
      service: 'system',
      resource: 'connect',
      method: 'POST',
      path: 'system/connect.json',
      success: function(data) {
        try {
          Drupal.user = data.user;
          if (options.success) { options.success(data); }
        }
        catch (error) { console.log('system_connect - success - ' + error); }
      },
      error: function(xhr, status, message) {
        try {
          if (options.error) { options.error(xhr, status, message); }
        }
        catch (error) { console.log('system_connect - error - ' + error); }
      }
    };

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
                'system_connect - services_csrf_token - success - ' + message
              );
            }
          },
          error: function(xhr, status, message) {
            try {
              if (options.error) { options.error(xhr, status, message); }
            }
            catch (error) {
              console.log(
                'system_connect - services_csrf_token - error - ' + message
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
    console.log('system_connect - ' + error);
  }
}

