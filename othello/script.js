var gameBackground;
var canMoveLayer;
var gap;
var cellWidth;
var diskLayer;
var turn = 'B'; // black goes first
var scoreLabel;
var gameOver = false;

// Starting board
var disks = [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, 'W', 'B', null, null, null],
    [null, null, null, 'B', 'W', null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null]
]

window.onload = function() {
    scoreLabel = document.getElementById("score");
    canMoveLayer = document.getElementById("canMoveLayer");
    gameBackground = document.getElementById("gameBackground");
    diskLayer = document.getElementById("diskLayer");
   
    window.addEventListener('resize', () => requestAnimationFrame(resizeGame));
    resizeGame(); // Initial draw

};

function resizeGame() {
    const headerHeight = document.getElementById("header").offsetHeight;
    const footerHeight = document.getElementById("footer").offsetHeight;
    
    // Calculate available height for the game area
    const availableHeight = window.innerHeight - headerHeight - footerHeight;
    const screenSize = Math.min(window.innerWidth, availableHeight) * 0.90; 
    cellWidth = screenSize / 8; // Each cell is 1/8th of the board

    gap = cellWidth * 0.05; // Gap size is 5% of cell size

    gameBackground.style.width = cellWidth * 8 + gap * 9 + "px";
    gameBackground.style.height = cellWidth * 8 + gap * 9 + "px";

    drawSquares();
    drawDisks();
    drawCanMoveLayer();
    redrawScore()
    updateTurnDisplay();
}


function drawSquares()
{
    gameBackground.innerHTML = ""; // Clear existing squares
    for (var row = 0; row < 8; row ++) {
        for(var col = 0; col < 8; col ++) {   
            var square = document.createElement("div");
            square.style.width = cellWidth + "px";
            square.style.height = cellWidth + "px";
            square.style.backgroundColor = "#953553"; // Purple
            square.style.left = (cellWidth + gap) * col + gap + "px";
            square.style.top = (cellWidth + gap) * row + gap + "px";
            square.style.position = "absolute";
            square.onclick = (function(r, c) {
                return function() {
                    clickedSquare(r, c);
                };
            })(row, col);
            
            gameBackground.appendChild(square);
        }
    }
}




function clickedSquare(row, col){
    // can't click if game over
    if (gameOver) return;

    // spot taken
    if (disks[row][col] != null)  return;
    
    
    if (canClickSpot(turn, row,  col)){
        var affectedDisks = getAffectedDisks(turn, row, col);
        flipDisks(affectedDisks);
        
        disks[row][col] = turn;

        if (turn == 'B' && canMove('W')) turn ='W';
        else if (turn == 'W' && canMove('B')) turn ='B';
        

        drawDisks();
        drawCanMoveLayer();
        redrawScore();
        
        if (!canMove('W') && !canMove('B')) {
            gameOver = true;
        }
        
        updateTurnDisplay();

    } 
    
}

function drawDisks(){
    diskLayer.innerHTML = ""; // Clear existing disks
    for (var row = 0; row < 8; row ++){
        for(var col = 0; col < 8; col ++){
            var value = disks[row][col];
            if (value != null){
                var disk = document.createElement("div");
                
                disk.style.width = (cellWidth - 4) + "px";
                disk.style.height = (cellWidth - 4) + "px";
                disk.style.borderRadius = "50%";
                disk.style.position = "absolute";
                disk.style.left = (cellWidth + gap) * col + gap + 2 + "px";
                disk.style.top = (cellWidth + gap) * row + gap + 2 + "px";
                disk.style.backgroundImage = value === 'B' ?
                    "radial-gradient(#333 30%, black 70%)" :
                    "radial-gradient(white 30%, #ccc 70%)";

                diskLayer.appendChild(disk);
                gameBackground.appendChild(diskLayer);

            }

        }
    }
}



