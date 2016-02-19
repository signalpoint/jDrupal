> Drupal 8 REST Comment Examples
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