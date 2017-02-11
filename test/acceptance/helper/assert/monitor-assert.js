define(function(require) {

    var BaseAssert = require('acceptance/helper/assert/base-assert');

    var MonitorAssert = BaseAssert.extend({


        event_tracked: function(category, action, label) {
            var eventName = [category, action, label].filter(function(value){return value;}).join('/');
            chai.assert.ok(this.ga.hasEvent(category, action, label), 'Event: ' + eventName + ' not found');
        },

        event_tracked_n_times: function(n, category, action, label) {
            var eventName = [category, action, label].filter(function(value){return value;}).join('/'),
                events = this.ga.getEvents(category, action, label).length;
            chai.assert.strictEqual(n, events, 'Event: ' + eventName + ' expected ' + n + ', but tracked ' + events + ' times');
        }

    });

    return MonitorAssert;
});