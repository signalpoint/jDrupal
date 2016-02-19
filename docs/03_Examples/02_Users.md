> Drupal 8 REST User Examples
### Get current user
```
var user = $.currentUser();
console.log('Current user id: ' + user.id());
```
### Load a user
```
$.userLoad(456).then(function(user) {
  console.log('Loaded : ' + user.getAccountName());
});
```