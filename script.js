const getRandId = (min, max) => Math.floor(Math.random() * (max - min)) + min;

// получаем див, где будет происходить игра
const gameElement = document.querySelector('#game');

// здесь будет храниться таймер до перезагрузки страницы, если юзер не ответил на пример за 5 сек
let timerToLose;

// здесь будет храниться интервал для обновления прогресс бара
let intervalUpdateProgressBar;

// переменные состояния
let context = {
  maxRange: 20,
  widthProgress: 100,
  streakCounter: 0,
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

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

// создаем 2 числа из которых будет строиться пример
function randNumbers() {
  let numbers = [];

  for (let i = 0; i < 2; i++) numbers.push(getRandId(1, context.maxRange));

  return numbers;
}

function getMathProblem(num1, num2) {
  return {
    example: `${num1} + ${num2}`,
    answer: num1 + num2,
  };
}

function updateProgress(value) {
  context.widthProgress = value;
  document.querySelector('#progress-bar-timer').style.width = `${value}%`;
}

function init() {
  clearCircles();

  // массив для вариантов ответов (circles)
  const numbers = new Array(4).fill(0).map(randNumbers);

  // массив с примерами (на вычитание и сложение)
  const mathExamples = [
    getMathProblem(numbers[0][0], numbers[0][1]),
    getMathProblem(numbers[3][0], numbers[3][1]),
  ];

  // создание примера
  const mathExampleCreate = mathExample(mathExamples);

  // создание circles, два рандомных числа (ответ - рандЧисло(1, 10), ответ + рандЧисло(1, 20), правильный ответ)
  createCircle([
    mathExampleCreate.answer - getRandId(1, 10),
    mathExampleCreate.answer + getRandId(1, 20),
    mathExampleCreate.answer,
  ]);

  // добавление функции при клике на circle и проверка на совпадение с правильным ответом
  checkAnswer(mathExampleCreate.answer);

  document.querySelector('#maxRangeText').innerHTML = `Макс. диапазон: ${context.maxRange}`;

  // создание таймера на решение примера
  initTimer();
}

// добавление функции при клике на circle и проверка ответа
function checkAnswer(correctAnswer) {
  for (let i = 0; i < 3; i++) {
    const circle = document.querySelector(`#circle${i}`);

    circle.addEventListener('click', () => {
      const userAnswer = parseInt(circle.childNodes[0].dataset.answer);
      correctAnswer = parseInt(correctAnswer);

      const isCorrect = userAnswer === correctAnswer;

      if (isCorrect) {
        notification('Правильно!', true);
      } else {
        notification('Неправильно!', false);
      }

      reloadGame(false);
    });
  }
}

function notification(text, isCorrect) {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-start',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  Toast.fire({
    icon: isCorrect ? 'success' : 'error',
    title: text,
  });

  streak(isCorrect);
}

function checkCombo() {
  if (context.streakCounter % 5 === 0) {
    context.maxRange += 5;
  }
}

function streak(isCorrect) {
  context.streakCounter = isCorrect ? context.streakCounter + 1 : 0;
  document.querySelector('#streak-text').innerHTML = `Комбо: ${context.streakCounter}`;

  checkCombo();
}

// функция создания примера
function mathExample(numbers) {
  // выбираем один из двух рандомных примеров
  const example = numbers[getRandId(0, numbers.length)];
  // вставляем его в
  document.querySelector('#math-example').innerHTML = `${example.example} = ?`;

  return example;
}

function createCircle(circleNumber = []) {
  shuffle(circleNumber);

  for (let i = 0; i < 3; i++) {
    const num = circleNumber[i];
    const isNumberIsPrimeNumber = (num < 9 && num > 0) || num === 0;

    const circle = document.createElement('div');
    const circleText = document.createElement('p');

    const randIdLeft = getRandId(0, 500);
    const randIdTop = getRandId(0, 100);

    circleText.className = 'circle-text';
    circleText.setAttribute('data-answer', num);
    circleText.innerText = num;

    circle.className = `circle`;
    circle.id = `circle${i}`;
    circle.style.marginLeft = `${randIdLeft}px`;
    circle.style.marginTop = `${randIdTop}px`;

    gameElement.appendChild(circle);
    circle.appendChild(circleText);

    if (isNumberIsPrimeNumber) {
      circleText.style.marginLeft = '3rem';
    }
  }
}

function clearCircles() {
  gameElement.innerHTML = ``;
}

function initTimer() {
  if (intervalUpdateProgressBar) clearInterval(intervalUpdateProgressBar);
  if (timerToLose) clearInterval(timerToLose);

  intervalUpdateProgressBar = setInterval(() => {
    updateProgress(context.widthProgress - 20);
  }, 1000);

  timerToLose = setTimeout(() => reloadGame(true), 6000);
}

function reloadGame(lose) {
  clearAllTimers();
  updateProgress(100);

  if (lose) {
    streak(false);
  }

  init();
}

function clearAllTimers() {
  clearTimeout(timerToLose);
  clearInterval(intervalUpdateProgressBar);
}