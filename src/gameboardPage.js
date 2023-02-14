import Gameboard from './gameboard';
import { GRID_SIZE, getRndInteger, coordsToIndex, indexToCoords } from './util';

const gameboardPage = (function() {
    const root = document.getElementById('root');
    const computerBoard = new Gameboard();
    let playerBoard;
    let gameover = false;

    const init = function (gameboard) {
        playerBoard = gameboard;
        root.innerHTML = '';

        placeRandomShips(computerBoard);

        const page = document.createElement('div');
        page.setAttribute('id', 'gameboardPage');

        //create player grid
        const playerGrid = document.createElement('div');
        playerGrid.classList.add('grid');
        playerGrid.classList.add('player-grid');

        playerGrid.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 1fr)`;
        playerGrid.style.gridTemplateRows = `repeat(${GRID_SIZE}, 1fr)`;

        //populate grid with cells
        for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            playerGrid.appendChild(cell);
        }
        page.appendChild(playerGrid);

        //create computer grid
        const computerGrid = document.createElement('div');
        computerGrid.classList.add('grid');
        computerGrid.classList.add('computer-grid');

        computerGrid.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 1fr)`;
        computerGrid.style.gridTemplateRows = `repeat(${GRID_SIZE}, 1fr)`;

        //populate grid with cells
        for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
            const cell = document.createElement('div');
            cell.dataset.index = i;
            cell.classList.add('cell');
            cell.addEventListener('click', attack);

            computerGrid.appendChild(cell);
        }
        page.appendChild(computerGrid);
        root.appendChild(page);

        updateGrids();
    }

    function attack(e) {
        if (gameover) return;

        const index = e.target.dataset.index;
        let { x, y } = indexToCoords(index);

        //handle player attack
        if (computerBoard.getCell(x, y) === 'miss' || computerBoard.getCell(x, y) === 'hit') {
            return;
        }

        computerBoard.receiveAttack(x, y);

        //handle computer attack
        ({ x, y } = getRandomAttack());
        playerBoard.receiveAttack(x, y);

        updateGrids();

        //check if game is over
        if (playerBoard.isAllShipsSunk()) {
            alert('Computer wins. Refresh page to play again');
            gameover = true;
        } else if (computerBoard.isAllShipsSunk()) {
            alert('You win! Refresh page to play again');
            gameover = true;
        }
    }

    function placeRandomShips(board) {
        const shipLengths = [2, 3, 3, 4, 5];

        while (shipLengths.length > 0) {
            const length = shipLengths.pop();

            let x, y, direction;

            do {
                x = getRndInteger(0, GRID_SIZE - 1);
                y = getRndInteger(0, GRID_SIZE - 1);
                direction = getRndInteger(0, 2) === 0 ? 'row' : 'col';
            } while (!board.isValidPlacement(x, y, length, direction));

            board.addShip(x, y, length, direction);
        }
    }

    function updateGrids() {
        const playerCells = document.querySelectorAll('.player-grid .cell');
        const computerCells = document.querySelectorAll('.computer-grid .cell');

        let i = 0;
        for (const cell of playerCells) {
            const { x, y } = indexToCoords(i++);
            
            const gameCell = playerBoard.getCell(x, y);

            if (gameCell >= 0) {
                cell.classList.add('ship');
            } else if (gameCell === 'hit') {
                cell.classList.add('hit');
            } else if (gameCell === 'miss') {
                cell.classList.add('miss');
            }
        }

        i = 0;
        for (const cell of computerCells) {
            const { x, y } = indexToCoords(i++);
            
            const gameCell = computerBoard.getCell(x, y);

            if (gameCell === 'hit') {
                cell.classList.add('hit');
            } else if (gameCell === 'miss') {
                cell.classList.add('miss');
            }
        }
    }

    function getRandomAttack() {
        const attackOptions = [];

        for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
                const cell = playerBoard.getCell(i, j);

                if (!(cell === 'miss' || cell === 'hit')) {
                    attackOptions.push({x: i, y: j});
                }
            }
        }

        return attackOptions[getRndInteger(0, attackOptions.length)];
    }

    return {
        init,
    }
})();

export default gameboardPage;