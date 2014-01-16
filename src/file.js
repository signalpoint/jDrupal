/**
 * Loads a file, given a file id.
 * @param {Number} fid
 * @param {Object} options
 */
function file_load(fid, options) {
  try {
    entity_load('file', fid, options);
  }
  catch (error) { console.log('file_load - ' + error); }
}

/**
 * Saves a file.
 * @param {Object} file
 * @param {Object} options
 */
function file_save(file, options) {
  try {
    entity_save('file', null, file, options);
  }
  catch (error) { console.log('file_save - ' + error); }
}

