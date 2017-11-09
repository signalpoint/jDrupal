// @TODO All "set" functions should return "this" for easy code chains.

/**
 * Given a entity type, bundle and id, this Creates a new jDrupal Entity object.
 * @param entityType
 * @param bundle
 * @param id
 * @constructor
 */
jDrupal.Entity = function(entityType, bundle, id) {

  // @TODO Allow an entity object to be passed in.

  this.entity = null;

  // @TODO these flat values need to be turned into arrays, e.g. [ { value: 'foo'} ]
  this.bundle = bundle;
  this.entityID = id;

  this.entityKeys = {};
};

/**
 *
 * @param prop
 * @param delta
 * @returns {*}
 */
jDrupal.Entity.prototype.get = function(prop, delta) {
  if (!this.entity || typeof this.entity[prop] === 'undefined') { return null; }
  return typeof delta !== 'undefined' ? this.entity[prop][delta] : this.entity[prop];
};

/**
 *
 * @param prop
 * @param delta
 * @param val
 */
jDrupal.Entity.prototype.set = function(prop, delta, val) {
  if (this.entity) {
    if (typeof delta !== 'undefined' && typeof this.entity[prop] !== 'undefined') {
      this.entity[prop][delta] = val;
    }
    else { this.entity[prop] = val; }
  }
};

/**
 *
 * @param key
 * @returns {null}
 */
jDrupal.Entity.prototype.getEntityKey = function(key) {
  return typeof this.entityKeys[key] !== 'undefined' ?
    this.entityKeys[key] : null;
};

/**
 *
 * @returns {*}
 */
jDrupal.Entity.prototype.getEntityType = function() {
  return this.entityKeys['type'];
};

/**
 *
 * @returns {*}
 */
jDrupal.Entity.prototype.getBundle = function() {
  var bundle = this.getEntityKey('bundle');
  return typeof this.entity[bundle] !== 'undefined' ?
    this.entity[bundle][0].target_id : null;
};

/**
 *
 * @returns {null}
 */
jDrupal.Entity.prototype.id = function() {
  var id = this.getEntityKey('id');
  return typeof this.entity[id] !== 'undefined' ?
    this.entity[id][0].value : null;
};

/**
 *
 * @returns {*}
 */
jDrupal.Entity.prototype.language = function() {
  return this.entity.langcode[0].value;
};

/**
 *
 * @returns {boolean}
 */
jDrupal.Entity.prototype.isNew = function() {
  return !this.id();
};

/**
 *
 * @returns {null}
 */
jDrupal.Entity.prototype.label = function() {
  var label = this.getEntityKey('label');
  return typeof this.entity[label] !== 'undefined' ?
    this.entity[label][0].value : null;
};

/**
 * @returns {String}
 */
jDrupal.Entity.prototype.stringify = function() {
  return JSON.stringify(this.entity);
};

/**
 * ENTITY LOADING...
 */

/**
 *
 * @param options
 * @returns {Promise}
 */
jDrupal.Entity.prototype.preLoad = function(options) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
};

/**
 *
 * @returns {Promise}
 */
