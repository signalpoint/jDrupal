> This creates a simple web app for Drupal 8.

To use jDrupal directly on the Drupal front end, see the [Drupal Example page](Examples/Drupal).

## 1. Set up the jDrupal Module

[Enable and Configure](Install) the jDrupal module for your Drupal 8 site.

## 2. Create an app folder

Next, create a folder called `app` to store your application's source code. This folder should live within the same domain as your Drupal website. For example, place it in a new directory called `app` in your Drupal root:

```
http://example.com/app
```

## 3. Download jDrupal

[Download](https://raw.githubusercontent.com/signalpoint/jDrupal/8.x-1.x/jdrupal.min.js) the tool kit so it lives here:

```
http://example.com/app/jdrupal.min.js
```

## 4. Add an index.html file

Next, create an `index.html` file to start your app. 

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

## 5. Add an app.js file

Next, create an `app.js` file to run your app and replace the `sitePath` value with the URL to your Drupal website.
                                                 
`http://example.com/app/app.js`

```
// Set the Drupal site path.
jDrupal.config('sitePath', 'http://example.com');
          
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

## 6. Run the app

Navigate to `http://example.com/app` to view the `Hello World`.
