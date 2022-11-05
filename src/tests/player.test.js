import Player from "../player";
import Gameboard from '../gameboard';
import { GRID_SIZE } from '../util';

test('test that attack works', () => {
    const player = new Player();
    const gameboard = new Gameboard();

    gameboard.addShip(0, 0, 1, 'row');
    player.attack(0, 0, gameboard);

    expect(gameboard.isAllShipsSunk()).toBeTruthy();
});

test('test get attacked list', () => {
    const player = new Player();
    const gameboard = new Gameboard();

    gameboard.addShip(0, 0, 1, 'row');
    player.attack(0, 0, gameboard);

    expect(player.getAttackedList()).toEqual([[true], [], [], [], [], [], []]);
});

test('get random move', () => {
    const player = new Player();
    const gameboard = new Gameboard();

    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (i === 0 && j === 0) continue;

            player.attack(i, j, gameboard);
        }
    }

    expect(player.getRandomMove()).toEqual([0, 0]);
});