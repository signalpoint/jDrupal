var test_services_user = function(name, pass, callback) {
  test_user_crud(name, pass, function() {
      if (callback) {
        callback();
      }
  });
};

function test_services_user_template() {
  return {
    type:"article",
    title:user_password()
  };
}

function test_services_user_new_template() {
  var account = {
    name: user_password(),
    mail: user_password() + '@example.com',
    pass: user_password()
  };
  account.pass2 = account.pass;
  return account;
}

var test_user_crud = function(name, pass, callback) {
  
  // TODO - need a failed user login test
  
  // User Logout
  asyncTest("user_logout", function() {
      user_logout({
          success:function(result){
            start();
            expect(1);
            ok(result[0], "lgged out");
            
            // Login attempt fail
            asyncTest("user_login - bad credentials", function() {
                user_login(user_password(), user_password(), {
                    error:function(xhr, status, message){
                      start();
                      expect(1);
                      ok(message[0], "Wrong username or password.");
                      
                      // User Register
                      asyncTest("user_register", function() {
                          user_register(test_services_user_new_template(), {
                              success:function(result){
                                start();
                                expect(1);
                                ok(result.uid, "uid");
                                var new_uid = result.uid;
                                
                                // Log back in...
                                asyncTest("user_login - logging back in", function() {
                                    user_login(name, pass, {
                                        success:function(result){
                                          start();
                                          expect(1);
                                          ok(result.user.name == name, "name");
                                          
                                          // Delete newly registered user...
                                          asyncTest("user_delete - deleting newly registered user", function() {
                                              user_delete(new_uid, {
                                                  success:function(result) {
                                                    start();
                                                    expect(1);
                                                    ok(result[0], "deleted");
                                                    
                                                    // Create
                                                    asyncTest("user_save - create new", function() {
                                                        var user = test_services_user_new_template();
                                                        user_save(user, {
                                                            success:function(user_create_result){
                                                              start();
                                                              expect(2);
                                                              ok(!!user_create_result.uid, "uid");
                                                              ok(!!user_create_result.uri, "uri");
                                                              
                                                              // Retrieve
                                                              asyncTest("user_load", function() {
                                                                  user_load(user_create_result.uid, {
                                                                      success:function(user_retrieve_result) {
                                                                        start();
                                                                        expect(2);
                                                                        ok(user_retrieve_result.uid == user_create_result.uid, "uid");
                                                                        ok(user_retrieve_result.title == user.title, "title");
                                                                        
                                                                        // Update
                                                                        asyncTest("user_save - update existing", function() {
                                                                            var user_changes = {
                                                                              uid:user_retrieve_result.uid,
                                                                              mail:user_password() + '@example.com',
                                                                              current_pass: user.pass
                                                                            };
                                                                            user_save(user_changes, {
                                                                                success:function(user_update_result) {
                                                                                  start();
                                                                                  expect(1);
                                                                                  ok(user_update_result.uid == user_create_result.uid, "uid");
                                                                                  
                                                                                  // Retrieve updated entity.
                                                                                  asyncTest("user_load - after update", function() {
                                                                                      user_load(user_update_result.uid, {
                                                                                          success:function(updated_user){
                                                                                            start();
                                                                                            expect(2);
                                                                                            ok(user_update_result.uid == updated_user.uid, "uid");
                                                                                            ok(user_update_result.mail == updated_user.mail, 'mail (' + user_update_result.mail + ' ?= ' + updated_user.mail + ')');
                                                                                            
                                                                                            // Delete
                                                                                            asyncTest("user_delete", function() {
                                                                                                user_delete(updated_user.uid, {
                                                                                                    success:function(user_delete_result){
                                                                                                      start();
                                                                                                      expect(1);
                                                                                                      ok(user_delete_result[0], "deleted");
                                                                                                      
                                                                                                      // Index
                                                                                                      asyncTest("user_index", function() {
                                                                                                          var query = {
                                                                                                            type: 'article'
                                                                                                          };
                                                                                                          user_index(query, {
                                                                                                              success:function(user_index_results){
                                                                                                                start();
                                                                                                                expect(1);
                                                                                                                ok(user_index_results[0].uid, "uid");
                                                                                                                
                                                                                                                if (callback) {
                                                                                                                  test_services_node(callback);
                                                                                                                  //callback();
                                                                                                                }
                                                                                                              }
                                                                                                          });
                                                                                                      }); // Index
                                                                                                      
                                                                                                    }
                                                                                                });
                                                                                            }); // Delete
                                                                                            
                                                                                          }
                                                                                      });
                                                                                  }); // Update Existing
                                                                                  
                                                                                }
                                                                            });
                                                                        }); // Load After Create
                                                                        
                                                                      }
                                                                  });
                                                              }); // Retrieve
                                                              
                                                            }
                                                        });
                                                    }); // Create
                                                    
                                                  }
                                              });
                                          });
                                          
                                        }
                                    });
                                });                     
                                
                              }
                          });
                      });
                      
                    }
                });
            });
            
          }
      });
  });

};

