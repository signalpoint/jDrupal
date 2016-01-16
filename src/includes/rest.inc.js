// Add a pre process hook, and continue with the call as usual.
(function(send) {
  XMLHttpRequest.prototype.send = function(data) {
    var self = this;
    var alters = jDrupal.moduleInvokeAll('rest_preprocess', this, data);
    if (!alters) { send.call(this, data); }
    else { alters.then(function() { send.call(self, data); }); }
  };
})(XMLHttpRequest.prototype.send);

// Add a post process hook, and continue with the call as usual.
(function(open) {
  XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
    this.addEventListener("readystatechange", function() {
      if (this.readyState == 4) { jDrupal.moduleInvokeAll('rest_post_process', this) }
    }, false);
    open.call(this, method, url, async, user, pass);
  };
})(XMLHttpRequest.prototype.open);

// Token resource.
jDrupal.token = function() {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.dg = {
      service: 'system',
      resource: 'token'
    };
    req.open('GET', jDrupal.restPath() + 'rest/session/token');
    req.onload = function() {
      if (req.status == 200) { resolve(req.response); }
      else { reject(Error(req.statusText)); }
    };
    req.onerror = function() { reject(Error("Network Error")); };
    req.send();
  });
};

// Connect resource.
jDrupal.connect = function() {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.dg = {
      service: 'system',
      resource: 'connect'
    };
    req.open('GET', jDrupal.restPath() + 'jdrupal/connect?_format=json');
    req.onload = function() {
      if (req.status != 200) { reject(Error(req.statusText)); return; }
      var result = JSON.parse(req.response);
      if (result.uid == 0) {
        jDrupal.setCurrentUser(jDrupal.userDefaults());
        resolve(result);
      }
      else {
        jDrupal.userLoad(result.uid).then(function(account) {
          jDrupal.setCurrentUser(account);
          resolve(result);
        });
      }
    };
    req.onerror = function() { reject(Error("Network Error")); };
    req.send();
  });
};

// User login resource.
jDrupal.userLogin = function(name, pass) {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.dg = {
      service: 'user',
      resource: 'login'
    };
    req.open('POST', jDrupal.restPath() + 'user/login');
    req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    req.onload = function() {
      if (req.status == 200 || req.status == 303) {
        jDrupal.connect().then(resolve);
      }
      else { reject(Error(req.statusText)); }
    };
    req.onerror = function() { reject(Error("Network Error")); };
    var data = 'name=' + encodeURIComponent(name) +
      '&pass=' + encodeURIComponent(pass) +
      '&form_id=user_login_form';
    req.send(data);
  });
};

// User logout resource.
jDrupal.userLogout = function(name, pass) {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.dg = {
      service: 'user',
      resource: 'logout'
    };
    req.open('GET', jDrupal.restPath() + 'user/logout');
    req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    req.onload = function() {
      if (req.status == 200 || req.status == 303) {
        jDrupal.setCurrentUser(jDrupal.userDefaults());
        jDrupal.connect().then(resolve);
      }
      else { reject(Error(req.statusText)); }
    };
    req.onerror = function() { reject(Error("Network Error")); };
    req.send();
  });
};

/**
 * ENTITY PROXY FUNCTIONS
 */
jDrupal.entityLoad = function(entity_type, entity_id) {
  var entity = new this[this.ucfirst(entity_type)](entity_id);
  return entity.load();
};
jDrupal.commentLoad = function(cid) { return this.entityLoad('comment', cid); };
jDrupal.nodeLoad = function(nid) { return this.entityLoad('node', nid); };
jDrupal.userLoad = function(uid) { return this.entityLoad('user', uid); };


// @TODO this doesn't work because for some reason(s) we have to pass along
// the node type bundle data to properly delete the node. Learn why this
// is, or raise an issue to remove that need, because without it you pretty
// much have to load a node before you can delete it, i.e. you can't just
// delete a node if you have its nid. This is true for comments too.
//jDrupal.nodeDelete = function(nid) {
//  var node = new this.Node(nid);
//  return node.delete();
//};
//$.nodeDelete(6).then(function() {
//  console.log('Node deleted eh!');
//});
