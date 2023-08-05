class DivisionBingoLevel2 extends ArithmeticBingo9 {
  constructor(basicTime) {
    super(basicTime);
  }
 
  // 구구단에 해당하는 빙고 문제 배열 생성 함수
  getShuffledBingoProblems() {
    const bingoProblems = [];

    for (let i = 1; i <= this.cellCount * this.cellCount; i++) {
      let num1 = Math.ceil(Math.random()*9);  
      let num2 = Math.ceil(Math.random()*9);  
	    if (num1===1 ) num1 = 2;
	    if (num2===1 ) num2 = 3;      
      bingoProblems.push(`${num1*num2} / ${num2}`);
    }
    return bingoProblems;
  }
}  