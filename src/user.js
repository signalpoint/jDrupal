/**
 * Gets the current user account object.
 * @returns {Object}
 */
jDrupal.currentUser = function() {
  return jDrupal._currentUser;
};

/**
 *
 * @returns {jDrupal.User}
 */
function jDrupalUserDefaults() {
  return new jDrupal.User({
    uid: [ { value: 0 } ],
    roles: [ { target_id: 'anonymous' }]
  });
}

/**
 * Sets the current user account object.
 * @param {Object} account
 */
function jDrupalSetCurrentUser(account) {
  jDrupal._currentUser = account;
}

/**
 * Generates a random user password.
 * @return {String}
 */
jDrupal.userPassword = function() {
  try {
    // @credit http://stackoverflow.com/a/1349426/763010
    var length = 10;
    if (arguments[0]) { length = arguments[0]; }
    var password = '';
    var possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz23456789';
    for (var i = 0; i < length; i++) {
      password += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return password;
  }
  catch (error) { console.log('jDrupal.userPassword - ' + error); }
};
