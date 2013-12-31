/**
 * System connect call.
 * @param {Object} options
 */
function system_connect(options) {
  try {
    Drupal.services.call({
        method: 'POST',
        path: 'system/connect.json',
        success: function(data) {
          Drupal.user = data.user;
          if (options.success) { options.success(data); }
        },
        error: function(xhr, status, message) {
          if (options.error) { options.error(xhr, status, message); }
        }
    });
  }
  catch (error) {
    console.log('system_connect - ' + error);
  }
}

