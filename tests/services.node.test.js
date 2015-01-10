var test_services_node = function(callback) {
  test_node_crud(function() {
      if (callback) {
        callback();
      }
  });
};

function test_services_node_template() {
  return {
    type: [ { target_id: 'page' } ],
    title: [ { value: user_password() } ]
  };
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
                      ok(node_retrieve_result.nid[0].value == node_create_result_nid, "nid");
                      ok(node_retrieve_result.title[0].value == node.title[0].value, "title");
                      
                      // Update
                      asyncTest("node_save - update existing", function() {
                          var node_changes = {
                            nid:node_retrieve_result.nid,
                            title:user_password()
                          };
                          node_save(node_changes, {
                              success:function(node_update_result) {
                                start();
                                expect(1);
                                ok(node_update_result.nid == node_create_result.nid, "nid");
                                
                                // Retrieve updated entity.
                                asyncTest("node_load - after update", function() {
                                    node_load(node_update_result.nid, {
                                        success:function(updated_node){
                                          start();
                                          expect(3);
                                          ok(node_update_result.nid == updated_node.nid, "nid");
                                          ok(node_changes.title == updated_node.title, "title");
                                          ok(node.title != updated_node.title, "title changed (" + node.title + " != " + updated_node.title + ")");
                                          
                                          // Delete
                                          asyncTest("node_delete", function() {
                                              node_delete(updated_node.nid, {
                                                  success:function(node_delete_result){
                                                    start();
                                                    expect(1);
                                                    ok(node_delete_result[0], "deleted");
                                                    
                                                    // Index
                                                    asyncTest("node_index", function() {
                                                        var query = {
                                                          type: 'article'
                                                        };
                                                        node_index(query, {
                                                            success:function(node_index_results){
                                                              start();
                                                              expect(1);
                                                              ok(node_index_results[0].nid, "nid");
                                                              
                                                              if (callback) {
                                                                test_services_comment(callback);
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

};

