var offline_test_services_node = function(callback) {
  offline_test_node_crud(function() {
      if (callback) {
        callback();
      }
  });
};

function offline_test_services_node_template() {
  return {
    type: "article",
    title: user_password()
  };
}

var offline_test_node_crud = function(callback) {
  
  // Create
  asyncTest("node_save - create new", function() {
      var node = offline_test_services_node_template();
      node_save(node, {
          success:function(node_create_result){
            start();
            expect(2);
            ok(!!node_create_result.nid, "nid");
            ok(!!node_create_result.uri, "uri");
            
            if (callback) {
              //test_services_comment(callback);
              callback();
            }
            
          }
      });
  }); // Create

};

