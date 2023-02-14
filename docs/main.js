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
        if (gameover) return;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBLGdCQUFnQixPQUFPLEVBQUUsb0RBQWE7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLFlBQVk7QUFDcEM7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLG9EQUFhO0FBQ3JDLGNBQWM7QUFDZCx3QkFBd0Isb0RBQWE7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0EsaUVBQWUsaUJBQWlCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcEhoQztBQUNPO0FBQ1A7QUFDTztBQUNQO0FBQ0E7QUFDQSxvQkFBb0IsT0FBTztBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLFFBQVE7QUFDbkI7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztVQy9DQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7O0FDTm9EO0FBQ3BEO0FBQ0EsK0RBQXNCLEciLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy8uL3NyYy9nYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvLi9zcmMvZ2FtZWJvYXJkUGFnZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy8uL3NyYy9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBzLy4vc3JjL3NoaXBQbGFjZW1lbnRQYWdlLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBzLy4vc3JjL3V0aWwuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXBzL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2hpcCBmcm9tICcuL3NoaXAnO1xyXG5pbXBvcnQgeyBjcmVhdGUyREFycmF5LCBkZWVwQ2xvbmVBcnJheSwgR1JJRF9TSVpFIH0gZnJvbSAnLi91dGlsJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVib2FyZCB7XHJcbiAgICAjc2hpcHMgPSB7fTtcclxuICAgICNib2FyZDtcclxuICAgICNhdXRvSW5jSWQgPSAwO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuI2JvYXJkID0gY3JlYXRlMkRBcnJheShHUklEX1NJWkUsIEdSSURfU0laRSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIGEgbmV3IHNoaXAgc3BlY2lmaWVkIGxvY2F0aW9uXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IHgtY29vcmRpbmF0ZSB0byBwbGFjZSBzaGlwXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geSB5LWNvb3JkaW5hdGUgdG8gcGxhY2Ugc2hpcFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxlbmd0aCBsZW5ndGggb2YgdGhlIHNoaXAgdG8gYmUgcGxhY2VkXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZGlyZWN0aW9uIGRpcmVjdGlvbiBvZiBzaGlwIGVpdGhlciAncm93JyBvciAnY29sJ1xyXG4gICAgICogQHJldHVybnMgdm9pZFxyXG4gICAgICovXHJcbiAgICBhZGRTaGlwKHgsIHksIGxlbmd0aCwgZGlyZWN0aW9uKSB7XHJcbiAgICAgICAgY29uc3Qgc2hpcCA9IG5ldyBTaGlwKGxlbmd0aCk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gJ3JvdycpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuI2JvYXJkW3ggKyBpXVt5XSA9IHRoaXMuI2F1dG9JbmNJZDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuI2JvYXJkW3hdW3kgKyBpXSA9IHRoaXMuI2F1dG9JbmNJZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy4jc2hpcHNbdGhpcy4jYXV0b0luY0lkKytdID0gc2hpcDtcclxuICAgIH1cclxuXHJcbiAgICByZWNlaXZlQXR0YWNrKHgsIHkpIHtcclxuICAgICAgICBpZiAoaXNOYU4odGhpcy4jYm9hcmRbeF1beV0pKSB7XHJcbiAgICAgICAgICAgIHRoaXMuI2JvYXJkW3hdW3ldID0gJ21pc3MnO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuI3NoaXBzW3RoaXMuI2JvYXJkW3hdW3ldXS5oaXQoKTtcclxuICAgICAgICAgICAgdGhpcy4jYm9hcmRbeF1beV0gPSAnaGl0JztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEZXRlcm1pbmVzIGlmIGEgc2hpcCBjYW4gYmUgcGxhY2VkIGhlcmVcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggeC1jb29yZGluYXRlIHRvIHBsYWNlIHNoaXBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5IHktY29vcmRpbmF0ZSB0byBwbGFjZSBzaGlwXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbGVuZ3RoIGxlbmd0aCBvZiB0aGUgc2hpcCB0byBiZSBwbGFjZWRcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBkaXJlY3Rpb24gZGlyZWN0aW9uIG9mIHNoaXAgZWl0aGVyICdyb3cnIG9yICdjb2wnXHJcbiAgICAgKiBAcmV0dXJucyB2b2lkXHJcbiAgICAgKi9cclxuICAgIGlzVmFsaWRQbGFjZW1lbnQoeCwgeSwgbGVuZ3RoLCBkaXJlY3Rpb24pIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChkaXJlY3Rpb24gPT09ICdyb3cnKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuI2Nvb3Jkc0lzVmFsaWQoeCArIGksIHkpKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuI2Nvb3Jkc0lzVmFsaWQoeCwgeSArIGkpKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgICNjb29yZHNJc1ZhbGlkKHgsIHkpIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICB4ID49IDAgJiYgeCA8IEdSSURfU0laRSAmJiBcclxuICAgICAgICAgICAgeSA+PSAwICYmIHkgPCBHUklEX1NJWkUgJiYgXHJcbiAgICAgICAgICAgIHRoaXMuI2JvYXJkW3hdW3ldID09PSB1bmRlZmluZWRcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIGlzQWxsU2hpcHNTdW5rKCkge1xyXG4gICAgICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLiNzaGlwcykubGVuZ3RoID09PSAwKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHRoaXMuI3NoaXBzKSkge1xyXG4gICAgICAgICAgICBpZiAoIXZhbHVlLmlzU3VuaygpKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRCb2FyZCgpIHtcclxuICAgICAgICByZXR1cm4gZGVlcENsb25lQXJyYXkodGhpcy4jYm9hcmQpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldENlbGwoeCwgeSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLiNib2FyZFt4XVt5XTtcclxuICAgIH1cclxufSIsImltcG9ydCBHYW1lYm9hcmQgZnJvbSAnLi9nYW1lYm9hcmQnO1xyXG5pbXBvcnQgeyBHUklEX1NJWkUsIGdldFJuZEludGVnZXIsIGNvb3Jkc1RvSW5kZXgsIGluZGV4VG9Db29yZHMgfSBmcm9tICcuL3V0aWwnO1xyXG5cclxuY29uc3QgZ2FtZWJvYXJkUGFnZSA9IChmdW5jdGlvbigpIHtcclxuICAgIGNvbnN0IHJvb3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9vdCcpO1xyXG4gICAgY29uc3QgY29tcHV0ZXJCb2FyZCA9IG5ldyBHYW1lYm9hcmQoKTtcclxuICAgIGxldCBwbGF5ZXJCb2FyZDtcclxuICAgIGxldCBnYW1lb3ZlciA9IGZhbHNlO1xyXG5cclxuICAgIGNvbnN0IGluaXQgPSBmdW5jdGlvbiAoZ2FtZWJvYXJkKSB7XHJcbiAgICAgICAgcGxheWVyQm9hcmQgPSBnYW1lYm9hcmQ7XHJcbiAgICAgICAgcm9vdC5pbm5lckhUTUwgPSAnJztcclxuXHJcbiAgICAgICAgcGxhY2VSYW5kb21TaGlwcyhjb21wdXRlckJvYXJkKTtcclxuXHJcbiAgICAgICAgY29uc3QgcGFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHBhZ2Uuc2V0QXR0cmlidXRlKCdpZCcsICdnYW1lYm9hcmRQYWdlJyk7XHJcblxyXG4gICAgICAgIC8vY3JlYXRlIHBsYXllciBncmlkXHJcbiAgICAgICAgY29uc3QgcGxheWVyR3JpZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHBsYXllckdyaWQuY2xhc3NMaXN0LmFkZCgnZ3JpZCcpO1xyXG4gICAgICAgIHBsYXllckdyaWQuY2xhc3NMaXN0LmFkZCgncGxheWVyLWdyaWQnKTtcclxuXHJcbiAgICAgICAgcGxheWVyR3JpZC5zdHlsZS5ncmlkVGVtcGxhdGVDb2x1bW5zID0gYHJlcGVhdCgke0dSSURfU0laRX0sIDFmcilgO1xyXG4gICAgICAgIHBsYXllckdyaWQuc3R5bGUuZ3JpZFRlbXBsYXRlUm93cyA9IGByZXBlYXQoJHtHUklEX1NJWkV9LCAxZnIpYDtcclxuXHJcbiAgICAgICAgLy9wb3B1bGF0ZSBncmlkIHdpdGggY2VsbHNcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IEdSSURfU0laRSAqIEdSSURfU0laRTsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKCdjZWxsJyk7XHJcbiAgICAgICAgICAgIHBsYXllckdyaWQuYXBwZW5kQ2hpbGQoY2VsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBhZ2UuYXBwZW5kQ2hpbGQocGxheWVyR3JpZCk7XHJcblxyXG4gICAgICAgIC8vY3JlYXRlIGNvbXB1dGVyIGdyaWRcclxuICAgICAgICBjb25zdCBjb21wdXRlckdyaWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBjb21wdXRlckdyaWQuY2xhc3NMaXN0LmFkZCgnZ3JpZCcpO1xyXG4gICAgICAgIGNvbXB1dGVyR3JpZC5jbGFzc0xpc3QuYWRkKCdjb21wdXRlci1ncmlkJyk7XHJcblxyXG4gICAgICAgIGNvbXB1dGVyR3JpZC5zdHlsZS5ncmlkVGVtcGxhdGVDb2x1bW5zID0gYHJlcGVhdCgke0dSSURfU0laRX0sIDFmcilgO1xyXG4gICAgICAgIGNvbXB1dGVyR3JpZC5zdHlsZS5ncmlkVGVtcGxhdGVSb3dzID0gYHJlcGVhdCgke0dSSURfU0laRX0sIDFmcilgO1xyXG5cclxuICAgICAgICAvL3BvcHVsYXRlIGdyaWQgd2l0aCBjZWxsc1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgR1JJRF9TSVpFICogR1JJRF9TSVpFOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgY2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICBjZWxsLmRhdGFzZXQuaW5kZXggPSBpO1xyXG4gICAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoJ2NlbGwnKTtcclxuICAgICAgICAgICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGF0dGFjayk7XHJcblxyXG4gICAgICAgICAgICBjb21wdXRlckdyaWQuYXBwZW5kQ2hpbGQoY2VsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBhZ2UuYXBwZW5kQ2hpbGQoY29tcHV0ZXJHcmlkKTtcclxuICAgICAgICByb290LmFwcGVuZENoaWxkKHBhZ2UpO1xyXG5cclxuICAgICAgICB1cGRhdGVHcmlkcygpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGF0dGFjayhlKSB7XHJcbiAgICAgICAgaWYgKGdhbWVvdmVyKSByZXR1cm47XHJcblxyXG4gICAgICAgIGNvbnN0IGluZGV4ID0gZS50YXJnZXQuZGF0YXNldC5pbmRleDtcclxuICAgICAgICBsZXQgeyB4LCB5IH0gPSBpbmRleFRvQ29vcmRzKGluZGV4KTtcclxuXHJcbiAgICAgICAgLy9oYW5kbGUgcGxheWVyIGF0dGFja1xyXG4gICAgICAgIGlmIChjb21wdXRlckJvYXJkLmdldENlbGwoeCwgeSkgPT09ICdtaXNzJyB8fCBjb21wdXRlckJvYXJkLmdldENlbGwoeCwgeSkgPT09ICdoaXQnKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbXB1dGVyQm9hcmQucmVjZWl2ZUF0dGFjayh4LCB5KTtcclxuXHJcbiAgICAgICAgLy9oYW5kbGUgY29tcHV0ZXIgYXR0YWNrXHJcbiAgICAgICAgKHsgeCwgeSB9ID0gZ2V0UmFuZG9tQXR0YWNrKCkpO1xyXG4gICAgICAgIHBsYXllckJvYXJkLnJlY2VpdmVBdHRhY2soeCwgeSk7XHJcblxyXG4gICAgICAgIHVwZGF0ZUdyaWRzKCk7XHJcblxyXG4gICAgICAgIC8vY2hlY2sgaWYgZ2FtZSBpcyBvdmVyXHJcbiAgICAgICAgaWYgKHBsYXllckJvYXJkLmlzQWxsU2hpcHNTdW5rKCkpIHtcclxuICAgICAgICAgICAgYWxlcnQoJ0NvbXB1dGVyIHdpbnMuIFJlZnJlc2ggcGFnZSB0byBwbGF5IGFnYWluJyk7XHJcbiAgICAgICAgICAgIGdhbWVvdmVyID0gdHJ1ZTtcclxuICAgICAgICB9IGVsc2UgaWYgKGNvbXB1dGVyQm9hcmQuaXNBbGxTaGlwc1N1bmsoKSkge1xyXG4gICAgICAgICAgICBhbGVydCgnWW91IHdpbiEgUmVmcmVzaCBwYWdlIHRvIHBsYXkgYWdhaW4nKTtcclxuICAgICAgICAgICAgZ2FtZW92ZXIgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBwbGFjZVJhbmRvbVNoaXBzKGJvYXJkKSB7XHJcbiAgICAgICAgY29uc3Qgc2hpcExlbmd0aHMgPSBbMiwgMywgMywgNCwgNV07XHJcblxyXG4gICAgICAgIHdoaWxlIChzaGlwTGVuZ3Rocy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxlbmd0aCA9IHNoaXBMZW5ndGhzLnBvcCgpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHgsIHksIGRpcmVjdGlvbjtcclxuXHJcbiAgICAgICAgICAgIGRvIHtcclxuICAgICAgICAgICAgICAgIHggPSBnZXRSbmRJbnRlZ2VyKDAsIEdSSURfU0laRSAtIDEpO1xyXG4gICAgICAgICAgICAgICAgeSA9IGdldFJuZEludGVnZXIoMCwgR1JJRF9TSVpFIC0gMSk7XHJcbiAgICAgICAgICAgICAgICBkaXJlY3Rpb24gPSBnZXRSbmRJbnRlZ2VyKDAsIDIpID09PSAwID8gJ3JvdycgOiAnY29sJztcclxuICAgICAgICAgICAgfSB3aGlsZSAoIWJvYXJkLmlzVmFsaWRQbGFjZW1lbnQoeCwgeSwgbGVuZ3RoLCBkaXJlY3Rpb24pKTtcclxuXHJcbiAgICAgICAgICAgIGJvYXJkLmFkZFNoaXAoeCwgeSwgbGVuZ3RoLCBkaXJlY3Rpb24pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB1cGRhdGVHcmlkcygpIHtcclxuICAgICAgICBjb25zdCBwbGF5ZXJDZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wbGF5ZXItZ3JpZCAuY2VsbCcpO1xyXG4gICAgICAgIGNvbnN0IGNvbXB1dGVyQ2VsbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY29tcHV0ZXItZ3JpZCAuY2VsbCcpO1xyXG5cclxuICAgICAgICBsZXQgaSA9IDA7XHJcbiAgICAgICAgZm9yIChjb25zdCBjZWxsIG9mIHBsYXllckNlbGxzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgeCwgeSB9ID0gaW5kZXhUb0Nvb3JkcyhpKyspO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgZ2FtZUNlbGwgPSBwbGF5ZXJCb2FyZC5nZXRDZWxsKHgsIHkpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGdhbWVDZWxsID49IDApIHtcclxuICAgICAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZCgnc2hpcCcpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGdhbWVDZWxsID09PSAnaGl0Jykge1xyXG4gICAgICAgICAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKCdoaXQnKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChnYW1lQ2VsbCA9PT0gJ21pc3MnKSB7XHJcbiAgICAgICAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoJ21pc3MnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaSA9IDA7XHJcbiAgICAgICAgZm9yIChjb25zdCBjZWxsIG9mIGNvbXB1dGVyQ2VsbHMpIHtcclxuICAgICAgICAgICAgY29uc3QgeyB4LCB5IH0gPSBpbmRleFRvQ29vcmRzKGkrKyk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBnYW1lQ2VsbCA9IGNvbXB1dGVyQm9hcmQuZ2V0Q2VsbCh4LCB5KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChnYW1lQ2VsbCA9PT0gJ2hpdCcpIHtcclxuICAgICAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZCgnaGl0Jyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZ2FtZUNlbGwgPT09ICdtaXNzJykge1xyXG4gICAgICAgICAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKCdtaXNzJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0UmFuZG9tQXR0YWNrKCkge1xyXG4gICAgICAgIGNvbnN0IGF0dGFja09wdGlvbnMgPSBbXTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBHUklEX1NJWkU7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IEdSSURfU0laRTsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjZWxsID0gcGxheWVyQm9hcmQuZ2V0Q2VsbChpLCBqKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIShjZWxsID09PSAnbWlzcycgfHwgY2VsbCA9PT0gJ2hpdCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXR0YWNrT3B0aW9ucy5wdXNoKHt4OiBpLCB5OiBqfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBhdHRhY2tPcHRpb25zW2dldFJuZEludGVnZXIoMCwgYXR0YWNrT3B0aW9ucy5sZW5ndGgpXTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGluaXQsXHJcbiAgICB9XHJcbn0pKCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnYW1lYm9hcmRQYWdlOyIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFNoaXAge1xyXG4gICAgI2hpdENvdW50ID0gMDtcclxuICAgICNsZW5ndGg7XHJcblxyXG4gICAgY29uc3RydWN0b3IobGVuZ3RoKSB7XHJcbiAgICAgICAgdGhpcy4jbGVuZ3RoID0gbGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIGhpdCgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaXNTdW5rKCkpIHtcclxuICAgICAgICAgICAgdGhpcy4jaGl0Q291bnQrKztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaXNTdW5rKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLiNoaXRDb3VudCA9PT0gdGhpcy4jbGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIGdldExlbmd0aCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy4jbGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEhpdENvdW50KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLiNoaXRDb3VudDtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEdSSURfU0laRSwgY29vcmRzVG9JbmRleCwgaW5kZXhUb0Nvb3JkcyB9IGZyb20gJy4vdXRpbCc7XHJcbmltcG9ydCBHYW1lYm9hcmQgZnJvbSAnLi9nYW1lYm9hcmQnO1xyXG5pbXBvcnQgZ2FtZWJvYXJkUGFnZSBmcm9tICcuL2dhbWVib2FyZFBhZ2UnO1xyXG5cclxuY29uc3Qgc2hpcFBsYWNlbWVudFBhZ2UgPSAoZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zdCByb290ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKTtcclxuICAgIGNvbnN0IHNoaXBMZW5ndGhzID0gWzIsIDMsIDMsIDQsIDVdO1xyXG4gICAgY29uc3QgaW5zdHJ1Y3Rpb25MaXN0ID0gW1xyXG4gICAgICAgICdQbGFjZSB5b3VyIGNhcnJpZXIgKGxlbmd0aDogNSknLFxyXG4gICAgICAgICdQbGFjZSB5b3VyIGJhdHRsZXNoaXAgKGxlbmd0aDogNCknLFxyXG4gICAgICAgICdQbGFjZSB5b3VyIGNydWlzZXIgKGxlbmd0aDogMyknLFxyXG4gICAgICAgICdQbGFjZSB5b3VyIHN1Ym1hcmluZSAobGVuZ3RoOiAzKScsXHJcbiAgICAgICAgJ1BsYWNlIHlvdXIgZGVzdHJveWVyIChsZW5ndGg6IDIpJ1xyXG4gICAgXTtcclxuICAgIGNvbnN0IGdhbWVib2FyZCA9IG5ldyBHYW1lYm9hcmQoKTtcclxuICAgIGxldCBheGlzID0gJ3Jvdyc7XHJcbiAgICBsZXQgc2hpcExlbmd0aCA9IHNoaXBMZW5ndGhzLnBvcCgpO1xyXG5cclxuICAgIGNvbnN0IGluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY29uc3QgcGFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHBhZ2Uuc2V0QXR0cmlidXRlKCdpZCcsICdzaGlwUGxhY2VtZW50UGFnZScpO1xyXG5cclxuICAgICAgICAvL2NyZWF0ZSB1c2VyIGluc3RydWN0aW9uIGhlYWRlclxyXG4gICAgICAgIGNvbnN0IGluc3RydWN0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKTtcclxuICAgICAgICBpbnN0cnVjdGlvbi5pbm5lclRleHQgPSBpbnN0cnVjdGlvbkxpc3Quc2hpZnQoKTtcclxuICAgICAgICBwYWdlLmFwcGVuZENoaWxkKGluc3RydWN0aW9uKTtcclxuXHJcbiAgICAgICAgLy9jcmVhdGUgYnV0dG9uIHRvIGNoYW5nZSBzaGlwIGRpcmVjdGlvblxyXG4gICAgICAgIGNvbnN0IGNoYW5nZUF4aXNCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuICAgICAgICBjaGFuZ2VBeGlzQnV0dG9uLmlubmVyVGV4dCA9ICdBeGlzOiByb3cnO1xyXG4gICAgICAgIGNoYW5nZUF4aXNCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjaGFuZ2VBeGlzKTtcclxuICAgICAgICBwYWdlLmFwcGVuZChjaGFuZ2VBeGlzQnV0dG9uKTtcclxuXHJcbiAgICAgICAgLy9jcmVhdGUgZ3JpZCB1c2VkIGZvciBwbGFjZW1lbnQgb2Ygc2hpcHNcclxuICAgICAgICBjb25zdCBncmlkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgZ3JpZC5jbGFzc0xpc3QuYWRkKCdncmlkJyk7XHJcblxyXG4gICAgICAgIGdyaWQuc3R5bGUuZ3JpZFRlbXBsYXRlQ29sdW1ucyA9IGByZXBlYXQoJHtHUklEX1NJWkV9LCAxZnIpYDtcclxuICAgICAgICBncmlkLnN0eWxlLmdyaWRUZW1wbGF0ZVJvd3MgPSBgcmVwZWF0KCR7R1JJRF9TSVpFfSwgMWZyKWA7XHJcblxyXG4gICAgICAgIC8vcG9wdWxhdGUgZ3JpZCB3aXRoIGNlbGxzXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBHUklEX1NJWkUgKiBHUklEX1NJWkU7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBjZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZCgnY2VsbCcpO1xyXG4gICAgICAgICAgICBjZWxsLmRhdGFzZXQuaW5kZXggPSBpO1xyXG5cclxuICAgICAgICAgICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCBkcmF3U2hpcFBsYWNlaG9sZGVyKTtcclxuICAgICAgICAgICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHBsYWNlU2hpcCk7XHJcblxyXG4gICAgICAgICAgICBncmlkLmFwcGVuZENoaWxkKGNlbGwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwYWdlLmFwcGVuZENoaWxkKGdyaWQpO1xyXG5cclxuICAgICAgICByb290LmFwcGVuZENoaWxkKHBhZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNoYW5nZUF4aXMoZSkge1xyXG4gICAgICAgIGF4aXMgPSBheGlzID09PSAncm93JyA/ICdjb2wnIDogJ3Jvdyc7XHJcbiAgICAgICAgZS50YXJnZXQuaW5uZXJUZXh0ID0gYXhpcyA9PT0gJ3JvdycgPyAnQXhpczogcm93JyA6ICdBeGlzOiBjb2x1bW4nO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHBsYWNlU2hpcChlKSB7XHJcbiAgICAgICAgY29uc3QgaW5kZXggPSBlLnRhcmdldC5kYXRhc2V0LmluZGV4O1xyXG4gICAgICAgIGNvbnN0IHsgeCwgeSB9ID0gaW5kZXhUb0Nvb3JkcyhpbmRleCk7XHJcblxyXG4gICAgICAgIGlmIChnYW1lYm9hcmQuaXNWYWxpZFBsYWNlbWVudCh4LCB5LCBzaGlwTGVuZ3RoLCBheGlzKSkge1xyXG4gICAgICAgICAgICBnYW1lYm9hcmQuYWRkU2hpcCh4LCB5LCBzaGlwTGVuZ3RoLCBheGlzKTtcclxuICAgICAgICAgICAgYWRkQ2xhc3NUb0NlbGxzKHgsIHksICdzaGlwJywgYXhpcywgc2hpcExlbmd0aCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoaW5zdHJ1Y3Rpb25MaXN0Lmxlbmd0aCAhPSAwKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbnN0cnVjdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2gyJyk7XHJcbiAgICAgICAgICAgICAgICBpbnN0cnVjdGlvbi5pbm5lclRleHQgPSBpbnN0cnVjdGlvbkxpc3Quc2hpZnQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBzaGlwTGVuZ3RoID0gc2hpcExlbmd0aHMucG9wKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBnYW1lYm9hcmRQYWdlLmluaXQoZ2FtZWJvYXJkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBkcmF3U2hpcFBsYWNlaG9sZGVyKGUpIHtcclxuICAgICAgICBjb25zdCBpbmRleCA9IGUudGFyZ2V0LmRhdGFzZXQuaW5kZXg7XHJcbiAgICAgICAgY29uc3QgY2VsbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY2VsbCcpO1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IGNlbGwgb2YgY2VsbHMpIHtcclxuICAgICAgICAgICAgY2VsbC5jbGFzc0xpc3QucmVtb3ZlKCdzaGlwUGxhY2Vob2xkZXInKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHsgeCwgeSB9ID0gaW5kZXhUb0Nvb3JkcyhpbmRleCk7XHJcblxyXG4gICAgICAgIGlmIChnYW1lYm9hcmQuaXNWYWxpZFBsYWNlbWVudCh4LCB5LCBzaGlwTGVuZ3RoLCBheGlzKSkge1xyXG4gICAgICAgICAgICBhZGRDbGFzc1RvQ2VsbHMoeCwgeSwgJ3NoaXBQbGFjZWhvbGRlcicsIGF4aXMsIHNoaXBMZW5ndGgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhZGRDbGFzc1RvQ2VsbHMoeCwgeSwgY2xhc3NOYW1lLCBkaXJlY3Rpb24sIGxlbmd0aCkge1xyXG4gICAgICAgIGNvbnN0IGNlbGxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNlbGwnKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgaW5kZXg7XHJcblxyXG4gICAgICAgICAgICBpZiAoZGlyZWN0aW9uID09PSAncm93Jykge1xyXG4gICAgICAgICAgICAgICAgaW5kZXggPSBjb29yZHNUb0luZGV4KHggKyBpLCB5KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGluZGV4ID0gY29vcmRzVG9JbmRleCh4LCB5ICsgaSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNlbGxzW2luZGV4XS5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5pdCxcclxuICAgIH1cclxufSkoKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHNoaXBQbGFjZW1lbnRQYWdlOyIsIi8vUGxhY2UgdG8gc3RvcmUgZ2VuZXJhbCB1dGlsaXR5IGZ1bmN0aW9ucyBhbmQgY29uc3RhbnRzXHJcbmV4cG9ydCBjb25zdCBHUklEX1NJWkUgPSA3O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZTJEQXJyYXkoeCwgeSkge1xyXG4gICAgY29uc3QgYXJyID0gbmV3IEFycmF5KHgpO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgeDsgaSsrKSB7XHJcbiAgICAgICAgYXJyW2ldID0gbmV3IEFycmF5KHkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhcnI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkZWVwQ2xvbmVBcnJheShhcnIpIHtcclxuICAgIGNvbnN0IGNsb25lID0gW107XHJcblxyXG4gICAgYXJyLmZvckVhY2goYXJySXRlbSA9PiB7XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYXJySXRlbSkpIHtcclxuICAgICAgICAgICAgY2xvbmUucHVzaChkZWVwQ2xvbmVBcnJheShhcnJJdGVtKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2xvbmUucHVzaChhcnJJdGVtKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gY2xvbmU7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiByZXR1cm5zIGEgcmFuZG9tIG51bWJlciBiZXR3ZWVuIG1pbiAoaW5jbHVkZWQpIGFuZCBtYXggKGV4Y2x1ZGVkKVxyXG4gKiBcclxuICogQHBhcmFtIHtudW1iZXJ9IG1pbiBtaW4gKGluY2x1ZGVkKVxyXG4gKiBAcGFyYW0ge251bWJlcn0gbWF4IG1heCAoZXhjbHVkZWQpXHJcbiAqIEByZXR1cm5zIGludGVnZXJcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRSbmRJbnRlZ2VyKG1pbiwgbWF4KSB7XHJcbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikpICsgbWluO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY29vcmRzVG9JbmRleCAoeCwgeSkge1xyXG4gICAgcmV0dXJuIHkgKiBHUklEX1NJWkUgKyB4O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaW5kZXhUb0Nvb3JkcyhpbmRleCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB5OiBNYXRoLmZsb29yKGluZGV4IC8gR1JJRF9TSVpFKSxcclxuICAgICAgICB4OiBpbmRleCAlIEdSSURfU0laRVxyXG4gICAgfTtcclxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHNoaXBQbGFjZW1lbnRQYWdlIGZyb20gXCIuL3NoaXBQbGFjZW1lbnRQYWdlXCI7XHJcblxyXG5zaGlwUGxhY2VtZW50UGFnZS5pbml0KCk7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9