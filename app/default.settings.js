// Settings.
jDrupal.settings = {

  // Drupal site settings.
  site_path: '',
  base_path: '/',

  // Set to true to see debug info printed to the console.log().
  debug: true,

  // Cache settings for Entities and View.
  cache: {
    entity: {
      enabled: false,
      expiration: 3600
    },
    views: {
      enabled: false,
      expiration: 3600
    }
  }

};