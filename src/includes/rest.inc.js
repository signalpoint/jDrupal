jDrupal.token = function() {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.open('GET', jDrupal.restPath() + 'rest/session/token');
    req.onload = function() {
      if (req.status == 200) { resolve(req.response); }
      else { reject(Error(req.statusText)); }
    };
    req.onerror = function() { reject(Error("Network Error")); };
    req.send();
  });
};
jDrupal.connect = function() {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.open('GET', jDrupal.restPath() + 'jdrupal/connect?_format=json');
    req.onload = function() {
      if (req.status != 200) { reject(Error(req.statusText)); return; }
      var result = JSON.parse(req.response);
      if (result.uid == 0) {
        jDrupalSetCurrentUser(jDrupalUserDefaults());
        resolve(result);
      }
      else {
        jDrupal.userLoad(result.uid).then(function(account) {
          jDrupalSetCurrentUser(account);
          resolve(result);
        });
      }
    };
    req.onerror = function() { reject(Error("Network Error")); };
    req.send();
  });
};
jDrupal.userLogin = function(name, pass) {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
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
jDrupal.entityLoad = function(entity_type, entity_id) {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.open('GET', jDrupal.restPath() + entity_type + '/' + entity_id + '?_format=json');
    req.onload = function() {
      if (req.status == 200) {
        resolve(new jDrupal[jDrupal.ucfirst(entity_type)](JSON.parse(req.response)));
      }
      else { reject(Error(req.statusText)); }
    };
    req.onerror = function() { reject(Error("Network Error")); };
    req.send();
  });
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