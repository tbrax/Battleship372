


var canvas = document.getElementById("board");
var context = canvas.getContext("2d");


function startGame(){
	var gameBoard = new Board(10,10);
	gameBoard.draw();
	
}

class Board{
	
	constructor(rows, cols){
		this.grid = new array(rows);
		for(var i = 0; i < rows; ++i){
			grid[i] = new array(cols)
		}
	}
	
	
	
	draw(){
		context.fillStyle = "#ff0000";
		context.fillRect(0,0,100,100);
		alert("draw");
	
	
	}
	
	
}

startGame();