/**
 * User
 * @param {Number|Object} uid_or_account
 * @constructor
 * @see https://api.drupal.org/api/drupal/core!modules!user!src!Entity!User.php/class/User/8
 */
jDrupal.User = function(uid_or_account) {

  // Set the entity keys.
  this.entityKeys['type'] = 'user';
  this.entityKeys['bundle'] = 'user';
  this.entityKeys['id'] = 'uid';

  // Prep the entity.
  jDrupalEntityConstructorPrep(this, uid_or_account);

  // Set default values.

};
jDrupal.User.prototype = new jDrupal.Entity;
jDrupal.User.prototype.constructor = jDrupal.User;
jDrupal.User.prototype.getAccountName = function() {
  return this.entity.name[0].value;
};
jDrupal.User.prototype.isAnonymous = function() {
  return this.id() == 0;
};
jDrupal.User.prototype.isAuthenticated = function() {
  return !this.isAnonymous();
};

/**
 * PROXIES
 */

//jDrupal.userPrepare = function(uid) {
//  return new jDrupal.User({
//
//  });
//};

/**
 * Gets the current user account object.
 * @returns {Object}
 */
jDrupal.currentUser = function() {
  return jDrupal._currentUser;
};

/**
 *
 * @param uid
 * @param options
 * @returns {jDrupal.User}
 */
jDrupal.userLoad = function(uid, options) {
  var account = new jDrupal.User(uid);
  account.load(options);
  return account;
};

/**
 * HELPERS
 */

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
