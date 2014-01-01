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
            
            // Retrieve
            asyncTest("taxonomy_vocabulary_load", function() {
                taxonomy_vocabulary_load(taxonomy_vocabulary_create_result.vid, {
                    success:function(taxonomy_vocabulary_retrieve_result) {
                      start();
                      expect(2);
                      ok(taxonomy_vocabulary_retrieve_result.vid == taxonomy_vocabulary_create_result.vid, "vid");
                      ok(taxonomy_vocabulary_retrieve_result.title == taxonomy_vocabulary.title, "title");
                      
                      // Update
                      asyncTest("taxonomy_vocabulary_save - update existing", function() {
                          var taxonomy_vocabulary_changes = {
                            vid:taxonomy_vocabulary_retrieve_result.vid,
                            title:user_password()
                          };
                          taxonomy_vocabulary_save(taxonomy_vocabulary_changes, {
                              success:function(taxonomy_vocabulary_update_result) {
                                start();
                                expect(1);
                                ok(taxonomy_vocabulary_update_result.vid == taxonomy_vocabulary_create_result.vid, "vid");
                                
                                // Retrieve updated entity.
                                asyncTest("taxonomy_vocabulary_load - after update", function() {
                                    taxonomy_vocabulary_load(taxonomy_vocabulary_update_result.vid, {
                                        success:function(updated_taxonomy_vocabulary){
                                          start();
                                          expect(3);
                                          ok(taxonomy_vocabulary_update_result.vid == updated_taxonomy_vocabulary.vid, "vid");
                                          ok(taxonomy_vocabulary_changes.title == updated_taxonomy_vocabulary.title, "title");
                                          ok(taxonomy_vocabulary.title != updated_taxonomy_vocabulary.title, "title changed (" + taxonomy_vocabulary.title + " != " + updated_taxonomy_vocabulary.title + ")");
                                          
                                          // Delete
                                          asyncTest("taxonomy_vocabulary_delete", function() {
                                              taxonomy_vocabulary_delete(updated_taxonomy_vocabulary.vid, {
                                                  success:function(taxonomy_vocabulary_delete_result){
                                                    start();
                                                    expect(1);
                                                    ok(taxonomy_vocabulary_delete_result[0], "deleted");
                                                    
                                                    if (callback) {
                                                      //test_services_comment(callback);
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
};