jDrupal.Entity.prototype.load = function() {
  try {
    var _entity = this;
    var entityType = _entity.getEntityType();
    return new Promise(function(resolve, reject) {

      _entity.preLoad().then(function() {

        var path = jDrupal.restPath() +
            entityType + '/' + _entity.id() + '?_format=json';
        var req = new XMLHttpRequest();
        req.dg = {
          service: entityType,
          resource: 'retrieve'
        };
        req.open('GET', path);
        var loaded = function() {
          _entity.entity = JSON.parse(req.response);
          _entity.postLoad(req).then(function() {
            resolve(_entity);
          });
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


    });
  }
  catch (error) {
    console.log('jDrupal.Entity.load - ' + error);
  }
};

/**
 *
 * @param options
 * @returns {Promise}
 */
jDrupal.Entity.prototype.postLoad = function(options) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
};

/**
 * ENTITY SAVING...
 */

/**
 *
 * @param options
 * @returns {Promise}
 */
jDrupal.Entity.prototype.preSave = function(options) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
};

/**
 *
 * @returns {Promise}
 */
jDrupal.Entity.prototype.save = function() {

  var _entity = this;

  return new Promise(function(resolve, reject) {

    _entity.preSave().then(function() {

      jDrupal.token().then(function(token) {

        var entityType = _entity.getEntityType();
        var method = null;
        var resource = null;
        var path = null;
        var isNew = _entity.isNew();

        if (isNew) {
          method = 'POST';
          resource = 'create';
          path = 'entity/' + entityType;
        }
        else {
          method = 'PATCH';
          resource = 'update';
          path = entityType + '/' + _entity.id();
        }

        var req = new XMLHttpRequest();
        req.dg = {
          service: entityType,
          resource: resource
        };
        req.open(method, jDrupal.restPath() + path);
        req.setRequestHeader('Content-type', 'application/json');
        req.setRequestHeader('X-CSRF-Token', token);
        req.onload = function() {
          _entity.postSave(req).then(function() {
            if (
              (method == 'POST' && req.status == 201) ||
              (method == 'PATCH' && req.status == 204) ||
              req.status == 200
            ) {
              var invoke = jDrupal.moduleInvokeAll('rest_post_process', req);
              if (!invoke) { resolve(req); }
              else { invoke.then(resolve(req));}
            }
            else { reject(req); }
          });

        };
        req.onerror = function() { reject(Error("Network Error")); };
        req.send(_entity.stringify());

      });

    });

  });

};

/**
 *
 * @param xhr
 * @returns {Promise}
 */
jDrupal.Entity.prototype.postSave = function(xhr) {
  var self = this;
  return new Promise(function(resolve, reject) {
    // For new entities, grab their id from the Location response header.
    if (self.isNew() && xhr.getResponseHeader('Location')) {
      var parts = xhr.getResponseHeader('Location').split('/');
      var entityID =
        self.entity[self.getEntityKey('id')] = [ {
          value: parts[parts.length - 1]
        }];
    }
    resolve();
  });
};

/**
 * ENTITY DELETING...
 */

/**
 *
 * @param options
 * @returns {Promise}
 */
jDrupal.Entity.prototype.preDelete = function(options) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
};

/**
 *
 * @param options
 * @returns {Promise}
 */
jDrupal.Entity.prototype.delete = function(options) {

  // Set aside "this" entity.
  var _entity = this;

  return new Promise(function(resolve, reject) {

    _entity.preDelete().then(function() {

      jDrupal.token().then(function(token) {

        var entityType = _entity.getEntityType();
        var path = jDrupal.restPath() + entityType + '/' + _entity.id();
        var data = {};
        data[_entity.getEntityKey('bundle')] = [ {
          target_id: _entity.getBundle()
        }];
        var req = new XMLHttpRequest();
        req.dg = {
          service: entityType,
          resource: 'delete'
        };
        req.open('DELETE', path);
        req.setRequestHeader('Content-type', 'application/json');
        req.setRequestHeader('X-CSRF-Token', token);
        req.onload = function() {
          _entity.postDelete(req).then(function() {
            if (req.status == 204) {
              var invoke = jDrupal.moduleInvokeAll('rest_post_process', req);
              if (!invoke) { resolve(req); }
              else { invoke.then(resolve(req));}
            }
            else { reject(req); }
          });

        };
        req.onerror = function() { reject(Error("Network Error")); };
        req.send(JSON.stringify(data));

      });

    });

  });

};

/**
 *
 * @param options
 * @returns {Promise}
 */
jDrupal.Entity.prototype.postDelete = function(options) {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.entity = null;
    resolve();
  });
};

/**
 * HELPERS
 */

/**
 *
 * @param obj
 * @param entityID_or_entity
 */
jDrupal.entityConstructorPrep = function(obj, entityID_or_entity) {
  if (!entityID_or_entity) { }
  else if (typeof entityID_or_entity === 'object') {
    obj.entity = entityID_or_entity;
  }
  else {
    var id = obj.getEntityKey('id');
    var entity = {};
    entity[id]= [ { value: entityID_or_entity } ];
    obj.entity = entity;
  }
};
