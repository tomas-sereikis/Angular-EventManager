# Angular EventManager
[![Build Status](https://travis-ci.org/Tomas-Sereikis/Angular-EventManager.svg?branch=master)](https://travis-ci.org/Tomas-Sereikis/Angular-EventManager)
[![Dev Dependencies](https://david-dm.org/Tomas-Sereikis/Angular-EventManager/dev-status.svg)](https://david-dm.org/Tomas-Sereikis/Angular-EventManager#info=devDependencies)
[![Coverage Status](https://img.shields.io/coveralls/Tomas-Sereikis/Angular-EventManager.svg)](https://coveralls.io/r/Tomas-Sereikis/Angular-EventManager?branch=master)

* Include Module: `tseed.eventsManager`
* Injector: `$events`

What is this module and why should you use it instead of native angular events?

Well angular native events are slow because you manipulate events by $scope, so if you $emit or $broadcast event
angular has to go up of down your scope to get event listeners and to trigger them. If your application is not
large you will not feel any performance issues, but if you are going with large angular applications this way you
will definitely upgrade your performance a bit.
Secondly you can not destroy event listener(-s) by default. Listener will only destroy then scope is destroyed.
Thirdly you you need to use $emit or $broadcast and why should you? You just what to trigger event listeners right?

### Usage:

You can get event manager instance by its namespace.
`var $em = $events.getEventManager(namespace);` (this is handy when you need the same event manager in different controllers),
or you can create new event manager instance which will not be attached to any namespace. `var $em = $events.createEventManager();`

#### Usage of EventManager

Binding event listener

```javascript
// trigger is used for event unbinding
var $trigger = $em.on(eventName, function (arg1, arg2, ...) {
	
});
```

Emitting event with content

```javascript
$em.emit(eventName, arg1, arg2, ...)
```

Unbinding event listener

```javascript
$em.off(eventName, $trigger)
```

Unbinding all event listeners for named event

```javascript
$em.allOff(eventName)
```


### Examples of usage:

```javascript
var EVENT_SIDEBAR = 'sidebar';
var EVENT_SIDEBAR_VISIBILITY = 'visibility';

SidebarController.$inject = ['$scope', '$events'];
// sidebar controller
function SidebarController ($scope, $events) {
	// get event manager by it namespace
	var $em = $events.getEventManager(EVENTS_STORAGE_SIDEBAR);
	// bind listener for sidebar visibility
	var $trigger = $em.on(EVENT_SIDEBAR_VISIBILITY, function (visible) {
		// you have to eval async 
		// because on event trigger scope it not applied
		$scope.$evalAsync(function () {
			$scope.visible = visible;
		});
	});
	
	$scope.$on('$destroy', function () {
		// on scope destroy we have to unbind event listener
		$em.off(EVENT_SIDEBAR_VISIBILITY, $trigger);
	});
}

ConfigController.$inject = ['$scope', '$events'];
// config controller
function ConfigController ($scope, $events) {
	// get event manager by it namespace
	var $em = $events.getEventManager(EVENTS_STORAGE_SIDEBAR);
	// default value for sidebar visibility
	$scope.sidebar = false;
	// send default visibility value
	$em.emit(EVENT_SIDEBAR_VISIBILITY, $scope.sidebar);
	
	// visibility change callback
	$scope.changeVisibility = function (visible) {
		$scope.sidebar = visible;
		// send changed visibility
		$em.emit(EVENT_SIDEBAR_VISIBILITY, visible);
	}
}

```

For less then Internet Explorer 9 provide these prototypes:
* [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys)
* [https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)
