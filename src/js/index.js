const matrix_row = 12;
const matrix_col = 12;

const origin_color = "rgb(42, 42, 42)";

const defaults = [5, 0, 5];

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

renderMatrix = () => {
    for(let i = matrix_row - 1; i >= 0; i--) {
        let newdiv = document.createElement("div");
        let class_value = i + "-row rows";
        newdiv.setAttribute("class", class_value);
        for(let j = 0; j < matrix_col; j++) {
            let newbutton = document.createElement("button");
            let click_value = "chooseButton(this)";
            let class_value = i + "-" + j + " buttons";
            newbutton.setAttribute("onclick", click_value);
            newbutton.setAttribute("class", class_value);
            newdiv.appendChild(newbutton);
            document.getElementsByClassName("launchpad")[0].appendChild(newdiv);
        }
    }
}
renderMatrix();

getRow = (str) => {
    let t = 0;
    while(str[t] != "-") {
        t++;
    }
    return str.slice(0, t);
}
getCol = (str) => {
    let t = str.length;
    while(str[t] != "-") {
        t--;
    }
    return str.slice(t + 1, str.length - 8);
}
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

clearAll = () => {
    //clear buttons
    for(let i = 0; i < matrix_col; i++) {
        for(let j = 0; j < matrix_row; j++) {
            chosen[i][j] = 0;
            document.getElementsByClassName("buttons")[i * matrix_col + j].style.backgroundColor = origin_color;
        }
    }
    //clear properties
    for(let i = 0; i < 3; i++) {
        let inputbutton = document.getElementsByClassName("roll_bar")[i].childNodes[3];
        inputbutton.value = defaults[i];
        document.getElementsByClassName("roll_bar")[i].childNodes[5].innerHTML = defaults[i];
    }
    instrument_property.speed = 5;
    instrument_property.excursion = 0;
    instrument_property.force = 5;
}

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

setInstrument = (e) => {
    instrument_property.i_name = e.childNodes[1].innerHTML.toLowerCase();
    for(let i = 0; i < 5; i++) {
        document.getElementsByClassName("instrument")[i].classList.remove("currentInstrument");
    }
    e.className += " currentInstrument";
}

test = () => {
    let music = make_stellatrix_sound(matrix_property, instrument_property);
    play(music);
} 
