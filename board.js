
const canvasScale = 2;
var canvas = document.getElementById("board");
var context = canvas.getContext("2d");
var playerBoard;
var opponentBoard;
var gameMode;
var shipsLeftToPlace;
const shipSizes = [5,4,3,3,2];
var shipSizeCounter;
var shipIsVertical;

window.addEventListener('keydown', this.keyPressHandler, false);

function keyPressHandler(e) {
    shipIsVertical = !shipIsVertical;
}

function startGame() {
	
	canvas.addEventListener("click", mouseClickHandler, false);
	canvas.addEventListener("mousemove", mouseMoveHandler, false);

	playerBoard = new Board(0, 0, 10,10);
	opponentBoard = new Board(110, 0, 10,10);
	//opponentBoard.hideShips();

	/*
	opponentBoard.placeShip(5,1,2,true);
	opponentBoard.placeShip(6, 3, 3, true);
	opponentBoard.placeShip(2, 3, 4, false);
	*/
	randomPlaceShips(opponentBoard);

	playerBoard.draw(canvasScale);
	opponentBoard.draw(canvasScale);
	
	//Reset globals to defaults
	shipsLeftToPlace = shipSizes.length;
	shipSizeCounter = 0;
	shipIsVertical = true;
	gameMode = 0;
}

function randomPlaceShips(board) {
	for(var c = 0; c < shipSizes.length; c++) {
		var row, col, rot;
		while(true) {
			row = Math.floor(Math.random() * 10);
			col = Math.floor(Math.random() * 10);
			rot = Math.random() <= 0.5;
			if(board.canPlaceShip(row, col, shipSizes[c], rot)) {
				board.placeShip(row, col, shipSizes[c], rot)
				break;
			}
		}
	}
}

function randomEnemyFire()
{
	var row, col;
    do {
		row = Math.floor(Math.random() * 10);
		col = Math.floor(Math.random() * 10);
    }while(!playerBoard.attackLocation(row, col))
    playerBoard.draw(canvasScale);

    if (playerBoard.checkHasLost()) {
        alert("You have lost!");
        startGame();
    }

}

function getGridPosition(x, y, board) {

	var row = Math.floor((y - board.locY*canvasScale) / 20);
	var col = Math.floor((x - board.locX*canvasScale) / 20);

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
	var gridPos = getGridPosition(x, y, playerBoard);
	var row = gridPos[0];
	var col = gridPos[1];
	if (playerBoard.canPlaceShip(row, col, shipSizes[shipSizeCounter], shipIsVertical))
	{
	    playerBoard.draw(canvasScale);
	    context.strokeStyle = "#00ff00";
	    if (shipIsVertical)
	    {
	        context.strokeRect(col * 10 * canvasScale, row * 10 * canvasScale, 10 * canvasScale, 10 * canvasScale * shipSizes[shipSizeCounter]);
	    }
	    else
	    {
	        context.strokeRect(col * 10 * canvasScale, row * 10 * canvasScale, 10 * canvasScale * shipSizes[shipSizeCounter], 10 * canvasScale);
	    }
	    
	}
	

}

function mouseClickHandler(e) {

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
	        if (playerBoard.canPlaceShip(row, col, shipSizes[shipSizeCounter], shipIsVertical))
	        {

	            playerBoard.placeShip(row, col, shipSizes[shipSizeCounter], shipIsVertical)
	            shipsLeftToPlace--;
	            shipSizeCounter++;
	            playerBoard.draw(canvasScale);
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

	    if (row < 10 && col < 10) {
	        opponentBoard.attackLocation(row, col);
	        if (opponentBoard.checkHasLost()) {
	            alert("You have won!");
	            startGame();
	        }
	        else {
	            randomEnemyFire();
	        }
	        opponentBoard.draw(canvasScale);
	        
	    }
	}

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
		this.renderShips = true;
		for(var i = 0; i < rows; ++i){
		    this.grid[i] = new Array(cols)
		    this.hitGrid[i] = new Array(cols)
 
		}
	}
	
	hideShips() {
		this.renderShips = false;
	}
	
	showShips() {
		this.renderShips = true;
	}
	
    canPlaceVert(row,col,size)
    {
        for (var rowi = 0; rowi < size; ++rowi) {
            if (rowi + row >= this.rows || this.grid[rowi + row][col] != null) {
                return false;
            }
        }
        return true;
    }
    canPlaceHorz(row,col,size)
    {
        for (var coli = 0; coli < size; ++coli) {
            if (coli + col >= this.cols || this.grid[row][coli + col] != null) {

                return false;
            }
        }
        return true;
    }
    canPlaceShip(row,col,size,isVert)
    {
        if (row >= this.rows || col >= this.cols)
        {
            return false;
        }
        if (isVert) {
            return this.canPlaceVert(row,col,size);
        }
        else {
            return this.canPlaceHorz(row, col, size);
        }
    }

    placeVert(row,col,size)
    {
        for (var rowi = 0; rowi < size; ++rowi) {
            this.grid[rowi + row][col] = 1;
            this.totalShipSquares++;
        }
    }
	
    placeHorz(row,col,size)
    {
        for (var coli = 0; coli < size; ++coli) {
            this.grid[row][coli + col] = 1;
            this.totalShipSquares++;
        }
    }
	
    placeShip(row, col, size,isVert)
    {
        if (isVert)
        {
            this.placeVert(row,col,size);
        }
        else
        {
            this.placeHorz(row, col, size);
        }
	}
    
    checkHasLost() {
        if (this.totalShipSquares == 0) {
            return true;
        }
        return false;
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
	        
	    }
	    else
	    {
	        this.hitGrid[row][col] = 0;
	    }
	    return true;
	    
	}

	draw(scale) {
	    context.clearRect(this.locX*scale,this.locY*scale,this.rows*10,this.cols*10);
		for(var i = 0; i < this.rows; ++i) {
		    for (var c = 0; c < this.cols; ++c) {
		        if (this.hitGrid[i][c] == 1) {
		            context.fillStyle = "#ff0000";
		        }
		        else if (this.hitGrid[i][c] == 0) {
		            context.fillStyle = "#ffffff";
		        }
				else if(this.grid[i][c] != null && this.renderShips) {
					context.fillStyle = "#00ff00";
				}
				else if((c + (i % 2)) % 2 == 0) {
					context.fillStyle = "#4286f4";
				}
				else {
					context.fillStyle = "#659bf2";
				}        
				context.fillRect((this.locX * scale) + (c * (10 * scale)), (this.locY * scale) + (i * (10 * scale)), (10 * scale), (10 * scale));
				context.fillStyle = "#000000";
				context.strokeStyle = "#000000";
				context.strokeRect((this.locX * scale) + (c * (10 * scale)), (this.locY * scale) + (i * (10 * scale)), (10 * scale), (10 * scale));
			}
		}
	}
}