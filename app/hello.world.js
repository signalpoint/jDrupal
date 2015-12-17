function start_my_app() {
  (function($) {

    // Connect and say hello.
    //$.connect().then(function(response) {
    //  var account = $.currentUser();
    //  var msg = !account.isAuthenticated() ?
    //    'Hello World' :
    //    'Hello ' + account.getAccountName();
    //  console.log(msg);
    //});

    // Connect to Drupal... if the user is anonymous show them the login
    // form, otherwise say hello to them.
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

            // Load a view.
            // @TODO rename to viewLoad?
            //$.viewsLoad('rest/content').then(function(view) {
            //  var results = view.getResults();
            //  for (var i = 0; i < results.length; i ++) {
            //    var node = new $.Node(results[i]);
            //    console.log(node.getTitle());
            //  }
            //});

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

            // Load a node.
            //var node = $.nodeLoad(1, {
            //  success: function() {
            //    console.log('Loaded node: ' + node.getTitle());
            //  }
            //});

            //// Load a user.
            //var account = $.userLoad(1, {
            //  success: function() {
            //    console.log('Loaded user: ' + account.getAccountName());
            //  }
            //});

            // Load a comment.
            //var comment = $.commentLoad(1, {
            //  success: function() {
            //    console.log('Loaded comment: ' + comment.getSubject());
            //  }
            //});

            // Create a new comment.
            //var comment = new $.Comment({
            //  uid: [ { target_id: 1 } ],
            //  entity_id: [ { target_id: 33 } ],
            //  entity_type: [ { value: 'node' } ],
            //  comment_type:[ { target_id: "comment" } ],
            //  subject: [ { value: jDrupal.userPassword() } ],
            //  comment_body: [{
            //    "value": "<p>See you later!</p>",
            //    "format": "basic_html"
            //  }]
            //});
            //comment.save({
            //  success: function() {
            //    console.log('Saved new comment # ' + comment.id());
            //  }
            //});

            // Update an existing comment...

            // First, load the comment...
            //var comment = $.commentLoad(6, {
            //  success: function() {
            //
            //    // then change its title...
            //    comment.setSubject('Woah buddy...');
            //
            //    // and then save the changes.
            //    comment.save({
            //      success: function() {
            //        console.log('Saved ' + comment.getTitle());
            //      }
            //    });
            //
            //  }
            //});

            // Delete an existing comment..

            // First, load the comment...
            //var comment = $.commentLoad(2, {
            //  success: function() {
            //
            //    // then delete it.
            //    comment.delete({
            //      success: function() {
            //
            //        console.log('Comment deleted!');
            //
            //      }
            //    });
            //
            //  }
            //});

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
