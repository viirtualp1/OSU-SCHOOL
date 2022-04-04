const getRandId = (min, max) => Math.floor(Math.random() * (max - min)) + min

const game = document.querySelector("#game");

createCircle()

function createCircle() {
    for (let i = 0; i < 3; i++) {
        const circle = document.createElement("div");
        const img = document.createElement("img");
        const img2 = document.createElement("img");
        
        const randNumb = getRandId(0, 9)

        img.src = `default-${randNumb}.png`;
        circle.appendChild(img);

        const randIdLeft = getRandId(0, 1000);
        const randIdTop = getRandId(0, 200);
    
        circle.id = "circle";
        circle.style.marginLeft = `${randIdLeft}px`
        circle.style.marginTop = `${randIdTop}px`
    
        game.appendChild(circle);
    
        circle.addEventListener("click", () => {
            circle.parentNode.removeChild(circle);
    
            createCircle();
        })
    }
}