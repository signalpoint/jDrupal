var test_services_system = function(callback) {
  test_connect(function() {
      if (callback) {
        callback();
      }
  });
};

var test_connect = function(callback) {
  asyncTest("jdrupal_connect", function() {
      jdrupal_connect({
          success:function(result){
            start();
            expect(2);
            var account = Drupal.currentUser();
            ok(!!account, "account");
            ok(!!account.id(), "uid");
            if (callback) {
              callback();
            }
          }
      });
  });
};

