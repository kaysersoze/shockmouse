// Generated by CoffeeScript 1.8.0
var Gamepad, NextEvent, button_down, gamepads, gamey, invert_scrolling, link_button, mouse_gain, stick, svg, tap_click_duration, _i, _len, _ref;

Gamepad = require('./local_modules/sony_controller').Gamepad;

NextEvent = require('./local_modules/next_event');

gamepads = Gamepad.devices();

console.log("gamepads:", gamepads);

console.log("connecting to first...");

gamey = new Gamepad(gamepads[0]);

console.log("connected!");

console.log("it is wireless?", gamey.wireless);

invert_scrolling = true;

gamey.set({
  led: 'blue'
});

mouse_gain = function(x) {
  return x * Math.abs(((1 / (1 + (Math.pow(Math.E, -x)))) - 0.5) * 2);
};

gamey.on("touchstart", function(touch) {
  var position;
  console.log("mouse move started", touch.id);
  position = NextEvent.mouse();
  touch.on('touchmove', function() {
    if (gamey.trackpad.touches.length === 1) {
      position.x += mouse_gain(touch.delta.x);
      position.y += mouse_gain(touch.delta.y);
      if (position.x < 0) {
        position.x = 0;
      }
      if (position.y < 0) {
        position.y = 0;
      }
      return NextEvent[gamey.report.trackPadButton ? 'mouse_drag' : 'mouse_move'](Math.round(position.x), Math.round(position.y));
    } else {
      return NextEvent.mouse_scroll_wheel(Math.round(mouse_gain(touch.delta.x)), Math.round(mouse_gain(invert_scrolling ? -touch.delta.y : touch.delta.y)));
    }
  });
  return touch.on('touchend', function() {
    return console.log("mouse movement complete", touch.id);
  });
});

tap_click_duration = 200;

gamey.on('touchend', function(touch) {
  var position;
  if (new Date - touch.created < tap_click_duration) {
    position = NextEvent.mouse();
    return NextEvent.mouse_click(position.x, position.y, 'left');
  }
});

button_down = null;

gamey.on("trackPadButton", function() {
  var position;
  button_down = gamey.trackpad.touches.length === 1 ? 'left' : 'right';
  position = NextEvent.mouse();
  return NextEvent.mouse_down(position.x, position.y, button_down);
});

gamey.on("trackPadButtonRelease", function() {
  var position;
  position = NextEvent.mouse();
  return NextEvent.mouse_up(position.x, position.y, button_down);
});

link_button = function(gamepad, keycode) {
  gamey.on(gamepad, function() {
    console.log("" + gamepad + " becomes " + keycode);
    return NextEvent.key_down(keycode);
  });
  return gamey.on("" + gamepad + "Release", function() {
    return NextEvent.key_up(keycode);
  });
};

link_button('dPadUp', 'UpArrow');

link_button('dPadDown', 'DownArrow');

link_button('dPadLeft', 'LeftArrow');

link_button('dPadRight', 'RightArrow');

svg = function(x) {
  var doc;
  doc = document.getElementById('gamepad_graphic').getSVGDocument();
  if (doc) {
    return doc.getElementById(x);
  }
};

gamey.on("keydown", function(key) {
  var element;
  element = svg("DS4_" + key);
  if (element) {
    return element.style.fill = 'red';
  }
});

gamey.on("keyup", function(key) {
  var element;
  element = svg("DS4_" + key);
  if (element) {
    return element.style.fill = '';
  }
});

_ref = ['leftAnalog', 'rightAnalog'];
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  stick = _ref[_i];
  gamey.on("change", function(changes) {
    var element, property, value, _results;
    _results = [];
    for (property in changes) {
      value = changes[property];
      if (property.match(/Analog/)) {
        element = svg("DS4_" + property);
        if (element) {
          _results.push(element.setAttribute('transform', "translate(" + (value.x * 20) + "," + (value.y * 20) + ")"));
        } else {
          _results.push(void 0);
        }
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  });
}

//# sourceMappingURL=shockmouse.js.map
