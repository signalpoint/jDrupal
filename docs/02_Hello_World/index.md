> This creates a simple web app for Drupal 7.

## 1. Create an app folder

Next, create a folder called `app` to store your application's source code. This folder should live within the same domain as your Drupal website. For example, place it in a new directory called `app` in your Drupal root:

```
http://example.com/app
```

## 2. Download jDrupal

[Download](https://raw.githubusercontent.com/easystreet3/jDrupal/7.x-1.x/jdrupal.min.js) the tool kit so it lives here:

```
http://example.com/app/jdrupal.min.js
```

## 3. Add an index.html file

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

  <body onload="hello_world()">
    
    <p id="msg">Loading...</p>
    
  </body>
</html>
```

## 4. Add an app.js file

Next, create an `app.js` file to run your app and replace the `sitePath` value with the URL to your Drupal website.
                                                 
`http://example.com/app/app.js`

```
Drupal.settings.site_path = "http://www.example.com";
Drupal.settings.endpoint = "rest";
          
function hello_world() {
  system_connect({
    success: function(result) {
    
      // Prepare a message for the user.
      var text = Drupal.user.uid == 0 ?
        'Hello World' : 'Hello ' + Drupal.user.name;
      
      // Show the message in the paragraph.
      document.getElementById("msg").innerHTML = text;
      
    }
  });
}
```

## 5. Run the app

Navigate to `http://example.com/app` to view the `Hello World`.
