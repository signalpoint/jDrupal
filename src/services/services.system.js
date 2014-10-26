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

    // Normally we would grab a token here (if we didn't already have one), but
    // the CSRF token is not available in D6 Services, so we'll call System
    // Connect without one.
    Drupal.services.call(system_connect);
  }
  catch (error) {
    console.log('system_connect - ' + error);
  }
}

