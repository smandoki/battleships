/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/gameboard.js":
/*!**************************!*\
  !*** ./src/gameboard.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Gameboard)
/* harmony export */ });
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ship */ "./src/ship.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util */ "./src/util.js");



class Gameboard {
    #ships = {};
    #board;
    #autoIncId = 0;

    constructor() {
        this.#board = (0,_util__WEBPACK_IMPORTED_MODULE_1__.create2DArray)(_util__WEBPACK_IMPORTED_MODULE_1__.GRID_SIZE, _util__WEBPACK_IMPORTED_MODULE_1__.GRID_SIZE);
    }

    /**
     * Adds a new ship specified location
     * 
     * @param {number} x x-coordinate to place ship
     * @param {number} y y-coordinate to place ship
     * @param {number} length length of the ship to be placed
     * @param {string} direction direction of ship either 'row' or 'col'
     * @returns void
     */
    addShip(x, y, length, direction) {
        const ship = new _ship__WEBPACK_IMPORTED_MODULE_0__["default"](length);

        for (let i = 0; i < length; i++) {
            if (direction === 'row') {
                this.#board[x + i][y] = this.#autoIncId;
            } else {
                this.#board[x][y + i] = this.#autoIncId;
            }
        }

        this.#ships[this.#autoIncId++] = ship;
    }

    receiveAttack(x, y) {
        if (isNaN(this.#board[x][y])) {
            this.#board[x][y] = 'miss';
        } else {
            this.#ships[this.#board[x][y]].hit();
            this.#board[x][y] = 'hit';
        }
    }

    /**
     * Determines if a ship can be placed here
     * 
     * @param {number} x x-coordinate to place ship
     * @param {number} y y-coordinate to place ship
     * @param {number} length length of the ship to be placed
     * @param {string} direction direction of ship either 'row' or 'col'
     * @returns void
     */
    isValidPlacement(x, y, length, direction) {
        for (let i = 0; i < length; i++) {
            if (direction === 'row') {
                if (!this.#coordsIsValid(x + i, y)) return false;
            } else {
                if (!this.#coordsIsValid(x, y + i)) return false;
            }
        }

        return true;
    }

    #coordsIsValid(x, y) {
        return (
            x >= 0 && x < _util__WEBPACK_IMPORTED_MODULE_1__.GRID_SIZE && 
            y >= 0 && y < _util__WEBPACK_IMPORTED_MODULE_1__.GRID_SIZE && 
            this.#board[x][y] === undefined
        );
    }

    isAllShipsSunk() {
        if (Object.keys(this.#ships).length === 0) return false;

        for (const [key, value] of Object.entries(this.#ships)) {
            if (!value.isSunk()) return false;
        }

        return true;
    }

    getBoard() {
        return (0,_util__WEBPACK_IMPORTED_MODULE_1__.deepCloneArray)(this.#board);
    }

    getCell(x, y) {
        return this.#board[x][y];
    }
}

/***/ }),

/***/ "./src/gameboardPage.js":
/*!******************************!*\
  !*** ./src/gameboardPage.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameboard */ "./src/gameboard.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util */ "./src/util.js");



const gameboardPage = (function() {
    const root = document.getElementById('root');
    const computerBoard = new _gameboard__WEBPACK_IMPORTED_MODULE_0__["default"]();
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
        playerGrid.classList.add('player-grid');

        playerGrid.style.gridTemplateColumns = `repeat(${_util__WEBPACK_IMPORTED_MODULE_1__.GRID_SIZE}, 1fr)`;
        playerGrid.style.gridTemplateRows = `repeat(${_util__WEBPACK_IMPORTED_MODULE_1__.GRID_SIZE}, 1fr)`;

        //populate grid with cells
        for (let i = 0; i < _util__WEBPACK_IMPORTED_MODULE_1__.GRID_SIZE * _util__WEBPACK_IMPORTED_MODULE_1__.GRID_SIZE; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            playerGrid.appendChild(cell);
        }
        page.appendChild(playerGrid);

        //create computer grid
        const computerGrid = document.createElement('div');
        computerGrid.classList.add('grid');
        computerGrid.classList.add('computer-grid');

        computerGrid.style.gridTemplateColumns = `repeat(${_util__WEBPACK_IMPORTED_MODULE_1__.GRID_SIZE}, 1fr)`;
        computerGrid.style.gridTemplateRows = `repeat(${_util__WEBPACK_IMPORTED_MODULE_1__.GRID_SIZE}, 1fr)`;

        //populate grid with cells
        for (let i = 0; i < _util__WEBPACK_IMPORTED_MODULE_1__.GRID_SIZE * _util__WEBPACK_IMPORTED_MODULE_1__.GRID_SIZE; i++) {
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
        const index = e.target.dataset.index;
        let { x, y } = (0,_util__WEBPACK_IMPORTED_MODULE_1__.indexToCoords)(index);

        //handle player attack
        if (computerBoard.getCell(x, y) === 'miss' || computerBoard.getCell(x, y) === 'hit') {
            return;
        }

        computerBoard.receiveAttack(x, y);

        //handle computer attack
        ({ x, y } = getRandomAttack());
        playerBoard.receiveAttack(x, y);

        updateGrids();
    }

    function placeRandomShips(board) {
        const shipLengths = [2, 3, 3, 4, 5];

        while (shipLengths.length > 0) {
            const length = shipLengths.pop();

            let x, y, direction;

            do {
                x = (0,_util__WEBPACK_IMPORTED_MODULE_1__.getRndInteger)(0, _util__WEBPACK_IMPORTED_MODULE_1__.GRID_SIZE - 1);
                y = (0,_util__WEBPACK_IMPORTED_MODULE_1__.getRndInteger)(0, _util__WEBPACK_IMPORTED_MODULE_1__.GRID_SIZE - 1);
                direction = (0,_util__WEBPACK_IMPORTED_MODULE_1__.getRndInteger)(0, 2) === 0 ? 'row' : 'col';
            } while (!board.isValidPlacement(x, y, length, direction));

            board.addShip(x, y, length, direction);
        }
    }

    function updateGrids() {
        const playerCells = document.querySelectorAll('.player-grid .cell');
        const computerCells = document.querySelectorAll('.computer-grid .cell');

        let i = 0;
        for (const cell of playerCells) {
            const { x, y } = (0,_util__WEBPACK_IMPORTED_MODULE_1__.indexToCoords)(i++);
            
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
            const { x, y } = (0,_util__WEBPACK_IMPORTED_MODULE_1__.indexToCoords)(i++);
            
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

        for (let i = 0; i < _util__WEBPACK_IMPORTED_MODULE_1__.GRID_SIZE; i++) {
            for (let j = 0; j < _util__WEBPACK_IMPORTED_MODULE_1__.GRID_SIZE; j++) {
                const cell = playerBoard.getCell(i, j);

                if (!(cell === 'miss' || cell === 'hit')) {
                    attackOptions.push({x: i, y: j});
                }
            }
        }

        return attackOptions[(0,_util__WEBPACK_IMPORTED_MODULE_1__.getRndInteger)(0, attackOptions.length)];
    }

    return {
        init,
    }
})();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (gameboardPage);

/***/ }),

/***/ "./src/ship.js":
/*!*********************!*\
  !*** ./src/ship.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Ship)
/* harmony export */ });
class Ship {
    #hitCount = 0;
    #length;

