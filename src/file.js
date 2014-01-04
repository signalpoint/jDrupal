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

