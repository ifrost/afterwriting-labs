define(function() {

    /**
     * Mocks all functions for a given Protoplast prototype
     * 
     * @param {Object} Prototype
     * @returns {Object}
     */
    var mock = function(Prototype) {
        var Mock = Object.create(Prototype);
        for (var property in Mock) {
            if (typeof Mock[property] === 'function') {
                Mock[property] = sinon.stub();
            }
            else {
                Mock[property] = undefined;
            }
        }
        Mock.extend = Mock.create = function() {
            return Object.create(Mock);
        };
        return Mock;
    };

    return mock;
    
});