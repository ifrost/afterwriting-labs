(function() {

   var global = this;

    mocha.setup({
        ui: 'bdd',
        reporter: 'dot'
    });

   
   var enabled = window.location.search.indexOf('ACCEPTANCE') !== -1 || navigator.userAgent.indexOf('PhantomJS') !== -1;

    if (enabled) {
   
        require(['../test/acceptance/tests'], function() {
            
            global.ACCEPTANCE = {
                before: function() {
                    window.clock = sinon.useFakeTimers();
                },
                run: function() {
                    window.clock.tick(5000);
                    mocha.run();
                }
            }
            
        });
        
    }
    else {
        global.ACCEPTANCE = false;
    }
   
    
})()
