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
