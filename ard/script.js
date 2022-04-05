const getRandId = (min, max) => Math.floor(Math.random() * (max - min)) + min

const game = document.querySelector("#game");

const mathExamples = [
    { example: '2 + 2', answer: 4 },
    { example: '3 + 5', answer: 8 },
    { example: '6 + 3', answer: 9 },
    { example: '2 * 3', answer: 6 },
    { example: '1 * 4', answer: 4 },
    { example: '7 - 2', answer: 5 },
    { example: '6 - 3', answer: 3 },
]


function init() {
    mathExampleCreate = mathExample();

    createCircle([mathExampleCreate.answer - getRandId(1, 3), mathExampleCreate.answer + getRandId(1, 2), mathExampleCreate.answer])
    checkAnswer(mathExampleCreate.answer);
}

init();

function checkAnswer(correctAnswer) {
    for (let i = 0; i < 3; i++) {
        const circle = document.querySelector(`#circle${i}`);

        circle.addEventListener("click", () => {
            circle.childNodes[0].id == correctAnswer ? alert('Правильно!') : alert('Неправильно!')

            location.reload();
        });
    }
}

function mathExample() {
    example = mathExamples[getRandId(0, mathExamples.length)];
    document.querySelector('#math-example').innerHTML = `${example.example} = ?`;

    return example
}

function createCircle(circleNumber = [num1, num2, num3]) {
    for (let i = 0; i < 3; i++) {
        const circle = document.createElement("div");
        const img = document.createElement("img");
        
        const randIdLeft = getRandId(0, 1000);
        const randIdTop = getRandId(0, 200);

        img.src = `default-${circleNumber[i]}.png`;
        img.id = circleNumber[i];
        circle.appendChild(img);
    
        circle.className = `circle`;
        circle.id = `circle${i}`;
        circle.style.marginLeft = `${randIdLeft}px`
        circle.style.marginTop = `${randIdTop}px`
    
        game.appendChild(circle);
    }
}