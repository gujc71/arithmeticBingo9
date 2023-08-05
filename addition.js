class AdditionBingo extends ArithmeticBingo9 {
  constructor(basicTime) {
    super(basicTime);
  }
 
  startGame(level) {
    this.resetGame();
    this.generateBingoBoard(level);
    this.startTimer();
  }  
  // 빙고판 생성 함수
  generateBingoBoard(level) {
    const bingoBoard = document.getElementById("bingoBoard");
    bingoBoard.innerHTML = "";
  
    const bingoProblems = this.getShuffledBingoProblems(level);
  
    let this_ = this;
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.textContent = bingoProblems[i];
      cell.addEventListener("click", () => this_.checkNumber(cell));
      cell.style.fontSize = level===9 ? "7vw" : "5vw";
      bingoBoard.appendChild(cell);
    }
  }
  
  // 구구단에 해당하는 빙고 문제 배열 생성 함수
  getShuffledBingoProblems(level) {
    const bingoProblems = [];
  
    for (let i = 1; i <= 9; i++) {
      let num1 = Math.ceil(Math.random()*level);  
      let num2 = Math.ceil(Math.random()*level);  
      if (num1===1) num1 = 2;
      if (num2===1) num2 = 3;
      bingoProblems.push(`${num1} + ${num2}`);
    }
  
    return bingoProblems;
  }
}  