    constructor(length) {
        this.#length = length;
    }

    hit() {
        if (!this.isSunk()) {
            this.#hitCount++;
        }
    }

    isSunk() {
        return this.#hitCount === this.#length;
    }

    getLength() {
        return this.#length;
    }

    getHitCount() {
        return this.#hitCount;
    }
}

/***/ }),

/***/ "./src/shipPlacementPage.js":
/*!**********************************!*\
  !*** ./src/shipPlacementPage.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "./src/util.js");
/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./gameboard */ "./src/gameboard.js");
/* harmony import */ var _gameboardPage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./gameboardPage */ "./src/gameboardPage.js");




const shipPlacementPage = (function() {
    const root = document.getElementById('root');
    const shipLengths = [2, 3, 3, 4, 5];
    const instructionList = [
        'Place your carrier (length: 5)',
        'Place your battleship (length: 4)',
        'Place your cruiser (length: 3)',
        'Place your submarine (length: 3)',
        'Place your destroyer (length: 2)'
    ];
    const gameboard = new _gameboard__WEBPACK_IMPORTED_MODULE_1__["default"]();
    let axis = 'row';
    let shipLength = shipLengths.pop();

    const init = function () {
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

        grid.style.gridTemplateColumns = `repeat(${_util__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE}, 1fr)`;
        grid.style.gridTemplateRows = `repeat(${_util__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE}, 1fr)`;

        //populate grid with cells
        for (let i = 0; i < _util__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE * _util__WEBPACK_IMPORTED_MODULE_0__.GRID_SIZE; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;

            cell.addEventListener('mouseover', drawShipPlaceholder);
            cell.addEventListener('click', placeShip);

            grid.appendChild(cell);
        }
        page.appendChild(grid);

        root.appendChild(page);
    }

    function changeAxis(e) {
        axis = axis === 'row' ? 'col' : 'row';
        e.target.innerText = axis === 'row' ? 'Axis: row' : 'Axis: column';
    }

    function placeShip(e) {
        const index = e.target.dataset.index;
        const { x, y } = (0,_util__WEBPACK_IMPORTED_MODULE_0__.indexToCoords)(index);

        if (gameboard.isValidPlacement(x, y, shipLength, axis)) {
            gameboard.addShip(x, y, shipLength, axis);
            addClassToCells(x, y, 'ship', axis, shipLength);

            if (instructionList.length != 0) {
                const instruction = document.querySelector('h2');
                instruction.innerText = instructionList.shift();

                shipLength = shipLengths.pop();
            } else {
                _gameboardPage__WEBPACK_IMPORTED_MODULE_2__["default"].init(gameboard);
            }
        }
    }

    function drawShipPlaceholder(e) {
        const index = e.target.dataset.index;
        const cells = document.querySelectorAll('.cell');

        for (const cell of cells) {
            cell.classList.remove('shipPlaceholder');
        }

        const { x, y } = (0,_util__WEBPACK_IMPORTED_MODULE_0__.indexToCoords)(index);

        if (gameboard.isValidPlacement(x, y, shipLength, axis)) {
            addClassToCells(x, y, 'shipPlaceholder', axis, shipLength);
        }
    }

    function addClassToCells(x, y, className, direction, length) {
        const cells = document.querySelectorAll('.cell');

        for (let i = 0; i < length; i++) {
            let index;

            if (direction === 'row') {
                index = (0,_util__WEBPACK_IMPORTED_MODULE_0__.coordsToIndex)(x + i, y);
            } else {
                index = (0,_util__WEBPACK_IMPORTED_MODULE_0__.coordsToIndex)(x, y + i);
            }

            cells[index].classList.add(className);
        }
    }

    return {
        init,
    }
})();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (shipPlacementPage);

