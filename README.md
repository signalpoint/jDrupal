jDrupal
=======

A pure JavaScript library for a RESTful Drupal website.

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

Above is an example of how easy it is to load a Drupal node with jDrupal
in JavaScript. Use jDrupal to easily build JavaScript based mobile applications
and web applications for your Drupal site.

For more information and "Hello World", please visit: http://www.easystreet3.com/jDrupal

## Install

### Download and Install Drupal
First, [download](https://drupal.org/download) and [install](https://drupal.org/documentation/install) Drupal so your site is available here, for example:

```
http://www.example.com
```

### Enable the Services Module and Create Endpoint
Download and enable the Services module on the Drupal site. Import the endpoint by following these steps:

- In Drupal, go to admin/structure/services/import
- Copy the export code from [services-endpoint-export.txt](https://github.com/easystreet3/jDrupal/blob/7.x-1.x/services-endpoint-export.txt)
- Paste it into the Endpoint code textarea
- Click Continue
- Click Save
- Under admin/config/development/performance click Clear all caches

### Add jDrupal library to your app and configure it
- Download the jDrupal library with `bower install jdrupal` or [download a release](https://github.com/easystreet3/jDrupal/releases) manually.
- Include the `bin/jdrupal.js` file using a script tag in your app.
- Configure the environmental variables to let jDrupal know where your Drupal endpoint is.
```
// Set the site path (without the trailing slash).
Drupal.settings.site_path = "http://www.example.com";

// Set the Service Resource endpoint path.
Drupal.settings.endpoint = "rest";
```

# Entity Local Storage Cache
```
// Set to true to enable local storage caching for entities.
Drupal.settings.cache.entity.enabled = true;

// Number of seconds before cached copy expires. Set to 0 to cache forever, set
// to 60 for one minute, etc.
Drupal.settings.cache.entity.expiration = 60*60*24;
```

