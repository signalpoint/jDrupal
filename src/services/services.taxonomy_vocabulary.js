/**
 * Creates a taxonomy vocabulary.
 * @param {Object} taxonomy_vocabulary
 * @param {Object} options
 */
function taxonomy_vocabulary_create(taxonomy_vocabulary, options) {
  try {
    // Set a default machine name if one wasn't provided.
    if (!taxonomy_vocabulary.machine_name && taxonomy_vocabulary.name) {
      taxonomy_vocabulary.machine_name =
        taxonomy_vocabulary.name.toLowerCase().replace(' ', '_');
    }
    services_resource_defaults(options, 'taxonomy_vocabulary', 'create');
    entity_create('taxonomy_vocabulary', null, taxonomy_vocabulary, options);
  }
  catch (error) { console.log('taxonomy_vocabulary_create - ' + error); }
}

/**
 * Retrieves a comment.
 * @param {Number} ids
 * @param {Object} options
 */
function taxonomy_vocabulary_retrieve(ids, options) {
  try {
    services_resource_defaults(options, 'taxonomy_vocabulary', 'retrieve');
    entity_retrieve('taxonomy_vocabulary', ids, options);
  }
  catch (error) { console.log('taxonomy_vocabulary_retrieve - ' + error); }
}

/**
 * Update a taxonomy vocabulary.
 * @param {Object} taxonomy_vocabulary
 * @param {Object} options
 */
function taxonomy_vocabulary_update(taxonomy_vocabulary, options) {
  try {
    // We need to make sure a machine_name was provided, otherwise it seems the
    // Services module will update a vocabulary and clear out its machine_name
    // if we don't provide it.
    if (!taxonomy_vocabulary.machine_name ||
      taxonomy_vocabulary.machine_name == '') {
      var message = 'taxonomy_vocabulary_update - missing machine_name';
      console.log(message);
      if (options.error) {
        options.error(null, 406, message);
      }
      return;
    }
    services_resource_defaults(options, 'taxonomy_vocabulary', 'update');
    entity_update('taxonomy_vocabulary', null, taxonomy_vocabulary, options);
  }
  catch (error) { console.log('taxonomy_vocabulary_update - ' + error); }
}

/**
 * Delete a taxonomy vocabulary.
 * @param {Number} vid
 * @param {Object} options
 */
function taxonomy_vocabulary_delete(vid, options) {
  try {
    services_resource_defaults(options, 'taxonomy_vocabulary', 'delete');
    entity_delete('taxonomy_vocabulary', vid, options);
  }
  catch (error) { console.log('taxonomy_vocabulary_delete - ' + error); }
}

/**
 * Perform a taxonomy_vocabulary index.
 * @param {Object} query
 * @param {Object} options
 */
function taxonomy_vocabulary_index(query, options) {
  try {
    services_resource_defaults(options, 'taxonomy_vocabulary', 'index');
    entity_index('taxonomy_vocabulary', query, options);
  }
  catch (error) { console.log('taxonomy_vocabulary_index - ' + error); }
}

/**
 * @see https://api.drupal.org/api/drupal/modules!taxonomy!taxonomy.module/function/taxonomy_get_tree/7
 */
function taxonomy_get_tree(vid, parent, max_depth, load_entities, options) {
  try {
    var parent = arguments[1] ? arguments[1] : 0;
    var max_depth = arguments[2] ? arguments[2] : null;
    var load_entities = arguments[3] ? arguments[3] : false;
    options.method = 'POST';
    options.path = 'taxonomy_vocabulary/getTree.json';
    options.service = 'taxonomy_vocabulary';
    options.resource = 'get_tree';
    options.data = JSON.stringify({
        vid: vid,
        parent: parent,
        max_depth: max_depth,
        load_entities: load_entities
    });
    Drupal.services.call(options);
  }
  catch (error) { console.log('taxonomy_get_tree - ' + error); }
}

