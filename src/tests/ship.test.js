import Ship from "../ship";

test('test that hit() increases hit counter', () => {
    const ship = new Ship(2);
    ship.hit();
    
    expect(ship.getHitCount()).toBe(1);
});

test('test isSunk() is false', () => {
    const ship = new Ship(2);
    ship.hit();
    
    expect(ship.isSunk()).toBeFalsy();
});

test('test isSunk() is true', () => {
    const ship = new Ship(2);
    ship.hit();
    ship.hit();
    
    expect(ship.isSunk()).toBeTruthy();
});

test('test length is 2', () => {
    const ship = new Ship(2);
    
    expect(ship.getLength()).toBe(2);
});