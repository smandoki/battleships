import Gameboard from "../gameboard";

test('test add ship function', () => {
    const gameboard = new Gameboard();
    gameboard.addShip(0, 0, 1, 'row');

    expect(gameboard.getBoard()).toEqual([
        [0], [], [], [], [], [], []
    ]);
});

test('test add ship function with two ships', () => {
    const gameboard = new Gameboard();
    gameboard.addShip(0, 0, 1, 'row');
    gameboard.addShip(1, 0, 2, 'col');

    expect(gameboard.getBoard()).toEqual([
        [0], [1, 1], [], [], [], [], []
    ]);
});

test('test all ships sunk is false with no ships', () => {
    const gameboard = new Gameboard();

    expect(gameboard.isAllShipsSunk()).toBeFalsy();
});

test('test all ships sunk is false with ships', () => {
    const gameboard = new Gameboard();
    gameboard.addShip(0, 0, 1, 'row');

    expect(gameboard.isAllShipsSunk()).toBeFalsy();
});

test('test receiveAttack hit and all ships sunk is true', () => {
    const gameboard = new Gameboard();
    gameboard.addShip(0, 0, 1, 'row');
    gameboard.receiveAttack(0, 0);

    expect(gameboard.isAllShipsSunk()).toBeTruthy();
    expect(gameboard.getBoard()).toEqual([
        ['hit'], [], [], [], [], [], []
    ]);
});

test('test receiveAttack missed attack', () => {
    const gameboard = new Gameboard();
    gameboard.receiveAttack(1, 0);

    expect(gameboard.getBoard()).toEqual([
        [], ['miss'], [], [], [], [], []
    ]);
});

test('test isValidPlacement is true', () => {
    const gameboard = new Gameboard();
    
    expect(gameboard.isValidPlacement(0, 0, 1, 'row')).toBeTruthy();
});

test('test isValidPlacement is false at border', () => {
    const gameboard = new Gameboard();
    
    expect(gameboard.isValidPlacement(7, 0, 2, 'row')).toBeFalsy();
});

test('test isValidPlacement is false from ship overlap', () => {
    const gameboard = new Gameboard();
    gameboard.addShip(1, 0, 1, 'row');
    
    expect(gameboard.isValidPlacement(0, 0, 2, 'row')).toBeFalsy();
});