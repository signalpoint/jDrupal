/**
 * System connect call.
 * @param {Object} options
 */
jDrupal.connect = function(options) {
  try {

    var service = {

      service: 'jdrupal',
      resource: 'connect',
      method: 'get',
      path: 'jdrupal/connect',
      _format: 'json',

      success: function(result) {
        try {

          // Set the current user...

          // Anonymous users.
          if (result.uid == 0) {

            // Create a default user account object and set it, then continue...
            jDrupalSetCurrentUser(jDrupalUserDefaults());
            options.success();

          }

          // Authenticated users.
          else {

            // Load the user's account from Drupal.
            var account = jDrupal.userLoad(result.uid, {
              success: function() {

                // Set the current user and continue...
                jDrupalSetCurrentUser(account);
                options.success();

              }
            });

          }
        }
        catch (error) { console.log('jDrupal.connect - success - ' + error); }
      },
      error: function(xhr, status, message) {
        try {
          if (options.error) { options.error(xhr, status, message); }
        }
        catch (error) { console.log('jDrupal.connect - error - ' + error); }
      }
    };
    jDrupal.services.call(service);
  }
  catch (error) {
    console.log('jDrupal.connect - ' + error);
  }
};