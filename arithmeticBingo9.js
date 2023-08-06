class ArithmeticBingo9 {
  constructor(basicTime, bingoType) {
    this.basicTime = basicTime;
    this.timerInterval = 0;
    this.timeRemaining = 0;
    this.isGameOver = false;
    this.currentCell =null;
    this.cellCount = 3;
    this.bingoCnt = 0;
    this.selectedCount =0;
    this.bingoType = bingoType;   // all or one

    const mathResult = document.getElementById("mathResult");
    mathResult.addEventListener("keydown", this.handleInputKeyDown.closureListener(this));

    const modalClose = document.getElementById("modalClose");
    modalClose.addEventListener("click", this.closeMessageModal.closureListener(this));

    const submitBtn = document.getElementById("submitBtn");
    submitBtn.addEventListener("click", this.submitResult.closureListener(this));
 }

  startGame(level) {
    this.cellCount = level;	
    this.resetGame();
    this.generateBingoBoard(level);
    this.startTimer();
  }

  // 빙고판 생성 함수
  generateBingoBoard(level) {
    this.selectedCount = 0;   // click number
    this.bingoCnt = 0;
  
    const bingoStar = document.getElementById("bingoStar");
    if (bingoStar) bingoStar.innerHTML = "";

    const bingoBoard = document.getElementById("bingoBoard");
    bingoBoard.innerHTML = "";
    bingoBoard.style.gridTemplateColumns = "repeat(" +   this.cellCount + ", 1fr)";

    const bingoProblems = this.getShuffledBingoProblems();

    let this_ = this;
    for (let i = 0; i < bingoProblems.length; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.textContent = bingoProblems[i];
	    cell.style.width = "calc(" + (29- (  this.cellCount-3)*6) +"vw - 20px)";
	    cell.style.height = cell.style.width;
	    cell.style.fontSize = (10 -   this.cellCount) +"vw";

      cell.addEventListener("click", () => this_.checkNumber(cell));
      bingoBoard.appendChild(cell);
    }
  }

  // 구구단에 해당하는 빙고 문제 배열 생성 함수
  getShuffledBingoProblems() {
    const bingoProblems = [];

    // 해당 구구단의 모든 문제를 배열에 추가
    while (bingoProblems.length <   this.cellCount *   this.cellCount) { 	  
      let num1 = Math.ceil(Math.random()*9);  
      let num2 = Math.ceil(Math.random()*9);
	    if (num1===1 ) num1 = 2;
	    if (num2===1 ) num2 = 3;

      let problems = `${num1} x ${num2}`;
	    if (bingoProblems.indexOf(problems)===-1) bingoProblems.push(problems);
    }
    return bingoProblems;
  }

  // 숫자 체크 함수
  checkNumber(cell) {
    if (!  this.isGameOver && cell.classList.length===1) {
      this.currentCell = cell;
      this.openInputModal();
    }
  }

  // 결과 입력 모달 열기
  openInputModal() {
    const inputModal = document.getElementById("inputModal");
    inputModal.style.display = "flex";
    const mathResult = document.getElementById("mathResult");
    mathResult.focus();
    mathResult.value="";
  }

  // 결과 입력 모달 닫기 - event
  closeInputModal() {
    const inputModal = document.getElementById("inputModal");
    inputModal.style.display = "none";
    this.currentCell = null;
  }
  
  // user input - event
  handleInputKeyDown(event) {
    if (event.key === "Enter") this.submitResult();
  }

  // 결과 입력 처리 함수 - event
  submitResult() {
    const inputResult = document.getElementById("mathResult").value;
    if (inputResult.trim() === "") return;
  
    this.selectedCount++;	
    const result = eval(  this.currentCell.textContent.replace("x", "*"));
    if (Number(inputResult) === result) {
      this.currentCell.classList.add("marked");
      this.bingoType === "all" ? this.checkBingoAll() : this.checkBingo();
    } else {
      this.currentCell.classList.add("wrong");
    }
    this.currentCell.innerHTML =   this.currentCell.innerHTML + "<br/> = " + inputResult;
  
    this.closeInputModal();
  
    if (! this.isGameOver && this.selectedCount===this.cellCount * this.cellCount) {
      this.endGameFail();      
    }
  }

  // check Bingo All
  checkBingoAll() {
    const bingoBoard = document.getElementById("bingoBoard");
    const cells = bingoBoard.getElementsByClassName("cell");

    let cnt1 =0;
    let cnt2 =0;
    for (let i = 0; i <   this.cellCount; i++) {
      if (this.horizonBingo(cells, i*  this.cellCount)) cnt1++;
      if (cnt1 >=  this.cellCount)  {
        this.addBinfoStart();
	      this.isGameOver = true;
        this.stopTimer();
        this.showModal("<span>💝</span> Perfect!");
        return;
      }	
      if (this.verticalBingo(cells, i)) cnt2++;
    }
  
    cnt1 += cnt2; 
    if ( this.diagonal_1(cells) )  cnt1++;
    if ( this.diagonal_2(cells) )  cnt1++;

    if (cnt1 >   this.bingoCnt && cnt1 <  this.cellCount)  {
      this.addBinfoStart();
    }
    this.bingoCnt = cnt1; 	
  }

    // check Bingo One
  checkBingo() {
    const bingoBoard = document.getElementById("bingoBoard");
    const cells = bingoBoard.getElementsByClassName("cell");
    let chkGameOver = false;
    for (let i = 0; i < this.cellCount; i++) {
      if ( this.horizonBingo(cells, i*this.cellCount) || this.verticalBingo(cells, i) ) {
        chkGameOver = true;
        break;
      }
    }
    if ( this.diagonal_1(cells) || this.diagonal_2(cells)) {
      chkGameOver = true;
    }

    if (chkGameOver) {
      this.isGameOver = true;
      this.stopTimer();
      this.showModal("<span>💝</span> Bingo!");
    }
  }

  addBinfoStart() {
	  const bingoStar = document.getElementById("bingoStar");
	  bingoStar.innerHTML += "💛";	
  }

  // 가로줄 빙고 확인
  horizonBingo(cells, index) {
    for (let i = 0; i <   this.cellCount; i++) {
      if (!cells[index+i].classList.contains("marked")) return false;
    }
    return true;
  }
  // 세로줄 빙고 확인
  verticalBingo(cells, index) {
    for (let i = 0; i <   this.cellCount; i++) {
      if (!cells[index+i*  this.cellCount].classList.contains("marked")) return false;
    }
    return true;
  }
   // 대각선 빙고 확인
  diagonal_1(cells) {
    for (let i = 0; i <   this.cellCount; i++) {
      if (!cells[i * (  this.cellCount+1)].classList.contains("marked")) return false;
    }
    return true;
  }
  diagonal_2(cells) {
    for (let i = 1; i <=   this.cellCount; i++) {
      if (!cells[i * (  this.cellCount-1)].classList.contains("marked")) return false;
    }
    return true;
  }

  endGameFail() {
    this.stopTimer();
    this.closeInputModal();
    this.isGameOver = true;
    this.showModal("<span>💥</span> try again.");
  }

  // 메시지 모달 창 표시 함수
  showModal(message) {
    const messageModal = document.getElementById("messageModal");
    const messageText = document.getElementById("messageText");
    messageText.innerHTML = message;
    messageModal.style.display = "flex";
  }

  // 메시지 모달 창 닫기 함수
  closeMessageModal() {
    const messageModal = document.getElementById("messageModal");
    messageModal.style.display = "none";
  }

  // 타이머 시작 함수
  startTimer() {
    this.timeRemaining = this.basicTime *   this.cellCount;
    this.updateTimerDisplay();
    let this_ = this;
    this.timerInterval = setInterval(() => {
      this_.timeRemaining--;
      this_.updateTimerDisplay();
      if (this_.timeRemaining === 0) {
        this.endGameFail();
      }
    }, 1000);
  }

  // 타이머 업데이트 함수
  updateTimerDisplay() {
    const timerDisplay = document.getElementById("timerDisplay");
    timerDisplay.textContent = `${  this.timeRemaining}s`;
    const timerGauge = document.getElementById("timerGauge");
    const gaugeWidth = (  this.timeRemaining / (this.basicTime*  this.cellCount)) * 90;
    timerGauge.style.width = `${gaugeWidth}%`;  
  }

  // 타이머 정지 함수
  stopTimer() {
    clearInterval(this.timerInterval);
  }

  // 게임 초기화 함수
  resetGame() {
    this.stopTimer();
    this.timeRemaining = this.basicTime *   this.cellCount;
    this.isGameOver = false;
    this.currentCell = null;

    const bingoBoard = document.getElementById("bingoBoard");
    bingoBoard.innerHTML = "";

    const cells = document.getElementsByClassName("cell");
    for (let i = 0; i < cells.length; i++) {
      cells[i].classList.remove("marked", "wrong");
    }

    this.closeInputModal();
    this.closeMessageModal();
  }
}

Function.prototype.closureListener = function() {
  var A = this,
      C = toArray(arguments), // bkLib.
      B = C.shift();
  return function(E) {
      E = E || window.event;
      if (E.target) {
          var D = E.target;
      } else {
          var D = E.srcElement;
      }
      return A.apply(B, [E, D].concat(C));
  };
};

function toArray(C) {
  var B = C.length,
      A = new Array(B);
  while (B--) {
      A[B] = C[B];
  }
  return A;
};