define(function() {
    
    var user = {};
    
    user.click = function(selector) {
        $(selector).click();
        window.clock.tick(20000);
    };

    user.back_to_main = function() {
        user.click('#back');
    };

    user.open_plugin = function(name) {
        user.click('.menu-item.' + name);
    };
    
    return user;
    
});