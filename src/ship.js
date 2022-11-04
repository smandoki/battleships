export default class Ship {
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