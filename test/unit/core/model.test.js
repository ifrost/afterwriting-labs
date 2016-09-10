define(['core/model'], function(Model) {

    describe('Model', function() {

        var handler;

        beforeEach(function() {

            handler = sinon.stub();

        });

        it('dispatches changed event', function() {

            var Basic = Model.extend({

                value: {
                    observable: true
                }

            });

            var basic = Basic.create();
            basic.on('changed', handler);

            basic.value = 1;
            sinon.assert.calledOnce(handler);

            basic.value = 1;
            sinon.assert.calledOnce(handler);

            basic.value = 2;
            sinon.assert.calledTwice(handler);
        });

        it('dispatches specified changed event', function() {

            var Basic = Model.extend({

                value: {
                    observable: 'value_changed'
                }

            });

            var basic = Basic.create();
            basic.on('value_changed', handler);

            basic.value = 1;
            sinon.assert.calledOnce(handler);

            basic.value = 1;
            sinon.assert.calledOnce(handler);

            basic.value = 2;
            sinon.assert.calledTwice(handler);
        });

        it('calculates computed property once', function() {

            var computed = sinon.spy(function() {
                return 2 + 2;
            });

            var Basic = Model.extend({

                value: {
                    computed: computed
                }

            });

            var basic = Basic.create();

            chai.assert.equal(basic.value, 4);
            sinon.assert.calledOnce(computed);
            basic.value;
            sinon.assert.calledOnce(computed);
        });

        it('resets computed properties', function() {

            var computed = sinon.spy(function() {
                return 2 + 2;
            });

            var Basic = Model.extend({

                value: {
                    computed: computed
                }

            });

            var basic = Basic.create();

            chai.assert.equal(basic.value, 4);
            sinon.assert.calledOnce(computed);
            basic.value = true;
            basic.value;
            sinon.assert.calledTwice(computed);
        });

        it('observes changes', function() {

            var Parent = Model.extend({
                
                name: {
                    observable: true
                },
                
                NAME: {
                    observe: ['name'],
                    computed: function() {
                        return this.name.toUpperCase();
                    }
                },
                
                child: {
                    observable: true
                }
                
            });
            
            var Child = Model.extend({
                
                child_name: {
                    observable: true
                }
                
            });
            
            var Computed = Model.extend({
               
                parent: {
                    observable: true
                },
                
                parent_name: {
                    observe: ['parent.name'],
                    computed: function() {
                        return this.parent.name;
                    }
                },
                
                child_name: {
                    observe: ['parent.child.name'],
                    computed: function() {
                        return this.parent.child.child_name;
                    }
                }
                
            });
            
        });
    });

});