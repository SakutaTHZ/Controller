let controllerIndex = null;

window.addEventListener("gamepadconnected", (event) => {
  const gamepad = event.gamepad;
  controllerIndex = gamepad.index;
});

// This is not working
window.addEventListener("gamepadisconnected", (event) => {
  controllerIndex = null;
});

// This functions handles for invidual buttons such as A,B,X,Y top,bottom,left,right
function handleButtons(buttons) {
  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    const buttonElement = document.getElementById(`controller-b${i}`);
    const selectedButton = "selected-button";

    if (buttonElement) {
      if (button.value > 0) {
        buttonElement.classList.add(selectedButton);
        // Pressure sensitivity
        buttonElement.style.filter = `contrast(${
          button.value * 150
        }%) saturate(${button.value * 150})`;
      } else {
        buttonElement.classList.remove(selectedButton);
        // Pressure sensitivity
        buttonElement.style.filter = `contrast(100%) saturate(1)`;
      }
    }
  }
}

function updateStick(elementId, leftRightAxis, upDownAxis) {
  const multiplier = 25;
  const stickLeftRight = leftRightAxis * multiplier;
  const stickUpDown = upDownAxis * multiplier;

  const stick = document.getElementById(elementId);
  stick.style.background = `blue`;
  const x = Number(stick.dataset.originalXPosition);
  const y = Number(stick.dataset.originalYPosition);

  stick.setAttribute("cx", x + stickLeftRight);
  stick.setAttribute("cy", y + stickUpDown);
}

// This handles the joystick controls
function handleStick(axes) {
  // axes[0],axes[2] is for left,right
  // axes[1],axes[3] is for up,down
  updateStick("controller-b10", axes[0], axes[1]);
  updateStick("controller-b11", axes[2], axes[3]);
}

function gameLoop() {
  if (controllerIndex !== null) {
    const gamepad = navigator.getGamepads()[controllerIndex];
    handleButtons(gamepad.buttons);
    handleStick(gamepad.axes);
  }
  //this function calls for game frames
  requestAnimationFrame(gameLoop);
}

gameLoop();

// For controls record
// Define the mapping of button indices to names
var buttonMapping = {
  0: "A",
  1: "B",
  2: "X",
  3: "Y",
  4: "LB",
  5: "RB",
  6: "LT",
  7: "RT",
  8: "Back",
  9: "Start",
  10: "LS",
  11: "RS",
  12: "Dpad Up",
  13: "Dpad Down",
  14: "Dpad Left",
  15: "Dpad Right",
  16: "Xbox",
};
const inputs = document.querySelector(".inputs");

// Check if the Gamepad API is supported by the browser
if ("getGamepads" in navigator) {
  // Function to handle button press
  function handleButtonPress(buttonIndex) {
    var buttonName = buttonMapping[buttonIndex];
    if (buttonName) {
      inputs.innerHTML += `<span class="input">${buttonName}</span> `;
      // Your code to handle the button press goes here
    } else {
      console.log("Button " + buttonIndex + " pressed");
    }
  }

  // Function to handle gamepad updates
  function handleGamepadUpdate() {
    var gamepads = navigator.getGamepads();
    for (var i = 0; i < gamepads.length; i++) {
      var gamepad = gamepads[i];
      if (gamepad) {
        // Iterate through each button
        for (var j = 0; j < gamepad.buttons.length; j++) {
          var button = gamepad.buttons[j];
          // Check if the button is pressed
          if (button.pressed) {
            // Call handleButtonPress with the button index
            handleButtonPress(j);
          }
        }
      }
    }
  }

  // Start listening for gamepad updates
  setInterval(handleGamepadUpdate, 100); // Check for gamepad updates every 100 milliseconds
} else {
  console.log("Gamepad API not supported");
}