/***/ }),

/***/ "./src/util.js":
/*!*********************!*\
  !*** ./src/util.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GRID_SIZE": () => (/* binding */ GRID_SIZE),
/* harmony export */   "coordsToIndex": () => (/* binding */ coordsToIndex),
/* harmony export */   "create2DArray": () => (/* binding */ create2DArray),
/* harmony export */   "deepCloneArray": () => (/* binding */ deepCloneArray),
/* harmony export */   "getRndInteger": () => (/* binding */ getRndInteger),
/* harmony export */   "indexToCoords": () => (/* binding */ indexToCoords)
/* harmony export */ });
//Place to store general utility functions and constants
const GRID_SIZE = 7;

function create2DArray(x, y) {
    const arr = new Array(x);

    for (let i = 0; i < x; i++) {
        arr[i] = new Array(y);
    }

    return arr;
}

function deepCloneArray(arr) {
    const clone = [];

    arr.forEach(arrItem => {
        if (Array.isArray(arrItem)) {
            clone.push(deepCloneArray(arrItem));
        } else {
            clone.push(arrItem);
        }
    });

    return clone;
}

/**
 * returns a random number between min (included) and max (excluded)
 * 
 * @param {number} min min (included)
 * @param {number} max max (excluded)
 * @returns integer
 */
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function coordsToIndex (x, y) {
    return y * GRID_SIZE + x;
}

function indexToCoords(index) {
    return {
        y: Math.floor(index / GRID_SIZE),
        x: index % GRID_SIZE
    };
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _shipPlacementPage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shipPlacementPage */ "./src/shipPlacementPage.js");


