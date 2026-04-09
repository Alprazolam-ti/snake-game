import { Game } from './src/Game.js';

const app = new PIXI.Application({
    width: 900,
    height: 900,
    backgroundColor: 0x424242
});
document.getElementById('game-container').appendChild(app.view);

let game = null;

const playBtn = document.getElementById('play-btn');
const exitBtn = document.getElementById('exit-btn');
const menuBtn = document.getElementById('menu-btn');
const menuPanel = document.getElementById('menu-panel');
const gameMenu = document.getElementById('game-menu');
const currentScoreSpan = document.getElementById('current-score');
const bestScoreSpan = document.getElementById('best-score');

function updateScore(current, best) {
    currentScoreSpan.textContent = current;
    bestScoreSpan.textContent = best;
}

playBtn.addEventListener('click', () => {
    const selectedMode = document.querySelector('input[name="mode"]:checked').value;

    playBtn.style.display = 'none';
    exitBtn.style.display = 'none';
    document.getElementById('modes').style.display = 'none';

    menuBtn.style.display = 'inline-block';

    game = new Game(app, selectedMode, updateScore);
    game.start();
});

menuBtn.addEventListener('click', () => {
    menuBtn.style.display = 'none';

    playBtn.style.display = 'inline-block';
    exitBtn.style.display = 'inline-block';
    document.getElementById('modes').style.display = 'flex';

    clearInterval(game.gameLoop);
    app.stage.removeChildren();
});