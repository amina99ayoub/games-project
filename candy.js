var candies = ["Blue", "Orange", "Green", "Yellow", "Red", "Purple"];
var board = [];
var rows = 9;
var columns = 9;
var score = 0;

var currTile;
var otherTile;

// Initialize the game and set an interval to handle candy crushing
window.onload = function() {
    startGame();

    window.setInterval(function() {
        crushCandy();
        slideCandy();
        generateCandy();
    }, 100);
};

// Randomly pick a candy
function randomCandy() {
    return candies[Math.floor(Math.random() * candies.length)];
}

// Create the board and populate it with random candies
function startGame() {
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("img");
            tile.id = `${r}-${c}`;
            tile.src = `./images/${randomCandy()}.png`;

            // Add drag-and-drop event listeners
            tile.addEventListener("dragstart", dragStart);
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("dragenter", dragEnter);
            tile.addEventListener("dragleave", dragLeave);
            tile.addEventListener("drop", dragDrop);
            tile.addEventListener("dragend", dragEnd);

            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }
}

// Drag-and-drop event handlers
function dragStart() {
    currTile = this;
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {}

function dragDrop() {
    otherTile = this;
}

function dragEnd() {
    if (currTile.src.includes("blank") || otherTile.src.includes("blank")) {
        return;
    }

    let [r, c] = currTile.id.split("-").map(Number);
    let [r2, c2] = otherTile.id.split("-").map(Number);

    // Check if the tiles are adjacent
    let isAdjacent = (c2 === c - 1 && r === r2) || (c2 === c + 1 && r === r2) ||
                     (r2 === r - 1 && c === c2) || (r2 === r + 1 && c === c2);

    if (isAdjacent) {
        // Swap the tiles
        [currTile.src, otherTile.src] = [otherTile.src, currTile.src];

        // Revert swap if move is invalid
        if (!checkValid()) {
            [currTile.src, otherTile.src] = [otherTile.src, currTile.src];
        }
    }
}

// Check and crush candies
function crushCandy() {
    crushThree();
    document.getElementById("score").innerText = score;
}

// Crush horizontal and vertical matches of three candies
function crushThree() {
    // Horizontal matches
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 2; c++) {
            let [candy1, candy2, candy3] = [board[r][c], board[r][c + 1], board[r][c + 2]];
            if (candy1.src === candy2.src && candy2.src === candy3.src && !candy1.src.includes("blank")) {
                candy1.src = candy2.src = candy3.src = "./images/blank.png";
                score += 30;
            }
        }
    }

    // Vertical matches
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 2; r++) {
            let [candy1, candy2, candy3] = [board[r][c], board[r + 1][c], board[r + 2][c]];
            if (candy1.src === candy2.src && candy2.src === candy3.src && !candy1.src.includes("blank")) {
                candy1.src = candy2.src = candy3.src = "./images/blank.png";
                score += 30;
            }
        }
    }
}

// Check if there are valid matches
function checkValid() {
    // Horizontal matches
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 2; c++) {
            let [candy1, candy2, candy3] = [board[r][c], board[r][c + 1], board[r][c + 2]];
            if (candy1.src === candy2.src && candy2.src === candy3.src && !candy1.src.includes("blank")) {
                return true;
            }
        }
    }

    // Vertical matches
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 2; r++) {
            let [candy1, candy2, candy3] = [board[r][c], board[r + 1][c], board[r + 2][c]];
            if (candy1.src === candy2.src && candy2.src === candy3.src && !candy1.src.includes("blank")) {
                return true;
            }
        }
    }

    return false;
}

// Slide candies down to fill blank spaces
function slideCandy() {
    for (let c = 0; c < columns; c++) {
        let ind = rows - 1;
        for (let r = rows - 1; r >= 0; r--) {
            if (!board[r][c].src.includes("blank")) {
                board[ind][c].src = board[r][c].src;
                ind -= 1;
            }
        }
        for (let r = ind; r >= 0; r--) {
            board[r][c].src = "./images/blank.png";
        }
    }
}

// Generate new candies to replace blanks
function generateCandy() {
    for (let c = 0; c < columns; c++) {
        if (board[0][c].src.includes("blank")) {
            board[0][c].src = `./images/${randomCandy()}.png`;
        }
    }
}
