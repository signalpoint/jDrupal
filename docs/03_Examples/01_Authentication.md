> Authenticate with Drupal 8 REST.
### Connect
```
$.connect().then(function() {
  // jDrupal.currentUser() is now ready...
  var account = jDrupal.currentUser();
  console.log('User id: ' + account.id());
});
```
### Login
```
$.userLogin('bob', 'secret').then(function() {
  console.log('Logged in!');
});
```
### Logout
```
$.userLogout().then(function() {
  console.log('Logged out!');
});
```
