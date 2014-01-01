var test_services_system = function(callback) {
  test_system_connect(function() {
      if (callback) {
        callback();
      }
  });
};

var test_system_connect = function(callback) {
  asyncTest("system_connect", function() {
      system_connect({
          success:function(result){
            start();
            expect(2);
            ok(!!result.sessid, "sessid");
            ok(!!result.user, "user");
            if (callback) {
              callback();
            }
          }
      });
  });
};

