/**
 * Perform a comment index.
 * @param {Object} query
 * @param {Object} options
 */
function comment_index(query, options) {
  try {
    services_resource_defaults(options, 'comment', 'index');
    entity_index('comment', query, options);
  }
  catch (error) { console.log('comment_index - ' + error); }
}

