import Ship from './ship';
import { create2DArray, deepCloneArray, GRID_SIZE } from './util';

export default class Gameboard {
    #ships = {};
    #board;
    #autoIncId = 0;

    constructor() {
        this.#board = create2DArray(GRID_SIZE, GRID_SIZE);
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
        const ship = new Ship(length);

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
        if (this.#board[x][y] === undefined) {
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
            x >= 0 && x < GRID_SIZE && 
            y >= 0 && y < GRID_SIZE && 
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
        return deepCloneArray(this.#board);
    }

    getCell(x, y) {
        return this.#board[x][y];
    }
}