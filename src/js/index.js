const matrix_row = 14;
const matrix_col = 14;
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

let current_music = -1;

//Two-dimensional array, if this button is chosen
var chosen = new Array(matrix_col);
for (let i = 0; i < matrix_col; i++) {
    chosen[i] = new Array(matrix_row);
    for (let j = 0; j < matrix_row; j++) {
        chosen[i][j] = 0;
    }
}

var music_list = [];

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

let curdiv = document.getElementsByClassName("current_music")[0];
let newtext = document.createTextNode("current music is " + current_music);
curdiv.appendChild(newtext);

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
    if (has_changed === 0) {
        has_changed = 1;
        tryPlaySound();
    }
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

switchPlayState = () => {
    tryPlaySound();
}

switchLoopState = () => {
    is_loop = is_loop ^ 1;
    if (document.getElementsByClassName('loop_state')[0].innerHTML === "loop") {
        document.getElementsByClassName('loop_state')[0].innerHTML = "no loop";
    }
    else {
        document.getElementsByClassName('loop_state')[0].innerHTML = "loop";
    }
}
switchNewState = () => {
    switchSaveState();
    switchClearState();
    current_music = -1;
}
switchSaveState = () => {
    let m_prop = {};
    let i_prop = {};
    let c = new Array(matrix_col);
    for (let i = 0; i < matrix_col; i++) {
        c[i] = new Array(matrix_row);
        for (let j = 0; j < matrix_row; j++) {
            c[i][j] = chosen[i][j];
        }
    }
    m_prop.m_row = matrix_property.m_row;
    m_prop.m_col = matrix_property.m_col;
    m_prop.matrix = c;
    i_prop.i_name = instrument_property.i_name;
    i_prop.speed = instrument_property.speed;
    i_prop.excursion = instrument_property.excursion;
    i_prop.force = instrument_property.force;

    if(current_music === -1) {
        let num = music_list.length;
        current_music = num;
        let music_fragment = {
            "music_id":         num,
            "m_prop":           m_prop,
            "i_prop":           i_prop
        }
        music_list.push(music_fragment);
        let newdiv = document.getElementsByClassName("num" + num)[0];
        let newp = document.createElement("p");
        let newtext = document.createTextNode(num + 1 + ". " + i_prop.i_name);
        newp.appendChild(newtext);
        newdiv.appendChild(newp);
        console.log(music_list);
    }
    else {
        let num = current_music;
        music_list[num].m_prop = m_prop;
        music_list[num].i_prop = i_prop;
        console.log(music_list);
    }
}

//click clear button and reset everything to default
switchClearState = () => {
    document.getElementsByClassName('loop_state')[0].innerHTML = "loop";
    is_stop = 1;
    //clear buttons
    for (let i = 0; i < matrix_col; i++) {
        for (let j = 0; j < matrix_row; j++) {
            chosen[i][j] = 0;
            document.getElementsByClassName("buttons")[(matrix_row - j - 1) * matrix_col + i].style.backgroundColor = origin_color;
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

chooseMelody = (e) => {
    let num = e.getAttribute("data-num");
    current_music = num;
    //调整launchpad
    for(let i = 0; i < matrix_col; i++) {
        for(let j = 0; j < matrix_row; j++) {
            chosen[i][j] = music_list[num].m_prop.matrix[i][j];
            if(chosen[i][j] === 0) {
                document.getElementsByClassName("buttons")[(matrix_row - j - 1) * matrix_col + i].style.backgroundColor = origin_color;
            }
            else {
                document.getElementsByClassName("buttons")[(matrix_row - j - 1) * matrix_col + i].style.backgroundColor = "white";
            }
        }
    }
    matrix_property = music_list[num].m_prop;
    instrument_property = music_list[num].i_prop;
    //调整乐器栏
    for (let i = 0; i < 5; i++) {
        document.getElementsByClassName("instrument")[i].classList.remove("currentInstrument");
    }
    let cur_instrument = document.getElementsByClassName(music_list[num].i_prop.i_name)[0];
    cur_instrument.className += " currentInstrument";
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

play_stellatrix_sound = () => {
    if (has_changed === 1) {
        sound = make_stellatrix_sound(matrix_property, instrument_property);
        has_changed = 0;
    }
    play(sound);
    is_play = 0;
    if (is_loop === 1) tryPlaySound();
}


tryPlaySound = () => {
    function doTry() {
        if (is_play === 0) {
            is_play === 1;
            setTimeout(play_stellatrix_sound, 0);
        }
    }
    setTimeout(doTry, 0);
}