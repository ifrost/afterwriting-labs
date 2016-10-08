(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.p = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Model = require('./model');

var CollectionView = Model.extend({

    _filters: null,

    _sort: null,

    _hiddenSelected: null,
    
    selected: null,

    length: {
        get: function() {
            return this._current.length;
        }
    },

    $create: function(collection) {
        this._source = collection;
        this._current = [];
        this._filters = [];
        this._sort = [];

        this._source.on('changed', this._invalidate, this);

        this.refresh = this.refresh.bind(this);

        this._invalidate({
            added: this._source.toArray()
        });
    },

    refresh: function() {
        this._invalidate();
    },

    addFilter: function(filter) {
        this._filters.push(filter);
        this._invalidate();
    },

    removeFilter: function(filter) {
        var index = this._filters.indexOf(filter);
        if (index !== -1) {
            this._filters.splice(index, 1);
            this._invalidate();
        }
    },

    addSort: function(sort) {
        this._sort.push(sort);
        this._invalidate();
    },

    removeSort: function(sort) {
        var index = this._sort.indexOf(sort);
        if (index !== -1) {
            this._sort.splice(index, 1);
            this._invalidate();
        }
    },

    get: function(index) {
        return this._current[index];
    },

    toArray: function() {
        return this._current;
    },

    forEach: function() {
        return this._current.forEach.apply(this._current, arguments);
    },

    _resubscribe: function(filterOrSort, event) {
        event.removed.forEach(function(item) {
            if (filterOrSort.properties) {
                filterOrSort.properties.forEach(function(property) {
                    item.off(property + '_changed', this.refresh, this);
                }, this);
            }
        }, this);

        event.added.forEach(function(item) {
            if (filterOrSort.properties) {
                filterOrSort.properties.forEach(function(property) {
                    item.on(property + '_changed', this.refresh, this);
                }, this);
            }
        }, this);
    },

    _invalidate: function(event) {

        if (!event) {
            event = {added: this._source.toArray(), removed: this._source.toArray()}
        }

        this._current = this._source.toArray().concat();

        this._filters.forEach(function(filter) {
            this._resubscribe(filter, event);
            this._current = this._current.filter(function(item) {
                return filter.fn(item);
            });

        }, this);

        if (this._sort.length) {
            this._sort.forEach(function(sort) {
                this._resubscribe(sort, event);
            }, this);

            this._current.sort(function(a, b) {
                var sorts = this._sort.concat();
                var result = 0, sort = sorts.shift();
                
                while (result === 0 && sort) {
                    result = sort.fn(a, b);
                    sort = sorts.shift();
                }

                return result;
            }.bind(this));
        }
        
        if (this.selected && this._current.indexOf(this.selected) === -1) {
            this._hiddenSelected = this.selected;
            this.selected = null;
        }
        else if (!this.selected && this._hiddenSelected && this._current.indexOf(this._hiddenSelected) !== -1) {
            this.selected = this._hiddenSelected;
            this._hiddenSelected = null;
        }
        
        this.dispatch('changed');
    }

});

module.exports = CollectionView;
},{"./model":7}],2:[function(require,module,exports){
var Model = require('./model');

var Collection = Model.extend({

    $create: function(array) {
        this.array = array || [];
    },

    length: {
        get: function() {
            return this.array.length;
        }
    },

    indexOf: function() {
        return this.array.indexOf.apply(this.array, arguments);
    },

    add: function(item) {
        var result = this.array.push(item);
        this.dispatch('changed', {added: [item], removed: []});
        return result;
    },
    
    remove: function(item) {
        var index = this.array.indexOf(item);
        if (index !== -1) {
            this.array.splice(index, 1);
            this.dispatch('changed', {added: [], removed: [item]});
        }
    },

    forEach: function(handler, context) {
        return this.array.forEach(handler, context);
    },
    
    concat: function() {
        return Collection.create(this.array.concat.apply(this.array, arguments));
    },

    filter: function(handler, context) {
        return Collection.create(this.array.filter(handler, context));
    },

    toArray: function() {
        return this.array;
    },

    toJSON: function() {
        return this.toArray();
    }

});

module.exports = Collection;
},{"./model":7}],3:[function(require,module,exports){
var Context = require('./di'),
    Object = require('./object'),
    utils = require('./utils');

/**
 * Creates a simple component tree-like architecture for the view layer. Used with DI
 * @alias Component
 */
var Component = Object.extend({

    $meta: {
        domProcessors: [utils.domProcessors.createComponents, utils.domProcessors.injectElement]
    },
    
    tag: '',

    html: '',

    root: {
        get: function() {
            return this._root;
        },
        set: function(value) {
            this._root = value;
            this.processRoot();
        }
    },

    children: {
        get: function() {
            return this._children
        }
    },

    /**
     * Init the object, construct and process DOM
     */
    $create: function() {
        var domWrapper;

        this._children = [];

        if (!this.tag && !this.html) {
            this.tag = 'div';
        }

        if (this.tag && !this.html) {
            this.html = '<' + this.tag + '></' + this.tag + '>';
        }

        domWrapper = utils.html.parseHTML(this.html);
        if (domWrapper.childNodes.length > 1) {
            throw new Error('Component should have only one root element');
        }
        this.root = domWrapper.firstChild;
    },

    /**
     * Process DOM using defined DOM processors
     */
    processRoot: function() {
        var i, elements, element, value;
        if (this._root) {
            (this.$meta.domProcessors || []).forEach(function(processor) {
                elements =  this._root.querySelectorAll('[' + processor.attribute + ']');
                for (i = 0; i < elements.length; i++) {
                    element = elements[i];
                    value = element.getAttribute(processor.attribute);
                    processor.process(this, element, value);
                }
            }, this);
        }
    },

    /**
     * @type {Function}
     */
    __fastinject__: {
        get: function() {return this.___fastinject___},
        set: function(value) {
            if (!this.___fastinject___) {
                this.___fastinject___ = value;
                // fastinject all the children
                this._children.forEach(this.__fastinject__, this);

                if (this.$meta.presenter) {
                    this.__presenter__ = this.$meta.presenter.create();
                }

            }
        }
    },

    __presenter__: {
        get: function() {
            return this.___presenter___;
        },
        set: function(presenter) {
            this.___presenter___ = presenter;
            presenter.view = this;
            this.___fastinject___(presenter);
        }
    },

    /**
     * Template method, used to create DOM of the component
     */
    init: {
        injectInit: true,
        value: function() {}
    },

    /**
     * Destroy the component and all child components
     */
    destroy: function() {
        if (this.__presenter__ && this.__presenter__.destroy) {
            this.__presenter__.destroy();
        }
        this._children.concat().forEach(function(child) {
            this.remove(child);
        }, this);
    },

    /**
     * Add a child component
     * @param {Component} child
     */
    add: function(child) {
        if (!child) {
            throw new Error('Child component cannot be null');
        }
        if (!child.root) {
            throw new Error('Child component should have root property');
        }
        this._children.push(child);
        this.root.appendChild(child.root);
        if (this.__fastinject__) {
            this.__fastinject__(child);
        } // otherwise it will be injected when __fastinject__ is set
    },

    /**
     * Remove child component
     * @param {Component} child
     */
    remove: function(child) {
        var index = this._children.indexOf(child);
        if (index !== -1) {
            this._children.splice(index, 1);
            child.root.parentNode.removeChild(child.root);
            child.destroy();
        }
    },

    /**
     * Attaches a component by replacing the provided element. Element must be an element inside the parent component.
     * @param {Component} child
     * @param {Element} element
     * @param {HTMLElement} root if different than child.root
     */
    attach: function(child, element, root) {
        this._children.push(child);
        (root || this.root).insertBefore(child.root, element);
        (root || this.root).removeChild(element);
    },

    /**
     * Attaches the component to a root created on a provided element
     * @param element
     * @param context
     */
    attachTo: function(element, context) {
        var parent = Component.Root(element, context);
        parent.add(this);
    }
});

/**
 *
 * @param {HTMLElement} element
 * @param {Context} [context]
 * @returns {Component}
 * @constructor
 */
Component.Root = function(element, context) {
    var component = Component.create();
    context = context || Context.create();
    component.root = element;
    context.register(component);
    return component;
};

module.exports = Component;


},{"./di":5,"./object":8,"./utils":10}],4:[function(require,module,exports){
/**
 * Collection of constructors
 */
var constructors = {
    
    /**
     * Bind all the function to the instance
     */
    autobind: function () {
        for (var property in this) {
            if (typeof(this[property]) === "function") {
                this[property] = this[property].bind(this);
            }
        }
    }

};

module.exports = constructors;
},{}],5:[function(require,module,exports){
var Protoplast = require('./protoplast'),
    Dispatcher = require('./dispatcher');

/**
 * Dependency Injection context builder
 * @type {Object}
 */
var Context = Protoplast.extend({

    $create: function() {
        var self = this;
        this._objects = {
            pub: function(topic, message) {
                self._dispatcher.dispatch(topic, message);
            },
            sub: function(topic) {
                var instanceSelf = this;
                return {
                    add: function(handler) {
                        self._dispatcher.on(topic, handler, instanceSelf);
                    },
                    remove: function(handler) {
                        self._dispatcher.off(topic, handler, instanceSelf);
                    }
                };
            }
        };
        this._unknows = [];

        this._dispatcher = Dispatcher.create();
    },

    /**
     * Map of object in the context
     * @type {Object}
     * @private
     */
    _objects: null,

    /**
     * List of objects added to the registry but having no id
     */
    _unknows: null,

    /**
     * Registers object in the DI context
     * @param {String} [id]
     * @param {Object} instance
     */
    register: function(id, instance) {
        if (arguments.length == 1) {
            instance = id;
            this._unknows.push(instance);
        }
        else {
            this._objects[id] = instance;
        }

        // fast inject is used to register and process new objects after the config has been built
        // any object registered in the config has this method.
        instance.__fastinject__ = function(obj) {
            this.register(obj);
            this.process(obj);
        }.bind(this);
        
    },

    process: function(obj) {
        if (obj.$meta && obj.$meta.properties && obj.$meta.properties.inject) {
            Object.keys(obj.$meta.properties.inject).forEach(function(property){
                obj[property] = this._objects[obj.$meta.properties.inject[property]];
            }, this);
        }
        if (obj.$meta && obj.$meta.properties && obj.$meta.properties.injectInit) {
            Object.keys(obj.$meta.properties.injectInit).forEach(function(handler){
                obj[handler]();
            }, this);
        }
        if (obj.$meta && obj.$meta.properties && obj.$meta.properties.sub) {
            Object.keys(obj.$meta.properties.sub).forEach(function(handler){
                this._objects.sub.call(obj, obj.$meta.properties.sub[handler]).add(obj[handler]);
            }, this);
        }
    },

    /**
     * Defines getters for injected properties. The getter returns instance from the config
     * @param {Object} instance
     * @param {Object} config - {property:dependencyId,...}
     */

    /**
     * Process all objects
     */
    build: function() {
        Object.keys(this._objects).forEach(function(id) {
            var instance = this._objects[id];
            this.process(instance);
        }, this);
        this._unknows.forEach(function(instance){
            this.process(instance);
        }, this);
    }

});

module.exports = Context;


},{"./dispatcher":6,"./protoplast":9}],6:[function(require,module,exports){

var Protoplast = require('./protoplast');

/**
 * EventDispatcher implementation, can be used as mixin or base protoype
 */
var Dispatcher = Protoplast.extend({

    $create: function() {
        this._topics = {};
    },

    dispatch: function(topic) {
        var args = Array.prototype.slice.call(arguments, 1);
        (this._topics[topic] || []).forEach(function(config) {
            config.handler.apply(config.context, args);
        })
    },

    on: function(topic, handler, context) {
        if (!handler) {
            throw new Error('Handler is required for event ' + topic);
        }
        this._topics[topic] = this._topics[topic] || [];
        this._topics[topic].push({handler: handler, context: context});
    },

    off: function(topic, handler, context) {
        if (!topic) {
            for (topic in this._topics) {
                if (this._topics.hasOwnProperty(topic)) {
                    this.off(topic, handler, context);
                }
            }
        }
        else {
            this._topics[topic] = (this._topics[topic] || []).filter(function(config) {
                return handler ? config.handler !== handler : config.context !== context
            })
        }
    }
});

module.exports = Dispatcher;

},{"./protoplast":9}],7:[function(require,module,exports){
var Protoplast = require('./protoplast'),
    Dispatcher = require('./dispatcher'),
    utils = require('./utils');

function defineComputedProperty(name, desc) {
    var calc = desc.value;

    delete desc.value;
    delete desc.writable;
    delete desc.enumerable;

    desc.get = function() {
        if (this['_' + name] === undefined) {
            this['_' + name] = calc.call(this);
        }
        return this['_' + name];
    };

    desc.set = function() {
        var old = this['_' + name];
        this['_' + name] = undefined;
        this.dispatch(name + '_changed', undefined, old);
    }
}

function defineBindableProperty(name, desc, proto) {
    var initialValue = desc.value;

    delete desc.value;
    delete desc.writable;
    delete desc.enumerable;

    desc.get = function() {
        return this['_' + name];
    };
    desc.set = function(value) {
        if (value !== this['_' + name]) {
            var old = this['_' + name];
            this['_' + name] = value;
            this.dispatch(name + '_changed', value, old);
        }
    };
    proto['_' + name] = initialValue;
}

var Model = Protoplast.extend([Dispatcher], {

    $create: function() {
        var computed = this.$meta.properties.computed;
        for (var computedProperty in computed) {
            if (computed.hasOwnProperty(computedProperty)) {
                computed[computedProperty].forEach(function(chain) {
                    (function(name){
                        utils.bind(this, chain, function() {
                            this[name] = undefined;
                        }.bind(this));
                    }.bind(this))(computedProperty);
                }, this);
            }
        }
    },

    $defineProperty: function(property, desc) {

        if (this.$meta.properties.computed && this.$meta.properties.computed[property]) {
            defineComputedProperty(property, desc);
        }
        else if (!desc.get || ['number', 'boolean', 'string'].indexOf(typeof(desc.value)) !== -1) {
            defineBindableProperty(property, desc, this);
        }

        Protoplast.$defineProperty.call(this, property, desc);
    }

});

module.exports = Model;
},{"./dispatcher":6,"./protoplast":9,"./utils":10}],8:[function(require,module,exports){
var constructors = require('./constructors'),
    utils = require('./utils'),
    Model = require('./model');

var Object = Model.extend({
    
    $meta: {
        constructors: [constructors.autobind]
    },
    
    init: {
        injectInit: true,
        value: function() {}
    },

    bind: function(chain, handler) {
        utils.bind(this, chain, handler);
    },

    bindProperty: function(chain, dest, destChain) {
        utils.bindProperty(this, chain, dest, destChain);
    }
    
});

module.exports = Object;
},{"./constructors":4,"./model":7,"./utils":10}],9:[function(require,module,exports){
(function (global){
var utils = require('./utils');

/**
 * Base protoplast
 */
var Protoplast = new (function() {
});

Protoplast.$meta = {};
Protoplast.$defineProperty = function(property, desc) {
    Object.defineProperty(this, property, desc);
};
Protoplast.create = function() {
    return utils.createObject(this, arguments);
};

/**
 * Creates new factory function
 * @param [mixins]     list of mixins to merge with
 * @param description  object description
 * @returns {Object}
 */
Protoplast.extend = function(mixins, description) {
    var proto = Object.create(this), meta, mixinsMeta, desc;

    // normalise parameters
    if (!(mixins instanceof Array)) {
        description = mixins;
        mixins = [];
    }
    description = description || {};
    mixins = mixins || [];

    meta = description.$meta || {};
    meta.properties = meta.properties || {};

    // $meta section of the description has to be deleted
    // so it's not processed as a property definition later or.
    // All entries but $meta and $create are treated as
    // property definitions
    delete description.$meta;

    // $create is a shortcut for adding a constructor to constructors list
    if (description.$create !== undefined) {
        meta.constructors = meta.constructors || [];
        meta.constructors.push(description.$create);
        delete description.$create;
    }

    // mix-in all the mixins to the current prototype
    proto = utils.mixin(proto, mixins);

    // create description for all properties (properties are defined at the end)
    var propertyDefinitions = [];

    for (var property in description) {

        if (Object.prototype.toString.call(description[property]) !== "[object Object]") {
            desc = {value: description[property], writable: true, enumerable: true, configurable: true};
        } else {
            desc = description[property];

            // default value to null
            if (!(property in this) && !desc.set && !desc.get && !desc.value) {
                desc.value = null;
            }

            for (var d in desc) {
                // move all non standard descriptors to meta
                if (desc.hasOwnProperty(d) && ['value', 'get', 'set', 'writable', 'enumerable', 'configurable'].indexOf(d) === -1) {
                    meta.properties[d] = meta.properties[d] || {};
                    meta.properties[d][property] = desc[d];
                    delete desc[d];
                }
            }
            if (!desc.hasOwnProperty('writable') && !desc.hasOwnProperty('set') && !desc.hasOwnProperty('get')) {
                desc.writable = true;
            }
            if (!desc.hasOwnProperty('enumerable')) {
                desc.enumerable = true;
            }
            if (!desc.hasOwnProperty('configurable')) {
                desc.configurable = true;
            }
        }
        propertyDefinitions.push({
            property: property,
            desc: desc
        });
    }

    // mix meta data from the mixins into one object
    mixinsMeta = (mixins || []).reduce(function(current, next) {
        return utils.merge(current, next.$meta);
    }, {});
    // mix all mixins meta data
    meta = utils.merge(meta, mixinsMeta);
    // mix base prototype meta to the current meta
    proto.$meta = utils.merge(meta, this.$meta);

    // define properties
    propertyDefinitions.forEach(function(definition) {
        var property = definition.property,
            desc = definition.desc;
        proto.$defineProperty(property, desc);
    });

    return proto;
};

global.Protoplast = Protoplast;
module.exports = Protoplast;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./utils":10}],10:[function(require,module,exports){
var common = require('./utils/common'),
    binding = require('./utils/binding'),
    component = require('./utils/component'),
    html = require('./utils/html');

module.exports = {
    createObject: common.createObject,
    merge: common.merge,
    isLiteral: common.isLiteral,
    isPrimitive: common.isPrimitive,
    mixin: common.mixin,
    uniqueId: common.uniqueId,

    resolveProperty: binding.resolveProperty,
    bind: binding.bind,
    bindSetter: binding.bindSetter,
    bindProperty: binding.bindProperty,
    bindCollection: binding.bindCollection,

    renderList: component.renderList,
    createRendererFunction: component.createRendererFunction,
    domProcessors: {
        injectElement: component.domProcessors.injectElement,
        createComponents: component.domProcessors.createComponents
    },
    
    html: html
};

},{"./utils/binding":11,"./utils/common":12,"./utils/component":13,"./utils/html":14}],11:[function(require,module,exports){
var resolveProperty = function(host, chain, handler) {
    var props = chain.split('.');

    if (!chain) {
        handler(host);
    }
    else if (props.length === 1) {
        handler(host[chain]);
    }
    else {
        var subHost = host[props[0]];
        var subChain = props.slice(1).join('.');
        if (subHost) {
            resolveProperty(subHost, subChain, handler);
        }
    }

};

var bindSetter = function(host, chain, handler, context) {
    var props = chain.split('.'),
        context = context || {};

    if (props.length === 1) {
        host.on(chain + '_changed', handler, context);
        handler(host[chain]);
    }
    else {
        var subHost = host[props[0]];
        var subChain = props.slice(1).join('.');
        if (subHost) {
            bindSetter(subHost, subChain, function() {
                resolveProperty(subHost, subChain, handler);
            }, context);
        }
        host.on(props[0] + '_changed', function(_, previous) {
            if (previous && previous.on) {
                previous.off(props[0] + '_changed', handler);
            }
            bindSetter(host[props[0]], subChain, handler, context);
        }, context);
    }

    return {
        start: function() {
            bindSetter(host, chain, handler);
        },
        stop: function() {
            resolveProperty(host, chain, function(value) {
                if (value.off) {
                    value.off(null, null, context);
                }
            });
            while (props.length) {
                props.pop();
                resolveProperty(host, props.join('.'), function(value) {
                    value.off(null, null, context);
                });
            }
        }
    }
};

var bindCollection = function(host, sourceChain, handler, context) {

    var previousList = null, previousHandler;

    context = context || {};

    return bindSetter(host, sourceChain, function() {
        resolveProperty(host, sourceChain, function(list) {
            if (previousList) {
                if (previousList.off) {
                    previousList.off('changed', previousHandler);
                }
                previousList = null;
                previousHandler = null
            }
            if (list) {
                previousList = list;
                previousHandler = handler.bind(host, list);
                if (list.on) {
                    list.on('changed', previousHandler, context);
                }
            }
            handler(list);
        });
    }, context);

};

var bind = function(host, bindingsOrChain, handler) {
    var handlersList;
    if (arguments.length === 3) {
        return bindCollection(host, bindingsOrChain, handler);
    }
    else {
        var watchers = [], subWatcher;
        for (var binding in bindingsOrChain) {
            if (bindingsOrChain.hasOwnProperty(binding)) {
                handlersList = bindingsOrChain[binding];
                if (!(handlersList instanceof Array)) {
                    handlersList = [handlersList];
                }
                handlersList.forEach(function(handler) {
                    subWatcher = bind(host, binding, handler.bind(host));
                    watchers.push(subWatcher);
                });
            }
        }
        var args = arguments;
        return {
            start: function() {
                bind.apply(null, args);
            },
            stop: function() {
                watchers.forEach(function(watcher) {
                    watcher.stop();
                });
            }
        }
    }
};

var bindProperty = function(host, hostChain, dest, destChain) {

    var props = destChain.split('.');
    var prop = props.pop();

    return bind(host, hostChain, function() {
        resolveProperty(host, hostChain, function(value) {
            resolveProperty(dest, props.join('.'), function(finalObject) {
                if (finalObject) {
                    finalObject[prop] = value;
                }
            })
        })
    });

};

module.exports = {
    resolveProperty: resolveProperty,
    bind: bind,
    bindSetter: bindSetter,
    bindProperty: bindProperty,
    bindCollection: bindCollection
};
},{}],12:[function(require,module,exports){
var idCounter = 0;

/**
 * Generate a unique id prefixed with prefix if defined
 * @param {String} prefix
 * @returns {String}
 */
function uniqueId(prefix) {
    var id = ++idCounter;
    return (prefix || '') + id;
}

/**
 * Create an object for the prototype
 * @param {Object} proto
 * @param {Object[]} args
 * @returns {Object}
 */
function createObject(proto, args) {
    var instance = Object.create(proto);
    if (instance.$meta.constructors) {
        instance.$meta.constructors.forEach(function(constructor){
            constructor.apply(instance, args);
        });
    }
    return instance;
}

function isPrimitive(value) {
    return ['number', 'boolean', 'string', 'function'].indexOf(typeof(value)) !== -1;
}

function isLiteral(value) {
    return value && value.constructor === Object;
}

/**
 * Merges source object into destination. Arrays are concatenated, primitives taken from the source if not
 * defined and complex object merged recursively
 * @param destination
 * @param source
 * @returns {Object}
 */
function merge(destination, source) {
    for (var property in source) {
        if (source.hasOwnProperty(property)) {
            if (source[property] instanceof Array) {
                destination[property] = source[property].concat(destination[property] || []);
            }
            else if (isPrimitive(source[property]) || !isLiteral(source[property])) {
                if (!destination.hasOwnProperty(property)) {
                    destination[property] = source[property];
                }
            }
            else {
                destination[property] = destination[property] || {};
                merge(destination[property], source[property]);
            }
        }
    }
    return destination;
}

/**
 * Mixes mixin source properties into destination object unless the property starts with __
 * @param {Object} destination
 * @param {Object} source
 * @returns {Object}
 */
function mix(destination, source) {
    for (var property in source) {
        if (property.substr(0, 2) !== '__') {
            destination[property] = source[property];
        }
    }
    return destination;
}

/**
 * Mixes all mixins into the instance
 * @param {Object} instance
 * @param {Object[]} mixins
 * @returns {Object}
 */
function mixin(instance, mixins) {
    mixins.forEach(function(Mixin) {
        mix(instance, Mixin);
    });
    return instance;
}

module.exports = {
    createObject: createObject,
    merge: merge,
    isLiteral: isLiteral,
    isPrimitive: isPrimitive,
    mixin: mixin,
    uniqueId: uniqueId
};
},{}],13:[function(require,module,exports){
var binding = require('./binding');

/**
 * Inject Element processor. Parses the template for elements with [data-prop] and injects the element to the
 * property passed as the value of the data-prop attribute. If a wrapper is defined the element is wrapped before
 * setting on the component
 */
var injectElement = {
    attribute: 'data-prop',
    process: function(component, element, value) {
        (function(element){
            component[value] = element;
            if (component.$meta.elementWrapper) {
                component[value] = component.$meta.elementWrapper(component[value]);
            }
        })(element);
    }
};

/**
 * Create Component processor. Replaces an element annotated with data-comp attribute with a component set in a property
 * of name passes as the value of the attribute, example
 * <div data-comp="foo"></div>
 */
var createComponents = {
    attribute: 'data-comp',
    process: function(component, element, value) {
        var child = component[value] = component.$meta.properties.component[value].create();
        component.attach(child, element, element.parentNode);
    }
};

var renderListDefaultOptions = {
    remove: function(parent, child) {
        parent.remove(child);
    },
    create: function(parent, data, renderer, propertyName) {
        var child = renderer.create();
        child[propertyName] = data;
        parent.add(child);
    },
    update: function(child, item, propertyName) {
        child[propertyName] = item;
    }
};

var createRendererFunction = function(host, opts) {

    opts = opts || {};
    opts.create = opts.create || renderListDefaultOptions.create;
    opts.remove = opts.remove || renderListDefaultOptions.remove;
    opts.update = opts.update || renderListDefaultOptions.update;
    opts.rendererDataProperty = opts.rendererDataProperty || 'data';
    if (!opts.renderer) {
        throw new Error('Renderer is required')
    }

    return function(list) {
        var max = Math.max(this.children.length, list.length),
            children = this.children.concat();

        for (var i = 0; i < max; i++) {
            if (children[i] && list.toArray()[i]) {
                opts.update(children[i], list.toArray()[i], opts.rendererDataProperty);
            }
            else if (!children[i]) {
                opts.create(this, list.toArray()[i], opts.renderer, opts.rendererDataProperty);
            }
            else if (!list.toArray()[i]) {
                opts.remove(this, children[i]);
            }
        }
    }.bind(host);
};

var renderList = function(host, sourceChain, opts) {
    var rendererFunction = createRendererFunction(opts.parent || host, opts);
    binding.bindCollection(host, sourceChain, rendererFunction);
};

module.exports = {
    createRendererFunction: createRendererFunction,
    renderList: renderList,
    renderListDefaults: renderListDefaultOptions,
    domProcessors: {
        injectElement: injectElement,
        createComponents: createComponents
    }
};
},{"./binding":11}],14:[function(require,module,exports){
/**
 * Source: https://gist.github.com/Munawwar/6e6362dbdf77c7865a99
 *
 * jQuery 2.1.3's parseHTML (without scripts options).
 * Unlike jQuery, this returns a DocumentFragment, which is more convenient to insert into DOM.
 * MIT license.
 *
 * If you only support Edge 13+ then try this:
 function parseHTML(html, context) {
        var t = (context || document).createElement('template');
            t.innerHTML = html;
        return t.content.cloneNode(true);
    }
 */
var parseHTML = (function() {
    var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
        rtagName = /<([\w:]+)/,
        rhtml = /<|&#?\w+;/,
    // We have to close these tags to support XHTML (#13200)
        wrapMap = {
            // Support: IE9
            option: [1, "<select multiple='multiple'>", "</select>"],

            thead: [1, "<table>", "</table>"],
            col: [2, "<table><colgroup>", "</colgroup></table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            tbody: [1, "<table>", "</table>"],

            _default: [0, "", ""]
        };

    /**
     * @param {String} elem A string containing html
     * @param {Document} context
     */
    return function parseHTML(elem, context) {
        context = context || document;

        var tmp, tag, wrap, j,
            fragment = context.createDocumentFragment();

        if (!rhtml.test(elem)) {
            fragment.appendChild(context.createTextNode(elem));

            // Convert html into DOM nodes
        } else {
            tmp = fragment.appendChild(context.createElement("div"));

            // Deserialize a standard representation
            tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
            wrap = wrapMap[tag] || wrapMap._default;
            tmp.innerHTML = wrap[1] + elem.replace(rxhtmlTag, "<$1></$2>") + wrap[2];

            // Descend through wrappers to the right content
            j = wrap[0];
            while (j--) {
                tmp = tmp.lastChild;
            }

            // Remove wrappers and append created nodes to fragment
            fragment.removeChild(fragment.firstChild);
            while (tmp.firstChild) {
                fragment.appendChild(tmp.firstChild);
            }
        }

        return fragment;
    };
}());

module.exports = {
    parseHTML: parseHTML
};
},{}],15:[function(require,module,exports){
(function (global){
var Protoplast = require('./js/protoplast'),
    Collection = require('./js/collection'),
    CollectionView = require('./js/collection-view'),
    Dispatcher = require('./js/dispatcher'),
    Context = require('./js/di'),
    Component = require('./js/component'),
    Model = require('./js/model'),
    Object = require('./js/object'),
    utils = require('./js/utils'),
    constructors = require('./js/constructors');

var protoplast = {
    extend: Protoplast.extend.bind(Protoplast),
    create: Protoplast.create.bind(Protoplast),
    Dispatcher: Dispatcher,
    Context: Context,
    Component: Component,
    Model: Model,
    Object: Object,
    Collection: Collection,
    CollectionView: CollectionView,
    constructors: constructors,
    utils: utils
};

global.Protoplast = protoplast;
module.exports = protoplast;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./js/collection":2,"./js/collection-view":1,"./js/component":3,"./js/constructors":4,"./js/di":5,"./js/dispatcher":6,"./js/model":7,"./js/object":8,"./js/protoplast":9,"./js/utils":10}]},{},[15])(15)
});