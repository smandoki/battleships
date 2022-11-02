import Ship from './ship';

const GRID_SIZE = 7;

export default class Gameboard {
    constructor() {
        this.#board = create2DArray(GRID_SIZE, GRID_SIZE);
        this.#ships = [];
    }

    addShip(x, y, length, direction) {
        const ship = new Ship(length);

        for (let i = 0; i < length; i++) {
            if (direction === 'row') {
                this.#board[x + i][y] = ship;
            } else {
                this.#board[x][y + i] = ship;
            }
        }

        this.#ships.push(ship);
    }

    receiveAttack(x, y) {
        if (this.#board[x][y] === undefined) {
            this.#board[x][y] = 'miss';
        } else {
            this.#board[x][y].hit();
        }
    }

    //check if ship can be placed here
    isValidPlacement(x, y, length, direction) {
        for (let i = 0; i < length; i++) {
            if (direction === 'row') {
                if (!this.#coordsIsValid(x + i, y)) return false;
                if (this.#board[x + i][y] != undefined) return false;
            } else {
                if (!this.#coordsIsValid(x, y + i)) return false;
                if (this.#board[x][y + i] != undefined) return false;
            }
        }
    }

    #coordsIsValid(x, y) {
        return x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE;
    }

    isAllShipsSunk() {
        this.#ships.forEach(ship => {
            if (!ship.isSunk()) return false;
        });

        return true;
    }
}

function create2DArray(x, y) {
    const arr = new Array(x);

    for (let i = 0; i < x; i++) {
        arr[i] = new Array(y);
    }

    return arr;
}