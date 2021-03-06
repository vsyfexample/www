
var me = true;
var chessBoard = [];
var gameOver = false;

//win
var wins = [];
var count = 0;

//
var myWin = [];
var computerWin = [];

//
for(var i=0; i<20; i++) {
	chessBoard[i] = [];
	for(var j=0; j<20; j++) {
		chessBoard[i][j] = 0;
	}
}

for (var i=0; i<20; i++) {
	wins[i] = []
	for (j=0; j<20; j++) {
		wins[i][j] = [];
	}
}

//fill wins[][][]
for (var i=0; i<20; i++) {
	for (var j=0; j<16; j++) {
		for(var k=0; k<5; k++) {
			wins[i][j+k][count] = true;
		}
		count++;
	}
}
for (var i=0; i<20; i++) {
	for (var j=0; j<16; j++) {
		for(var k=0; k<5; k++) {
			wins[j+k][i][count] = true;
		}
		count++;
	}
}
for (var i=0; i<16; i++) {
	for (var j=0; j<16; j++) {
		for(var k=0; k<5; k++) {
			wins[i+k][j+k][count] = true;
		}
		count++;
	}
}
for (var i=0; i<16; i++) {
	for (var j=19; j>3; j--) {
		for(var k=0; k<5; k++) {
			wins[i+k][j-k][count] = true;
		}
		count++;
	}
}

console.log(count);
for (var i=0; i<count; i++) {
	myWin[i] = 0;
	computerWin[i] = 0;
}


var chess = document.getElementById('chess')
var context = chess.getContext('2d')

context.strokeStyle = "#BFBFBF"

var logo = new Image();
logo.src = "images/logo.png";
logo.onload = function() {
	context.drawImage(logo, 0, 0, 600, 600);
	drawChessBoard();
}

var drawChessBoard = function() {
	for(var i=0; i<20; i++) {
		context.moveTo(15 + i*30, 15);
		context.lineTo(15 + i*30, 585);
		context.stroke();
		context.moveTo(15, 15 + i*30);
		context.lineTo(585, 15 + i*30);
		context.stroke();
	}
}


var oneStep = function(i, j, me) {
	context.beginPath();
	context.arc(15 + i*30, 15 + j*30, 13, 0, 2*Math.PI);
	context.closePath();
	var gradient = context.createRadialGradient(15 + i*30 + 2, 15 + j*30 - 2, 13, 15 + i*30 + 2, 15 + j*30 - 2, 0);
	if (me) {
		gradient.addColorStop(0, "#0A0A0A");
		gradient.addColorStop(1, "#636776");
	} else {
		gradient.addColorStop(0, "#D1D1D1");
		gradient.addColorStop(1, "#F9F9F9");
	}
	context.fillStyle = gradient;
	context.fill();
}

chess.onclick = function(e) {
	if (gameOver == true) {
		return;
	}
	if (!me) {
		return
	}
	var x = e.offsetX;
	var y = e.offsetY;
	var i = Math.floor(x / 30);
	var j = Math.floor(y / 30);
	if (chessBoard[i][j] == 0) {
		oneStep(i, j, me);
		chessBoard[i][j] = 1;
		for (var k=0; k<count; k++) {
			if (wins[i][j][k]) {
				myWin[k]++;
				computerWin[k] = 6;//never win
				if (myWin[k] == 5) {
					window.alert("you win!");
					gameOver = true;
				}
			}
		}
		if (!gameOver) {
			me = !me;
			computerAI();
		}
	}
}

var computerAI = function() {
	var myScore = [];
	var computerScore = [];
	var max = 0;
	var u = 0, v = 0;
	for (var i=0; i<20; i++) {
		myScore[i] = [];
		computerScore[i] = [];
		for (var j=0; j<20; j++) {
			myScore[i][j] = 0;
			computerScore[i][j] = 0;
		}
	}
	for (var i=0; i<20; i++) {
		for (var j=0; j<20; j++) {
			if (chessBoard[i][j] == 0) {
				for (var k =0; k<count; k++) {
					if (wins[i][j][k]) {
						if (myWin[k] == 1 ) {
							myScore[i][j] += 200;
						} else if (myWin[k] == 2) {
							myScore[i][j] += 400;
						} else if (myWin[k] == 3) {
							myScore[i][j] += 2000;
						} else if (myWin[k] == 4) {
							myScore[i][j] += 10000;
						}
						if (computerWin[k] == 1 ) {
							computerScore[i][j] += 200;
						} else if (computerWin[k] == 2) {
							computerScore[i][j] += 400;
						} else if (computerWin[k] == 3) {
							computerScore[i][j] += 2000;
						} else if (computerWin[k] == 4) {
							computerScore[i][j] += 10000;
						}
					}
				}
				if (myScore[i][j] > max) {
					max = myScore[i][j];
					u = i;
					v = j;
				} else if (myScore[i][j] == max) {
					if (computerScore[i][j] > computerScore[u][v]) {
						u = i;
						u = j;
					}
				}
				if (computerScore[i][j] > max) {
					max = computerScore[i][j];
					u = i;
					v = j;
				} else if (computerScore[i][j] == max) {
					if (myScore[i][j] > myScore[u][v]) {
						u = i;
						u = j;
					}
				}
			}	
		}
	}
	oneStep(u, v, false);
	chessBoard[u][v] = 2;
	for (var k=0; k<count; k++) {
		if (wins[u][v][k]) {
			computerWin[k]++;
			myWin[k] = 6;//never win
			if (computerWin[k] == 5) {
				window.alert("computer win!");
				gameOver = true;
			}
		}
	}
	if (!gameOver) {
		me = !me;
	}
}