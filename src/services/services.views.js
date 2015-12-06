/**
 * Entity
 * @param {String} path
 * @constructor
 */
jDrupal.Views = function(path) {
  this.path = path;
  this.results = null;
};

/**
 *
 * @returns {String|*}
 */
jDrupal.Views.prototype.getPath = function() {
  return this.path;
};

jDrupal.Views.prototype.getResults = function() {
  return this.results;
};

/**
 *
 * @param options
 */
jDrupal.Views.prototype.getView = function(options) {
  try {
    var _view = this;
    jDrupal.services.call({
      resource: 'views',
      method: 'GET',
      path: this.getPath(),
      success: function(results) {
        _view.results = results;
        if (options.success) { options.success(); }
      },
      error: function(xhr, status, message) {
        if (options.error) { options.error(xhr, status, message); }
      }
    });
  }
  catch (error) {
    console.log('jDrupal.Views.getView - ' + error);
  }
};

/**
 * @param {String} path
 * @param {Object} options
 */
jDrupal.viewsLoad = function(path, options) {
  try {
    var view = new jDrupal.Views(path);
    view.getView(options);
    return view;
  }
  catch (error) {
    console.log('viewsLoad - ' + error);
  }
};
