/**
 * Creates a comment.
 * @param {Object} comment
 * @param {Object} options
 */
function comment_create(comment, options) {
  try {
    options.method = 'POST';
    options.path = 'comment.json';
    entity_create('comment', null, comment, options);
  }
  catch (error) { console.log('comment_create - ' + error); }
}

/**
 * Retrieves a comment.
 * @param {Number} ids
 * @param {Object} options
 */
function comment_retrieve(ids, options) {
  try {
    options.method = 'GET';
    options.path = 'comment/' + ids + '.json';
    entity_retrieve('comment', ids, options);
  }
  catch (error) { console.log('comment_retrieve - ' + error); }
}

/**
 * Update a comment.
 * @param {Object} comment
 * @param {Object} options
 */
function comment_update(comment, options) {
  try {
    options.method = 'PUT';
    options.path = 'comment/' + comment.cid + '.json';
    entity_update('comment', null, comment, options);
  }
  catch (error) { console.log('comment_update - ' + error); }
}

