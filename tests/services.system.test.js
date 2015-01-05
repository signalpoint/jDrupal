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
            console.log(result);
            start();
            expect(2);
            ok(!!result.account, "account");
            ok(!!result.account.uid, "uid");
            if (callback) {
              callback();
            }
          }
      });
  });
};

