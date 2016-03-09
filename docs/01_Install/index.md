## 1. Set up a Drupal 7 Website

- [Download Drupal](https://drupal.org/download)
- [Install Drupal](http://drupal.org/documentation/install)

## 2. Enable the Services Module and Create Endpoint
Download and enable the Services module on the Drupal site. Import the endpoint by following these steps:

- In Drupal, go to admin/structure/services/import
- Copy the export code from [services-endpoint-export.txt](https://github.com/easystreet3/jDrupal/blob/7.x-1.x/services-endpoint-export.txt)
- Paste it into the Endpoint code textarea
- Click Continue
- Click Save
- Under admin/config/development/performance click Clear all caches

## 3. Add jDrupal library to your app and configure it
- Download the jDrupal library with `npm install jdrupal`, `bower install jdrupal` or [download a release](https://github.com/easystreet3/jDrupal/releases) manually.
- Include the `jdrupal.min.js` file using a script tag in your app.
- Configure the environmental variables to let jDrupal know where your Drupal endpoint is:

```
// Set the site path (without the trailing slash).
Drupal.settings.site_path = "http://www.example.com";

// Set the Service Resource endpoint path.
Drupal.settings.endpoint = "rest";

// Set to true to enable local storage caching for entities.
Drupal.settings.cache.entity.enabled = true;

// Number of seconds before cached copy expires. Set to 0 to cache forever, set
// to 60 for one minute, etc.
Drupal.settings.cache.entity.expiration = 60*60*24;
```

## 4. Done!

Now you're ready to build an application, try the [Hello World](Hello_World) for starters.
