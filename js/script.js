/* To fix:
     1. Не вмещаются 3-ех значные числа в Circle
     2. Ставить паузу когда открыто меню
   
   TODO:
     1. BPM Tester
*/

const elements = {
  range: document.querySelector(".settings__range"),
  game: document.querySelector(".game"),
  circles: document.querySelector(".game__content"),
  example: document.querySelector(".game__example"),
  streak: document.querySelector(".game__streak"),
  timer: document.querySelector("#progress-bar-timer"),
};

const context = {
  maxRange: 20,
  widthProgress: 100,
  streakCounter: 0,
  timerToLose: null,
  intervalUpdateProgressBar: null,
};

init();

function addRange() {
  context.maxRange += 5;
  reloadGame(false);
}

function decreaseRange() {
  if (context.maxRange > 20) {
    context.maxRange -= 5;
  }

  reloadGame(false);
}

function getRandomNumbers() {
  return Array.from({ length: 2 }, () => {
    return getRandId(1, context.maxRange);
  });
}

function getMathProblem(num1, num2) {
  return {
    example: `${num1} + ${num2}`,
    answer: num1 + num2,
  };
}

function updateProgress(value) {
  context.widthProgress = value;
  elements.timer.style.width = `${value}%`;
}

function init() {
  elements.circles.innerHTML = "";

  const numbers = new Array(4).fill(0).map(getRandomNumbers);

  // Массив с примерами (вычитание и сложение)
  const mathExamples = [
    getMathProblem(numbers[0][0], numbers[0][1]),
    getMathProblem(numbers[3][0], numbers[3][1]),
  ];

  const answer = getMathExample(mathExamples);

  elements.range.innerHTML = `Макс. диапазон: ${context.maxRange}`;

  // Создание circles, два рандомных числа (ответ - рандЧисло(1, 10), ответ + рандЧисло(1, 20), правильный ответ)
  createCircle([answer - getRandId(1, 10), answer + getRandId(1, 20), answer]);
  handleCircleClick(answer);
  initTimer();
}

function handleCircleClick(correctAnswer) {
  for (let index = 0; index < 3; index++) {
    const circle = document.querySelectorAll(".game__circle")[index];

    circle.addEventListener("click", () => {
      const userAnswer = parseInt(circle.dataset.answer);
      correctAnswer = parseInt(correctAnswer);

      const isCorrect = userAnswer === correctAnswer;

      if (isCorrect) {
        notification("Правильно!", "success");
      } else {
        notification("Неправильно!", "error");
      }

      updateStreak(isCorrect);
      reloadGame(false);
    });
  }
}

/**
 *
 * @param {string} text
 * @param {'success' | 'error'} type
 */
function notification(text, type) {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-start",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  Toast.fire({
    icon: type,
    title: text,
  });
}

function checkCombo(isCorrect) {
  if (context.streakCounter % 5 === 0 && isCorrect) {
    context.maxRange += 5;
  }
}

function updateStreak(isCorrect) {
  context.streakCounter = isCorrect ? context.streakCounter + 1 : 0;
  elements.streak.innerText = `Комбо: ${context.streakCounter}`;

  checkCombo(false);
}

// функция создания примера
function getMathExample(numbers) {
  const { example, answer } = numbers[getRandId(0, numbers.length)];
  elements.example.innerHTML = `${example} = ?`;

  return answer;
}

function getIndents() {
  return {
    left: getRandId(0, window.innerWidth / 2),
    top: getRandId(0, 20),
  };
}

function createCircle(circleNumber = []) {
  shuffle(circleNumber);

  for (let index = 0; index < 3; index++) {
    const answer = circleNumber[index];
    const isNumberIsPrime = (answer < 9 && answer > 0) || answer === 0;

    const circle = document.createElement("div");
    const circleText = document.createElement("p");

    const { left, top } = getIndents();

    circleText.className = "game__circle-text";
    circleText.innerText = answer;

    circle.dataset.answer = answer;
    circle.dataset.id = index;
    circle.className = `game__circle`;
    circle.style.marginLeft = `${left}px`;
    circle.style.marginTop = `${top}px`;

    elements.circles.appendChild(circle);
    circle.appendChild(circleText);

    if (isNumberIsPrime) {
      circleText.style.marginLeft = "3rem";
    }
  }
}

function initTimer() {
  if (context.intervalUpdateProgressBar) {
    clearInterval(context.intervalUpdateProgressBar);
  }

  if (context.timerToLose) {
    clearInterval(context.timerToLose);
  }

  context.intervalUpdateProgressBar = setInterval(() => {
    updateProgress(context.widthProgress - 20);
  }, 1000);

  context.timerToLose = setTimeout(() => reloadGame(true), 6000);
}

/**
 *
 * @param {boolean} resetStreak Need to update streak?
 */
function reloadGame(resetStreak) {
  clearAllTimers();
  updateProgress(100);

  if (resetStreak) {
    updateStreak(false);
  }

  init();
}

function clearAllTimers() {
  clearTimeout(context.timerToLose);
  clearInterval(context.intervalUpdateProgressBar);
}