_shipPlacementPage__WEBPACK_IMPORTED_MODULE_0__["default"].init();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixZQUFZO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixvREFBYTtBQUNyQyxjQUFjO0FBQ2Qsd0JBQXdCLG9EQUFhO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBLGlFQUFlLGlCQUFpQjs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3BIaEM7QUFDTztBQUNQO0FBQ087QUFDUDtBQUNBO0FBQ0Esb0JBQW9CLE9BQU87QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7VUMvQ0E7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ05vRDtBQUNwRDtBQUNBLCtEQUFzQixHIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvLi9zcmMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBzLy4vc3JjL2dhbWVib2FyZFBhZ2UuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvLi9zcmMvc2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy8uL3NyYy9zaGlwUGxhY2VtZW50UGFnZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy8uL3NyYy91dGlsLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXBzL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXBzL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNoaXAgZnJvbSAnLi9zaGlwJztcclxuaW1wb3J0IHsgY3JlYXRlMkRBcnJheSwgZGVlcENsb25lQXJyYXksIEdSSURfU0laRSB9IGZyb20gJy4vdXRpbCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lYm9hcmQge1xyXG4gICAgI3NoaXBzID0ge307XHJcbiAgICAjYm9hcmQ7XHJcbiAgICAjYXV0b0luY0lkID0gMDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLiNib2FyZCA9IGNyZWF0ZTJEQXJyYXkoR1JJRF9TSVpFLCBHUklEX1NJWkUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyBhIG5ldyBzaGlwIHNwZWNpZmllZCBsb2NhdGlvblxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCB4LWNvb3JkaW5hdGUgdG8gcGxhY2Ugc2hpcFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkgeS1jb29yZGluYXRlIHRvIHBsYWNlIHNoaXBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZW5ndGggbGVuZ3RoIG9mIHRoZSBzaGlwIHRvIGJlIHBsYWNlZFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGRpcmVjdGlvbiBkaXJlY3Rpb24gb2Ygc2hpcCBlaXRoZXIgJ3Jvdycgb3IgJ2NvbCdcclxuICAgICAqIEByZXR1cm5zIHZvaWRcclxuICAgICAqL1xyXG4gICAgYWRkU2hpcCh4LCB5LCBsZW5ndGgsIGRpcmVjdGlvbikge1xyXG4gICAgICAgIGNvbnN0IHNoaXAgPSBuZXcgU2hpcChsZW5ndGgpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChkaXJlY3Rpb24gPT09ICdyb3cnKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiNib2FyZFt4ICsgaV1beV0gPSB0aGlzLiNhdXRvSW5jSWQ7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiNib2FyZFt4XVt5ICsgaV0gPSB0aGlzLiNhdXRvSW5jSWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuI3NoaXBzW3RoaXMuI2F1dG9JbmNJZCsrXSA9IHNoaXA7XHJcbiAgICB9XHJcblxyXG4gICAgcmVjZWl2ZUF0dGFjayh4LCB5KSB7XHJcbiAgICAgICAgaWYgKGlzTmFOKHRoaXMuI2JvYXJkW3hdW3ldKSkge1xyXG4gICAgICAgICAgICB0aGlzLiNib2FyZFt4XVt5XSA9ICdtaXNzJztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLiNzaGlwc1t0aGlzLiNib2FyZFt4XVt5XV0uaGl0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuI2JvYXJkW3hdW3ldID0gJ2hpdCc7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGV0ZXJtaW5lcyBpZiBhIHNoaXAgY2FuIGJlIHBsYWNlZCBoZXJlXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IHgtY29vcmRpbmF0ZSB0byBwbGFjZSBzaGlwXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geSB5LWNvb3JkaW5hdGUgdG8gcGxhY2Ugc2hpcFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxlbmd0aCBsZW5ndGggb2YgdGhlIHNoaXAgdG8gYmUgcGxhY2VkXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZGlyZWN0aW9uIGRpcmVjdGlvbiBvZiBzaGlwIGVpdGhlciAncm93JyBvciAnY29sJ1xyXG4gICAgICogQHJldHVybnMgdm9pZFxyXG4gICAgICovXHJcbiAgICBpc1ZhbGlkUGxhY2VtZW50KHgsIHksIGxlbmd0aCwgZGlyZWN0aW9uKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoZGlyZWN0aW9uID09PSAncm93Jykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLiNjb29yZHNJc1ZhbGlkKHggKyBpLCB5KSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLiNjb29yZHNJc1ZhbGlkKHgsIHkgKyBpKSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAjY29vcmRzSXNWYWxpZCh4LCB5KSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgeCA+PSAwICYmIHggPCBHUklEX1NJWkUgJiYgXHJcbiAgICAgICAgICAgIHkgPj0gMCAmJiB5IDwgR1JJRF9TSVpFICYmIFxyXG4gICAgICAgICAgICB0aGlzLiNib2FyZFt4XVt5XSA9PT0gdW5kZWZpbmVkXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBpc0FsbFNoaXBzU3VuaygpIHtcclxuICAgICAgICBpZiAoT2JqZWN0LmtleXModGhpcy4jc2hpcHMpLmxlbmd0aCA9PT0gMCkgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyh0aGlzLiNzaGlwcykpIHtcclxuICAgICAgICAgICAgaWYgKCF2YWx1ZS5pc1N1bmsoKSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Qm9hcmQoKSB7XHJcbiAgICAgICAgcmV0dXJuIGRlZXBDbG9uZUFycmF5KHRoaXMuI2JvYXJkKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRDZWxsKHgsIHkpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy4jYm9hcmRbeF1beV07XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgR2FtZWJvYXJkIGZyb20gJy4vZ2FtZWJvYXJkJztcclxuaW1wb3J0IHsgR1JJRF9TSVpFLCBnZXRSbmRJbnRlZ2VyLCBjb29yZHNUb0luZGV4LCBpbmRleFRvQ29vcmRzIH0gZnJvbSAnLi91dGlsJztcclxuXHJcbmNvbnN0IGdhbWVib2FyZFBhZ2UgPSAoZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zdCByb290ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKTtcclxuICAgIGNvbnN0IGNvbXB1dGVyQm9hcmQgPSBuZXcgR2FtZWJvYXJkKCk7XHJcbiAgICBsZXQgcGxheWVyQm9hcmQ7XHJcblxyXG4gICAgY29uc3QgaW5pdCA9IGZ1bmN0aW9uIChnYW1lYm9hcmQpIHtcclxuICAgICAgICBwbGF5ZXJCb2FyZCA9IGdhbWVib2FyZDtcclxuICAgICAgICByb290LmlubmVySFRNTCA9ICcnO1xyXG5cclxuICAgICAgICBwbGFjZVJhbmRvbVNoaXBzKGNvbXB1dGVyQm9hcmQpO1xyXG5cclxuICAgICAgICBjb25zdCBwYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgcGFnZS5zZXRBdHRyaWJ1dGUoJ2lkJywgJ2dhbWVib2FyZFBhZ2UnKTtcclxuXHJcbiAgICAgICAgLy9jcmVhdGUgcGxheWVyIGdyaWRcclxuICAgICAgICBjb25zdCBwbGF5ZXJHcmlkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgcGxheWVyR3JpZC5jbGFzc0xpc3QuYWRkKCdncmlkJyk7XHJcbiAgICAgICAgcGxheWVyR3JpZC5jbGFzc0xpc3QuYWRkKCdwbGF5ZXItZ3JpZCcpO1xyXG5cclxuICAgICAgICBwbGF5ZXJHcmlkLnN0eWxlLmdyaWRUZW1wbGF0ZUNvbHVtbnMgPSBgcmVwZWF0KCR7R1JJRF9TSVpFfSwgMWZyKWA7XHJcbiAgICAgICAgcGxheWVyR3JpZC5zdHlsZS5ncmlkVGVtcGxhdGVSb3dzID0gYHJlcGVhdCgke0dSSURfU0laRX0sIDFmcilgO1xyXG5cclxuICAgICAgICAvL3BvcHVsYXRlIGdyaWQgd2l0aCBjZWxsc1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgR1JJRF9TSVpFICogR1JJRF9TSVpFOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgY2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoJ2NlbGwnKTtcclxuICAgICAgICAgICAgcGxheWVyR3JpZC5hcHBlbmRDaGlsZChjZWxsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcGFnZS5hcHBlbmRDaGlsZChwbGF5ZXJHcmlkKTtcclxuXHJcbiAgICAgICAgLy9jcmVhdGUgY29tcHV0ZXIgZ3JpZFxyXG4gICAgICAgIGNvbnN0IGNvbXB1dGVyR3JpZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGNvbXB1dGVyR3JpZC5jbGFzc0xpc3QuYWRkKCdncmlkJyk7XHJcbiAgICAgICAgY29tcHV0ZXJHcmlkLmNsYXNzTGlzdC5hZGQoJ2NvbXB1dGVyLWdyaWQnKTtcclxuXHJcbiAgICAgICAgY29tcHV0ZXJHcmlkLnN0eWxlLmdyaWRUZW1wbGF0ZUNvbHVtbnMgPSBgcmVwZWF0KCR7R1JJRF9TSVpFfSwgMWZyKWA7XHJcbiAgICAgICAgY29tcHV0ZXJHcmlkLnN0eWxlLmdyaWRUZW1wbGF0ZVJvd3MgPSBgcmVwZWF0KCR7R1JJRF9TSVpFfSwgMWZyKWA7XHJcblxyXG4gICAgICAgIC8vcG9wdWxhdGUgZ3JpZCB3aXRoIGNlbGxzXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBHUklEX1NJWkUgKiBHUklEX1NJWkU7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBjZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgIGNlbGwuZGF0YXNldC5pbmRleCA9IGk7XHJcbiAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZCgnY2VsbCcpO1xyXG4gICAgICAgICAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXR0YWNrKTtcclxuXHJcbiAgICAgICAgICAgIGNvbXB1dGVyR3JpZC5hcHBlbmRDaGlsZChjZWxsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcGFnZS5hcHBlbmRDaGlsZChjb21wdXRlckdyaWQpO1xyXG4gICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQocGFnZSk7XHJcblxyXG4gICAgICAgIHVwZGF0ZUdyaWRzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYXR0YWNrKGUpIHtcclxuICAgICAgICBjb25zdCBpbmRleCA9IGUudGFyZ2V0LmRhdGFzZXQuaW5kZXg7XHJcbiAgICAgICAgbGV0IHsgeCwgeSB9ID0gaW5kZXhUb0Nvb3JkcyhpbmRleCk7XHJcblxyXG4gICAgICAgIC8vaGFuZGxlIHBsYXllciBhdHRhY2tcclxuICAgICAgICBpZiAoY29tcHV0ZXJCb2FyZC5nZXRDZWxsKHgsIHkpID09PSAnbWlzcycgfHwgY29tcHV0ZXJCb2FyZC5nZXRDZWxsKHgsIHkpID09PSAnaGl0Jykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb21wdXRlckJvYXJkLnJlY2VpdmVBdHRhY2soeCwgeSk7XHJcblxyXG4gICAgICAgIC8vaGFuZGxlIGNvbXB1dGVyIGF0dGFja1xyXG4gICAgICAgICh7IHgsIHkgfSA9IGdldFJhbmRvbUF0dGFjaygpKTtcclxuICAgICAgICBwbGF5ZXJCb2FyZC5yZWNlaXZlQXR0YWNrKHgsIHkpO1xyXG5cclxuICAgICAgICB1cGRhdGVHcmlkcygpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHBsYWNlUmFuZG9tU2hpcHMoYm9hcmQpIHtcclxuICAgICAgICBjb25zdCBzaGlwTGVuZ3RocyA9IFsyLCAzLCAzLCA0LCA1XTtcclxuXHJcbiAgICAgICAgd2hpbGUgKHNoaXBMZW5ndGhzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgY29uc3QgbGVuZ3RoID0gc2hpcExlbmd0aHMucG9wKCk7XHJcblxyXG4gICAgICAgICAgICBsZXQgeCwgeSwgZGlyZWN0aW9uO1xyXG5cclxuICAgICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICAgICAgeCA9IGdldFJuZEludGVnZXIoMCwgR1JJRF9TSVpFIC0gMSk7XHJcbiAgICAgICAgICAgICAgICB5ID0gZ2V0Um5kSW50ZWdlcigwLCBHUklEX1NJWkUgLSAxKTtcclxuICAgICAgICAgICAgICAgIGRpcmVjdGlvbiA9IGdldFJuZEludGVnZXIoMCwgMikgPT09IDAgPyAncm93JyA6ICdjb2wnO1xyXG4gICAgICAgICAgICB9IHdoaWxlICghYm9hcmQuaXNWYWxpZFBsYWNlbWVudCh4LCB5LCBsZW5ndGgsIGRpcmVjdGlvbikpO1xyXG5cclxuICAgICAgICAgICAgYm9hcmQuYWRkU2hpcCh4LCB5LCBsZW5ndGgsIGRpcmVjdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHVwZGF0ZUdyaWRzKCkge1xyXG4gICAgICAgIGNvbnN0IHBsYXllckNlbGxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBsYXllci1ncmlkIC5jZWxsJyk7XHJcbiAgICAgICAgY29uc3QgY29tcHV0ZXJDZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jb21wdXRlci1ncmlkIC5jZWxsJyk7XHJcblxyXG4gICAgICAgIGxldCBpID0gMDtcclxuICAgICAgICBmb3IgKGNvbnN0IGNlbGwgb2YgcGxheWVyQ2VsbHMpIHtcclxuICAgICAgICAgICAgY29uc3QgeyB4LCB5IH0gPSBpbmRleFRvQ29vcmRzKGkrKyk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBnYW1lQ2VsbCA9IHBsYXllckJvYXJkLmdldENlbGwoeCwgeSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZ2FtZUNlbGwgPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKCdzaGlwJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZ2FtZUNlbGwgPT09ICdoaXQnKSB7XHJcbiAgICAgICAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoJ2hpdCcpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGdhbWVDZWxsID09PSAnbWlzcycpIHtcclxuICAgICAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZCgnbWlzcycpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpID0gMDtcclxuICAgICAgICBmb3IgKGNvbnN0IGNlbGwgb2YgY29tcHV0ZXJDZWxscykge1xyXG4gICAgICAgICAgICBjb25zdCB7IHgsIHkgfSA9IGluZGV4VG9Db29yZHMoaSsrKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IGdhbWVDZWxsID0gY29tcHV0ZXJCb2FyZC5nZXRDZWxsKHgsIHkpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGdhbWVDZWxsID09PSAnaGl0Jykge1xyXG4gICAgICAgICAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKCdoaXQnKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChnYW1lQ2VsbCA9PT0gJ21pc3MnKSB7XHJcbiAgICAgICAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoJ21pc3MnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRSYW5kb21BdHRhY2soKSB7XHJcbiAgICAgICAgY29uc3QgYXR0YWNrT3B0aW9ucyA9IFtdO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IEdSSURfU0laRTsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgR1JJRF9TSVpFOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNlbGwgPSBwbGF5ZXJCb2FyZC5nZXRDZWxsKGksIGopO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICghKGNlbGwgPT09ICdtaXNzJyB8fCBjZWxsID09PSAnaGl0JykpIHtcclxuICAgICAgICAgICAgICAgICAgICBhdHRhY2tPcHRpb25zLnB1c2goe3g6IGksIHk6IGp9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGF0dGFja09wdGlvbnNbZ2V0Um5kSW50ZWdlcigwLCBhdHRhY2tPcHRpb25zLmxlbmd0aCldO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5pdCxcclxuICAgIH1cclxufSkoKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGdhbWVib2FyZFBhZ2U7IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2hpcCB7XHJcbiAgICAjaGl0Q291bnQgPSAwO1xyXG4gICAgI2xlbmd0aDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihsZW5ndGgpIHtcclxuICAgICAgICB0aGlzLiNsZW5ndGggPSBsZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgaGl0KCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pc1N1bmsoKSkge1xyXG4gICAgICAgICAgICB0aGlzLiNoaXRDb3VudCsrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpc1N1bmsoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuI2hpdENvdW50ID09PSB0aGlzLiNsZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TGVuZ3RoKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLiNsZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0SGl0Q291bnQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuI2hpdENvdW50O1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgR1JJRF9TSVpFLCBjb29yZHNUb0luZGV4LCBpbmRleFRvQ29vcmRzIH0gZnJvbSAnLi91dGlsJztcclxuaW1wb3J0IEdhbWVib2FyZCBmcm9tICcuL2dhbWVib2FyZCc7XHJcbmltcG9ydCBnYW1lYm9hcmRQYWdlIGZyb20gJy4vZ2FtZWJvYXJkUGFnZSc7XHJcblxyXG5jb25zdCBzaGlwUGxhY2VtZW50UGFnZSA9IChmdW5jdGlvbigpIHtcclxuICAgIGNvbnN0IHJvb3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9vdCcpO1xyXG4gICAgY29uc3Qgc2hpcExlbmd0aHMgPSBbMiwgMywgMywgNCwgNV07XHJcbiAgICBjb25zdCBpbnN0cnVjdGlvbkxpc3QgPSBbXHJcbiAgICAgICAgJ1BsYWNlIHlvdXIgY2FycmllciAobGVuZ3RoOiA1KScsXHJcbiAgICAgICAgJ1BsYWNlIHlvdXIgYmF0dGxlc2hpcCAobGVuZ3RoOiA0KScsXHJcbiAgICAgICAgJ1BsYWNlIHlvdXIgY3J1aXNlciAobGVuZ3RoOiAzKScsXHJcbiAgICAgICAgJ1BsYWNlIHlvdXIgc3VibWFyaW5lIChsZW5ndGg6IDMpJyxcclxuICAgICAgICAnUGxhY2UgeW91ciBkZXN0cm95ZXIgKGxlbmd0aDogMiknXHJcbiAgICBdO1xyXG4gICAgY29uc3QgZ2FtZWJvYXJkID0gbmV3IEdhbWVib2FyZCgpO1xyXG4gICAgbGV0IGF4aXMgPSAncm93JztcclxuICAgIGxldCBzaGlwTGVuZ3RoID0gc2hpcExlbmd0aHMucG9wKCk7XHJcblxyXG4gICAgY29uc3QgaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBjb25zdCBwYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgcGFnZS5zZXRBdHRyaWJ1dGUoJ2lkJywgJ3NoaXBQbGFjZW1lbnRQYWdlJyk7XHJcblxyXG4gICAgICAgIC8vY3JlYXRlIHVzZXIgaW5zdHJ1Y3Rpb24gaGVhZGVyXHJcbiAgICAgICAgY29uc3QgaW5zdHJ1Y3Rpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpO1xyXG4gICAgICAgIGluc3RydWN0aW9uLmlubmVyVGV4dCA9IGluc3RydWN0aW9uTGlzdC5zaGlmdCgpO1xyXG4gICAgICAgIHBhZ2UuYXBwZW5kQ2hpbGQoaW5zdHJ1Y3Rpb24pO1xyXG5cclxuICAgICAgICAvL2NyZWF0ZSBidXR0b24gdG8gY2hhbmdlIHNoaXAgZGlyZWN0aW9uXHJcbiAgICAgICAgY29uc3QgY2hhbmdlQXhpc0J1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gICAgICAgIGNoYW5nZUF4aXNCdXR0b24uaW5uZXJUZXh0ID0gJ0F4aXM6IHJvdyc7XHJcbiAgICAgICAgY2hhbmdlQXhpc0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNoYW5nZUF4aXMpO1xyXG4gICAgICAgIHBhZ2UuYXBwZW5kKGNoYW5nZUF4aXNCdXR0b24pO1xyXG5cclxuICAgICAgICAvL2NyZWF0ZSBncmlkIHVzZWQgZm9yIHBsYWNlbWVudCBvZiBzaGlwc1xyXG4gICAgICAgIGNvbnN0IGdyaWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBncmlkLmNsYXNzTGlzdC5hZGQoJ2dyaWQnKTtcclxuXHJcbiAgICAgICAgZ3JpZC5zdHlsZS5ncmlkVGVtcGxhdGVDb2x1bW5zID0gYHJlcGVhdCgke0dSSURfU0laRX0sIDFmcilgO1xyXG4gICAgICAgIGdyaWQuc3R5bGUuZ3JpZFRlbXBsYXRlUm93cyA9IGByZXBlYXQoJHtHUklEX1NJWkV9LCAxZnIpYDtcclxuXHJcbiAgICAgICAgLy9wb3B1bGF0ZSBncmlkIHdpdGggY2VsbHNcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IEdSSURfU0laRSAqIEdSSURfU0laRTsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKCdjZWxsJyk7XHJcbiAgICAgICAgICAgIGNlbGwuZGF0YXNldC5pbmRleCA9IGk7XHJcblxyXG4gICAgICAgICAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIGRyYXdTaGlwUGxhY2Vob2xkZXIpO1xyXG4gICAgICAgICAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcGxhY2VTaGlwKTtcclxuXHJcbiAgICAgICAgICAgIGdyaWQuYXBwZW5kQ2hpbGQoY2VsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBhZ2UuYXBwZW5kQ2hpbGQoZ3JpZCk7XHJcblxyXG4gICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQocGFnZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY2hhbmdlQXhpcyhlKSB7XHJcbiAgICAgICAgYXhpcyA9IGF4aXMgPT09ICdyb3cnID8gJ2NvbCcgOiAncm93JztcclxuICAgICAgICBlLnRhcmdldC5pbm5lclRleHQgPSBheGlzID09PSAncm93JyA/ICdBeGlzOiByb3cnIDogJ0F4aXM6IGNvbHVtbic7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcGxhY2VTaGlwKGUpIHtcclxuICAgICAgICBjb25zdCBpbmRleCA9IGUudGFyZ2V0LmRhdGFzZXQuaW5kZXg7XHJcbiAgICAgICAgY29uc3QgeyB4LCB5IH0gPSBpbmRleFRvQ29vcmRzKGluZGV4KTtcclxuXHJcbiAgICAgICAgaWYgKGdhbWVib2FyZC5pc1ZhbGlkUGxhY2VtZW50KHgsIHksIHNoaXBMZW5ndGgsIGF4aXMpKSB7XHJcbiAgICAgICAgICAgIGdhbWVib2FyZC5hZGRTaGlwKHgsIHksIHNoaXBMZW5ndGgsIGF4aXMpO1xyXG4gICAgICAgICAgICBhZGRDbGFzc1RvQ2VsbHMoeCwgeSwgJ3NoaXAnLCBheGlzLCBzaGlwTGVuZ3RoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChpbnN0cnVjdGlvbkxpc3QubGVuZ3RoICE9IDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGluc3RydWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaDInKTtcclxuICAgICAgICAgICAgICAgIGluc3RydWN0aW9uLmlubmVyVGV4dCA9IGluc3RydWN0aW9uTGlzdC5zaGlmdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHNoaXBMZW5ndGggPSBzaGlwTGVuZ3Rocy5wb3AoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGdhbWVib2FyZFBhZ2UuaW5pdChnYW1lYm9hcmQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGRyYXdTaGlwUGxhY2Vob2xkZXIoZSkge1xyXG4gICAgICAgIGNvbnN0IGluZGV4ID0gZS50YXJnZXQuZGF0YXNldC5pbmRleDtcclxuICAgICAgICBjb25zdCBjZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jZWxsJyk7XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgY2VsbCBvZiBjZWxscykge1xyXG4gICAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5yZW1vdmUoJ3NoaXBQbGFjZWhvbGRlcicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgeyB4LCB5IH0gPSBpbmRleFRvQ29vcmRzKGluZGV4KTtcclxuXHJcbiAgICAgICAgaWYgKGdhbWVib2FyZC5pc1ZhbGlkUGxhY2VtZW50KHgsIHksIHNoaXBMZW5ndGgsIGF4aXMpKSB7XHJcbiAgICAgICAgICAgIGFkZENsYXNzVG9DZWxscyh4LCB5LCAnc2hpcFBsYWNlaG9sZGVyJywgYXhpcywgc2hpcExlbmd0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGFkZENsYXNzVG9DZWxscyh4LCB5LCBjbGFzc05hbWUsIGRpcmVjdGlvbiwgbGVuZ3RoKSB7XHJcbiAgICAgICAgY29uc3QgY2VsbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY2VsbCcpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBpbmRleDtcclxuXHJcbiAgICAgICAgICAgIGlmIChkaXJlY3Rpb24gPT09ICdyb3cnKSB7XHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IGNvb3Jkc1RvSW5kZXgoeCArIGksIHkpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaW5kZXggPSBjb29yZHNUb0luZGV4KHgsIHkgKyBpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY2VsbHNbaW5kZXhdLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpbml0LFxyXG4gICAgfVxyXG59KSgpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgc2hpcFBsYWNlbWVudFBhZ2U7IiwiLy9QbGFjZSB0byBzdG9yZSBnZW5lcmFsIHV0aWxpdHkgZnVuY3Rpb25zIGFuZCBjb25zdGFudHNcclxuZXhwb3J0IGNvbnN0IEdSSURfU0laRSA9IDc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlMkRBcnJheSh4LCB5KSB7XHJcbiAgICBjb25zdCBhcnIgPSBuZXcgQXJyYXkoeCk7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB4OyBpKyspIHtcclxuICAgICAgICBhcnJbaV0gPSBuZXcgQXJyYXkoeSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGFycjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRlZXBDbG9uZUFycmF5KGFycikge1xyXG4gICAgY29uc3QgY2xvbmUgPSBbXTtcclxuXHJcbiAgICBhcnIuZm9yRWFjaChhcnJJdGVtID0+IHtcclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShhcnJJdGVtKSkge1xyXG4gICAgICAgICAgICBjbG9uZS5wdXNoKGRlZXBDbG9uZUFycmF5KGFyckl0ZW0pKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjbG9uZS5wdXNoKGFyckl0ZW0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBjbG9uZTtcclxufVxyXG5cclxuLyoqXHJcbiAqIHJldHVybnMgYSByYW5kb20gbnVtYmVyIGJldHdlZW4gbWluIChpbmNsdWRlZCkgYW5kIG1heCAoZXhjbHVkZWQpXHJcbiAqIFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbWluIG1pbiAoaW5jbHVkZWQpXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtYXggbWF4IChleGNsdWRlZClcclxuICogQHJldHVybnMgaW50ZWdlclxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFJuZEludGVnZXIobWluLCBtYXgpIHtcclxuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSkgKyBtaW47XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjb29yZHNUb0luZGV4ICh4LCB5KSB7XHJcbiAgICByZXR1cm4geSAqIEdSSURfU0laRSArIHg7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpbmRleFRvQ29vcmRzKGluZGV4KSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHk6IE1hdGguZmxvb3IoaW5kZXggLyBHUklEX1NJWkUpLFxyXG4gICAgICAgIHg6IGluZGV4ICUgR1JJRF9TSVpFXHJcbiAgICB9O1xyXG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgc2hpcFBsYWNlbWVudFBhZ2UgZnJvbSBcIi4vc2hpcFBsYWNlbWVudFBhZ2VcIjtcclxuXHJcbnNoaXBQbGFjZW1lbnRQYWdlLmluaXQoKTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=