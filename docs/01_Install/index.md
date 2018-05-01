## 1. Set up a Drupal 8 Website

- [Download Drupal](https://drupal.org/download)
- [Install Drupal](http://drupal.org/documentation/install)

## 2. Enable the Module

Using composer to download and drush to install:

```
composer require drupal/jdrupal
drush en jdrupal
```

Or download and enable the [jDrupal module](http://www.drupal.org/project/jdrupal) manually and then enable it:

```
drush en jdrupal
```

## 3. Configure it

Next, configure Drupal 8 site by following the [README](http://cgit.drupalcode.org/jdrupal/plain/README.md).

## 4. Done!

Now you're ready to build an application, try the [Hello World](Hello_World) for starters.
