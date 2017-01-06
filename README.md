## What is jDrupal?

> A simple Vanilla JavaScript Library and API.

## What is jDrupal used for?

> Drupal 8 Application Development.

## What kind of apps?

> A variety of application architectures, including...

- Mobile Applications (Android, iOS, etc)
- Web Applications
- Headless Drupal / Decoupled Drupal
- [PhoneGap](http://phonegap.com/) ([Cordova](https://cordova.apache.org/))

## jDrupal...

- solves many common development needs for Drupal based applications.
- provides a familiar Drupal coding experience and syntax for developers.
- runs alongside any frontend client side framework, or with no framework at all.
- utilizes JavaScript prototypes and promises.

Since jDrupal has no dependencies and is written in pure JavaScript, it can be used in a wide variety of architectures and frameworks. Just include it in the `<head>` of your app's `index.html` file:

```
<html>
  <head>
    <!-- ... -->
    <script src="jdrupal.min.js"></script>
    <!-- ... -->
  </head>
  <body><!-- ... --></body>
</html>
```

## Quick Examples

```
// Connect to Drupal and say hello to the current user.
jDrupal.connect().then(function() {
  var user = jDrupal.currentUser();
  var msg = user.isAuthenticated() ?
    'Hello ' + user.getAccountName() : 'Hello World';
  alert(msg);
});
```

```
// Load a node and display the title.
jDrupal.nodeLoad(123).then(function(node) {
  alert(node.getTitle());
});
```

```
// Login and show the user their id.
jDrupal.userLogin('bob', 'secret').then(function() {
  alert(jDrupal.currentUser().id());
});
```

```
// Get results from a view and print the node ids to the console.
jDrupal.viewsLoad('my-view-url').then(function(view) {
  var results = view.getResults();
  for (var i = 0; i < results.length; i ++) {
    var node = new jDrupal.Node(results[i]);
    console.log('node id: ' + node.id());
  }
});
```

## Getting Started

- [Hello World](http://jdrupal.tylerfrankenstein.com/8/docs/Hello_World)

> jDrupal is best friends with [DrupalGap](http://drupalgap.org), the open source application development kit for Drupal websites.
