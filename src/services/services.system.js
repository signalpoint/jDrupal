/**
 * System connect call.
 * @param {Object} options
 */
jDrupal.Connect = function(options) {
  try {

    var service = {

      service: 'jdrupal',
      resource: 'connect',
      method: 'get',
      path: 'jdrupal/connect',
      _format: 'json',

      success: function(result) {
        try {

          console.log(result);

          //jDrupal.csrf_token = result.csrfToken;

          console.log('connected, still');

          // Load the user's account from Drupal.
          var account = new jDrupal.User(result.uid, {
            success: function() {

              // Set the current user.
              jDrupalSetCurrentUser(account);

              // Now that we've set some contexts, it's safe to return to the
              // connect caller, since they'll be able to use our prototypes
              // and functions to develop.
              options.success();

            }
          });

        }
        catch (error) { console.log('jDrupal.Connect - success - ' + error); }
      },
      error: function(xhr, status, message) {
        try {
          if (options.error) { options.error(xhr, status, message); }
        }
        catch (error) { console.log('jDrupal.Connect - error - ' + error); }
      }
    };
    jDrupal.services.call(service);
  }
  catch (error) {
    console.log('jDrupal.Connect - ' + error);
  }
};