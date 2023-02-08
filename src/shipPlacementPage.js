import { GRID_SIZE } from './util';
import Gameboard from './gameboard';

const shipPlacementPage = (function() {
    const instructionList = [
        'Place your carrier (length: 5)',
        'Place your battleship (length: 4)',
        'Place your cruiser (length: 3)',
        'Place your submarine (length: 3)',
        'Place your destroyer (length: 2)'
    ];

    const gameboard = new Gameboard();

    const init = function (root) {
        const page = document.createElement('div');
        page.setAttribute('id', 'shipPlacementPage');

        //create user instruction header
        const instruction = document.createElement('h2');
        instruction.innerText = instructionList.shift();
        page.appendChild(instruction);

        //create grid used for placement of ships
        const grid = document.createElement('div');
        grid.classList.add('grid');

        for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            grid.appendChild(cell);
        }
        page.appendChild(grid);

        root.appendChild(page);
    }

    return {
        init,
    }
})();

export default shipPlacementPage;