/**
 * Creates a node.
 * @param {Object} node
 * @param {Object} options
 */
function node_create(node, options) {
  try {
    options.method = 'POST';
    options.path = 'node.json';
    entity_create('node', node.type, node, options);
  }
  catch (error) { console.log('node_create - ' + error); }
}

/**
 * Retrieves a node.
 * @param {Number} ids
 * @param {Object} options
 */
function node_retrieve(ids, options) {
  try {
    options.method = 'GET';
    options.path = 'node/' + ids + '.json';
    entity_retrieve('node', ids, options);
  }
  catch (error) { console.log('node_retrieve - ' + error); }
}

/**
 * Update a node.
 * @param {Object} node
 * @param {Object} options
 */
function node_update(node, options) {
  try {
    options.method = 'PUT';
    options.path = 'node/' + node.nid + '.json';
    entity_update('node', node.type, node, options);
  }
  catch (error) { console.log('node_update - ' + error); }
}

/**
 * Delete a node.
 * @param {Number} nid
 * @param {Object} options
 */
function node_delete(nid, options) {
  try {
    Drupal.services.call({
        method: 'DELETE',
        path: 'node/' + nid + '.json',
        success: function(data) {
          if (options.success) { options.success(data); }
        },
        error: function(xhr, status, message) {
          if (options.error) { options.error(xhr, status, message); }
        }
    });
  }
  catch (error) { console.log('node_delete - ' + error); }
}

