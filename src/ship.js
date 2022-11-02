export default class Ship {
    constructor(length) {
        this.#length = length;
        this.#hitCount = 0;
    }

    hit() {
        this.#hitCount = 0;
    }

    isSunk() {
        return this.#hitCount === this.#length;
    }

    getLength() {
        return this.#length;
    }
}