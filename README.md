## What is jDrupal?

> A simple Vanilla JavaScript Library and API.

## What is jDrupal used for?

> Drupal 7 Application Development.

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
system_connect({
  success: function(result) {
    var msg = Drupal.user.uid == 0 ?
        'Hello World' : 'Hello ' + Drupal.user.name;
    alert(msg);
  }
});
```

```
// Load a node and display the title.
node_load(123, {
  success: function(node) {
    alert(node.title);
  }
});
```

```
// Login and show the user their id.
user_login("bob", "secret", {
  success: function(result) {
    alert(Drupal.user.id);
  }
});
```

## Getting Started

- [Hello World](http://jdrupal.easystreet3.com/7/docs/Hello_World)

> jDrupal is best friends with [DrupalGap](http://drupalgap.org), the open source application development kit for Drupal websites.
