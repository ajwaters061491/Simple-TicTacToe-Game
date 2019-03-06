var origBoard;
const humanPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [ //all win conditions
    [0,1,2], [3,4,5], [6,7,8], //horizontal wins
    [0,3,6], [1,4,7], [2,5,8], //vertical wins
    [0,4,8], [2,4,6] //diagonal wins
]

const cells = document.querySelectorAll('.cell'); //stores a reference to each cell

startGame();

function startGame() { //resets the board to have nothing in it 
    document.querySelector('.endgame').style.display = 'none';
    origBoard = Array.from(Array(9).keys()); //creates an array of all numbers 0 to 9
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(square) {
    if (typeof origBoard[square.target.id] == 'number') { //if nobody has played in the spot
        turn(square.target.id, humanPlayer); //calls the turn function specifically with the humanPlayer
        if (!checkTie()) turn(bestSpot(), aiPlayer); //checks to see if there is a tie and if not, the ai takes a turn
    }   
}

function turn(squareId, player) {
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player; //sets the square to be a O for the player mark
    let gameWon = checkWin(origBoard, player);
    if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) { //finds every spot the player has marked in
    let plays = board.reduce((a,e,i) => 
    (e === player) ? a.concat(i) : a, []) // if element = player, add the index to the array, if not, return the accumulator
    let gameWon = null;
    for (let [index, win] of winCombos.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) { //loops to check to if the player has marked each spot that counts as a win
            gameWon = {index: index, player: player};
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) { //sets the color of the cells to blue for a win and red for a loss
    for (let index of winCombos[gameWon.index]) {
        document.getElementById(index).style.backgroundColor = 
            gameWon.player == humanPlayer ? 'blue' : 'red'; //checks to see who won
    }
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player ==humanPlayer ? 'You win!' : 'You lose!');
}

function declareWinner(who) {
    document.querySelector('.endgame').style.display = 'block';
    document.querySelector('.endgame .text').innerText = who;
}

function emptySquares() { 
    return origBoard.filter(s => typeof s == 'number'); //finds the first spot thats not empty
}

function bestSpot() {
    //return emptySquares()[0];
    return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
    if (emptySquares().length == 0) { //checks to see if there is nothing in empty squares
        for (var i =0; i < cells.length; i++) {
            cells[i].style.backgroundColor = 'green';
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner('Tie Game!');
        return true;
    }
    return false;
}

function minimax(newBoard, player) { //minimax algorithm to guarantee all loses. 
                                     // https://medium.freecodecamp.org/how-to-make-your-tic-tac-toe-game-unbeatable-by-using-the-minimax-algorithm-9d690bad4b37
    var availSpots = emptySquares(newBoard);

    if (checkWin(newBoard, player)) {
        return {score: -10};
    } else if (checkWin(newBoard, aiPlayer)) {
        return {score: 10};
    } else if (availSpots.length === 0) {
        return {score: 0};
    }

    var moves = [];

    for (var i = 0; i < availSpots.length; i++) {
        var move = {};

        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if(player == aiPlayer){
            var result = minimax(newBoard, humanPlayer);
            move.score = result.score;
        } else {
            var result = minimax(newBoard, aiPlayer);
            move.score = result.score;
        }

        newBoard[availSpots[i]] = move.index;

        moves.push(move);
    }

    var bestMove;

    if(player === aiPlayer) {
        var bestScore = -10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        var bestScore = 10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}