let currentOperation = "";
let score1 = 0;
let score2 = 0;
let timeLimit;
let timer;
let choices1 = [];
let choices2 = [];
let correctAnswerIndex1;
let correctAnswerIndex2;
let player1Answers = [];
let player2Answers = [];

document.addEventListener("keydown", function (event) {
  if (event.key === "a") selectChoice(0, "player1");
  if (event.key === "s") selectChoice(1, "player1");
  if (event.key === "d") selectChoice(2, "player1");
  if (event.key === "f") selectChoice(3, "player1");
  if (event.key === "1") selectChoice(0, "player2");
  if (event.key === "2") selectChoice(1, "player2");
  if (event.key === "3") selectChoice(2, "player2");
  if (event.key === "4") selectChoice(3, "player2");
});

function startGame(operation) {
  currentOperation = operation;
  score1 = 0;
  score2 = 0;
  player1Answers = [];
  player2Answers = [];
  timeLimit = parseInt(document.getElementById("timeLimit").value);
  const difficulty = document.getElementById("difficultyLevel").value;
  document.getElementById("score1").innerText = score1;
  document.getElementById("score2").innerText = score2;
  document.getElementById("menu").style.display = "none"; // Hide the menu
  document.getElementById("game").style.display = "flex"; // Show the game
  document.getElementById("time-left").innerText = timeLimit;
  document.getElementById(
    "timer-bar"
  ).style.animationDuration = `${timeLimit}s`;
  generateQuestion("player1", difficulty);
  generateQuestion("player2", difficulty);
  startTimer();
}

function generateQuestion(player, difficulty) {
  let num1 = 1;
  let num2 = 1;
  switch (difficulty) {
    case "easy":
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      break;
    case "medium":
      num1 = Math.floor(Math.random() * 50) + 1;
      num2 = Math.floor(Math.random() * 50) + 1;
      break;
    case "hard":
      num1 = Math.floor(Math.random() * 100) + 1;
      num2 = Math.floor(Math.random() * 100) + 1;
      break;
  }

  let question = "";
  let correctAnswer = 0;
  switch (currentOperation) {
    case "addition":
      question = `${num1} + ${num2}`;
      correctAnswer = num1 + num2;
      break;
    case "subtraction":
      question = `${num1} - ${num2}`;
      correctAnswer = num1 - num2;
      break;
    case "multiplication":
      question = `${num1} * ${num2}`;
      correctAnswer = num1 * num2;
      break;
    case "division":
      question = `${num1 * num2} / ${num2}`;
      correctAnswer = num1;
      break;
    case "all":
      const operations = ["+", "-", "*", "/"];
      const randomOp =
        operations[Math.floor(Math.random() * operations.length)];
      if (randomOp === "+") {
        question = `${num1} + ${num2}`;
        correctAnswer = num1 + num2;
      } else if (randomOp === "-") {
        question = `${num1} - ${num2}`;
        correctAnswer = num1 - num2;
      } else if (randomOp === "*") {
        question = `${num1} * ${num2}`;
        correctAnswer = num1 * num2;
      } else if (randomOp === "/") {
        question = `${num1 * num2} / ${num2}`;
        correctAnswer = num1;
      }
      break;
  }

  let choices = generateChoices(correctAnswer);
  choices = shuffleArray(choices); // Shuffle the choices to randomize the order
  const correctAnswerIndex = choices.indexOf(correctAnswer);

  if (player === "player1") {
    correctAnswerIndex1 = correctAnswerIndex;
    choices1 = choices;
    document.getElementById("question1").innerText = question;
    const choiceElements1 = document.getElementById("choices1").children;
    for (let i = 0; i < choiceElements1.length; i++) {
      choiceElements1[i].innerText = choices[i];
    }
  } else {
    correctAnswerIndex2 = correctAnswerIndex;
    choices2 = choices;
    document.getElementById("question2").innerText = question;
    const choiceElements2 = document.getElementById("choices2").children;
    for (let i = 0; i < choiceElements2.length; i++) {
      choiceElements2[i].innerText = choices[i];
    }
  }
}

function generateChoices(correctAnswer) {
  const choices = new Set();
  choices.add(correctAnswer);

  while (choices.size < 4) {
    let randomChoice;
    switch (currentOperation) {
      case "addition":
      case "subtraction":
        randomChoice = Math.floor(Math.random() * 20 + 1);
        break;
      case "multiplication":
        randomChoice = Math.floor(Math.random() * 100 + 1);
        break;
      case "division":
        randomChoice = Math.floor(Math.random() * 10 + 1);
        break;
      case "all":
        randomChoice = Math.floor(Math.random() * 100 + 1);
        break;
    }
    if (randomChoice !== correctAnswer) {
      choices.add(randomChoice);
    }
  }

  return Array.from(choices);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function playSound(isCorrect) {
  const sound = document.getElementById(
    isCorrect ? "correct-sound" : "incorrect-sound"
  );
  sound.play();
}

function selectChoice(index, player) {
  const choiceElements = document.getElementById(
    player === "player1" ? "choices1" : "choices2"
  ).children;

  if (player === "player1") {
    if (index === correctAnswerIndex1) {
      score1++;
      player1Answers.push({
        question: document.getElementById("question1").innerText,
        answer: "Correct",
      });
      choiceElements[index].classList.add("correct");
      playSound(true);
    } else {
      score1--;
      player1Answers.push({
        question: document.getElementById("question1").innerText,
        answer: "Incorrect",
      });
      choiceElements[index].classList.add("incorrect");
      playSound(false);
    }
    document.getElementById("score1").innerText = score1;
    setTimeout(() => {
      choiceElements[index].classList.remove("correct", "incorrect");
      generateQuestion(
        "player1",
        document.getElementById("difficultyLevel").value
      );
    }, 500);
  } else if (player === "player2") {
    if (index === correctAnswerIndex2) {
      score2++;
      player2Answers.push({
        question: document.getElementById("question2").innerText,
        answer: "Correct",
      });
      choiceElements[index].classList.add("correct");
      playSound(true);
    } else {
      score2--;
      player2Answers.push({
        question: document.getElementById("question2").innerText,
        answer: "Incorrect",
      });
      choiceElements[index].classList.add("incorrect");
      playSound(false);
    }
    document.getElementById("score2").innerText = score2;
    setTimeout(() => {
      choiceElements[index].classList.remove("correct", "incorrect");
      generateQuestion(
        "player2",
        document.getElementById("difficultyLevel").value
      );
    }, 500);
  }
}

function startTimer() {
  document.getElementById("timer-bar").style.animationPlayState = "running";
  let timeLeft = timeLimit;
  timer = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(timer);
      endGame();
    } else {
      document.getElementById("time-left").innerText = timeLeft;
      timeLeft--;
    }
  }, 1000);
}

function endGame() {
  const winnerMessage =
    score1 > score2
      ? "Player 1 wins!"
      : score2 > score1
      ? "Player 2 wins!"
      : "It's a tie!";

  document.getElementById("winner-message").innerText = winnerMessage;
  document.getElementById("winner").style.display = "flex";
}

function backToGame() {
  document.getElementById("winner").style.display = "none";
  document.getElementById("game").style.display = "none";
  document.getElementById("menu").style.display = "flex"; // Show the menu
}

function showSummary() {
  let summary = "Player 1:\n";
  player1Answers.forEach((answer) => {
    summary += `${answer.question} = ${answer.answer}\n`;
  });
  summary += "\nPlayer 2:\n";
  player2Answers.forEach((answer) => {
    summary += `${answer.question} = ${answer.answer}\n`;
  });
  alert(summary);
}
