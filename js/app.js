'use strict';

let minSpeed = 1; // Minimal enemy's speed
let maxSpeed = 5; // Maximal enemy's speed

let gemsCollected = 0; // Number of collected gems

// Get access to the DOM element where the score is stored
const score = document.querySelector('.score');

// Show if timer is on (game has started)
let isTimerOn = false;
const timerField = document.querySelector('.timer');
// Time the user spent to win the game (in seconds)
let numOfSeconds = 0;
let timerId;

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
  constructor(character, name) {
    this.col = 2;
    this.row = 5;
    this.x = this.col * 101;
    this.y = this.row * 83 - 23;
    this.name = name;
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
    // At first move start the timer
    if (!isTimerOn) {
      isTimerOn = true;
      timerId = setInterval(() => {
        // Count time every second
        numOfSeconds = numOfSeconds + 1;

        // Transform time to format mm:ss
        let numOfMinutes = Math.floor(numOfSeconds / 60);
        if (numOfMinutes < 10) {
          numOfMinutes = `0${numOfMinutes}`;
        }
        let time = `${numOfMinutes}:`;
        if ((numOfSeconds % 60) < 10) {
          time += '0';
        }
        time = `${time}${(numOfSeconds % 60)}`;

        // Show it to the user
        timerField.textContent = time;
      }, 1000);
    }

    // The player cannot move off the screen and move through the rocks
    switch (direction) {
      case 'left':
        if(this.col > 0 && !allRocks.some(rock => {
          return rock.row === this.row && rock.col === this.col - 1;
        })) { this.col -= 1; } // To the left of the player there is no rock
        break;
      case 'up':
        if(this.row > 0 && !allRocks.some(rock => {
          return rock.row === this.row - 1 && rock.col === this.col;
        })) {
          // Above the player there is no rock
          this.row -= 1;
          // If player wins
          if (this.row === 0) {
            setTimeout(() => {
              // return him into his initial position
              this.reset();
              // increase every enemy's speed
              minSpeed += 1;
              maxSpeed += 1;
              allEnemies.forEach(enemy => {
                enemy.speed = Math.random() * (maxSpeed - minSpeed + 1) + minSpeed;
              });
              // Reset gems
              resetGems();
              // Reset rocks
              resetRocks();
            }, 100);
          }
        }
        break;
      case 'right':
        if(this.col < 4 && !allRocks.some(rock => {
          return rock.row === this.row && rock.col === this.col + 1;
        })) { this.col += 1; } // To the right of the player there is no rock
        break;
      case 'down':
        if(this.row < 5 && !allRocks.some(rock => {
          return rock.row === this.row + 1 && rock.col === this.col;
        })) { this.row += 1; } // Below the player there is no rock
    }
    // If there is a gem
    allGems.forEach(gem => {
      if(gem.row === player.row && gem.col === player.col) {
        // collect it
        gem.collect();
        gemsCollected += 1;
        score.textContent = `Gems Collected: ${gemsCollected}`;
      }
    });
  }

  // Return player into his initial position
  reset() {
    this.col = 2;
    this.row = 5;
    this.x = this.col * 101;
    this.y = this.row * 83 - 23;
  }
}

