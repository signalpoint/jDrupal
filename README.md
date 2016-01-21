## What is jDrupal?

> A simple Vanilla JavaScript Library and API.

## What is jDrupal used for?

> Tools for Drupal 8 Application Development.

- Connect
- User Login / Logout
- Entity C.R.U.D. (*create, retrieve, update, delete*)
  - Nodes
  - Users
  - Comments
- Views Integration

## What kind of apps?

> A variety of application architectures, including...

- headless/decoupled
- web apps
- hybrid mobile apps
  - phonegap/cordova
  - titanium

> and works with many frameworks, including...

- Bootstrap
- Foundation
- Angular
- React
- Ember

> or with no framework at all.

## Where can jDrupal be used?

> In any JavaScript application.

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
  var msg = jDrupal.currentUser().isAuthenticated() ?
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

- [Hello World](http://jdrupal.easystreet3.com/8/docs/Hello_World)