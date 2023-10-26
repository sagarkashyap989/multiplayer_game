const BG_COLOUR = '#231f20';
const SNAKE_COLOUR = '#c2c2c2';
const FOOD_COLOUR = '#e66916';

const socket = io('http://localhost:3000/');
let roomName;

socket.on('init', handleInit);
socket.on('gameState', handleGameState);
socket.on('gameOver', handleGameOver);
socket.on('gameCode', handleGameCode);
socket.on('unknownCode', handleUnknownCode);
socket.on('tooManyPlayers', handleTooManyPlayers);

const gameScreen = document.getElementById('gameScreen');
const initialScreen = document.getElementById('initialScreen');
const newGameBtn = document.getElementById('newGameButton');
const joinGameBtn = document.getElementById('joinGameButton');
const gameCodeInput = document.getElementById('gameCodeInput');
const gameCodeDisplay = document.getElementById('gameCodeDisplay');


// NEW CONSTS-----NEW CONSTS-----NEW CONSTS-----NEW CONSTS-----NEW CONSTS-----NEW CONSTS-----NEW CONSTS-----NEW CONSTS-----NEW CONSTS-----
const newPlyName = document.getElementById('playerNameS')
const PlyName = document.getElementById('playerName')

const messageForm = document.getElementById('send-container')
const messageContainer = document.getElementById('message-container')

const messageInput = document.getElementById('message-input')



let userId;
let seq = [3]
let userClickedPattern = []
// NEW CONSTS-----NEW CONSTS-----NEW CONSTS-----NEW CONSTS-----NEW CONSTS-----NEW CONSTS-----NEW CONSTS-----NEW CONSTS-----NEW CONSTS-----


newGameBtn.addEventListener('click', newGame);
joinGameBtn.addEventListener('click', joinGame);




function joinGame() {
  const code = gameCodeInput.value;
  socket.emit('joinGame', code, PlyName.value);
  init();
}

let canvas, ctx;
let playerNumber;
let gameActive = false;

function init() {
  initialScreen.style.display = "none";
  gameScreen.style.display = "block";

  // canvas = document.getElementById('canvas');
  // ctx = canvas.getContext('2d');

  // canvas.width = canvas.height = 600;

  // ctx.fillStyle = BG_COLOUR;
  // ctx.fillRect(0, 0, canvas.width, canvas.height);

  // document.addEventListener('keydown', keydown);
  // gameActive = true;
}

function keydown(e) {
  socket.emit('keydown', e.keyCode);
}

function paintGame(state) {
  ctx.fillStyle = BG_COLOUR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const food = state.food;
  const gridsize = state.gridsize;
  const size = canvas.width / gridsize;

  ctx.fillStyle = FOOD_COLOUR;
  ctx.fillRect(food.x * size, food.y * size, size, size);

  paintPlayer(state.players[0], size, SNAKE_COLOUR);
  paintPlayer(state.players[1], size, 'red');
}

function paintPlayer(playerState, size, colour) {
  const snake = playerState.snake;

  ctx.fillStyle = colour;
  for (let cell of snake) {
    ctx.fillRect(cell.x * size, cell.y * size, size, size);
  }
}

function handleInit(number) {
  playerNumber = number;
}

function handleGameState(gameState) {
  if (!gameActive) {
    return;
  }
  gameState = JSON.parse(gameState);
  requestAnimationFrame(() => paintGame(gameState));
}

function handleGameOver(data) {
  if (!gameActive) {
    return;
  }
  data = JSON.parse(data);

  gameActive = false;

  if (data.winner === playerNumber) {
    alert('You Win!');
  } else {
    alert('You Lose :(');
  }
}



function handleUnknownCode() {
  reset();
  alert('Unknown Game Code')
}

function handleTooManyPlayers() {
  reset();
  alert('This game is already in progress');
}

function reset() {
  playerNumber = null;
  gameCodeInput.value = '';
  initialScreen.style.display = "block";
  gameScreen.style.display = "none";
}


//NEW EMITS -----NEW EMITS -----NEW EMITS -----NEW EMITS -----NEW EMITS -----NEW EMITS -----NEW EMITS -----NEW EMITS -----NEW EMITS -----NEW EMITS -----


