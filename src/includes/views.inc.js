/**
 * The Views constructor.
 * @param {String} path The path to the Views REST Export in Drupal.
 * @constructor
 */
jDrupal.Views = function(path) {
  this.path = path;
  this.results = null;
};

/**
 * Returns the path to the rest export.
 * @returns {String}
 */
jDrupal.Views.prototype.getPath = function() {
  return this.path;
};

/**
 * Returns the results, if any.
 * @returns {*}
 */
jDrupal.Views.prototype.getResults = function() {
  return this.results;
};

/**
 * Retrieves the Views' results from the Drupal site's rest export.
 * @returns {Promise}
 */
jDrupal.Views.prototype.getView = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.dg = {
      service: 'views',
      resource: null
    };
    req.open('GET', jDrupal.restPath() + self.getPath());
    var loaded = function() {
      self.results = JSON.parse(req.response);
      resolve();
    };
    req.onload = function() {
      if (req.status == 200) {
        var invoke = jDrupal.moduleInvokeAll('rest_post_process', req);
        if (!invoke) { loaded(); }
        else { invoke.then(loaded); }
      }
      else { reject(req); }
    };
    req.onerror = function() { reject(Error("Network Error")); };
    req.send();
  });
};

/**
 * Loads a view and fetches its results from the Drupal site.
 * @param {String} path
 */
jDrupal.viewsLoad = function(path) {
  return new Promise(function(resolve, reject) {
    var view = new jDrupal.Views(path);
    view.getView().then(function() {
      resolve(view);
    });
  });
};
