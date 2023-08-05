class MultiBingoLevel1 extends ArithmeticBingo9 {
  constructor(basicTime) {
    super(basicTime);
  }
 
  startGame(level) {
    this.level = level;	
    this.resetGame();
    this.generateBingoBoard();
    this.startTimer();
  }
  // 구구단에 해당하는 빙고 문제 배열 생성 함수
  getShuffledBingoProblems() {
    const bingoProblems = [];

    let level = this.level;
    for (let i = 1; i <= 9; i++) {
      bingoProblems.push(`${level} x ${i}`);
    }

    const mixedProblems = [];
    while (bingoProblems.length > 0) {
      const randomIndex = Math.floor(Math.random() * bingoProblems.length);
      mixedProblems.push(bingoProblems.splice(randomIndex, 1)[0]);
    }

    return mixedProblems;
  }
}  