messageForm.addEventListener('submit', e => {
  console.log( messageInput.value)
  e.preventDefault()
  const message = messageInput.value
  appendMessage(`You: ${message}`)
  socket.emit('send-chat-message', roomName, message)
  messageInput.value = ''
})
//NEW EMITS -----NEW EMITS -----NEW EMITS -----NEW EMITS -----NEW EMITS -----NEW EMITS -----NEW EMITS -----NEW EMITS -----NEW EMITS -----NEW EMITS -----



//memememememememememememememememememememememememememememememememememememememememememememememememememememememe -socket-listners
socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`)
})

socket.on('user-connected', (name,numberOfUsers, id, room) => {


  appendMessage(`${name} connected `)
})

socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`)
})



//memememememememememememememememememememememememememememememememememememememememememememememememememememememe -socket-listners




//functions functions functions functions functions functions functions functions functions functions functions functions 

function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}


function newGame() {
  console.log(newPlyName.value)
  socket.emit('newGame', newPlyName.value);
  init();
}



function handleGameCode(gameCode, userCode) {
  console.log('gameCode', gameCode, 'userCode', userCode)
  roomName = gameCode
  userId = userCode
  gameCodeDisplay.innerText = gameCode;
}
//functions functions functions functions functions functions functions functions functions functions functions functions 





//socket listernser --socket listernser --socket listernser --socket listernser --socket listernser --socket listernser --socket listernser --socket listernser --socket listernser --


socket.on('someone-lost', data => {
  console.log(data, 'dream')
  if (userId > data.userId) {
    userId = userId - 1
  }
  appendMessage(`${data.name}: ${data.message}`, 'lost-title')
})



socket.on('you-win', data => {
  body.classList.add("you-win");
  // alert('you win')
})


//socket listernser --socket listernser --socket listernser --socket listernser --socket listernser --socket listernser --socket listernser --socket listernser --socket listernser --






//client game login ---client game login ---client game login ---client game login ---client game login ---client game login ---client game login ---client game login ---client game login ---client game login ---


const colors = ['red', 'green', 'yellow', 'blue'];

colors.forEach(color => {
  const element = document.getElementById(color);
  element.addEventListener('click', () => {


    // if ( != Number(userId)) {
    //   alert(
    //     'not my turn'
    //   )

    // }

    console.log(seq.length % 2 + 1, 'wild')
    userClickedPattern.push(colors.indexOf(color));
    console.log(userClickedPattern, 'this is userClickedPattern')
    console.log(seq, 'this is seq')
    playSound(color);


    if (userClickedPattern.length > seq.length) {

      if (seq.length % 2 + 1 != Number(userId)) {
        overlay.classList.add('no-click')
      } else {
        overlay.classList.remove('no-click')

      }
      console.log('adding to socket.........,', seq.length % 2 + 1 != userId)
      socket.emit('add-seq', roomName, colors.indexOf(color))
      userClickedPattern = []
    } else {
      checkAnswer(userClickedPattern.length - 1)
    }

  });
});

function playSound(name) {
  const audio = new Audio(name + '.mp3');
  audio.play();
}



function checkAnswer(currentLevel) {

  if (seq[currentLevel] === userClickedPattern[currentLevel]) {
    if (userClickedPattern.length === seq.length) {


      //pass
      score = score + 100
      viewScore.innerText = score

      console.log('pass')
    }
  } else {
    // fail

    socket.emit('del-seq', roomName)
    playSound("wrong");

    socket.emit('won-lost', roomName, userId)
    appendMessage('you: lost', 'lost-title  ')
    overlay.classList.add('no-click')
    body.classList.remove("background");
    body.classList.add("game-over");
    levelTitle.innerText = "Game Over, Click here  to Restart";
    userClickedPattern = []
    setTimeout(function () {
      body.classList.remove("game-over");
      body.classList.add("background");
    }, 200);

    startOver();
  }
}

//client game login ---client game login ---client game login ---client game login ---client game login ---client game login ---client game login ---client game login ---client game login ---client game login ---