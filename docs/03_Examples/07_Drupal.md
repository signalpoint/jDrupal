> Using jDrupal on a Drupal 8 Site

jDrupal is not just for building apps that connect with Drupal, it can also be used directly with a Drupal website on its frontend.

1. Create a a custom Drupal 8 module
2. Use Drupal 8's asset library to attach jDrupal for use 

For convenience, an example module is available on GitHub:

- [Download example module for Drupal 8](https://github.com/signalpoint/jdrupal-drupal-example)

Once enabled, we could attach jDrupal and our app to [a page's](https://github.com/signalpoint/jdrupal-drupal-example/blob/8.x-1.x/src/Controller/ExampleController.php) render element:

```
$element = array(
  '#markup' => '<div id="msg">Loading...</div>',
  '#attached' => array(
    'library' => array(
      'jdrupal/jdrupal',
      'example/app'
    )
  )
);
```

Then the [app](https://github.com/signalpoint/jdrupal-drupal-example/blob/8.x-1.x/js/app.js) would then be ready for use with jDrupal on the Drupal frontend's page:

```
// Set the Drupal site path.
jDrupal.config('sitePath', 'http://example.com');

// Connect to Drupal and say hello.
jDrupal.connect().then(function() {
  var user = jDrupal.currentUser();
  var msg = user.isAuthenticated() ?
  'Hello ' + user.getAccountName() : 'Hello World';
  document.getElementById('msg').innerHTML = msg;
});
```