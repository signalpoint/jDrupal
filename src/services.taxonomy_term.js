/**
 * Creates a taxonomy term.
 * @param {Object} taxonomy_term
 * @param {Object} options
 */
function taxonomy_term_create(taxonomy_term, options) {
  try {
    options.method = 'POST';
    options.path = 'taxonomy_term.json';
    entity_create('taxonomy_term', null, taxonomy_term, options);
  }
  catch (error) { console.log('taxonomy_term_create - ' + error); }
}

/**
 * Retrieves a taxonomy term.
 * @param {Number} ids
 * @param {Object} options
 */
function taxonomy_term_retrieve(ids, options) {
  try {
    options.method = 'GET';
    options.path = 'taxonomy_term/' + ids + '.json';
    entity_retrieve('taxonomy_term', ids, options);
  }
  catch (error) { console.log('taxonomy_term_retrieve - ' + error); }
}

/**
 * Update a taxonomy term.
 * @param {Object} taxonomy_term
 * @param {Object} options
 */
function taxonomy_term_update(taxonomy_term, options) {
  try {
    options.method = 'PUT';
    options.path = 'taxonomy_term/' + taxonomy_term.tid + '.json';
    entity_update('taxonomy_term', null, taxonomy_term, options);
  }
  catch (error) { console.log('taxonomy_term_update - ' + error); }
}

/**
 * Delete a taxonomy term.
 * @param {Number} tid
 * @param {Object} options
 */
function taxonomy_term_delete(tid, options) {
  try {
    // TODO - this should be replaced with a call to entity_delete().
    Drupal.services.call({
        method: 'DELETE',
        path: 'taxonomy_term/' + tid + '.json',
        success: function(data) {
          if (options.success) { options.success(data); }
        },
        error: function(xhr, status, message) {
          if (options.error) { options.error(xhr, status, message); }
        }
    });
  }
  catch (error) { console.log('taxonomy_term_delete - ' + error); }
}

/**
 * Perform a taxonomy_term index.
 * @param {Object} query
 * @param {Object} options
 */
function taxonomy_term_index(query, options) {
  try {
    entity_index('taxonomy_term', query, options);
  }
  catch (error) { console.log('taxonomy_term_index - ' + error); }
}

