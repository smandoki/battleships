import Gameboard from './gameboard';

const gameboardPage = (function() {
    const computerBoard = new Gameboard();
    let playerBoard;

    const init = function (gameboard) {
        playerBoard = gameboard;

        
    }

    return {
        init,
    }
})();

export default gameboardPage;