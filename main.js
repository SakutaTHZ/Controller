let controllerIndex = null;

console.log("testing");

window.addEventListener("gamepadconnected", (event) => {
  const gamepad = event.gamepad;
  controllerIndex = gamepad.index;
  console.log("connected");
});

// This is not working
window.addEventListener("gamepadisconnected", (event) => {
  controllerIndex = null;
  console.log("disconnected");
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
