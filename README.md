jDrupal
=======

An HTML5 JavaScript library for Drupal.

The library utilizes the Services module (3.5 or later) to provide an asynchronous RESTful API to Drupal websites for JavaScript applications.

```
node_load(123, {
    success: function(node) {
      alert('Loaded node: ' + node.title);
    },
    error: function(xhr, status, message) {
      alert(message)
    }
});
```

Above is an example of how easy it is to load a Drupal node with jDrupal in JavaScript. Use jDrupal to easily build JavaScript based mobile applications and web applications for your Drupal site.

For more information and "Hello World", please visit: http://www.easystreet3.com/jDrupal

# Backport

jDrupal for Drupal 6 is a backport from the Drupal 7 version. This means there
are some quirks and differences between the two. Here's a running list of things
that are different in D6:

- There are no language codes in D6, so do not use this when building JSON:
```
field_custom: {
  und: [
    { value: 'ABC' }
  ]
}
```
Instead use this:
```
field_custom: [
  { value: 'ABC' }
]
```

## Comments

 - when calling e.g. `comment_save()`, the comment's body property is called
 `comment`, not `comment_body`, and it is just a flat string


## Nodes

 - when calling e.g. `node_save({ uid: 45, title: 'Hello' })`, will not work,
 you must also pass along the `type` property in the node's JSON object

## Taxonomy Vocabularies

 - when using taxonomy_vocabulary_load(1), the machine_name value doesn't come
 back, it does come back from a call to taxonomy_vocabulary_save() though.
 Unfortunately the machine_name is a required argument to taxonomy_vocabulary_save()
 though. This seems like a "bug" in D6 Services, should be a simple patch to fix
 though.
 
 - when using taxonomy_vocabaulary_save() the result doesn't come back as the
 value of SAVED_UPDATED or SAVED_NEW as it does in D7, it comes back as a JSON
 object filled with the vocabularies values.

## Users

 - when calling e.g. `user_save({ uid: 123, field_custom:[{ value: 'ABC' }] })`,
 will not work, you must also pass along the `name` property in the account's
 JSON object
