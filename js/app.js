'use strict';

let minSpeed = 1; // Minimal enemy's speed
let maxSpeed = 5; // Maximal enemy's speed
// Enemies our player must avoid
class Enemy {
    constructor() {
      // Variables applied to each of our instances go here

      // Place enemy off the screen (to the left) at random position
      this.x = -101 - Math.random() * (100);
      // at random row
      this.row = Math.floor(Math.random() * 3 + 1);
      this.y = this.row * 83 - 23;
      // and randomly set its speed
      this.speed = Math.random() * (maxSpeed - minSpeed + 1) + minSpeed;

      // The image/sprite for our enemies, this uses
      // a helper we've provided to easily load images
      this.sprite = 'images/enemy-bug.png';
    }

    // Draw the enemy on the screen, required method for game
    render() {
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
      // You should multiply any movement by the dt parameter
      // which will ensure the game runs at the same speed for
      // all computers.
      this.x = this.x + this.speed;

      // If enemy's off the screen
      if(this.x >= 505) {
        this.reset();
      }
    }

    // Return enemy into its initial position
    reset() {
      // Place it to the left of the screen at random position
      this.x = -101 - Math.random() * 100;
      // at random row
      this.row = Math.floor(Math.random() * 3 + 1);
      this.y = this.row * 83 - 23;
      // and randomly set its speed
      this.speed = Math.random() * (maxSpeed - minSpeed + 1) + minSpeed;
    }
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player {
  constructor(character) {
    this.col = 2;
    this.row = 5;
    this.x = this.col * 101;
    this.y = this.row * 83 - 23;
    // The image/sprite for our player, this uses
    // a helper we've provided to easily load images
    this.sprite = character;
  }

  // Draw the player on the screen, required method for game
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  // Update the player's position, required method for game
  // Parameter: dt, a time delta between ticks
  update(dt) {
    this.x = this.col * 101;
    this.y = this.row * 83 - 23;
  }

  handleInput(direction) {
    // The player cannot move off the screen
    switch (direction) {
      case 'left':
        if(this.col > 0) { this.col -= 1; }
        break;
      case 'up':
        if(this.row > 0) {
          this.row -= 1;
          if (this.row === 0) {
            setTimeout(() => {
              this.reset();
            }, 100);
          }
        }
        break;
      case 'right':
        if(this.col < 4) { this.col += 1; }
        break;
      case 'down':
        if(this.row < 5) { this.row += 1; }
    }
  }

  // Return player into his initial position
  reset() {
    this.col = 2;
    this.row = 5;
    this.x = this.col * 101;
    this.y = this.row * 83 - 23;
  }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
const allEnemies = [];
for(let enemy = 1; enemy <= 3; enemy++) {
  allEnemies.push(new Enemy());
}

// Place the player object in a variable called player
const player = new Player('images/char-boy.png');

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// This listens for mouse clicks on the character board
// and changes player character accordingly
document.querySelector('.character-board').addEventListener('click', (e) => {
  if(e.target.nodeName === 'IMG') {
    player.sprite = e.target.attributes[0].nodeValue; // src attribute of image
  }
});
