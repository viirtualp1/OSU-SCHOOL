const getRandId = (min, max) => Math.floor(Math.random() * (max - min)) + min

const game = document.querySelector("#game");

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

    for (let i = 0; i < 2; i++) {
        numbers.push(getRandId(0, 10    ));
    }

    return numbers
}

function init() {
    let numbers = [];

    for (let i = 0; i < 4; i++) {
        numbers.push(randNumbers());
    }

    const mathExamples = [
        { example: `${numbers[0][0]} + ${numbers[0][1]}`, answer: numbers[0][0] + numbers[0][1]},
        { example: `${numbers[1][0]} + ${numbers[1][1]}`, answer: numbers[1][0] + numbers[1][1]},
        { example: `${numbers[2][0]} + ${numbers[2][1]}`, answer: numbers[2][0] + numbers[2][1]},
        { example: `${numbers[3][0]} + ${numbers[3][1]}`, answer: numbers[3][0] + numbers[3][1]},
    ]

    mathExampleCreate = mathExample(mathExamples);

    createCircle([mathExampleCreate.answer - getRandId(1, 3), mathExampleCreate.answer + getRandId(1, 2), mathExampleCreate.answer])
    checkAnswer(mathExampleCreate.answer);
}

init();

function checkAnswer(correctAnswer) {
    for (let i = 0; i < 3; i++) {
        const circle = document.querySelector(`#circle${i}`);

        circle.addEventListener("click", () => {
            circle.childNodes[0].id == correctAnswer ? alert('Правильно!') : alert('Неправильно!')

            clearCircles();
            init();
        });
    }
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
        const img = document.createElement("img");
        
        const randIdLeft = getRandId(0, 1000);
        const randIdTop = getRandId(0, 100);

        img.src = `default-${circleNumber[i]}.png`;

        if (circleNumber[i] > 9) { 
            circle.innerHTML = `<p class="circle-text" id="${circleNumber[i]}">${circleNumber[i]}</p>` 
        } else {
            img.id = circleNumber[i];
            circle.appendChild(img);
        }

        circle.className = `circle`;
        circle.id = `circle${i}`;
        circle.style.marginLeft = `${randIdLeft}px`
        circle.style.marginTop = `${randIdTop}px`
    
        game.appendChild(circle);
    }
}

function clearCircles() {
    game.innerHTML = ``;
}