


var canvas = document.getElementById("board");
var context = canvas.getContext("2d");

var playerBoard;
var opponentBoard;

function startGame(){
	//alert("Game Started");		/*debug stuff*/

	canvas.addEventListener("click", mouseClickHandler, false);

	playerBoard = new Board(10,10);
	opponentBoard = new Board(10,10);

	playerBoard.placeShip(3,7);
	playerBoard.placeShip(4,7);

	opponentBoard.placeShip(5,1);
	opponentBoard.placeShip(4,2);

	playerBoard.draw(0,0,2);
	opponentBoard.draw(0,110, 2);
}

function mouseClickHandler(e) {
	//alert(e.pageX / 20 + "," + e.pageY / 20);

	//First find the correct x,y with element offsets
	var offsetX = 0;
	var offsetY = 0;
	var element = canvas;
	if(element.offsetParent) {
		do {
			offsetX += element.offsetLeft;
			offsetY += element.offsetTop;
		} while(element = element.offsetParent);
	}
	var x = e.pageX - offsetX;
	var y =  e.pageY - offsetY;

	var row = Math.floor(y / 20);
	var col = Math.floor(x / 20);

	//alert(row + "," + col);
	if(row < 10 && col < 10) {
		playerBoard.placeShip(row, col);
		context.clearRect(0,0, 200, 200);
		playerBoard.draw(0, 0, 2);
	}
}

class Board {
	
	constructor(rows, cols){
		this.grid = new Array(rows);
		this.rows = rows;
		this.cols = cols;
		for(var i = 0; i < rows; ++i){
			this.grid[i] = new Array(cols)
		}
	}
	
	placeShip(row, col) {
		this.grid[row][col] = 1;
	}

	draw(y, x, scale){
		for(var i = 0; i < this.rows; ++i) {
			for(var c = 0; c < this.cols; ++c) {
				if(this.grid[i][c] != null) {
					context.fillStyle = "#00ff00";
				}
				else if((c + (i % 2)) % 2 == 0) {
					context.fillStyle = "#4286f4";
				}
				else {
					context.fillStyle = "#659bf2";
				}
				context.fillRect((x * scale) + (c * (10 * scale)),(y * scale) + (i * (10 * scale)),(10 * scale),(10 * scale));
			}
		}
	}
}