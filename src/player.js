import { create2DArray, GRID_SIZE, getRndInteger, deepCloneArray } from './util';

export default class Player {
    #attackedList;

    constructor() {
        this.#attackedList = create2DArray(GRID_SIZE, GRID_SIZE);
    }

    getRandomMove() {
        const possibleAttacks = [];

        for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
                if (this.#attackedList[i][j] != true) {
                    possibleAttacks.push([i, j]);
                }
            }
        }

        return possibleAttacks[getRndInteger(0, possibleAttacks.length)];
    }

    attack(x, y, board) {
        board.receiveAttack(x, y);
        this.#attackedList[x][y] = true;
    }

    getAttackedList() {
        return deepCloneArray(this.#attackedList);
    }
}