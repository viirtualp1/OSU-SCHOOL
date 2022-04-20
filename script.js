const getRandId = (min, max) => Math.floor(Math.random() * (max - min)) + min

const game = document.querySelector("#game");

let maxRange = 20;

init();

function addRange() { maxRange += 5; init() }
function decreaseRange() { maxRange > 20 ? maxRange -= 5 : 20; init() }

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
  
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
  
    return array;
}

function randNumbers() {
    let numbers = [];

    for (let i = 0; i < 2; i++) numbers.push(getRandId(0, maxRange));

    return numbers
}

function init() {
    clearCircles();
    let numbers = [];

    for (let i = 0; i < 4; i++) numbers.push(randNumbers());

    const mathExamples = [
        { example: `${numbers[0][0]} + ${numbers[0][1]}`, answer: numbers[0][0] + numbers[0][1]},
        { example: `${numbers[3][0]} - ${numbers[3][1]}`, answer: numbers[3][0] - numbers[3][1]},
    ]

    mathExampleCreate = mathExample(mathExamples);

    createCircle([mathExampleCreate.answer - getRandId(1, 10), mathExampleCreate.answer + getRandId(1, 10), mathExampleCreate.answer])
    checkAnswer(mathExampleCreate.answer);

    document.querySelector('#maxRangeText').innerHTML = `Макс. диапазон: ${maxRange}`;
}

function checkAnswer(correctAnswer) {
    for (let i = 0; i < 3; i++) {
        const circle = document.querySelector(`#circle${i}`);

        circle.addEventListener("click", () => {
            circle.childNodes[0].id == correctAnswer ? notification('Правильно!', true) : notification('Неправильно!', false)

            init();
        });
    }
}

function notification(text, isCorrect) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })
    
    Toast.fire({
        icon: isCorrect ? 'success' : 'error',
        title: text
    })
}

function mathExample(numbers) {
    example = numbers[getRandId(0, numbers.length)];
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