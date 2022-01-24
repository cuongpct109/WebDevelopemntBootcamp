let gamePattern = [];

let userClickedPattern = [];

let buttonColours = ["red", "blue", "green", "yellow"];

let level = 0;
let started = false;

function playSound(name) {
  let sound = new Audio(`sounds/${name}.mp3`);
  sound.play();
}

function animatePress(currentColour) {
  $(`#${currentColour}`).addClass("pressed");
  setTimeout(function () {
    $(`#${currentColour}`).removeClass("pressed");
  }, 100);
}

function nextSequence() {
  let randomNumber = Math.floor(Math.random() * 4);

  let randomChosenColour = buttonColours[randomNumber];

  gamePattern.push(randomChosenColour);

  $(`#${randomChosenColour}`).fadeOut(100).fadeIn(100);

  playSound(randomChosenColour);

  level++;
  $("#level-title").text(`Level ${level}`);
}

function checkAnswer(currentLevel) {
  let index = currentLevel.length - 1;
  if (currentLevel[index] === gamePattern[index]) {
    console.log("success");
  } else {
    console.log("wrong");
  }
  if (currentLevel.length === gamePattern.length) {
    setTimeout(nextSequence, 1000);
    userClickedPattern = [];
  }
}

$(document).keypress(function () {
  if (!started) {
    $("#level-title").text(`Level ${level}`);
    nextSequence();
    started = true;
  }
});

$(".btn").click(function () {
  let userChosenColour = $(this).attr("id");

  userClickedPattern.push(userChosenColour);

  checkAnswer(userClickedPattern);

  playSound(userChosenColour);

  animatePress(userChosenColour);
});
