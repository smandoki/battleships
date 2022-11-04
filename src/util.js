//Place to store general utility functions and constants
export const GRID_SIZE = 7;

export function create2DArray(x, y) {
    const arr = new Array(x);

    for (let i = 0; i < x; i++) {
        arr[i] = new Array(y);
    }

    return arr;
}

export function deepCloneArray(arr) {
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
export function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}