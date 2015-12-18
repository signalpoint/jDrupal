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
      node.save().then(function() {
        start();
        expect(1);
        ok(!!node.id(), "nid");

        // Retrieve
        var node_create_result_nid = node.id();
        asyncTest("jDrupal.nodeLoad", function() {
          jDrupal.nodeLoad(node_create_result_nid).then(function(node_retrieve_result) {
            start();
            expect(2);
            ok(node_retrieve_result.id() == node_create_result_nid, "nid");
            ok(node_retrieve_result.getTitle() == node.getTitle(), "title");

            var original_title = node.getTitle();

            // Update
            asyncTest("jDrupal.Node.save - update existing", function() {
              node_retrieve_result.setTitle(jDrupal.userPassword());
              node_retrieve_result.save().then(function() {
                start();
                expect(1);
                ok(typeof arguments[0] === 'undefined', "204 - No Content");

                // Retrieve updated entity.
                asyncTest("jDrupal.nodeLoad - after update", function() {
                  jDrupal.nodeLoad(node_retrieve_result.id()).then(function(updated_node) {
                    start();
                    expect(3);
                    ok(node_retrieve_result.id() == updated_node.id(), "nid");
                    ok(node_retrieve_result.getTitle() == updated_node.getTitle(), "title");
                    ok(node.getTitle() != updated_node.getTitle(), "title changed (" + node.getTitle() + " != " + updated_node.getTitle() + ")");

                    // Delete
                    asyncTest("jDrupal.Node.delete", function() {
                      updated_node.delete().then(function() {
                        start();
                        expect(2);
                        ok(typeof arguments[0] === 'undefined', "204 - No Content");
                        ok(updated_node.entity === null, "null entity");

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
                          callback();
                        }
                        //}
                        //});
                        //}); // Index
                      });
                    }); // Delete
                  });
                }); // Update Existing
              });
            }); // Load After Create
          });
        }); // Retrieve
      });
  }); // Create

};

