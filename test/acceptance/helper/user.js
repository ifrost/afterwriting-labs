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

    user.open_from_dropbox = function() {
        user.click('[open-action=dropbox]');
    };

    user.close_popup = function() {
        user.click('[name=jqi_state0_buttonCancel]');
    };

    return user;
    
});