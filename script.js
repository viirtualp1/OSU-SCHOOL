// фукнция для генерации числа от min до max чисел 
const getRandId = (min, max) => Math.floor(Math.random() * (max - min)) + min

// получаем див, где будет происходить игра)
const game = document.querySelector("#game");

// макс. диапазон чисел для создания примера
let maxRange = 20;

// счетчик комбо
let streakCounter = 0;

// здесь будет храниться таймер до перезагрузки страницы, если юзер не ответил на пример за 5 сек
let timerToLose;

// здесь будет храниться интервал, для обновления прогресс бара
let timerUpdateProgressBar;

// начальная ширина прогресс бара
let widthProgress = 100;

// Запускаем игру
init();

// увеличить диапазон чисел при создании примера
function addRange() { maxRange += 5; reloadGame(false) }
// уменьшить диапазон чисел при создании примера
function decreaseRange() { maxRange > 20 ? maxRange -= 5 : 20; reloadGame(false) }

// перемешать массив с числами, которые будут в circles (варианты ответов на пример)
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
  
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
  
    return array;
}

// создаем 2 числа из которых будет строиться пример
function randNumbers() {
    let numbers = [];

    for (let i = 0; i < 2; i++) numbers.push(getRandId(1, maxRange));

    return numbers
}

// ининицализация игры 
function init() {
    // удаление пред. circles
    clearCircles();

    // массив для вариантов ответов (circles)
    let numbers = [];
    for (let i = 0; i < 4; i++) numbers.push(randNumbers());

    // массив с примерами (на вычитание и сложение) 
    const mathExamples = [
        { example: `${numbers[0][0]} + ${numbers[0][1]}`, answer: numbers[0][0] + numbers[0][1]},
        { example: `${numbers[3][0]} - ${numbers[3][1]}`, answer: numbers[3][0] - numbers[3][1]},
    ]

    // создание примера
    mathExampleCreate = mathExample(mathExamples);

    // создание circles, два рандомных числа (ответ - рандЧисло(1, 10), ответ + рандЧисло(1, 20), правильный ответ)
    createCircle([mathExampleCreate.answer - getRandId(1, 10), mathExampleCreate.answer + getRandId(1, 20), mathExampleCreate.answer])
    // добавление функции при клике на circle и проверка на совпадение с правильным ответом
    checkAnswer(mathExampleCreate.answer);

    // вставка макс. диапазона для создания примера
    document.querySelector('#maxRangeText').innerHTML = `Макс. диапазон: ${maxRange}`;

    // создание таймера на решение примера
    initTimer();
}

// добавление функции при клике на circle и проверка ответа
function checkAnswer(correctAnswer) {
    // перебор каждого из circle
    for (let i = 0; i < 3; i++) {
        // получение текущего circle
        const circle = document.querySelector(`#circle${i}`);

        // добавление ему события click
        circle.addEventListener("click", () => {
            // в Id добавлено число в circle, его мы сравниваем с правильным ответом на пример и вызываем уведомление 
            circle.childNodes[0].id == correctAnswer ? notification('Правильно!', true) : notification('Неправильно!', false)

            // перезагружаем игру
            reloadGame(false);
        });
    }
}

// уведомления (правильно/нет)
function notification(text, isCorrect) {
    // тоаст (sweetalert2)
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-start',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })
    
    // иконка и текст toast
    Toast.fire({
        icon: isCorrect ? 'success' : 'error',
        title: text
    })

    // вызов функции стрик
    streak(isCorrect);
}

// стрик
function streak(isCorrect) {
    // если isCorrect == true, то мы добавляем к счетчику комбо +1, иначе присваимаем 0
    streakCounter = isCorrect ? streakCounter += 1 : 0;
    // обновляем текст счетчика комбо
    document.querySelector("#streak-text").innerHTML = `Комбо: ${streakCounter}`;
}

// функция создания примера
function mathExample(numbers) {
    // выбираем один из двух рандомных примеров
    example = numbers[getRandId(0, numbers.length)];
    // вставляем его в 
    document.querySelector('#math-example').innerHTML = `${example.example} = ?`;
 
    return example
}

function createCircle(circleNumber = [num1, num2, num3]) {
    shuffle(circleNumber);

    for (let i = 0; i < 3; i++) {
        const circle = document.createElement("div");

        const randIdLeft = getRandId(0, 500);
        const randIdTop = getRandId(0, 100);

        circle.innerHTML = `<p class="circle-text" id="${circleNumber[i]}">${circleNumber[i]}</p>` 

        circle.className = `circle`;
        circle.id = `circle${i}`;
        circle.style.marginLeft = `${randIdLeft}px`
        circle.style.marginTop = `${randIdTop}px`
    
        game.appendChild(circle);
    }

    circleNumber.forEach((num) => {
        if (num < 9 && num > 0 || num == 0) document.getElementById(num).style.marginLeft = "3rem";
    })
}

function clearCircles() {
    game.innerHTML = ``;
}

function initTimer() {
    timerUpdateProgressBar = setInterval(() => {
        document.querySelector("#progress-bar-timer").style.width = `${widthProgress -= 20}%`
    }, 1000);

    timerToLose = setTimeout(() => reloadGame(true), 6000);
}

function reloadGame(lose) {
    clearTimeout(timerToLose);
    clearInterval(timerUpdateProgressBar);
    widthProgress = 100;
    document.querySelector("#progress-bar-timer").style.width = `100%`

    lose ? streak(false) : null;

    init();
}