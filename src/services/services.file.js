/**
 * Creates a file.
 * @param {Object} file
 * @param {Object} options
 */
function file_create(file, options) {
  try {
    services_resource_defaults(options, 'file', 'create');
    entity_create('file', null, file, options);
  }
  catch (error) { console.log('file_create - ' + error); }
}

/**
 * Retrieves a file.
 * @param {Number} ids
 * @param {Object} options
 */
function file_retrieve(ids, options) {
  try {
    services_resource_defaults(options, 'file', 'retrieve');
    entity_retrieve('file', ids, options);
  }
  catch (error) { console.log('file_retrieve - ' + error); }
}

