// @see https://api.drupal.org/api/drupal/core!modules!user!src!Entity!User.php/class/User/8

/**
 * Given a user id or JSON object, this Creates a new jDrupal User object.
 * @param {Number|Object} uid_or_account
 * @constructor
 */
jDrupal.User = function(uid_or_account) {

  // Set the entity keys.
  this.entityKeys['type'] = 'user';
  this.entityKeys['bundle'] = 'user';
  this.entityKeys['id'] = 'uid';
  this.entityKeys['label'] = 'name';

  // Prep the entity.
  jDrupal.entityConstructorPrep(this, uid_or_account);

};

/**
 * Extend the entity prototype.
 * @type {jDrupal.Entity}
 */
jDrupal.User.prototype = new jDrupal.Entity;

/**
 * Set the constructor.
 * @type {jDrupal.User|*}
 */
jDrupal.User.prototype.constructor = jDrupal.User;

/**
 *
 * @returns {*}
 */
jDrupal.User.prototype.getAccountName = function() { return this.label(); };

jDrupal.User.prototype.getRoles = function() {
  var _roles = this.entity.roles;
  var roles = [];
  for (var i = 0; i < this.entity.roles.length; i++) {
    roles.push(this.entity.roles[i].target_id)
  }
  return roles;
};

jDrupal.User.prototype.hasRole = function(role) {
  return jDrupal.inArray(role, this.getRoles());
};

/**
 *
 * @returns {boolean}
 */
jDrupal.User.prototype.isAnonymous = function() {
  return this.id() == 0;
};

/**
 *
 * @returns {boolean}
 */
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
 * HELPERS
 */

/**
 *
 * @returns {jDrupal.User}
 */
jDrupal.userDefaults = function() {
  return new jDrupal.User({
    uid: [ { value: 0 } ],
    roles: [ { target_id: 'anonymous' }]
  });
};

/**
 * Sets the current user account object.
 * @param {Object} account
 */
jDrupal.setCurrentUser = function(account) {
  jDrupal._currentUser = account;
};

/**
 * Generates a random user password.
 * @return {String}
 */
jDrupal.userPassword = function() {
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
};
