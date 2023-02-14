import { GRID_SIZE } from './util';
import Gameboard from './gameboard';

const shipPlacementPage = (function() {
    const shipLengths = [2, 3, 3, 4, 5];
    const instructionList = [
        'Place your carrier (length: 5)',
        'Place your battleship (length: 4)',
        'Place your cruiser (length: 3)',
        'Place your submarine (length: 3)',
        'Place your destroyer (length: 2)'
    ];
    const gameboard = new Gameboard();
    let axis = 'row';
    let shipLength = shipLengths.pop();

    const init = function (root) {
        const page = document.createElement('div');
        page.setAttribute('id', 'shipPlacementPage');

        //create user instruction header
        const instruction = document.createElement('h2');
        instruction.innerText = instructionList.shift();
        page.appendChild(instruction);

        //create button to change ship direction
        const changeAxisButton = document.createElement('button');
        changeAxisButton.innerText = 'Axis: row';
        changeAxisButton.addEventListener('click', changeAxis);
        page.append(changeAxisButton);

        //create grid used for placement of ships
        const grid = document.createElement('div');
        grid.classList.add('grid');

        grid.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 1fr)`;
        grid.style.gridTemplateRows = `repeat(${GRID_SIZE}, 1fr)`;

        //populate grid with cells
        for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            cell.addEventListener('mouseover', drawShipPlaceholder);

            grid.appendChild(cell);
        }
        page.appendChild(grid);

        root.appendChild(page);
    }

    function changeAxis(e) {
        axis = axis === 'row' ? 'col' : 'row';
        e.target.innerText = axis === 'row' ? 'Axis: row' : 'Axis: column';
    }

    function drawShipPlaceholder(e) {
        const index = e.target.dataset.index;
        const cells = document.querySelectorAll('.cell');

        for (const cell of cells) {
            cell.classList.remove('shipPlaceholder');
        }

        const { x, y } = indexToCoords(index);

        if (gameboard.isValidPlacement(x, y, shipLength, axis)) {
            addClassToCells(x, y, 'shipPlaceholder', axis, shipLength);
        }
    }

    function addClassToCells(x, y, className, direction, length) {
        const cells = document.querySelectorAll('.cell');

        for (let i = 0; i < length; i++) {
            let index;

            if (direction === 'row') {
                index = coordsToIndex(x + i, y);
            } else {
                index = coordsToIndex(x, y + i);
            }

            cells[index].classList.add(className);
        }
    }

    function indexToCoords(index) {
        return {
            y: Math.floor(index / GRID_SIZE),
            x: index % GRID_SIZE
        };
    }

    function coordsToIndex (x, y) {
        return y * GRID_SIZE + x;
    }

    return {
        init,
    }
})();

export default shipPlacementPage;