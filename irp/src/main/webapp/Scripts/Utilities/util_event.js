﻿// REQUIRES: util.js

(function(Util) {

    var E = {};
    
    E.hasModifier = function(ev) {
        return (ev.ctrlKey || ev.altKey || ev.metaKey);
    };

    // did this key event occur in a text area
    E.inTextInput = function(ev) {
        var target = YAHOO.util.Event.getTarget(ev);
        return Util.Dom.isTextInput(target);
    };
    
    // normalized mouse events for desktop/mobile
    E.Mouse = (function() {
        if ('ontouchstart' in window) {
            return {
                start: 'touchstart',
                end: 'touchend',
                move: 'touchmove',
                click: 'click',
                enter: 'touchenter',
                leave: 'touchleave',
                touchScreen: true
            };
        } else {
            return {
                start: 'mousedown',
                end: 'mouseup',
                move: 'mousemove',
                click: 'click',
                enter: 'mouseenter',
                leave: 'mouseleave',
                touchScreen: false
            };
        }
    })();

    // normalize a touch event into mouse event
    E.normalize = function(evt) {

        // check if touch screen
        if ('ontouchstart' in window && evt.changedTouches) {

            var touches = evt.changedTouches;

            // find touch event that matches dom event
            for (var i = 0, ii = touches.length; i < ii; i++) {
                if (touches[i].target == evt.target) {
                    // save original event
                    var oldevt = evt;

                    // replace mouse event with touch event
                    evt = touches[i];
                    evt.preventDefault = function() { return oldevt.preventDefault(); };
                    evt.stopPropagation = function() { return oldevt.stopPropagation(); };
                    break;
                }
            }
        }

        return evt;
    };

    function addEventListener(type, el, listener, useCapture) {

        // event event listener
        el.addEventListener(type, listener, useCapture);

        // return object to remove event
        return {
            destroy: function () {
                el.removeEventListener(type, listener, useCapture);
            }
        }
        
    }

    // generic event listener
    E.on = function (type, el, listener, useCapture) {

        el = Util.Dom.get(el);

        if (!el) {
            throw new Error('Element not found');
        }

        useCapture = useCapture || false;

        return addEventListener(type, el, listener, useCapture);

    };
    
    var EventMap = {
        'start': 'pointerdown',
        'move': 'pointermove',
        'end': 'pointerup'
    };

    // DEPRECATED: This function should no longer be used and 'Util.Event.on' should be used instead
    // add event listener to element
    E.addTouchMouse = function (name, el, listener) {

        var type = EventMap[name];

        if (!type) {
            throw new Error('Unknown event name: ' + name);
        }

        return E.on(type, el, listener);

    };

    var hold_schedule_events = 'pointerdown';
    var hold_cancel_events = 'pointerup pointermove pointercancel contextmenu';
    var hold_click_events = 'click';

    // attach listener that fires after holding down 
    // mouse/finger for a specific duration (millseconds)
    E.addTouchHold = function(el, duration, listener) {

        var fired = false,
            timer = null;

        function schedule() {
            fired = false;
            cancel();
            timer = setTimeout(scheduled, duration);
        }

        function scheduled() {
            fired = true;
            timer = null;
            listener();
        }

        function cancel() {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
        }

        function click(evt) {
            // Prevent `click` event to be fired after button release once fired
            if (fired) {
                return evt.stopImmediatePropagation() || false;
            }
        }

        $(el).on(hold_schedule_events, schedule);
        $(el).on(hold_cancel_events, cancel);
        $(el).on(hold_click_events, click);
        
        return {
            destroy: function () {
                $(el).off(hold_schedule_events, schedule);
                $(el).off(hold_cancel_events, cancel);
                $(el).off(hold_click_events, click);
            }
        }

    };

    Util.Event = E;

})(Util);