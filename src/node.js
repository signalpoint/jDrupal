// @see https://api.drupal.org/api/drupal/core!modules!node!src!Entity!Node.php/class/Node/8

/**
 * Node
 * @param {Number|Object} nid_or_node
 * @constructor
 */
jDrupal.Node = function(nid_or_node) {

  // Set the entity keys.
  this.entityKeys['type'] = 'node';
  this.entityKeys['bundle'] = 'type';
  this.entityKeys['id'] = 'nid';

  // Prep the entity.
  jDrupalEntityConstructorPrep(this, nid_or_node);

  // Set default values.
  if (!this.entity.title) {
    this.entity.title = [ { value: '' }];
  }

};

// Extend the entity prototype.
jDrupal.Node.prototype = new jDrupal.Entity;
jDrupal.Node.prototype.constructor = jDrupal.Node;

/**
 *
 * @returns {*}
 */
jDrupal.Node.prototype.getTitle = function() {
  return this.entity.title[0].value;
};

/**
 *
 * @returns {*}
 */
jDrupal.Node.prototype.setTitle = function(title) {
  try {
    this.entity.title[0].value = title;
  }
  catch (e) { console.log('jDrupal.Node.setTitle - ' + e); }
};

/**
 *
 * @returns {*}
 */
jDrupal.Node.prototype.getType = function() {
  return this.getBundle();
};

/**
 *
 * @returns {*}
 */
jDrupal.Node.prototype.isPromoted = function() {
  return this.entity.promote[0].value;
};

/**
 *
 * @returns {*}
 */
jDrupal.Node.prototype.isPublished = function() {
  return this.entity.status[0].value;
};

/**
 *
 * @returns {*}
 */
jDrupal.Node.prototype.isSticky = function() {
  return this.entity.sticky[0].value;
};

/**
 * OVERRIDES
 */

jDrupal.Node.prototype.preSave = function(options) {
  try {

    // Remove protected fields.
    var protected_fields = [
      'changed',
      'revision_timestamp',
      'revision_uid'
    ];
    for (var i = 0; i < protected_fields.length; i++) {
      delete this.entity[protected_fields[i]];
    }

    // Continue along...
    options.success();
  }
  catch (error) {
    console.log('jDrupal.Node.preSave - ' + error);
  }

};

/**
 * PROXIES
 */

/**
 *
 * @param nid
 * @param options
 * @returns {jDrupal.Node}
 */
jDrupal.nodeLoad = function(nid, options) {
  var node = new jDrupal.Node(nid);
  node.load(options);
  return node;
};
