function start_my_app() {
  try {

    // Connect to Drupal... if the user is anonymous show them the login
    // form, otherwise say hello to them.
    jDrupalConnect({
      success: function() {
        console.log('app connected');

        var account = jDrupal.currentUser();
        if (account.id() != 0) {
          console.log('Hi, ' + account.getAccountName() + '!');
        }
        else {
          console.log('Login you jerk!');
          document.getElementById('user_login_form').style.display = 'inline';
        }
      }
    });

  }
  catch (error) { console.log('start_my_app - ' + error); }
}

// Handle the login button click.
function login_click() {

  // Grab the username and password.
  var name = document.getElementById('name').value;
  var pass = document.getElementById('pass').value;
  jDrupalUserLogin(name, pass, {
    success: function(result) {
      console.log(result);
      return;
      var account = jDrupal.currentUser();
      alert('Hello ' + account.getUsername());
    },
    error: function(xhr, status, result) {
      alert(result.message);
    }
  });
}