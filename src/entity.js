/**
 * Entity
 * @param entityType
 * @param bundle
 * @param id
 * @constructor
 */
jDrupal.Entity = function(entityType, bundle, id) {

  this.entity = null;

  // @TODO these flat values need to be turned into arrays, e.g.
  // [ { value: 'foo'} ]
  this.bundle = bundle;
  this.entityID = id;

  this.entityKeys = {};
};

jDrupal.Entity.prototype.get = function(prop, delta) {
  if (!this.entity || typeof this.entity[prop] === 'undefined') { return null; }
  return typeof delta !== 'undefined' ? this.entity[prop][delta] : this.entity[prop];
};
jDrupal.Entity.prototype.set = function(prop, delta, val) {
  if (this.entity) {
    if (typeof delta !== 'undefined' && typeof this.entity[prop] !== 'undefined') {
      this.entity[prop][delta] = val;
    }
    else { this.entity[prop] = val; }
  }
};
jDrupal.Entity.prototype.getEntityKey = function(key) {
  return typeof this.entityKeys[key] !== 'undefined' ?
    this.entityKeys[key] : null;
};
jDrupal.Entity.prototype.getEntityType = function() {
  return this.entityKeys['type'];
};
jDrupal.Entity.prototype.getBundle = function() {
  var bundle = this.getEntityKey('bundle');
  return typeof this.entity[bundle] !== 'undefined' ?
    this.entity[bundle][0].target_id : null;
};
jDrupal.Entity.prototype.id = function() {
  var id = this.getEntityKey('id');
  return typeof this.entity[id] !== 'undefined' ?
    this.entity[id][0].value : null;
};
jDrupal.Entity.prototype.language = function() {
  return this.entity.langcode[0].value;
};
jDrupal.Entity.prototype.isNew = function() {
  return !this.id();
};
jDrupal.Entity.prototype.label = function() {
  var label = this.getEntityKey('label');
  return typeof this.entity[label] !== 'undefined' ?
    this.entity[label][0].value : null;
};
jDrupal.Entity.prototype.stringify = function() {
  return JSON.stringify(this.entity);
};

/**
 * ENTITY LOADING...
 */

/**
 * Entity load.
 * @param options
 */
jDrupal.Entity.prototype.load = function() {
  try {
    var _entity = this;
    var entityType = _entity.getEntityType();
    return new Promise(function(resolve, reject) {
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
        resolve(_entity);
      };
      req.onload = function() {
        if (req.status == 200) {
          var invoke = jDrupal.moduleInvokeAll('rest_post_process', req);
          if (!invoke) { loaded(); }
          else { invoke.then(loaded); }
        }
        else { reject(Error(req.statusText)); }
      };
      req.onerror = function() { reject(Error("Network Error")); };
      req.send();
    });
  }
  catch (error) {
    console.log('jDrupal.Entity.load - ' + error);
  }
};

/**
 * ENTITY SAVING...
 */

/**
 * Entity pre save.
 * @param options
 */
jDrupal.Entity.prototype.preSave = function(options) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
};

/**
 * Entity save.
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
              (method == 'PATCH' && req.status == 204)
            ) {
              var invoke = jDrupal.moduleInvokeAll('rest_post_process', req);
              if (!invoke) { resolve(); }
              else { invoke.then(resolve); }
            }
            else { reject(Error(req.statusText)); }
          });

        };
        req.onerror = function() { reject(Error("Network Error")); };
        req.send(_entity.stringify());

      });

    });

  });

};

/**
 * Entity post save.
 * @param data
 */
jDrupal.Entity.prototype.postSave = function(req) {
  var self = this;
  return new Promise(function(resolve, reject) {
    // For new entities, grab their id from the Location response header.
    if (self.isNew()) {
      var parts = req.getResponseHeader('Location').split('/');
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
 * Entity pre delete.
 * @param options
 */
jDrupal.Entity.prototype.preDelete = function(options) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
};

/**
 * Entity delete.
 * @param options
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
              if (!invoke) { resolve(); }
              else { invoke.then(resolve); }
            }
            else { reject(Error(req.statusText)); }
          });

        };
        req.onerror = function() { reject(Error("Network Error")); };
        req.send(JSON.stringify(data));

      });

    });

  });

};

/**
 * Entity post delete.
 * @param options
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
