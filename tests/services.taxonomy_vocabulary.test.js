var test_services_taxonomy_vocabulary = function(callback) {
  test_taxonomy_vocabulary_crud(function() {
      if (callback) {
        callback();
      }
  });
};

function test_services_taxonomy_vocabulary_template() {
  return {
    name:user_password(),
    description:user_password()
  };
}

var test_taxonomy_vocabulary_crud = function(callback) {
  
  // Create
  asyncTest("taxonomy_vocabulary_save - create new", function() {
      var taxonomy_vocabulary = test_services_taxonomy_vocabulary_template();
      taxonomy_vocabulary_save(taxonomy_vocabulary, {
          success:function(taxonomy_vocabulary_create_result){
            start();
            expect(1);
            ok(taxonomy_vocabulary_create_result[0] === 1, "SAVED_NEW");
            
            // Index
            asyncTest("taxonomy_vocabulary_index", function() {
                var query = {
                  parameters:{
                    'name':taxonomy_vocabulary.name
                  }
                };
                taxonomy_vocabulary_index(query, {
                    success:function(taxonomy_vocabulary_index_results){
                      var index = taxonomy_vocabulary_index_results.length-1;
                      var old_name = taxonomy_vocabulary.name;
                      taxonomy_vocabulary = taxonomy_vocabulary_index_results[index];
                      start();
                      expect(2);
                      ok(taxonomy_vocabulary.vid, "vid");
                      ok(taxonomy_vocabulary.name == old_name, "name");
                      
                      // Retrieve
                      asyncTest("taxonomy_vocabulary_load", function() {
                          taxonomy_vocabulary_load(taxonomy_vocabulary.vid, {
                              success:function(taxonomy_vocabulary_retrieve_result) {
                                start();
                                expect(1);
                                ok(taxonomy_vocabulary_retrieve_result.vid == taxonomy_vocabulary.vid, "vid");
                                
                                // Update
                                asyncTest("taxonomy_vocabulary_save - update existing", function() {
                                    var taxonomy_vocabulary_changes = {
                                      vid: taxonomy_vocabulary_retrieve_result.vid,
                                      name: user_password(),
                                      machine_name: taxonomy_vocabulary.machine_name
                                    };
                                    taxonomy_vocabulary_save(taxonomy_vocabulary_changes, {
                                        success:function(taxonomy_vocabulary_update_result) {
                                          start();
                                          expect(1);
                                          ok(taxonomy_vocabulary_update_result[0] == 2, "SAVED_UPDATED");
                                          
                                          // Retrieve updated entity.
                                          asyncTest("taxonomy_vocabulary_load - after update", function() {
                                              taxonomy_vocabulary_load(taxonomy_vocabulary_changes.vid, {
                                                  success:function(updated_taxonomy_vocabulary){
                                                    start();
                                                    expect(3);
                                                    ok(taxonomy_vocabulary_retrieve_result.vid == updated_taxonomy_vocabulary.vid, "vid");
                                                    ok(taxonomy_vocabulary_changes.name == updated_taxonomy_vocabulary.name, "title");
                                                    ok(taxonomy_vocabulary.name != updated_taxonomy_vocabulary.name, "title changed (" + taxonomy_vocabulary.name + " != " + updated_taxonomy_vocabulary.name + ")");
                                                    
                                                    // Delete
                                                    asyncTest("taxonomy_vocabulary_delete", function() {
                                                        taxonomy_vocabulary_delete(taxonomy_vocabulary_changes.vid, {
                                                            success:function(taxonomy_vocabulary_delete_result){
                                                              start();
                                                              expect(1);
                                                              ok(taxonomy_vocabulary_delete_result[0] == 3, "SAVED_DELETED");
                                                              if (callback) {
                                                                test_taxonomy_term_crud(callback);
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
            }); // Index
            
          }
      });
  });

};

