// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#6-client-input-%EF%B8%8F
import { updateDirection, moveRobot } from './networking';

let keysState = [];

function calculateDirection(x, y) {
  const dir = Math.atan2(x - window.innerWidth / 2, window.innerHeight / 2 - y);
  console.log("X, Y, dir ", x, y, dir);
  return dir;  
}

function onMouseInput(e) {
  handleInput(e.clientX, e.clientY);
}

function onMouseDown(e) {
  var backforth = 1;
  e = e || window.event;
  
  if (e.type == "mousedown") {
    if ("buttons" in e) {
          if ((e.buttons == 1) || (e.buttons == 2)) {
            const dir = calculateDirection(e.clientX, e.clientY);
            if (e.buttons == 1) backforth = 1; else backforth = -1;                        
            moveRobot(dir, backforth);
        console.log('Clicked Button #', e.buttons);
      }
    }
  }
//  handleInput(e.clientX, e.clientY);
}

function onTouchInput(e) {
  const touch = e.touches[0];
  handleInput(touch.clientX, touch.clientY);
}

function handleInput(x, y) {
  const dir = calculateDirection(x, y);
  updateDirection(dir);
}

function getUpdatesFromInputDevices() {
  if (keysState.keys && keysState.keys[37]) {    
    keysState.dir += -1 * Math.PI / 180;
    console.log("37 updated direction is ", keysState.dir);
    updateDirection(keysState.dir);
  }
  
  
  
  if (keysState.keys && keysState.keys[39]) {
    keysState.dir += 1 * Math.PI / 180;
    console.log("39 updated direction is ", keysState.dir);
    updateDirection(keysState.dir);
  }
  
  if ((keysState.keys && keysState.keys[38]) || 
    (keysState.keys && keysState.keys[0])) {moveRobot(keysState.dir, 1); }

  if ((keysState.keys && keysState.keys[40]) ||
    (keysState.keys && keysState.keys[2])) {moveRobot(keysState.dir, -1); }  
}


export function startCapturingInput() {  

  keysState.interval = setInterval(getUpdatesFromInputDevices, 20);
  keysState.dir = 0;

  // window.addEventListener('mousedown mouseup', onMouseDown);
  // window.addEventListener('mousemove', onMouseInput);  
  // window.addEventListener('click', onMouseInput);
  // window.addEventListener('touchstart', onTouchInput);
  // window.addEventListener('touchmove', onTouchInput);

  //***THIS VARIATION OF CODE SHOULD BE PLACED FOR PRODUCTION VERSION***
  //*** SINCE THE e.keyCode is deprecated-^^^
  // var dispatchForCode = function(event, callback) {
  //   var code;
  
  //   if (event.key !== undefined) {
  //     code = event.key;
  //   } else if (event.keyIdentifier !== undefined) {
  //     code = event.keyIdentifier;
  //   } else if (event.keyCode !== undefined) {
  //     code = event.keyCode;
  //   }
  
  //   callback(code);
  // };
  //***THIS VARIATION OF CODE SHOULD BE PLACED FOR PRODUCTION VERSION***

  //REGISTERING KEYBOARD CAPTURING EVENT
  window.addEventListener('keydown', function(e) {
    e.preventDefault();
    keysState.keys = (keysState.keys || []);
    keysState.keys[e.keyCode] = (e.type == "keydown"); 
  });
  window.addEventListener('keyup', function(e) {
    e.preventDefault();    
    keysState.keys[e.keyCode] = (e.type == "keydown"); 
  });

  //REGISTERING MOUSE BUTTON CLICK CAPTURING EVENT
  window.addEventListener('mousedown', function(e) {
    keysState.keys = (keysState.keys || []);
    keysState.keys[e.button] = (e.type == "mousedown"); 
  });
  window.addEventListener('mouseup', function(e) {
    e.preventDefault();
    keysState.keys[e.button] = (e.type == "mousedown"); 
  });

  //REGISTERING MOUSE MOVE CAPTURING EVENT
  window.addEventListener('mousemove', function(e) {
    keysState.dir = calculateDirection(e.clientX, e.clientY);
    keysState.x = e.clientX;
    keysState.y = e.clientY;
    updateDirection(keysState.dir);
  }); 

}

export function stopCapturingInput() {
  // window.removeEventListener('mousemove', onMouseInput);
  // window.removeEventListener('click', onMouseInput);
  // window.removeEventListener('touchstart', onTouchInput);
  // window.removeEventListener('touchmove', onTouchInput);
}
