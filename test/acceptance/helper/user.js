define(function() {
    
    var user = {};
    
    user.click = function(selector) {
        $(selector).click();
        window.clock.tick(20000);
    };
    
    return user;
    
});