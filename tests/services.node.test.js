var test_services_node = function(callback) {
  test_node_crud(function() {
      if (callback) {
        callback();
      }
  });
};

function test_services_node_template() {
  return new Drupal.Entity.Node({
    type: [ { target_id: 'page' } ],
    title: [ { value: user_password() } ]
  });
}

var test_node_crud = function(callback) {
  
  // Create
  asyncTest("node_save - create new", function() {
      var node = test_services_node_template();
      node_save(node, {
          success:function(node_create_result){
            start();
            expect(1);
            ok(!!node_create_result.indexOf(Drupal.settings.site_path) != -1, "Location");
            
            // Retrieve
            var node_create_result_nid = entity_id_from_location(node_create_result);
            asyncTest("node_load", function() {
                node_load(node_create_result_nid, {
                    success:function(node_retrieve_result) {
                      start();
                      expect(2);
                      ok(node_retrieve_result.id() == node_create_result_nid, "nid");
                      ok(node_retrieve_result.getTitle() == node.getTitle(), "title");
                      
                      // Update
                      asyncTest("node_save - update existing", function() {
                          var node_changes = new Drupal.Entity.Node({
                              nid: [{ value: node_create_result_nid }],
                              type: [{ target_id: node_retrieve_result.getType() }],
                              title: [{ value: user_password() }]
                          });
                          node_save(node_changes, {
                              success:function() {
                                start();
                                expect(1);
                                ok(arguments.length == 0, "204 - No Content");
                                
                                // Retrieve updated entity.
                                asyncTest("node_load - after update", function() {
                                    node_load(node_changes.id(), {
                                        success:function(updated_node){
                                          start();
                                          expect(3);
                                          ok(node_changes.id() == updated_node.id(), "nid");
                                          ok(node_changes.getTitle() == updated_node.getTitle(), "title");
                                          ok(node.getTitle() != updated_node.getTitle(), "title changed (" + node.getTitle() + " != " + updated_node.getTitle() + ")");
                                          
                                          // Delete
                                          asyncTest("node_delete", function() {
                                              node_delete(updated_node.id(), {
                                                  success:function(){
                                                    start();
                                                    expect(1);
                                                    ok(arguments.length == 0, "204 - No Content");
                                                    
                                                    // Index
                                                    /*asyncTest("node_index", function() {
                                                        var query = {
                                                          type: 'article'
                                                        };
                                                        node_index(query, {
                                                            success:function(node_index_results){
                                                              start();
                                                              expect(1);
                                                              ok(node_index_results[0].nid, "nid");*/
                                                              
                                                              if (callback) {
                                                                test_services_comment(callback);
                                                                //callback();
                                                              }
                                                            //}
                                                        //});
                                                    //}); // Index
                                                    
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

};

