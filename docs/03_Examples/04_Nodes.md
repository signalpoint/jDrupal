> Drupal 8 REST Node Examples
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