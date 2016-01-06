(function (window) {
  function eventManagerFactory () {
    /**
     * Event manager by name storage map.
     * If we are in child window then we what to link events to main window.
     * This way events would be passed from and to child windows parent window.
     * @type {{}}
     */
    var transnationalEvents;
    if (window.opener) {
      var openerTransnationalEvents;
      try {
        // sometimes you can not access opener document and it causes an error when you try to do it
        // so we wrap it in try catch making sure that this error dose not go out
        openerTransnationalEvents = window.opener.document.transnationalEvents || {};
      } catch (e) {
        openerTransnationalEvents = {};
      }
      transnationalEvents = window.document.transnationalEvents = openerTransnationalEvents;
    } else {
      transnationalEvents = window.document.transnationalEvents = {};
    }
    /**
     * @name eventManager
     */
    function eventManager () {
      var instanceEvents = {}, incremental = 0;
      return {
        /**
         * Bind callback on event namespace trigger.
         * @param {*} namespace - event trigger namespace.
         * @param {Function} fn - callback
         * @return {number} - unbind trigger number
         */
        on: function (namespace, fn) {
          // if event by namespace was not registered yet
          // create empty object to it
          if (!(namespace in instanceEvents)) {
            instanceEvents[namespace] = {};
          }
          var index = incremental++;
          instanceEvents[namespace][index] = fn;
          return index;
        },
        /**
         * Unbinds event callback.
         * @param {*} namespace
         * @param {number} number
         * @return {boolean}
         */
        off: function (namespace, number) {
          if (namespace in instanceEvents) {
            if (number in instanceEvents[namespace]) {
              delete instanceEvents[namespace][number];
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
          if (namespace in instanceEvents) {
            var has = Object.keys(instanceEvents[namespace]).length > 0;
            delete instanceEvents[namespace];
            return has;
          }
          return false;
        },
        /**
         * Emits event with data to listeners.
         * @param {*} namespace
         */
        emit: function (namespace) {
          var detail = Array.prototype.slice.call(arguments, 1);
          if (namespace in instanceEvents) {
            // events list reference
            var events = instanceEvents[namespace];
            // get object keys and trigger callback function with passed emit data
            Object.keys(events).forEach(function (index) {
              var fn = events[index];
              fn.apply(fn, detail);
            });
          }
        }
      };
    }

    return {
      /**
       * Create new event manager instance.
       * @name $events#createEventManager
       * @return {eventManager}
       */
      createEventManager: function () {
        return eventManager();
      },
      /**
       * Get event manager instance by name.
       * @name $events#getEventManager
       * @param {*} name
       * @returns {eventManager}
       */
      getEventManager: function (name) {
        // if event manager by this name was not created then create it
        // if event manager by this name was created then return its instance
        if (!(name in transnationalEvents)) {
          transnationalEvents[name] = this.createEventManager();
        }
        return transnationalEvents[name];
      }
    };
  }

  angular.module('tseed.eventManager', [])
    .factory('$events', eventManagerFactory);
})(window);