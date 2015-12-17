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
 */
jDrupal.Views.prototype.getView = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.open('GET', jDrupal.restPath() + self.getPath() + '?_format=json');
    req.onload = function() {
      if (req.status == 200) {
        self.results = JSON.parse(req.response);
        resolve();
      }
      else { reject(Error(req.statusText)); }
    };
    req.onerror = function() { reject(Error("Network Error")); };
    req.send();
  });
};

/**
 * @param {String} path
 * @param {Object} options
 */
jDrupal.viewsLoad = function(path) {
  return new Promise(function(resolve, reject) {
    var view = new jDrupal.Views(path);
    view.getView().then(function() {
      resolve(view);
    });
  });
};
