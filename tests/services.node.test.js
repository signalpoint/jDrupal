var test_services_node = function(callback) {
  test_node_crud(function() {
      if (callback) {
        callback();
      }
  });
};

function test_services_node_template() {
  return new jDrupal.Node({
    type: [ { target_id: 'article' } ],
    title: [ { value: jDrupal.userPassword() } ]
  });
}

var test_node_crud = function(callback) {
  
  // Create
  asyncTest("jDrupal.Node.save - create new", function() {
      var node = test_services_node_template();
      node.save({
          success:function(node_create_result){
            start();
            expect(1);
            ok(!!node_create_result.indexOf(jDrupal.sitePath()) != -1, "Location");
            
            // Retrieve
            var node_create_result_nid = node.id();
            asyncTest("jDrupal.nodeLoad", function() {
                var node_retrieve_result = jDrupal.nodeLoad(node_create_result_nid, {
                    success:function() {
                      start();
                      expect(2);
                      ok(node_retrieve_result.id() == node_create_result_nid, "nid");
                      ok(node_retrieve_result.getTitle() == node.getTitle(), "title");

                      var original_title = node.getTitle();
                      
                      // Update
                      asyncTest("jDrupal.Node.save - update existing", function() {
                        node_retrieve_result.setTitle(jDrupal.userPassword());
                        node_retrieve_result.save({
                              success:function() {
                                start();
                                expect(1);
                                console.log('arguments');
                                console.log(arguments);
                                ok(arguments.length == 0, "204 - No Content");
                                
                                // Retrieve updated entity.
                                asyncTest("jDrupal.nodeLoad - after update", function() {
                                    var updated_node = jDrupal.nodeLoad(node_retrieve_result.id(), {
                                        success:function(){
                                          start();
                                          expect(3);
                                          ok(node_retrieve_result.id() == updated_node.id(), "nid");
                                          ok(node_retrieve_result.getTitle() == updated_node.getTitle(), "title");
                                          ok(node.getTitle() != updated_node.getTitle(), "title changed (" + node.getTitle() + " != " + updated_node.getTitle() + ")");

                                          // Delete
                                          asyncTest("jDrupal.Node.delete", function() {
                                            updated_node.delete({
                                                  success:function(){
                                                    start();
                                                    expect(1);
                                                    ok(arguments.length == 0, "204 - No Content");

                                                    return;
                                                    
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
                                                                //test_services_comment(callback);
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

