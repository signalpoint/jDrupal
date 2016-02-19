> Drupal 8 REST Views Examples
### Get Views Result for Nodes
```
$.viewsLoad('my-view-url').then(function(view) {
  var results = view.getResults();
  for (var i = 0; i < results.length; i ++) {
    var node = new $.Node(results[i]);
    console.log('Loaded: ' + node.getTitle());
  }
});
```