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
