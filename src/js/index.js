const matrix_row = 12;
const matrix_col = 12;
//button's origion color
const origin_color = "rgb(42, 42, 42)";
//default speed, excursion and force
const defaults = [5, 0, 5];

let is_loop = 1;
let is_stop = 1;
let is_play = 0;
let has_changed = 1;
let sound = null;

let mouse_state = -1;
let start_row = -1;
let start_col = -1;

//Two-dimensional array, if this button is chosen
var chosen = new Array(matrix_col);
for (let i = 0; i < matrix_col; i++) {
    chosen[i] = new Array(matrix_row);
    for (let j = 0; j < matrix_row; j++) {
        chosen[i][j] = 0;
    }
}

matrix_property = {
    "m_row": matrix_row,
    "m_col": matrix_col,
    "matrix": chosen
}

instrument_property = {
    "i_name": "piano",
    "speed": 5,
    "excursion": 0,
    "force": 5
}

//render buttons on this page
renderMatrix = () => {
    for (let i = matrix_row - 1; i >= 0; i--) {
        //a newdiv is a row
        let newdiv = document.createElement("div");
        let class_value = i + "-row rows";
        newdiv.setAttribute("class", class_value);
        for (let j = 0; j < matrix_col; j++) {
            let newbutton = document.createElement("button");
            //add events value
            //let click_value = "chooseButton(this)";
            let mousedown_value = "mousedownButton(this)";
            let mouseup_value = "mouseupButton(this)";
            let mouseover_value = "mouseoverButton(this)";
            //add row and colum to class
            let class_value = i + "-" + j + " buttons";
            newbutton.setAttribute("onmousedown", mousedown_value);
            newbutton.setAttribute("onmouseup", mouseup_value);
            newbutton.setAttribute("onmouseover", mouseover_value);
            newbutton.setAttribute("class", class_value);
            newdiv.appendChild(newbutton);
            document.getElementsByClassName("launchpad")[0].appendChild(newdiv);
        }
    }
}
renderMatrix();

//get row number by classname
getRow = (str) => {
    let t = 0;
    while (str[t] != "-") {
        t++;
    }
    return str.slice(0, t);
}

//get colum number by classname
getCol = (str) => {
    let t = str.length;
    while (str[t] != "-") {
        t--;
    }
    return str.slice(t + 1, str.length - 8);
}

// change chosen array when you click a button
mousedownButton = (e) => {
    let row = getRow(e.className);
    let col = getCol(e.className);
    start_row = row;
    start_col = col;
    if (chosen[col][row] === 0) {
        chosen[col][row] = 1;
        e.style.backgroundColor = "white"
        mouse_state = 1;
    }
    else {
        chosen[col][row] = 0;
        e.style.backgroundColor = origin_color;
        mouse_state = 0;
    }
    //tryPlaySound();
}

window.addEventListener("mouseup", function () {
    start_row = -1;
    start_col = -1;
    mouse_state = -1;
    has_changed = 1;
    tryPlaySound();
})

mouseupButton = (e) => {
    let row = getRow(e.className);
    let col = getCol(e.className);
    if (start_row === row && start_col === col) {
        mouse_state = -1;
        return;
    }
    start_row = -1;
    start_col = -1;
    if (chosen[col][row] === 0) {
        chosen[col][row] = 1;
        e.style.backgroundColor = "white"
    }
    else {
        chosen[col][row] = 0;
        e.style.backgroundColor = origin_color;
    }
    mouse_state = -1;
    has_changed = 1;
    tryPlaySound();
}

mouseoverButton = (e) => {
    let row = getRow(e.className);
    let col = getCol(e.className);
    if (mouse_state !== -1 && mouse_state !== chosen[col][row]) {
        if (chosen[col][row] === 0) {
            chosen[col][row] = 1;
            e.style.backgroundColor = "white"
        }
        else {
            chosen[col][row] = 0;
            e.style.backgroundColor = origin_color;
        }
        has_changed = 1;
        tryPlaySound();
    }
}

//change property number when you slide the rollbar
changeNumber = (e) => {
    e.nextElementSibling.innerHTML = e.value;
    let property = e.previousElementSibling.innerHTML.toLowerCase();
    if (property === "speed") {
        instrument_property.speed = parseInt(e.value);
    }
    else if (property === "excursion") {
        instrument_property.excursion = parseInt(e.value);
    }
    else if (property === "force") {
        instrument_property.force = parseInt(e.value);
    }
    has_changed = 1;
    tryPlaySound();
}

function switchPlayState() {
    tryPlaySound();
}

function switchLoopState() {
    is_loop = is_loop ^ 1;
    if (document.getElementById('loop_state').innerHTML === "loop") {
        document.getElementById('loop_state').innerHTML = "no loop";
    }
    else {
        document.getElementById('loop_state').innerHTML = "loop";
    }
}

//click clear button and reset everything to default
function switchClearState() {
    document.getElementById('loop_state').innerHTML = "loop";
    is_loop = 0;
    is_stop = 1;
    //clear buttons
    for (let i = 0; i < matrix_col; i++) {
        for (let j = 0; j < matrix_row; j++) {
            chosen[i][j] = 0;
            document.getElementsByClassName("buttons")[i * matrix_col + j].style.backgroundColor = origin_color;
        }
    }
    //clear property rollbars
    for (let i = 0; i < 2; i++) {
        let inputbutton = document.getElementsByClassName("roll_bar")[i].childNodes[3];
        inputbutton.value = defaults[i];
        document.getElementsByClassName("roll_bar")[i].childNodes[5].innerHTML = defaults[i];
    }
    //clear property numbers
    instrument_property.speed = 5;
    instrument_property.excursion = 0;
    instrument_property.force = 5;
}

//click reset button and set properties to default
resetDefault = () => {
    for (let i = 0; i < 2; i++) {
        let inputbutton = document.getElementsByClassName("roll_bar")[i].childNodes[3];
        inputbutton.value = defaults[i];
        document.getElementsByClassName("roll_bar")[i].childNodes[5].innerHTML = defaults[i];
    }
    instrument_property.speed = 5;
    instrument_property.excursion = 0;
    instrument_property.force = 5;
}

//set instrument when you click the instruments buttons
setInstrument = (e) => {
    instrument_property.i_name = e.childNodes[1].innerHTML.toLowerCase();
    for (let i = 0; i < 5; i++) {
        document.getElementsByClassName("instrument")[i].classList.remove("currentInstrument");
    }
    //change the current instrument's style
    e.className += " currentInstrument";
    tryPlaySound();
}

function play_stellatrix_sound() {
    if (has_changed === 1) {
        sound = make_stellatrix_sound(matrix_property, instrument_property);
        has_changed = 0;
    }
    play(sound);
    is_play = 0;
    if (is_loop === 1) tryPlaySound();
}

//when you click, play the music
test = () => {
    let music = make_stellatrix_sound(matrix_property, instrument_property);
    play(music);
}

function tryPlaySound() {
    function doTry() {
        if (is_play === 0) {
            is_play === 1;
            setTimeout(play_stellatrix_sound, 0);
        }
    }
    setTimeout(doTry, 0);
}