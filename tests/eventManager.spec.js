angular.module('test.tseed.eventManager', ['tseed.eventManager']);

describe('test.tseed.eventManager', function () {
  var $events;

  beforeEach(function () {
    module('test.tseed.eventManager');
    inject(function (_$events_) {
      $events = _$events_;
    });
  });

  it('should send and receive event', function () {
    var eventManager = $events.createEventManager();
    var called = false;

    var trigger = eventManager.on('test.0', function (list, num) {
      expect(list).toEqual([1]);
      expect(num).toBe(num);
      called = true;
    });

    eventManager.emit('test.0', [1], 2);

    expect(trigger).toEqual(jasmine.any(Number));
    expect(called).toBeTruthy();
  });

  it('should bind listener and trigger two emits', function () {
    var eventManager = $events.createEventManager();
    var times = 0;
    var data = [];

    var trigger = eventManager.on('test.1', function (a, b, c) {
      data.push([a, b, c]);
      times++;
    });

    eventManager.emit('test.1', 1, 2, 3);
    eventManager.emit('test.1', 4, 5, 6);

    expect(trigger).toEqual(jasmine.any(Number));
    expect(times).toBe(2);
    expect(data).toEqual([[1, 2, 3], [4, 5, 6]]);
  });

  it('should get event manager by the same name and trigger events', function () {
    var eventA = $events.getEventManager('name');
    var eventB = $events.getEventManager('name');

    var called = false;

    eventA.on('test.2', function () {
      called = true;
    });

    eventB.emit('test.2');
    expect(called).toBeTruthy();
  });

  it('should trigger event unbind and trigger again', function () {
    var eventManager = $events.createEventManager();
    var times = 0;

    var trigger = eventManager.on('test.3', function () {
      times++;
    });

    eventManager.emit('test.3');
    eventManager.off('test.3', trigger);
    eventManager.emit('test.3');

    expect(times).toBe(1);
  });

  it('should check if off event returns valid status', function () {
    var eventManager = $events.createEventManager();

    var trigger = eventManager.on('test.4', function () {
    });
    var status = eventManager.off('test.4', trigger);
    expect(status).toBeTruthy();
    status = eventManager.off('test.4', trigger);
    expect(status).toBeFalsy();
  });

  it('should check if multiple event bind right', function () {
    var eventManager = $events.createEventManager();
    var eventResponseA = [];
    var eventResponseB = [];

    eventManager.on('test.5.a', function () {
      eventResponseA.push(Array.prototype.slice.call(arguments));
    });

    eventManager.on('test.5.b', function () {
      eventResponseB.push(Array.prototype.slice.call(arguments));
    });

    eventManager.emit('test.5.a', 'a', 1);
    eventManager.emit('test.5.b', 'b', 1);

    expect(eventResponseA).toEqual([['a', 1]]);
    expect(eventResponseB).toEqual([['b', 1]]);
  });

  it('should check if multiple call works', function () {
    var eventManager = $events.createEventManager();
    var response = [];

    eventManager.on('test.6', function () {
      response.push(Array.prototype.slice.call(arguments));
    });

    eventManager.emit('test.6', 1);
    eventManager.emit('test.6', 2);
    eventManager.emit('test.6', 3);

    expect(response).toEqual([[1], [2], [3]]);
  });

  it('should check if allOff method removes all event listeners', function () {
    var eventManager = $events.createEventManager();
    var response = [];

    eventManager.on('test.7', function (num) {
      response.push(num);
    });

    eventManager.on('test.7', function (num) {
      response.push(num);
    });

    eventManager.emit('test.7', 1);
    eventManager.allOff('test.7');
    eventManager.emit('test.7', 2);

    expect(response).toEqual([1, 1]);
  });

  it('should trigger event with two listeners and then remove listeners by one', function () {
    var eventManager = $events.createEventManager();
    var response = [];

    var triggerA = eventManager.on('test.8', function (num) {
      response.push(num);
    });

    var triggerB = eventManager.on('test.8', function (num) {
      response.push(num * num);
    });

    eventManager.emit('test.8', 2);
    expect(response).toEqual([2, 4]);
    eventManager.off('test.8', triggerB);
    eventManager.emit('test.8', 3);
    expect(response).toEqual([2, 4, 3]);
    eventManager.off('test.8', triggerA);
    eventManager.emit('test.8', 4);
    expect(response).toEqual([2, 4, 3]);
  });
});