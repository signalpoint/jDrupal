/**
 * Creates a node.
 * @param {Object} node
 * @param {Object} options
 */
function node_create(node, options) {
  try {
    services_resource_defaults(options, 'node', 'create');
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
    services_resource_defaults(options, 'node', 'retrieve');
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
    services_resource_defaults(options, 'node', 'update');
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
    services_resource_defaults(options, 'node', 'delete');
    entity_delete('node', nid, options);
  }
  catch (error) { console.log('node_delete - ' + error); }
}

/**
 * Perform a node index.
 * @param {Object} query
 * @param {Object} options
 */
function node_index(query, options) {
  try {
    services_resource_defaults(options, 'node', 'index');
    entity_index('node', query, options);
  }
  catch (error) { console.log('node_index - ' + error); }
}

