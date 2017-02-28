
const canvasScale = 2;

var canvas = document.getElementById("board");
var context = canvas.getContext("2d");

var playerBoard;
var opponentBoard;
var gameMode = 0;
var shipsLeftToPlace;
const shipSizes = [5,4,3,3,2];
var shipSizeCounter;
var shipIsVertical;

window.addEventListener('keydown', this.keyPressHandler, false);

function keyPressHandler(e) {
    shipIsVertical = !shipIsVertical;
}

function startGame(){
	//alert("Game Started");		/*debug stuff*/

	canvas.addEventListener("click", mouseClickHandler, false);
	canvas.addEventListener("mousemove", mouseMoveHandler, false);

	playerBoard = new Board(0, 0, 10,10);
	opponentBoard = new Board(0, 110, 10,10);

	//playerBoard.placeShip(3,7);
	//playerBoard.placeShip(4,7);

	opponentBoard.placeShip(5,1,1,true);
	opponentBoard.placeShip(4,2,1,true);

	playerBoard.draw(0,0,canvasScale);
	opponentBoard.draw(0, 110, canvasScale);
	shipsLeftToPlace = shipSizes.length;
	shipSizeCounter = 0;
	shipIsVertical = true;
}

function randomEnemyFire()
{
   
    var row = Math.floor(Math.random() * 10);
    var col = Math.floor(Math.random() * 10);

    while(!playerBoard.attackLocation(row, col))
    {
        row = Math.floor(Math.random() * 10);
       col = Math.floor(Math.random() * 10);
    }
    playerBoard.draw(0, 0, canvasScale);

}

function getGridPosition(x, y, board) {

	var row = Math.floor((y - board.locY*canvasScale) / 20);
	var col = Math.floor((x - board.locX*canvasScale) / 20);

	//alert(x + ", " + y + "\n" + board.locX + ", " + board.locY);

	return [row, col];
}

function getOffsets() {

	var offsetX = 0;
	var offsetY = 0;
	var element = canvas;
	if(element.offsetParent) {
		do {
			offsetX += element.offsetLeft;
			offsetY += element.offsetTop;
		} while(element = element.offsetParent);
	}

	return [offsetX, offsetY];
}

function mouseMoveHandler(e) {

	var offsets = getOffsets();
	var offsetX = offsets[0];
	var offsetY = offsets[1];

	var x = e.pageX - offsetX;
	var y = e.pageY - offsetY;

	playerBoard.draw(0, 0, canvasScale);
	context.strokeRect(x, y, 10*canvasScale, 10*canvasScale*shipSizes[shipSizeCounter]);

}

function mouseClickHandler(e) {
	//alert(e.pageX / 20 + "," + e.pageY / 20);

	//First find the correct x,y with element offsets
	var offsets = getOffsets();
	var offsetX = offsets[0];
	var offsetY = offsets[1];

	var x = e.pageX - offsetX;
	var y = e.pageY - offsetY;
	if (gameMode == 0)
	{
	    var gridCoords = getGridPosition(x, y, playerBoard);
	    var row = gridCoords[0];
	    var col = gridCoords[1];
	    if (row < 10 && col < 10) {
	        if (playerBoard.placeShip(row, col, shipSizes[shipSizeCounter], shipIsVertical))
	        {
	            shipsLeftToPlace--;
	            shipSizeCounter++;
	            //context.clearRect(0, 0, 200, 200);
	            playerBoard.draw(0, 0, canvasScale);
	        }
	       
	    }

	    if (shipsLeftToPlace ==0)
	    {
	        gameMode = 1;
	    }
	    
	}
	else
	{
	    var gridCoords = getGridPosition(x, y, opponentBoard);
	    var row = gridCoords[0];
	    var col = gridCoords[1];
	    alert("attacking" + row + ", " + col);
	    if (row < 10 && col < 10) {
	        opponentBoard.attackLocation(row, col);
	        //context.clearRect(220, 0, 400, 200);
	        opponentBoard.draw(0, 110, canvasScale);
	        randomEnemyFire();
	    }
	}
	

	//alert(row + "," + col);

}

class Board {
	
	constructor(locX, locY, rows, cols){
	    this.grid = new Array(rows);
	    this.hitGrid = new Array(rows);
	    this.locX = locX;
	    this.locY = locY;
		this.rows = rows;
		this.cols = cols;
		this.totalShipSquares = 0;
		for(var i = 0; i < rows; ++i){
		    this.grid[i] = new Array(cols)
		    this.hitGrid[i] = new Array(cols)
 
		}
	}
	
    placeShip(row, col, size,isVert)
    {
        if (isVert)
        {
            for (var rowi = 0; rowi < size; ++rowi) {
                if (rowi >= this.rows || this.grid[rowi + row][col] != null) {
                    return false;
                }

            }

            for (var rowi = 0; rowi < size; ++rowi) {
                this.grid[rowi + row][col] = 1;
                this.totalShipSquares++;
            }
            return true;
        }
        else
        {
            for (var coli = 0; coli < size; ++coli) {
                if (coli >= this.cols || this.grid[row][coli + col] != null) {
                    return false;
                }

            }

            for (var coli = 0; coli < size; ++coli) {
                this.grid[row][coli + col] = 1;
                this.totalShipSquares++;
            }
            return true;
        }
        
		
	}

    attackLocation(row, col)
    {
        if (this.hitGrid[row][col] != null)
        {
            return false;
        }
	    else if (this.grid[row][col] != null)
	    {
	        this.hitGrid[row][col] = 1;
	        this.totalShipSquares--;
	        if (this.totalShipSquares==0)
	        {
	            alert("A player has won!");
	            startGame();
	        }
	    }
	    else
	    {
	        this.hitGrid[row][col] = 0;
	    }
	    return true;
	    
	}

	draw(y, x, scale) {
	    context.clearRect(x*scale,y*scale,this.rows*10,this.cols*10);
		for(var i = 0; i < this.rows; ++i) {
		    for (var c = 0; c < this.cols; ++c) {
		        if (this.hitGrid[i][c] == 1) {
		            context.fillStyle = "#ff0000";
		        }
		        else if (this.hitGrid[i][c] == 0) {
		            context.fillStyle = "#ffffff";
		        }
				else if(this.grid[i][c] != null) {
					context.fillStyle = "#00ff00";
				}
				else if((c + (i % 2)) % 2 == 0) {
					context.fillStyle = "#4286f4";
				}
				else {
					context.fillStyle = "#659bf2";
				}

		        
				context.fillRect((x * scale) + (c * (10 * scale)), (y * scale) + (i * (10 * scale)), (10 * scale), (10 * scale));
				context.fillStyle = "#000000";
				context.strokeRect((x * scale) + (c * (10 * scale)), (y * scale) + (i * (10 * scale)), (10 * scale), (10 * scale));
			}
		}
	}
}