function drawCanMoveLayer(){
    canMoveLayer.innerHTML = ""; // Clear existing disks

    for (var row = 0; row < 8; row ++){
        for(var col = 0; col < 8; col ++){
            var value = disks[row][col];
            if (value == null && canClickSpot(turn, row, col)){
                var diskOutline = document.createElement("div");
                diskOutline.style.width = (cellWidth - 8) + "px";
                diskOutline.style.height = (cellWidth - 8) + "px";
                diskOutline.style.borderRadius = "50%"
                diskOutline.style.position = "absolute";
                diskOutline.style.left = (cellWidth + gap)*col + gap + 2 + "px";
                diskOutline.style.top = (cellWidth + gap)*row + gap + 2 + "px";
                
                // Add pulse animation
                diskOutline.classList.add('can-move'); 
                
                diskOutline.setAttribute("onclick", "clickedSquare("+row+","+col+")");

                if(turn == 'B'){
                    
                    diskOutline.style.border = "2px solid black";
                }
                if(turn == 'W'){
                    diskOutline.style.border = "2px solid white";
                    
                }
                canMoveLayer.appendChild(diskOutline);
                gameBackground.appendChild(canMoveLayer);

            }

        }
    }
}


function canMove(id){
    for (var row = 0; row < 8; row ++){
        for (var col = 0; col < 8; col ++){
            if(canClickSpot(id, row, col)) return true;
        }
    }
    return false;
}

function redrawScore(){
    var blacks = 0;
    var whites = 0;
    for (var row = 0; row < 8; row ++){
        for (var col = 0; col < 8; col ++){
            var val = disks[row][col]
            if (val == 'B') blacks +=1;
            if (val == 'W') whites +=1;
        }
    }
    scoreLabel.innerHTML = "Black: "+blacks+" White: "+whites;

}
function canClickSpot(id, row, col){
    // if number of affected disks at this spot would be 0 return false. Else return true
    var affectedDisks = getAffectedDisks(id, row, col);
    return affectedDisks.length > 0;

}

function getAffectedDisks(id, row, col) {
    var affectedDisks = [];

    if (disks[row][col] !== null)  return affectedDisks;


    var directions = [
        [-1, -1],   [-1, 0],    [-1, 1],
        [0, -1],                [0, 1],
        [1, -1],    [1, 0],     [1, 1]
    ];

    for (var d = 0; d < directions.length; d++) {
        var rowDir = directions[d][0];
        var colDir = directions[d][1];
        var maybeAffected = [];
        var r = row + rowDir;
        var c = col + colDir;

        while (r >= 0 && r < 8 && c >= 0 && c < 8) {
            var spotVal = disks[r][c];
            if (spotVal == null) {
                break; // Empty spot, stop checking in this direction
            }
            
            if (spotVal == id) {
                // If we reach our own color, add all the maybeAffected disks
                affectedDisks = affectedDisks.concat(maybeAffected);
                break;
            } else {
                // Keep track of the opponent's disks
                maybeAffected.push({ row: r, col: c });
            }

            r += rowDir;
            c += colDir;
        }
    }

    return affectedDisks;
}


function flipDisks(affectedDisks){
    // flip affected disks
    for(var i=0; i < affectedDisks.length; i++){
        var spot = affectedDisks[i];
        disks[spot.row][spot.col] = disks[spot.row][spot.col] == 'B' ? 'W' : 'B';
    }
}

function getWinner() {
    var blacks = 0;
    var whites = 0;

    for (var row = 0; row < 8; row++) {
        for (var col = 0; col < 8; col++) {
            if (disks[row][col] === 'B') blacks++;
            if (disks[row][col] === 'W') whites++;
        }
    }

    // Determine the winner
    if (blacks > whites) return "Black";
    if (whites > blacks) return "White";
    return null; // Tie
}


function updateTurnDisplay() {
    if (gameOver) {
        // Game over, display winner
        let winner = getWinner();
        if (winner) {
            turnDisplay.textContent = winner + " Wins";
        } else {
            turnDisplay.textContent = "Tie";
        }
    } else {
        // Game not over, display current turn
        turnDisplay.textContent = turn === 'B' ? "Black Turn" : "White Turn";
    }
}

function resetGame() {
    gameOver = false;
    turn = 'B'; // Black goes first
    disks = disks.map(row => row.map(() => null));
    disks[3][3] = 'W'; disks[3][4] = 'B';
    disks[4][3] = 'B'; disks[4][4] = 'W';
    
    gameBackground.classList.add('reset');
    setTimeout(function() {
        gameBackground.classList.remove('reset');
    }, 500);

    drawDisks();
    drawCanMoveLayer();
    redrawScore();
    updateTurnDisplay();

}


