//Place to store general utility functions

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