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

            // Create a node.
            //var node = new $.Node({
            //  type: [ { target_id: 'article' } ],
            //  title: [ { value: 'Hello World' }]
            //});
            //node.save().then(function() {
            //  console.log('Saved new node # ' + node.id());
            //});

            // Retrieve a node.
            //$.nodeLoad(1).then(function(node) {
            //  console.log('Loaded node: ' + node.getTitle());
            //});

            // Update a node...

            // First, load the node...
            //$.nodeLoad(123).then(function(node) {
            //
            //  // then change its title...
            //  node.setTitle('Goodbye world');
            //
            //  // and then save the changes.
            //  node.save().then(function() {
            //    console.log('Saved ' + node.getTitle());
            //  });
            //
            //});

            // Delete a node..

            // First, load the node...
            //$.nodeLoad(6).then(function(node) {
            //
            //  // then delete it.
            //  node.delete().then(function() {
            //    console.log('Node deleted!');
            //  });
            //
            //});

            // Create a comment.
            //var comment = new $.Comment({
            //  uid: [ { target_id: 1 } ],
            //  entity_id: [ { target_id: 3 } ],
            //  entity_type: [ { value: 'node' } ],
            //  comment_type:[ { target_id: "comment" } ],
            //  subject: [ { value: jDrupal.userPassword() } ],
            //  comment_body: [{
            //    "value": "<p>See you later!</p>",
            //    "format": "basic_html"
            //  }]
            //});
            //comment.save().then(function() {
            //  console.log('Saved new comment # ' + comment.id());
            //});

            // Retrieve a comment.
            //$.commentLoad(3).then(function(comment) {
            //  console.log('Loaded comment: ' + comment.getSubject());
            //});

            // Update a comment...
            // @TODO D8 core bug?
            // @see https://www.drupal.org/node/2631774

            // First, load the comment...
            //$.commentLoad(3).then(function(comment) {
            //
            //  // then change its subject...
            //  comment.setSubject('Woah buddy...');
            //
            //  // and then save the changes.
            //  comment.save().then(function() {
            //    console.log('Saved ' + comment.setSubject());
            //  });
            //
            //});

            // Delete a comment..

            // First, load the comment...
            //$.commentLoad(3).then(function(comment) {
            //
            //  // Then delete it.
            //  comment.delete().then(function() {
            //    console.log('Comment deleted!');
            //  });
            //
            //});

            // Load a user.
            //$.userLoad(1).then(function (account) {
            //  console.log('Loaded user: ' + account.getAccountName());
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