class Gem {
  constructor(row) {
    // Pick randomly gem's position in the row
    this.col = Math.floor(Math.random() * 5);
    this.row = row;
    this.x = this.col * 101;
    this.y = this.row * 83 - 23;
    // Pick randomly gem's color
    switch(Math.floor(Math.random() * 3)) {
      case 0:
        this.sprite = 'images/Gem Blue.png';
        break;
      case 1:
        this.sprite = 'images/Gem Green.png';
        break;
      case 2:
      this.sprite = 'images/Gem Orange.png';
    }
    // Shows whether gem is collected
    this.isCollected = false;
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  collect() {
    // The gem is collected
    this.isCollected = true;
  }

  reset() {
    this.col = Math.floor(Math.random() * 5);
    this.x = this.col * 101;
    switch(Math.floor(Math.random() * 3)) {
      case 0:
        this.sprite = 'images/Gem Blue.png';
        break;
      case 1:
        this.sprite = 'images/Gem Green.png';
        break;
      case 2:
      this.sprite = 'images/Gem Orange.png';
    }
    // The gem is not collected
    this.isCollected = false;
  }
}

class Rock {
  constructor() {
    // Pick randomly rock's position in the row
    this.col = Math.floor(Math.random() * 5);
    // and in the column
    this.row = Math.floor(Math.random() * 3 + 1);
    this.x = this.col * 101;
    this.y = this.row * 83 - 23;
    this.sprite = 'images/Rock.png';
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  reset() {
    this.col = Math.floor(Math.random() * 5);
    this.row = Math.floor(Math.random() * 3 + 1);
    this.x = this.col * 101;
    this.y = this.row * 83 - 23;
  }
}

// Reset all gems
const resetGems = function() {
  allGems.forEach(gem => gem.reset());
}

// Reset all rocks
const resetRocks = function() {
  allRocks.forEach(rock => rock.reset());
}

// Reset game
const resetGame = function() {
  // Stop the timer and reset all game parameters
  clearInterval(timerId);
  isTimerOn = false;
  timerField.textContent = '00:00';
  numOfSeconds = 0;
  resetGems();
  gemsCollected = 0;
  score.textContent = `Gems Collected: ${gemsCollected}`;
  minSpeed = 1;
  maxSpeed = 5;
  allEnemies.forEach(enemy => enemy.reset());
  resetRocks();
  player.reset();
}

// Now instantiate your objects.
// Place all gem objects in an array called allGems
const allGems = [];
for(let row = 1; row <= 3; row++) {
  allGems.push(new Gem(row));
}

// Place all rock objects in an array called allRocks
const allRocks = [];
for(let rock = 1; rock <= 2; rock++) {
  allRocks.push(new Rock());
}

// Place all enemy objects in an array called allEnemies
const allEnemies = [];
for(let enemy = 1; enemy <= 3; enemy++) {
  allEnemies.push(new Enemy());
}

// Place the player object in a variable called player
const player = new Player('images/char-boy.png', 'Boy');

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    if(allowedKeys.hasOwnProperty(e.keyCode)) { e.preventDefault(); }
    player.handleInput(allowedKeys[e.keyCode]);
});

// This listens for mouse clicks on the character board
// and changes player character accordingly
document.querySelector('.character-board').addEventListener('click', (e) => {
  if(e.target.nodeName === 'IMG') {
    player.sprite = e.target.attributes[0].nodeValue; // src attribute of image
    player.name = e.target.attributes[2].nodeValue; // title attribute of image
  }
});

// This listens for mouse clicks on the Reset Button
document.querySelector('.reset-button').addEventListener('click', resetGame);

// This listens for mouse clicks on the Clear Stats Button
document.querySelector('.clear-stats').addEventListener('click', () => {
  // Remove stats from Local Storage
  localStorage.removeItem('froggerGame');
  // Update info on the screen
  showStatistics();
});

// Save game statistics to Local Storage
function saveStatistics(character, gems, time) {
  // Read data from Local Storage
  const statistics = JSON.parse(localStorage.getItem('froggerGame') || '[]');
  // Add new data to statistics
  statistics.push({character, gems, time});
  // Save updated data back to Local Storage
  localStorage.setItem('froggerGame', JSON.stringify(statistics));
}

// Read game statistics from Local Storage and show it to the user
function showStatistics() {
  const fragment = document.createDocumentFragment();
  const attempts = document.querySelector('.attempts-stats > tbody');

  // Remove previous data from the table
  while (attempts.firstElementChild) {
    attempts.removeChild(attempts.firstElementChild);
  }

  // Read data from Local Storage
  const stats = JSON.parse(localStorage.getItem('froggerGame') || '[]');

  if (!stats.length) {
    // If there is no data yet, tell the user about that
    const row = document.createElement('tr');
    const td = document.createElement('td');
    td.setAttribute('colspan', 4);
    td.textContent = 'There is no attempts yet!';

    row.appendChild(td);

    fragment.appendChild(row);
  } else {
    // Construct rows with data
    for (let i = 0; i < stats.length; i++) {
      const row = document.createElement('tr');

      let td = document.createElement('td');
      td.textContent = `#${i + 1}`;
      row.appendChild(td);

      td = document.createElement('td');
      td.textContent = stats[i].character;
      row.appendChild(td);

      td = document.createElement('td');
      td.textContent = stats[i].gems;
      row.appendChild(td);

      td = document.createElement('td');
      td.textContent = stats[i].time;
      row.appendChild(td);

      fragment.appendChild(row);
    }
  }
  // and add them to the table with attempts statistics
  attempts.appendChild(fragment);
}
