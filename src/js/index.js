const matrix_row = 12;
const matrix_col = 12;

var chosen = new Array(matrix_row);
for(let i = 0; i < matrix_row; i++) {
    chosen[i] = new Array(matrix_col);
    for(let j = 0; j < matrix_col; j++) {
        chosen[i][j] = false;
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
    "excusion":             0,
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
            let class_value = i + "-" + j;
            newbutton.setAttribute("onclick", click_value);
            newbutton.setAttribute("class", class_value);
            newdiv.appendChild(newbutton);
            document.getElementsByClassName("buttons")[0].appendChild(newdiv);
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
    return str.slice(t + 1, str.length);
}
chooseButton = (e) => {
    let row = getRow(e.className);
    let col = getCol(e.className);
    if(chosen[row][col] === false) {
        chosen[row][col] = true;
        e.style.backgroundColor = "white"
    }
    else {
        chosen[row][col] = false;
        e.style.backgroundColor = "rgb(42, 42, 42)";
    }
}

changeNumber = (e) => {
    e.nextElementSibling.innerHTML = e.value;
}