// @see https://api.drupal.org/api/drupal/core!modules!node!src!Entity!Node.php/class/Node/8
//jDrupal.node = {
//  Entity: {}
//};
//jDrupal.node.Entity.Node = function(node) {
//  try {
//    this.entity = node;
//    this.id = function() {
//      return this.entity.nid ? this.entity.nid[0].value : null;
//    };
//    this.isPromoted = function() {
//      return this.entity.promote[0].value;
//    };
//    this.isPublished = function() {
//      return this.entity.status[0].value;
//    };
//    this.isSticky = function() {
//      return this.entity.sticky[0].value;
//    };
//    this.getTitle = function() {
//      return this.entity.title[0].value;
//    };
//    this.getType = function() {
//      return this.entity.type[0].target_id;
//    };
//    this.setTitle = function(title) {
//      this.entity.title[0].value = title;
//    };
//  }
//  catch (error) { console.log('jDrupal.Entity.Node - ' + error); }
//};

/**
 * Loads a node.
 * @param {Number} nid
 * @param {Object} options
 */
function node_load(nid, options) {
  try {
    entity_load('node', nid, options);
  }
  catch (error) { console.log('node_load - ' + error); }
}

/**
 * Saves a node.
 * @param {Object} node
 * @param {Object} options
 */
function node_save(node, options) {
  try {
    entity_save('node', node.getType(), node, options);
  }
  catch (error) { console.log('node_save - ' + error); }
}

