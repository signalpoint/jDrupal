> By completing this guide, you'll be ready to build an app for your Drupal 8 website.

## 1. Install jDrupal

Follow the [jDrupal install docs](Install).

## 2. Add an index.html file

Next, create an `index.html` file to start your app.

This file should live within the same domain as your Drupal site, but not in Drupal's root directory, for example:

`http://example.com/app/index.html`

```
<!DOCTYPE html>
<html>

  <head>

      <title>jDrupal</title>
      <script src="jdrupal.min.js"></script>
      <script src="app.js"></script>

  </head>

  <body onload="helloWorld()">
    
    <p id="msg">Loading...</p>
    
  </body>
</html>
```

## 3. Add an app.js file

Next, create an `app.js` file to power your app.

This file will live next to the `index.html` file, for example:
                                                 
`http://example.com/app/app.js`

```
jDrupal.settings = {
  sitePath: 'http://example.com',
  basePath: '/'
};
          
function helloWorld() {

  // Connect to Drupal.
  jDrupal.connect().then(function() {

    // Grab the current user account.
    var user = jDrupal.currentUser();

    // Prepare a message for the user.
    var text = 'Hello World';
    if (user.isAuthenticated()) {
      text = 'Hello ' + user.getAccountName();
    }

    // Show the message in the paragraph.
    document.getElementById("msg").innerHTML = text;

  });
  
}
```

## 4. Run the app

Navigate to `http://example.com/app` to view the `Hello World`.