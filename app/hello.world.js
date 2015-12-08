function start_my_app() {
  (function($) {

    // Connect to Drupal... if the user is anonymous show them the login
    // form, otherwise say hello to them.
    $.connect({

      success: function() {

        try {

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

            // Create a new node.
            //var node = new $.Node({
            //  type: [ { target_id: 'article' } ],
            //  title: [ { value: 'Hello World' }]
            //});
            //node.save({
            //  success: function() {
            //    console.log('Saved new node # ' + node.id());
            //  }
            //});

            // Update an existing node...

            // First, load the node...
            //var node = $.nodeLoad(3, {
            //  success: function() {
            //
            //    // then change its title...
            //    node.setTitle('Goodbye world');
            //
            //    // and then save the changes.
            //    node.save({
            //      success: function() {
            //        console.log('Saved ' + node.getTitle());
            //      }
            //    });
            //
            //  }
            //});

            // Delete an existing node..

            // First, load the node...
            //var node = $.nodeLoad(14, {
            //  success: function() {
            //
            //    // then delete it.
            //    node.delete({
            //      success: function() {
            //
            //        console.log('Node deleted!');
            //
            //      }
            //    });
            //
            //  }
            //});

          }

          // Load a node.
          //var node = $.nodeLoad(1, {
          //  success: function() {
          //    console.log('Loaded node: ' + node.getTitle());
          //  }
          //});
          //
          //// Load a user.
          //var account = $.userLoad(1, {
          //  success: function() {
          //    console.log('Loaded user: ' + account.getAccountName());
          //  }
          //});
          //
          //// Load a view.
          //var view = $.viewsLoad('rest/content', {
          //  success: function() {
          //    var results = view.getResults();
          //    for (var i = 0; i < results.length; i ++) {
          //      var node = new $.Node(results[i]);
          //      console.log('from a view: ' + node.getTitle());
          //    }
          //  }
          //});

        }
        catch (error) { console.log('start_my_app - ' + error); }

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
  jDrupal.userLogin(name, pass, {
    success: function() {
      document.getElementById('user_dashboard').style.display = 'inline';
      document.getElementById('user_login_form').style.display = 'none';
    },
    error: function(xhr, status, result) {
      alert(result.message);
    }
  });
}

function logout_click() {

  // User logout.
  jDrupal.userLogout({
    success: function() {
      document.getElementById('user_dashboard').style.display = 'none';
      document.getElementById('user_login_form').style.display = 'inline';
    }
  });

}