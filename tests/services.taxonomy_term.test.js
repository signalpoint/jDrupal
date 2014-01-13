var test_services_taxonomy_term = function(callback) {
  test_taxonomy_term_crud(function() {
      if (callback) {
        callback();
      }
  });
};

function test_services_taxonomy_term_template(vid) {
  return {
    "vid":vid,
    name:user_password()
  };
}

var test_taxonomy_term_crud = function(callback) {
  
  // Create a vocabulary to test with.
  asyncTest("taxonomy_vocabulary_save - create new", function() {
      var taxonomy_vocabulary = test_services_taxonomy_vocabulary_template();
      taxonomy_vocabulary_save(taxonomy_vocabulary, {
          success:function(taxonomy_vocabulary_create_result){
            start();
            expect(1);
            ok(taxonomy_vocabulary_create_result[0] === 1, "SAVED_NEW");
            
            // Retrieve new vocabulary
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
                      ok(old_name == taxonomy_vocabulary.name, "name");
                      
                      // Create
                      asyncTest("taxonomy_term_save - create new", function() {
                          var taxonomy_term = test_services_taxonomy_term_template(taxonomy_vocabulary.vid);
                          taxonomy_term_save(taxonomy_term, {
                              success:function(taxonomy_term_create_result){
                                start();
                                expect(1);
                                ok(taxonomy_term_create_result[0] === 1, "SAVED_NEW");
                                
                                // Index
                                asyncTest("taxonomy_term_index", function() {
                                    var query = {
                                      parameters:{
                                        'vid':taxonomy_vocabulary.vid,
                                        'name':taxonomy_term.name
                                      }
                                    };
                                    taxonomy_term_index(query, {
                                        success:function(taxonomy_term_index_results){
                                          var index = taxonomy_term_index_results.length-1;
                                          var old_name = taxonomy_term.name;
                                          taxonomy_term = taxonomy_term_index_results[index];
                                          start();
                                          expect(2);
                                          ok(taxonomy_term.tid, "tid");
                                          ok(taxonomy_term.name == old_name, 'name (' + taxonomy_term.name + ' ?= ' + old_name + ')');
                                          
                                          // Retrieve
                                          asyncTest("taxonomy_term_load", function() {
                                              taxonomy_term_load(taxonomy_term.tid, {
                                                  success:function(taxonomy_term_retrieve_result) {
                                                    start();
                                                    expect(1);
                                                    ok(taxonomy_term_retrieve_result.tid == taxonomy_term.tid, "tid");
                                                    
                                                    // Update
                                                    asyncTest("taxonomy_term_save - update existing", function() {
                                                        var taxonomy_term_changes = {
                                                          vid:taxonomy_vocabulary.vid,
                                                          tid:taxonomy_term_retrieve_result.tid,
                                                          name:user_password()
                                                        };
                                                        taxonomy_term_save(taxonomy_term_changes, {
                                                            success:function(taxonomy_term_update_result) {
                                                              start();
                                                              expect(1);
                                                              ok(taxonomy_term_update_result[0] == 2, "SAVED_UPDATED");
                                                              
                                                              // Retrieve updated entity.
                                                              asyncTest("taxonomy_term_load - after update", function() {
                                                                  taxonomy_term_load(taxonomy_term_changes.tid, {
                                                                      success:function(updated_taxonomy_term){
                                                                        start();
                                                                        expect(3);
                                                                        ok(taxonomy_term_retrieve_result.tid == updated_taxonomy_term.tid, "tid");
                                                                        ok(taxonomy_term_changes.name == updated_taxonomy_term.name, "title");
                                                                        ok(taxonomy_term.name != updated_taxonomy_term.name, "title changed (" + taxonomy_term.name + " != " + updated_taxonomy_term.name + ")");
                                                                        
                                                                        // Delete
                                                                        asyncTest("taxonomy_term_delete", function() {
                                                                            taxonomy_term_delete(taxonomy_term_changes.tid, {
                                                                                success:function(taxonomy_term_delete_result){
                                                                                  start();
                                                                                  expect(1);
                                                                                  ok(taxonomy_term_delete_result[0] == 3, "SAVED_DELETED");
                                                                                  
                                                                                  // Delete Vocabulary
                                                                                  asyncTest("taxonomy_vocabulary_delete", function() {
                                                                                      taxonomy_vocabulary_delete(taxonomy_vocabulary.vid, {
                                                                                          success:function(taxonomy_vocabulary_delete_result){
                                                                                            start();
                                                                                            expect(1);
                                                                                            ok(taxonomy_vocabulary_delete_result[0] == 3, "SAVED_DELETED");
                                                                                            if (callback) {
                                                                                              callback();
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
                      
                      
                    }
                });
            });
            
          }
      });
  });

};

