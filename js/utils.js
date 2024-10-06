const getRandId = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const isMobile = navigator.userAgentData && navigator.userAgentData.mobile;

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
