const matrix_num = 12;

var chosen = new Array(matrix_num);
for(let i = 0; i < matrix_num; i++) {
    chosen[i] = new Array(matrix_num);
    for(let j = 0; j < matrix_num; j++) {
        chosen[i][j] = false;
    }
}

matrix_property = {
    "m_row":                matrix_num,
    "m_col":                matrix_num,
    "matrix":               chosen
}

instrument_property = {
    "i_name":               "piano",
    "speed":                5,
    "excusion":             0,
    "force":                5
}



renderMatrix = () => {
    for(let i = matrix_num - 1; i >= 0; i--) {
        let newdiv = document.createElement("div");
        let class_value = i + "-row rows";
        newdiv.setAttribute("class", class_value);
        for(let j = 0; j < matrix_num; j++) {
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

test = (e) => {
    e.style.backgroundColor = "blue";
    console.log(e.style["background-color"]);
}
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
    console.log(window.chosen);
    let row = getRow(e.className);
    let col = getCol(e.className);
    console.log("row:",row,"col: ",col);
    if(chosen[row][col] === false) {
        chosen[row][col] = true;
        e.style.backgroundColor = "white"
    }
    else {
        chosen[row][col] = false;
        e.style.backgroundColor = "rgb(42, 42, 42)";
    }
}

