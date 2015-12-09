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
    "uid":[{"target_id": jDrupal.currentUser().id()}],
    "entity_type":[{"value":"node"}],
    "comment_type":[{"target_id":"comment"}],
    "subject":[{"value":jDrupal.userPassword()}],
    "comment_body":[
      {"value":jDrupal.userPassword(),"format":"basic_html"}
    ]
  };
  if (arguments[0]) { comment.entity_id = [{ target_id: arguments[0] }]; }
  return new jDrupal.Comment(comment);
}

var test_comment_crud = function(callback) {
  
  // Create new article node to post comments to.
  asyncTest("node_save - create new node to post comments onto", function() {
      var node = test_services_node_template();
      node.save({
          success:function(node_save_result) {
            start();
            expect(1);
            ok(!!node.id(), "nid");
            // Create
            asyncTest("comment_save - create new", function() {
                var comment = test_services_comment_template(node.id());
                comment.save({
                    success:function(comment_create_result){
                      start();
                      expect(1);
                      ok(!!comment.id(), "cid");
                      
                      // Retrieve
                      asyncTest("comment_load", function() {
                          var comment_retrieve_result = jDrupal.commentLoad(comment.id(), {
                              success:function() {
                                //var lng = language_default();
                                start();
                                expect(2);
                                ok(comment.id() == comment_retrieve_result.id(), "cid");
                                ok(comment_retrieve_result.getSubject() == comment.getSubject(), "subject");
                                //ok(comment_retrieve_result.comment_body[lng][0].value == comment_retrieve_result.comment_body[lng][0].value, "comment_body");
                                
                                // Update - waiting on dg core issue #2631774
                                //asyncTest("comment_save - update existing", function() {
                                //  var original_subject = comment.getSubject();
                                //  comment.setSubject(jDrupal.userPassword());
                                //    comment.save({
                                //        success:function() {
                                //          start();
                                //          expect(1);
                                //          ok(original_subject != comment.getSubject(), "subject");
                                          
                                          // Index. Retrieve updated entity.
                                          //asyncTest("comment_index", function() {
                                          //    var query = {
                                          //      parameters:{
                                          //        'cid': comment_changes.cid
                                          //      }
                                          //    };
                                          //    comment_index(query, {
                                          //        success:function(comments){
                                          //          var updated_comment = comments[0];
                                          //          start();
                                          //          expect(2);
                                          //          ok(comment_retrieve_result.cid == updated_comment.cid, "cid");
                                          //          ok(comment_changes.subject != updated_comment.subject, "subject");
                                                    
                                                    // Delete
                                                    
                                                    asyncTest("comment_delete", function() {
                                                        comment.delete({
                                                            success:function(){
                                                              start();
                                                              expect(2);
                                                              ok(arguments.length == 0, "204 - No Content");
                                                              ok(comment.entity === null, "deleted");
                                                              
                                                              // Delete node.
                                                              asyncTest("node_delete - delete node after comments", function() {
                                                                  node.delete({
                                                                      success:function(){
                                                                        start();
                                                                        expect(1);
                                                                        ok(node.entity === null, "deleted");
                                                                        if (callback) {
                                                                          //test_services_taxonomy_vocabulary(callback);
                                                                          callback();
                                                                        }
                                                                      }
                                                                  });
                                                              });
                                                            }
                                                        });
                                                    });
                                          //        }
                                          //    });
                                          //});
                                //        }
                                //    });
                                //});
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

