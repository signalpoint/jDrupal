// @see https://api.drupal.org/api/drupal/core!modules!node!src!Entity!Node.php/class/Node/8

/**
 * Given a node id or JSON object, this Creates a new jDrupal Node object.
 * @param {Number|Object} nid_or_node
 * @constructor
 */
jDrupal.Node = function(nid_or_node) {

  // Set the entity keys.
  this.entityKeys['type'] = 'node';
  this.entityKeys['bundle'] = 'type';
  this.entityKeys['id'] = 'nid';
  this.entityKeys['label'] = 'title';

  // Prep the entity.
  jDrupal.entityConstructorPrep(this, nid_or_node);

  // Set default values.
  if (this.entity) {
    if (!this.entity.title) {
      this.entity.title = [ { value: '' }];
    }
  }

};

/**
 * Extend the entity prototype.
 * @type {jDrupal.Entity}
 */
jDrupal.Node.prototype = new jDrupal.Entity;

/**
 * Set the constructor.
 * @type {jDrupal.Node|*}
 */
jDrupal.Node.prototype.constructor = jDrupal.Node;

/**
 *
 * @returns {*}
 */
jDrupal.Node.prototype.getTitle = function() { return this.label(); };

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
jDrupal.Node.prototype.getCreatedTime = function() {
  return this.entity.created[0].value;
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

/**
 *
 * @param options
 * @returns {Promise}
 */
jDrupal.Node.prototype.preSave = function(options) {
  var self = this;
  return new Promise(function(resolve, reject) {
    // Remove protected fields.
    var protected_fields = [
      'changed',
      'revision_timestamp',
      'revision_uid'
    ];
    for (var i = 0; i < protected_fields.length; i++) {
      delete self.entity[protected_fields[i]];
    }
    resolve();
  });
};
