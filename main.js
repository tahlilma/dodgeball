import { Application, Sprite, Text } from "pixi.js";

const app = new Application({ height: 500, width: 500 });
document.body.appendChild(app.view);

const PLAYER_SPEED = 10;
const ENEMY_SPEED = 5;
const SPAWN_RATE = 0.5;

let score = 0;

const player = Sprite.from("./assets/mc.png");
player.anchor.set(0.5);
player.x = app.view.height / 2;
player.y = app.view.width / 2;
app.stage.addChild(player);

function spawnEnemy() {
  const enemy = Sprite.from("./assets/enemy.png");
  enemy.anchor.set(0.5);

  const randomizer = Math.floor(Math.random() * 4);

  switch (randomizer) {
    case 0:
      // TOP
      enemy.x = Math.floor(Math.random() * 490);
      enemy.y = 1;
      enemy.spawn = "TOP";
      break;
    case 1:
      // Bottom
      enemy.x = Math.floor(Math.random() * 490);
      enemy.y = 500;
      enemy.spawn = "BOTTOM";
      break;
    case 2:
      // Left
      enemy.x = 1;
      enemy.y = Math.floor(Math.random() * 490);
      enemy.spawn = "LEFT";
      break;
    case 3:
      // Right
      enemy.x = 500;
      enemy.y = Math.floor(Math.random() * 490);
      enemy.spawn = "RIGHT";
      break;
  }

  app.stage.addChild(enemy);
}

function collisionDetector(player, enemy) {
  const bunnyBounds = player.getBounds();
  const enemyBounds = enemy.getBounds();

  return (
    bunnyBounds.x + bunnyBounds.width > enemyBounds.x &&
    bunnyBounds.x < enemyBounds.x + enemyBounds.width &&
    bunnyBounds.y + bunnyBounds.height > enemyBounds.y &&
    bunnyBounds.y < enemyBounds.y + enemyBounds.height
  );
}

function gameOver() {
  clearInterval(scoreKeeper);
  clearInterval(spawner);
  app.stage.removeChildren();
  gameLoop.remove();

  const loser = Sprite.from("./assets/mc.png");
  loser.anchor.set(0.5);
  loser.x = app.view.height / 2;
  loser.y = app.view.width / 2 + 50;

  const loserText = new Text(`YOUR SCORE : ${score}`, {
    fontFamily: "Arial",
    fontSize: 25,
    fill: 0xff1010,
  });

  loserText.anchor.set(0.5);
  loserText.x = app.view.height / 2;
  loserText.y = app.view.width / 2;

  app.stage.addChild(loser, loserText);

  app.ticker.add((delta) => {
    loser.rotation += 0.1 * delta;
  });
}

const spawner = setInterval(spawnEnemy, SPAWN_RATE * 1000);
const scoreKeeper = setInterval(() => (score += 1), 1000);

const gameLoop = app.ticker.add((delta) => {
  let children = [...app.stage.children];
  let player = children.shift();

  children.forEach((child) => {
    if (collisionDetector(player, child)) {
      gameOver();
    }

    switch (child.spawn) {
      case "TOP":
        child.y += ENEMY_SPEED * delta;
        break;
      case "BOTTOM":
        child.y -= ENEMY_SPEED * delta;
        break;
      case "LEFT":
        child.x += ENEMY_SPEED * delta;
        break;
      case "RIGHT":
        child.x -= ENEMY_SPEED * delta;
        break;
      default:
        return;
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (player.x === 480 && event.key === "ArrowRight") {
    player.x -= PLAYER_SPEED;
  } else if (player.x === 20 && event.key === "ArrowLeft") {
    player.x += PLAYER_SPEED;
  }

  if (player.y === 480 && event.key === "ArrowDown") {
    player.y -= PLAYER_SPEED;
  } else if (player.y === 20 && event.key === "ArrowUp") {
    player.y += PLAYER_SPEED;
  }

  switch (event.key) {
    case "ArrowRight":
      player.x += PLAYER_SPEED;
      break;
    case "ArrowLeft":
      player.x -= PLAYER_SPEED;
      break;
    case "ArrowUp":
      player.y -= PLAYER_SPEED;
      break;
    case "ArrowDown":
      player.y += PLAYER_SPEED;
      break;
  }
});
