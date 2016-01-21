function start_my_app() {
  (function($) {

    // Connect to Drupal... if the user is anonymous show them the login form, otherwise say hello to them.
    $.connect().then(function(result) {

          console.log(result);

          // Grab the current user.
          var account = $.currentUser();

          // Anonymous users.
          if (!account.isAuthenticated()) {

            // Show the login form.
            document.getElementById('user_login_form').style.display = 'inline';

          }

          // Authenticated users.
          else {

            // Show the user dashboard and say hello.
            document.getElementById('user_dashboard').style.display = 'inline';
            var msg = 'Hello, ' + account.getAccountName();
            console.log(msg);

          }

    });

  }(jDrupal));
}

// Handle the login button click.
function login_click() {

  // Grab the user input.
  var name = document.getElementById('name').value;
  var pass = document.getElementById('pass').value;

  // User login.
  jDrupal.userLogin(name, pass).then(
    function() {
      document.getElementById('user_dashboard').style.display = 'inline';
      document.getElementById('user_login_form').style.display = 'none';
    },
    function(err) { alert(err); }
  );

}

// Handle the logout button click.
function logout_click() {

  // User logout.
  jDrupal.userLogout().then(function(){
    document.getElementById('user_dashboard').style.display = 'none';
    document.getElementById('user_login_form').style.display = 'inline';
  });

}
