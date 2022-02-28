// global properties, assigned with let for easy overriding by the user
let disk;

// store user input history
let inputs = [''];
let inputsPos = 0;

// reference to the input element
let input = document.querySelector('#input');

// add any default values to the disk
// disk -> disk
let init = (disk) => {
  const initializedDisk = Object.assign({}, disk);
  initializedDisk.rooms = disk.rooms.map((room) => {
    // number of times a room has been visited
    room.visits = 0;
    return room;
  });
  return initializedDisk;
};

// register listeners for input events
let setup = () => {
  input.addEventListener('keypress', (e) => {
    const ENTER = 13;

    if (e.keyCode === ENTER) {
      applyInput();
    }
  });

  input.addEventListener('keydown', (e) => {
    input.focus();

    const UP = 38;
    const DOWN = 40;
    const TAB = 9;

    if (e.keyCode === UP) {
      navigateHistory('prev');
    } else if (e.keyCode === DOWN) {
      navigateHistory('next');
    } else if (e.keyCode === TAB) {
      e.stopPropagation();
      e.preventDefault()
      autocomplete();
    }
  });

  input.addEventListener('focusout', () => {
    input.focus({preventScroll: true});
  });
};

let next = () => {
  const room = getRoom(disk.roomId);
  if (room.hasOwnProperty('onNext')){
    room.onNext({disk, println});
  }
  else {
    println(`Sorry, that command is invalid. For a list of available commands, type HELP.`);
  }
};

let one = () => {
  const room = getRoom(disk.roomId);
  if (room.hasOwnProperty('on1')){
    room.on1({disk, println});
  }
  else {
    println(`Sorry, that command is invalid. For a list of available commands, type HELP.`);
  }
};

let two = () => {
  const room = getRoom(disk.roomId);
  if (room.hasOwnProperty('on2')){
    room.on2({disk, println});
  }
  else {
    println(`Sorry, that command is invalid. For a list of available commands, type HELP.`);
  }
};

let three = () => {
  const room = getRoom(disk.roomId);
  if (room.hasOwnProperty('on3')){
    room.on3({disk, println});
  }
  else {
    println(`Sorry, that command is invalid. For a list of available commands, type HELP.`);
  }
};

let four = () => {
  const room = getRoom(disk.roomId);
  if (room.hasOwnProperty('on4')){
    room.on4({disk, println});
  }
  else {
    println(`Sorry, that command is invalid. For a list of available commands, type HELP.`);
  }
};

let restart = () => {
  location.reload();
}

let quit = () => {
  window.location.href = "../index.html";
}

// display help menu
let help = () => {
  println(`The following commands are available:`)

  const always = `HELP: displays this menu
  RESTART: restart the game
  QUIT: return to the home page`;

  const instructions = getRoom(disk.roomId).commands;

  println(instructions);
  println(always);
};

// retrieve user input (remove whitespace at beginning or end)
// nothing -> string
let getInput = () => input.value.trim();

let commands = {
  // no arguments (e.g. "help", "chars", "inv")
  next,
  1: one,
  2: two,
  3: three,
  4: four,
  help,
  restart,
  quit
};

// process user input & update game state (bulk of the engine)
// accepts optional string input; otherwise grabs it from the input element
let applyInput = (input) => {
  input = input || getInput();
  inputs.push(input);
  inputsPos = inputs.length;
  println(`> ${input}`, 'retroblue');
  const val = input.toLowerCase();
  setInput(''); // reset input field

  const exec = (cmd) => {
    if (cmd) {
      cmd();
    } else {
      println(`Sorry, I didn't understand your input. For a list of available commands, type HELP.`);
    }
  };
  
  exec(commands[val]);
};

// allows wrapping text in special characters so println can convert them to HTML tags
// string, string, string -> string
let addStyleTags = (str, char, tagName) => {
  let odd = true;
  while (str.includes(char)) {
    const tag = odd ? `<${tagName}>` : `</${tagName}>`;
    str = str.replace(char, tag);
    odd = !odd;
  }

  return str;
};

// overwrite user input
// string -> nothing
let setInput = (str) => {
  input.value = str;
  // on the next frame, move the cursor to the end of the line
  setTimeout(() => {
    input.selectionStart = input.selectionEnd = input.value.length;
  });
};

// render output, with optional class
// (string | array | fn -> string) -> nothing
let println = (line, className) => {
  // bail if string is null or undefined
  if (!line) {
    return;
  }

  str =
    // if this is an array of lines, pick one at random
    Array.isArray(line) ? pickOne(line)
    // if this is a method returning a string, evaluate it
    : typeof line  === 'function' ? line()
    // otherwise, line should be a string
    : line;

  const output = document.querySelector('#output');
  const newLine = document.createElement('div');

  if (className) {
    newLine.classList.add(className);
  }

  // add a class for styling prior user input
  if (line[0] === '>') {
    newLine.classList.add('user');
  }

  // support for markdown-like bold, italic, underline & strikethrough tags
  if (className !== 'img') {
    str = addStyleTags(str, '__', 'u');
    str = addStyleTags(str, '**', 'b');
    str = addStyleTags(str, '*', 'i');
    str = addStyleTags(str, '~~', 'strike');
  }

  // maintain line breaks
  while (str.includes('\n')) {
    str = str.replace('\n', '<br>');
  }

  output.appendChild(newLine).innerHTML = str;
  window.scrollTo(0, document.body.scrollHeight);
};

// select previously entered commands
// string -> nothing
let navigateHistory = (dir) => {
  if (dir === 'prev') {
    inputsPos--;
    if (inputsPos < 0) {
      inputsPos = 0;
    }
  } else if (dir === 'next') {
    inputsPos++;
    if (inputsPos > inputs.length) {
      inputsPos = inputs.length;
    }
  }

  setInput(inputs[inputsPos] || '');
};

// get random array element
// array -> any
let pickOne = arr => arr[Math.floor(Math.random() * arr.length)];

// return the first name if it's an array, or the only name
// string | array -> string
let getName = name => typeof name === 'object' ? name[0] : name;

// retrieve room by its ID
// string -> room
let getRoom = (id) => disk.rooms.find(room => room.id === id);

// remove punctuation marks from a string
// string -> string
let removePunctuation = str => str.replace(/[.,\/#?!$%\^&\*;:{}=\_`~()]/g,"");

// remove extra whitespace from a string
// string -> string
let removeExtraSpaces = str => str.replace(/\s{2,}/g," ");

// move the player into room with passed ID
// string -> nothing
let enterRoom = (id) => {
  const room = getRoom(id);

  if (!room) {
    println(`This stage doesn't exist`);
    return;
  }

  println(room.img, 'img');

  if (room.name) {
    println(`${getName(room.name)}`, 'room-name');
  }

  if (room.visits === 0) {
    println(room.desc);
  }

  disk.roomId = id;

};

// load the passed disk and start the game
// disk -> nothing
let loadDisk = (uninitializedDisk) => {
  // initialize the disk
  disk = init(uninitializedDisk);

  // start the game
  enterRoom(disk.roomId);

  // start listening for user input
  setup();

  // focus on the input
  input.focus();
};

// npm support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = loadDisk;
}
