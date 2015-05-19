jDrupal
=======

## A Drupal 8 REST JavaScript Library

This library provides an asynchronous RESTful API to Drupal websites for JavaScript
applications.

```
node_load(123, {
    success: function(node) {
      alert('Loaded node: ' + node.title[0].value);
    }
});
```

Above is an example of how easy it is to load a Drupal 8 node with jDrupal in
JavaScript. Use jDrupal to easily build JavaScript based mobile applications
and web applications for your Drupal site.

For more information and "Hello World", please visit: http://www.easystreet3.com/jDrupal

# Installation

First, install the jDrupal module on your Drupal 8 site:

https://www.drupal.org/project/jdrupal

Install the REST UI module:

https://www.drupal.org/project/restui

Go to `admin/config/services/rest` and enable the `User` resource, then enable
the following methods, formats and authentication providers for the `User`
resource:

GET, POST, DELETE, PATCH
json
cookie

To be continued...

