board = new Board(0, 0, 10, 10);
//Test bounds checking
if (board.canPlaceShip(0, 10, 1, true))
{
    alert("Test 1 Failed");
}

if (board.canPlaceShip(10, 0, 1, true))
{
    alert("Test 2 Failed");
}

if (board.canPlaceShip(0, 100, 1, true))
{
    alert("Test 3 Failed");
}

if (board.canPlaceShip(100, 0, 1, true))
{
    alert("Test 4 Failed");
}

if (!board.canPlaceShip(0, 0, 1, true))
{
    alert("Test 5 Failed");
}