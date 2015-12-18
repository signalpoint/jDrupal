var test_services_system = function(callback) {
  test_connect(function() {
      if (callback) {
        callback();
      }
  });
};

var test_connect = function(callback) {
  asyncTest("jDrupal.connect", function() {
      jDrupal.connect().then(function(){
        start();
        expect(2);
        var account = jDrupal.currentUser();
        ok(!!account, "account");
        ok(!!account.id(), "uid");
        if (callback) { callback(); }
      });
  });
};
