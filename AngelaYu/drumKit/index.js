let button = document.querySelectorAll(".drum");

function flash(currentKey) {
  document.querySelector("." + currentKey).classList.add("pressed");
  setTimeout(function () {
    document.querySelector("." + currentKey).classList.remove("pressed");
  }, 100);
}

for (let i = 0; i < button.length; i++) {
  switch (button[i].innerHTML) {
    case "w":
      let tom1 = new Audio("sounds/tom-1.mp3");

      button[i].addEventListener("click", function () {
        tom1.play();
        flash(button[i].innerHTML);
      });

      break;
    case "a":
      let tom2 = new Audio("sounds/tom-2.mp3");

      button[i].addEventListener("click", function () {
        tom2.play();
        flash(button[i].innerHTML);
      });

      break;
    case "s":
      let tom3 = new Audio("sounds/tom-3.mp3");

      button[i].addEventListener("click", function () {
        tom3.play();
        flash(button[i].innerHTML);
      });

      break;
    case "d":
      let tom4 = new Audio("sounds/tom-4.mp3");

      button[i].addEventListener("click", function () {
        tom4.play();
        flash(button[i].innerHTML);
      });

      break;
    case "j":
      let snare = new Audio("sounds/snare.mp3");

      button[i].addEventListener("click", function () {
        snare.play();
        flash(button[i].innerHTML);
      });

      break;
    case "k":
      let crash = new Audio("sounds/crash.mp3");

      button[i].addEventListener("click", function () {
        crash.play();
        flash(button[i].innerHTML);
      });

      break;
    case "l":
      let kick = new Audio("sounds/kick-bass.mp3");

      button[i].addEventListener("click", function () {
        kick.play();
        flash(button[i].innerHTML);
      });

      break;
    default:
      console.log("something else");
      break;
  }
}

document.addEventListener("keydown", function (event) {
  switch (event.key) {
    case "w":
      let tom1 = new Audio("sounds/tom-1.mp3");

      tom1.play();
      flash(event.key);

      break;
    case "a":
      let tom2 = new Audio("sounds/tom-2.mp3");

      tom2.play();
      flash(event.key);
      break;
    case "s":
      let tom3 = new Audio("sounds/tom-3.mp3");

      tom3.play();
      flash(event.key);
      break;
    case "d":
      let tom4 = new Audio("sounds/tom-4.mp3");

      tom4.play();
      flash(event.key);
      break;
    case "j":
      let snare = new Audio("sounds/snare.mp3");

      snare.play();
      flash(event.key);
      break;
    case "k":
      let crash = new Audio("sounds/crash.mp3");

      crash.play();
      flash(event.key);
      break;
    case "l":
      let kick = new Audio("sounds/kick-bass.mp3");

      kick.play();
      flash(event.key);
      break;
    default:
      console.log("something else");
      break;
  }
});
