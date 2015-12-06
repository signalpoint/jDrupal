/**
 * System connect call.
 * @param {Object} options
 */
function jDrupalConnect(options) {
  try {

    var service = {

      service: 'jdrupal',
      resource: 'connect',
      method: 'get',
      path: 'jdrupal/connect',
      _format: 'json',

      success: function(result) {
        try {

          console.log('connected, still');

          // Load the user's account from Drupal.
          var account = new jDrupal.User(result.currentUser.uid, {
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
        catch (error) { console.log('jDrupalConnect - success - ' + error); }
      },
      error: function(xhr, status, message) {
        try {
          if (options.error) { options.error(xhr, status, message); }
        }
        catch (error) { console.log('jDrupalConnect - error - ' + error); }
      }
    };
    jDrupal.services.call(service);
  }
  catch (error) {
    console.log('jDrupalConnect - ' + error);
  }
}

function jDrupalConnectExtractUser(result, options) {
  try {
    var currentUser = result.currentUser;
    jDrupal.currentUser = currentUser;
    options.success(currentUser);
  }
  catch (error) {
    console.log('jDrupalConnectExtractUser - ' + error);
  }
}