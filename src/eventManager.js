(function (angular) {
    /**
     * once function ensures that the function will only be called once
     * if function is called twice it will get same response as previous call
     *
     * @param {Function} fn
     * @return {Function}
     */
    var once = function (fn) {
        var response;
        return function () {
            if (angular.isUndefined(response)) {
                response = fn.apply(this, arguments);
            }
            
            return response;
        };
    };
    
    var EventManagerFactory = once(function () {
        /**
         * Event manager by name storage map.
         * @type {{}}
         */
        var $eventStorage = {};

        /**
         * @name EventManager
         * @constructor
         */
        function EventManager () {
            // events storage
            this.$$events = {};
            // events uid increment storage
            this.$$index = 0;
        }

        EventManager.prototype = {
            /**
             * Bind callback on event namespace trigger.
             * @param {*} namespace - event trigger namespace.
             * @param {Function} fn - callback
             * @return {number} - unbind trigger number
             */
            on: function (namespace, fn) {
                // if event by namespace was not registered yet
                // create empty object to it
                if (!this.$$events.hasOwnProperty(namespace)) {
                    this.$$events[namespace] = {};
                }

                var index = this.$$index;
                this.$$events[namespace][index] = fn;
                this.$$index++;

                return index;
            },

            /**
             * Unbinds event callback.
             * @param {*} namespace
             * @param {number} number
             * @return {boolean}
             */
            off: function (namespace, number) {
                if (this.$$events.hasOwnProperty(namespace)) {
                    var has = this.$$events[namespace].hasOwnProperty(number);
                    if (has) {
                        delete this.$$events[namespace][number];
                        return true;
                    }
                }

                return false;
            },

            /**
             * Unbind all event listens for namespace.
             * @param {*} namespace
             * @return {boolean}
             */
            allOff: function (namespace) {
                if (this.$$events.hasOwnProperty(namespace)) {
                    var has = Object.keys(this.$$events[namespace]).length > 0;
                    delete this.$$events[namespace];
                    return has;
                }

                return false;
            },

            /**
             * Emits event with data to listeners.
             * @param {*} namespace
             * @param {...*} data
             */
            emit: function (namespace, data) {
                data = Array.prototype.slice.call(arguments, 1);
                if (this.$$events.hasOwnProperty(namespace)) {
                    // events list reference
                    var events = this.$$events[namespace];
                    // get object keys and trigger callback function with passed emit data
                    Object.keys(events)
                        .forEach(function (index) {
                            var fn = events[index];
                            fn.apply(fn, data);
                        });
                }
            }
        };

        return {
            /**
             * Create new event manager instance.
             * @name $events#createEventManager
             * @return {EventManager}
             */
            createEventManager: function () {
                return new EventManager();
            },

            /**
             * Get event manager instance by name.
             * @name $events#getEventManager
             * @param {*} name
             * @returns {EventManager}
             */
            getEventManager: function (name) {
                // if event manager by this name was not created then create it
                // if event manager by this name was created then return its instance
                if (!$eventStorage.hasOwnProperty(name)) {
                    $eventStorage[name] = this.createEventManager();
                }

                return $eventStorage[name];
            }
        };
    });
    EventManagerFactory.$inject = [];
    
    angular
        .module('tseed.eventManager', [])
        .factory('$events', EventManagerFactory);
})(angular);