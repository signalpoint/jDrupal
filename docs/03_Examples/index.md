> A Bunch of Common jDrupal Examples

For custom entity types, see the [README](https://github.com/signalpoint/jDrupal/tree/7.x-1.x#custom-entity-types).

## Authentication
### Connect
```
system_connect({
  success: function(result) {
    // Connected to Drupal, safe to start my app...
  }
});
```
### Login
```
user_login("bob", "bobs-password", {
    success:function(result){
      alert('Hi, ' + result.user.name + '!');
    },
    error:function(xhr, status, message){
      alert(message);
    }
});
```
### Logout
```
user_logout({
    success:function(result){
      if (result[0]) {
         alert("Logged out!");
      }
    }
});
```
### Request a new password
```
user_request_new_password('bob' /* or 'bob@hotmail.com' */ , {
    success: function(result) {
      if (result[0]) {
        alert('Further instructions have been sent to your e-mail address.');
      }
    }
});
```

## Users
### Get current user
```
var user = jDrupal.user;
console.log('Current user id: ' + user.id);
```
### Register a user
```
var account = {
  name:"bob",
  mail:"bot@example.com"
};
user_register(account, {
    success:function(result) {
      console.log('Registered user #' + result.uid);
    }
});
```
### Create a user
```
var account = {
  name:"bob",
  mail:"bob@hotmail.com",
  pass:"pizza"
};
user_save(account, {
    success:function(result) {
      alert('Created new user #' + result.uid);
    }
});
```
### Retrieve a user
```
$.userLoad(456).then(function(user) {
  console.log('Loaded : ' + user.getAccountName());
});
```

## Nodes
### Create a node
```
var node = {
  title: "Hello World",
  type: "article"
};
node_save(node, {
  success: function(result) {
    alert("Saved node #" + result.nid);
  }
});
```
### Retrieve a node
```
node_load(123, {
  success: function(node) {
    alert("Loaded " + node.title);
  }
});
```
### Update a node
```
var node = {
  nid: 123,
  title: "New Title"
};
node_save(node, {
  success: function(result) {
    alert("Saved node #" + result.nid);
  }
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
var comment = {
  nid: 123,
  subject: 'My Comment Subject',
  comment_body: {
    und: [
      { value: 'My Comment Body.' }
    ]
  }
};
comment_save(comment, {
    success:function(result) {
      console.log('Saved comment #' + result.cid);
    }
});
```
### Retrieve a comment
```
comment_load(456, {
    success: function(comment) {
      console.log('Loaded comment #' + comment.cid);
    }
});
```
### Update a comment
```
var comment = {
  cid: 456,
  subject: "New Subject",
  comment_body: {
    und: [
      { value: "New Comment Body" }
    ]
  }
};
comment_save(comment, {
  success: function(result) {
    alert("Saved comment #" + result[0]);
  }
});
```
### Delete a comment
```
// First, load the comment...
comment_delete(456, {
    success: function(result){
      if (result[0]) {
        alert("Comment deleted!");
      }
    }
});
```

## Taxonomy terms
### Create a taxonomy term
```
...
```
### Load a taxonomy term
```
taxonomy_term_load(1, {
    success:function(taxonomy_term) {
      console.log('Loaded term: ' + taxonomy_term.name);
    }
});
```
### Update a taxonomy term
```
...
```
### Delete a taxonomy term
```
...
```

## Taxonomy vocabularies
### Create a taxonomy vocabulary
```
var taxonomy_vocabulary = {
  name: "Fruits",
  machine_name: "fruits",
  description: "Fruit is delicious."
};
taxonomy_vocabulary_save(taxonomy_vocabulary, {
    success: function(result){
      if (result[0] === 1) {
        alert("Created new taxonomy vocabulary");
      }
    }
});
```
### Load a taxonomy vocabulary
```
taxonomy_vocabulary_load(1, {
    success:function(taxonomy_vocabulary) {
      console.log('Loaded vocabulary: ' + taxonomy_vocabulary.name);
    }
});
```
### Update a taxonomy vocabulary
```
var taxonomy_vocabulary = {
  vid: 2,
  name: "Colorful Fruits",
  machine_name: "fruits",
  description: user_password()
};
taxonomy_vocabulary_save(taxonomy_vocabulary, {
    success: function(result){
      if (result[0] == 2) {
        alert("Updated taxonomy vocabulary");
      }
    }
});
```
### Delete a taxonomy vocabulary
```
var vid = 2;
taxonomy_vocabulary_delete(vid, {
    success: function(result){
      if (result[0] == 3) {
        alert("Deleted taxonomy vocabulary!");
      }
    }
});
```

## Index resources
### Nodes
```
// Get the Most Recent Nodes of Type Article
var query = {
  parameters: {
    'type': 'article'
  }
};
node_index(query, {
    success: function(nodes) {
      alert('Indexed ' + nodes.length + ' node(s)!');
    }
});
```
```
// Get list of articles from oldest to newest with a title containing the word "foo"
var query = {
  fields: ['nid', 'title', 'created'],
  parameters: {
    type: 'article',
    title: '%foo%'
  },
  options: {
    order_by: {
      created: 'asc'
    },
    parameters_op: {
      title: 'like'
    }
  }
};
node_index(query, {
    success: function(nodes) {
      alert('Indexed ' + nodes.length + ' node(s)!');
    }
});
```
### Users
```
...
```
### Comments
```
// Get Comments from a Node
var query = {
  parameters:{
    nid: 123,
  }
};
comment_index(query, {
    success: function(comments){
      alert('Found ' + comments.length + ' comment(s)!');
    }
});
```
### Taxonomy Terms
```
// Get Terms from a Given Vocabulary ID
var query = {
  parameters: {
    vid: 1
  }
};
taxonomy_term_index(query, {
    success: function(terms) {
      if (terms.length == 0) { return; }
      alert('Loaded ' + terms.length + ' term(s)!');
    }
});
```
### Taxonomy Vocabularies
```
...
```
### Files
```
...
```
