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

          console.log('connected');

          // Load the user's account from Drupal and pass along the caller's
          // options, which should include a success callback.
          jDrupalUserLoad(result.currentUser.uid, {
            success: function(account) {

              // Set the current user.
              jDrupalSetCurrentUser(account);

              // Now that we've set some contexts, it's safe to return to the
              // connect caller, since they'll be able to use our prototypes
              // and functions to develop.
              options.success();

            }
          });
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