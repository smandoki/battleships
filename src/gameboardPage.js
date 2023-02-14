import Gameboard from './gameboard';
import { GRID_SIZE, getRndInteger } from './util';

const gameboardPage = (function() {
    const root = document.getElementById('root');
    const computerBoard = new Gameboard();
    let playerBoard;

    const init = function (gameboard) {
        playerBoard = gameboard;
        root.innerHTML = '';

        placeRandomShips(computerBoard);

        const page = document.createElement('div');
        page.setAttribute('id', 'gameboardPage');

        //create player grid
        const playerGrid = document.createElement('div');
        playerGrid.classList.add('grid');

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
            cell.classList.add('cell');
            cell.addEventListener('click', attack);

            computerGrid.appendChild(cell);
        }
        page.appendChild(computerGrid);

        root.appendChild(page);
    }

    function attack(e) {
        //handle player attack

        //handle computer attack
    }

    function placeRandomShips(board) {
        const shipLengths = [2, 3, 3, 4, 5];

        while (shipLengths.length > 0) {
            const length = shipLengths.pop();

            let x, y, direction;

            do {
                x = getRndInteger(0, GRID_SIZE - 1);
                y = getRndInteger(0, GRID_SIZE - 1);
                direction = getRndInteger(0, 1) ? 'row' : 'col';
            } while (!board.isValidPlacement(x, y, length, direction));

            board.addShip(x, y, length, direction);
        }
    }

    function updateGrids() {

    }

    function getRandomAttack() {

    }

    return {
        init,
    }
})();

export default gameboardPage;