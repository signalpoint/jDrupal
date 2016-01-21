> A Bunch of Common jDrupal Examples

The following examples use a [closure]((http://stackoverflow.com/q/111102/763010)) so we can use `$.example();` instead of `jDrupal.example();` for brevity.

## Authentication
### Connect
```
$.connect().then(function() {
  // Connected to Drupal, safe to start my app...
});
```
### Login
```
$.userLogin('bob', 'secret').then(function() {
  console.log('Logged out!');
});
```
### Logout
```
$.userLogout().then(function() {
  console.log('Logged out!');
});
```

## Users
### Get current user
```
var user = $.currentUser();
console.log('Current user id: ' + user.id());
```
### Load a user
```
$.userLoad(456).then(function(user) {
  console.log('Loaded : ' + user.getAccountName());
});
```

## Views
```
$.viewsLoad('my-view-url').then(function(view) {
  var results = view.getResults();
  for (var i = 0; i < results.length; i ++) {
    var node = new $.Node(results[i]);
    console.log('Loaded: ' + node.getTitle());
  }
});
```

## Nodes
### Create a node
```
var node = new $.Node({
  type: [ { target_id: 'article' } ],
  title: [ { value: 'Hello World' }]
});
node.save().then(function() {
  console.log('Saved new node # ' + node.id());
});
```
### Load a node
```
$.nodeLoad(1).then(function(node) {
  console.log('Loaded node: ' + node.getTitle());
});
```
### Update a node
```
// First, load the node...
$.nodeLoad(123).then(function(node) {

  // then change its title...
  node.setTitle('Goodbye world');

  // and then save the changes.
  node.save().then(function() {
    console.log('Saved ' + node.getTitle());
  });

});
```
### Delete a node
```
// First, load the node...
$.nodeLoad(123).then(function(node) {

  // then delete it.
  node.delete(123).then(function() {
    console.log('Node deleted!');
  });

});
```
## Comments
### Create a comment
```
var comment = new $.Comment({
  uid: [ { target_id: 1 } ],
  entity_id: [ { target_id: 123 } ],
  entity_type: [ { value: 'node' } ],
  comment_type:[ { target_id: "comment" } ],
  subject: [ { value: 'Hello World' } ],
  comment_body: [{
    "value": "<p>How are you?</p>",
    "format": "basic_html"
  }]
});
comment.save().then(function() {
  console.log('Saved new comment # ' + comment.id());
});
```
### Load a comment
```
$.commentLoad(456).then(function(comment) {
  console.log('Loaded: ' + comment.getSubject());
});
```
### Update a comment
```
// @see https://www.drupal.org/node/2631774 (D8 core bug)

// First, load the comment...
$.commentLoad(456).then(function(comment) {

  // then change its subject...
  comment.setSubject('Goodbye world');

  // and then save the changes.
  comment.save().then(function() {
    console.log('Saved ' + comment.setSubject());
  });

});
```
### Delete a comment
```
// First, load the comment...
$.commentLoad(456).then(function(comment) {

  // then delete it.
  comment.delete(456).then(function() {
    console.log('comment deleted!');
  });

});
```

## Taxonomy terms
### Create a taxonomy term
```
```
### Load a taxonomy term
```
```
### Update a taxonomy term
```
```
### Delete a taxonomy term
```
```
### Understanding a closure
#### With a closure
When using a closure you can access jDrupal using `$`, which is great for keeping code clean:
```
(function($) {

  $.nodeLoad(123).then(function(node) {
    alert(node.getTitle());
  });

})(jDrupal);
```

#### Without a closure
When not using a closure, you can quickly access jDrupal using the `jDrupal` object:
```
jDrupal.nodeLoad(123).then(function(node) {
  alert(node.getTitle());
});
```
