var test_services_comment = function(callback) {
  test_comment_crud(function() {
      if (callback) {
        callback();
      }
  });
};

// Pass in an optional node id.
function test_services_comment_template() {
  var comment = {
    subject:user_password(),
    comment_body:{
      und:[
        {value:user_password()}
      ]
    }
  };
  if (arguments[0]) { comment.nid = arguments[0]; }
  return comment;
}

var test_comment_crud = function(callback) {
  
  // Create new article node to post comments to.
  asyncTest("node_save - create new node to post comments onto", function() {
      var node = test_services_node_template();
      node_save(node, {
          success:function(node_save_result) {
            start();
            expect(1);
            ok(!!node_save_result.nid, "nid");
            node.nid = node_save_result.nid;
            // Create
            asyncTest("comment_save - create new", function() {
                var comment = test_services_comment_template(node.nid);
                comment_save(comment, {
                    success:function(comment_create_result){
                      start();
                      expect(2);
                      ok(!!comment_create_result.cid, "cid");
                      ok(!!comment_create_result.uri, "uri");
                      
                      // Retrieve
                      asyncTest("comment_load", function() {
                          comment_load(comment_create_result.cid, {
                              success:function(comment_retrieve_result) {
                                var lng = language_default();
                                start();
                                expect(3);
                                ok(comment_retrieve_result.cid == comment_create_result.cid, "cid");
                                ok(comment_retrieve_result.subject == comment.subject, "subject");
                                ok(comment_retrieve_result.comment_body[lng][0].value == comment_retrieve_result.comment_body[lng][0].value, "comment_body");
                                
                                // Update
                                asyncTest("comment_save - update existing", function() {
                                    var comment_changes = test_services_comment_template();
                                    comment_changes.cid = comment_retrieve_result.cid;
                                    comment_save(comment_changes, {
                                        success:function(comment_update_result) {
                                          start();
                                          expect(1);
                                          ok(comment_update_result[0], "cid");
                                          
                                          // Index. Retrieve updated entity.
                                          asyncTest("comment_index", function() {
                                              var query = {
                                                parameters:{
                                                  'cid': comment_changes.cid
                                                }
                                              };
                                              comment_index(query, {
                                                  success:function(comments){
                                                    var updated_comment = comments[0];
                                                    start();
                                                    expect(2);
                                                    ok(comment_retrieve_result.cid == updated_comment.cid, "cid");
                                                    ok(comment_changes.subject != updated_comment.subject, "subject");
                                                    
                                                    // Delete
                                                    
                                                    asyncTest("comment_delete", function() {
                                                        comment_delete(updated_comment.cid, {
                                                            success:function(comment_delete_result){
                                                              start();
                                                              expect(1);
                                                              ok(comment_delete_result[0], "deleted");
                                                              
                                                              // Delete node.
                                                              asyncTest("node_delete - delete node after comments", function() {
                                                                  node_delete(updated_comment.nid, {
                                                                      success:function(node_delete_result){
                                                                        start();
                                                                        expect(1);
                                                                        ok(node_delete_result[0], "deleted");
                                                                        if (callback) {
                                                                          test_services_taxonomy_vocabulary(callback);
                                                                        }
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
                    }
                });
            });
            
          }
      });
  });
};

