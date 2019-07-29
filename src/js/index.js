const matrix_row = 12;
const matrix_col = 12;
//button's origion color
const origin_color = "rgb(42, 42, 42)";
//default speed, excursion and force
const defaults = [5, 0, 5];

//Two-dimensional array, if this button is chosen
var chosen = new Array(matrix_col);
for(let i = 0; i < matrix_col; i++) {
    chosen[i] = new Array(matrix_row);
    for(let j = 0; j < matrix_row; j++) {
        chosen[i][j] = 0;
    }
}

matrix_property = {
    "m_row":                matrix_row,
    "m_col":                matrix_col,
    "matrix":               chosen
}

instrument_property = {
    "i_name":               "piano",
    "speed":                5,
    "excursion":             0,
    "force":                5
}

//render buttons on this page
renderMatrix = () => {
    for(let i = matrix_row - 1; i >= 0; i--) {
        //a newdiv is a row
        let newdiv = document.createElement("div");
        let class_value = i + "-row rows";
        newdiv.setAttribute("class", class_value);
        for(let j = 0; j < matrix_col; j++) {
            let newbutton = document.createElement("button");
            //add click event value
            let click_value = "chooseButton(this)";
            //add row and colum to class
            let class_value = i + "-" + j + " buttons";
            newbutton.setAttribute("onclick", click_value);
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
    while(str[t] != "-") {
        t++;
    }
    return str.slice(0, t);
}
//get colum number by classname
getCol = (str) => {
    let t = str.length;
    while(str[t] != "-") {
        t--;
    }
    return str.slice(t + 1, str.length - 8);
}
//change chosen array when you click a button
chooseButton = (e) => {
    let row = getRow(e.className);
    let col = getCol(e.className);
    if(chosen[col][row] === 0) {
        chosen[col][row] = 1;
        e.style.backgroundColor = "white"
    }
    else {
        chosen[col][row] = 0;
        e.style.backgroundColor = origin_color;
    }
}
//change property number when you slide the rollbar
changeNumber = (e) => {
    e.nextElementSibling.innerHTML = e.value;
    let property = e.previousElementSibling.innerHTML.toLowerCase();
    if(property === "speed") {
        instrument_property.speed = parseInt(e.value);
    }
    else if(property === "excursion") {
        instrument_property.excursion = parseInt(e.value);
    }
    else if(property === "force") {
        instrument_property.force = parseInt(e.value);
    }
}
//click clear button and reset everything to default
clearAll = () => {
    //clear buttons
    for(let i = 0; i < matrix_col; i++) {
        for(let j = 0; j < matrix_row; j++) {
            chosen[i][j] = 0;
            document.getElementsByClassName("buttons")[i * matrix_col + j].style.backgroundColor = origin_color;
        }
    }
    //clear property rollbars
    for(let i = 0; i < 3; i++) {
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
    for(let i = 0; i < 3; i++) {
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
    for(let i = 0; i < 5; i++) {
        document.getElementsByClassName("instrument")[i].classList.remove("currentInstrument");
    }
    //change the current instrument's style
    e.className += " currentInstrument";
}
//when you click, play the music
test = () => {
    let music = make_stellatrix_sound(matrix_property, instrument_property);
    play(music);
} 
