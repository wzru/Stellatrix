import interact from "interactjs"

const matrix_row = 14;
const matrix_col = 14;
//button's origion color
const origin_color = "rgb(42, 42, 42)";
//default speed, excursion and force
const defaults = [5, 0, 5];

const colors = ["red", "orange", "yello", "green", "blue", "purple"];

let sound = null;
let is_play = 0;

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
var timeline_list = [];

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
}

window.addEventListener("mouseup", function () {
    if (mouse_state !== -1) {
        start_row = -1;
        start_col = -1;
        mouse_state = -1;
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
    if(mouse_state !== chosen[col][row]) {
        if (chosen[col][row] === 0) {
            chosen[col][row] = 1;
            e.style.backgroundColor = "white"
        }
        else {
            chosen[col][row] = 0;
            e.style.backgroundColor = origin_color;
        }
    }
    
    mouse_state = -1;
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
    }
}

//set instrument when you click the instruments buttons
setInstrument = (e) => {
    instrument_property.i_name = e.childNodes[1].innerHTML.toLowerCase();
    for (let i = 0; i < 5; i++) {
        document.getElementsByClassName("instrument")[i].classList.remove("currentInstrument");
    }
    //change the current instrument's style
    e.className += " currentInstrument";
}

switchPlayState = () => {
    tryPlaySound();
}

switchNewState = () => {
    switchSaveState();
    switchClearState();
    current_music = -1;

    let lists = document.getElementsByClassName("lists");
    let length = lists.length;
    for (let i = 0; i < length; i++) {
        lists[i].classList.remove("currentList");
    }
    let num = music_list.length;
    let newdiv = document.createElement("div");
    let class_value = "lists num" + num + " currentList";
    newdiv.setAttribute("class", class_value);
    newdiv.setAttribute("onmousedown", "chooseMelody(this)");
    newdiv.setAttribute("data-num", num);
    document.getElementsByClassName("melody_list")[0].appendChild(newdiv);
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

    if (current_music === -1) {
        let num = music_list.length;
        current_music = num;
        let music_fragment = {
            "music_id": num,
            "m_prop": m_prop,
            "i_prop": i_prop
        }
        music_list.push(music_fragment);
        //渲染music_list
        let newdiv = document.getElementsByClassName("num" + num)[0];
        //如果当前为歌曲为新建歌曲且没有点过save 而是通过new来调用的save 那么给它取个名字
        if(newdiv.childNodes[0] === undefined) {
            //给片段取名
            let input_value = num + 1 + ". " + i_prop.i_name;
            let newinput = document.createElement("input");
            newinput.setAttribute("value", input_value);
            newinput.setAttribute("ondblclick", "removeBlur(this)");
            newinput.setAttribute("onfocus", "this.blur()");
            newinput.setAttribute("onblur", "setBlur(this)");
            newdiv.appendChild(newinput);
            //创建del按钮
            let newdel = document.createElement("span");
            let del_value = document.createTextNode("×");
            newdel.appendChild(del_value);
            newdel.setAttribute("class", "del");
            newdel.setAttribute("onclick", "delMelody(this)");
            newdiv.appendChild(newdel);
            //创建 添加到时间轴 按钮
            let newadd = document.createElement("button");
            newadd.setAttribute("title", "click to add to timeline");
            newadd.setAttribute("onclick", "addToTimeline(this)");
            let add_value = document.createTextNode("add");
            newadd.appendChild(add_value);
            newdiv.appendChild(newadd);
        }
    }
    //如果是刚刚删除过的 什么都不做
    else if(current_music === -2) {
        
    }
    //如果是当前选中某一段音乐 更新当前片段数据
    else {
        let num = current_music;
        music_list[num].m_prop = m_prop;
        music_list[num].i_prop = i_prop;

        // let newdiv = document.getElementsByClassName("num" + num)[0];
        // //如果当前为歌曲为新建歌曲且没有点过save 而是通过new来调用的save 那么给它取个名字
        // if(newdiv.childNodes[0] === undefined) {
        //     let input_value = num + 1 + ". " + i_prop.i_name;
        //     let newinput = document.createElement("input");
        //     newinput.setAttribute("value", input_value);
        //     newinput.setAttribute("ondblclick", "removeBlur(this)");
        //     newinput.setAttribute("onfocus", "this.blur()");
        //     newinput.setAttribute("onblur", "setBlur(this)");
        //     newdiv.appendChild(newinput);
        //     let newdel = document.createElement("span");
        //     let del_value = document.createTextNode("×");
        //     newdel.appendChild(del_value);
        //     newdel.setAttribute("class", "del");
        //     newdel.setAttribute("onclick", "delMelody(this)");
        //     newdiv.appendChild(newdel);
        // }
    }
}
//click clear button and reset everything to default
switchClearState = () => {
    is_stop = 1;
    //clear buttons
    for (let i = 0; i < matrix_col; i++) {
        for (let j = 0; j < matrix_row; j++) {
            chosen[i][j] = 0;
            document.getElementsByClassName("buttons")[(matrix_row - j - 1) * matrix_col + i].style.backgroundColor = origin_color;
        }
    }
    //reset instrument
    instrument_property.i_name = "piano";
    for (let i = 0; i < 5; i++) {
        document.getElementsByClassName("instrument")[i].classList.remove("currentInstrument");
    }
    document.getElementsByClassName("piano")[0].className += " currentInstrument";
    //reset properties
    resetDefault();
}

//双击时移除input的禁止聚焦事件
removeBlur = (e) => {
    e.removeAttribute("onfocus");
    e.focus();
}
//当input失去焦点时再禁止单击聚焦
setBlur = (e) => {
    e.setAttribute("onfocus", "this.blur()");
}

delMelody = (e) => {
    let del_num = e.parentNode.getAttribute("data-num");
    // music_list.splice(del_num, 1);
    e.parentNode.parentNode.removeChild(document.getElementsByClassName("num" + del_num)[0]);
    switchClearState();
    //独有的记录删除了乐曲的标记
    current_music = -2;
}

chooseMelody = (e) => {
    let lists = document.getElementsByClassName("lists");
    let length = lists.length;
    for (let i = 0; i < length; i++) {
        lists[i].classList.remove("currentList");
    }
    e.classList.add("currentList");
    //如果当前片段还未保存
    if(current_music === -1) {
        switchSaveState();
    }
    //如果当前列表未存储片段
    if(e.childNodes[0] === undefined) {
        current_music = -1;
        switchClearState();
    }
    else {
        let num = e.getAttribute("data-num");
        current_music = num;
        let cur_m_prop = music_list[num].m_prop;
        let cur_i_prop = music_list[num].i_prop;
        //调整launchpad
        for (let i = 0; i < matrix_col; i++) {
            for (let j = 0; j < matrix_row; j++) {
                chosen[i][j] = music_list[num].m_prop.matrix[i][j];
                if (chosen[i][j] === 0) {
                    document.getElementsByClassName("buttons")[(matrix_row - j - 1) * matrix_col + i].style.backgroundColor = origin_color;
                }
                else {
                    document.getElementsByClassName("buttons")[(matrix_row - j - 1) * matrix_col + i].style.backgroundColor = "white";
                }
            }
        }
        matrix_property = cur_m_prop;
        instrument_property = cur_i_prop;
        //调整乐器栏
        for (let i = 0; i < 5; i++) {
            document.getElementsByClassName("instrument")[i].classList.remove("currentInstrument");
        }
        let cur_instrument = document.getElementsByClassName(cur_i_prop.i_name)[0];
        cur_instrument.className += " currentInstrument";
        //调整properties
        let values = [];
        values.push(cur_i_prop.speed);
        values.push(cur_i_prop.excursion);
        for (let i = 0; i < 2; i++) {
            let inputbutton = document.getElementsByClassName("roll_bar")[i].childNodes[3];
            inputbutton.value = values[i];
            document.getElementsByClassName("roll_bar")[i].childNodes[5].innerHTML = values[i];
        }
    }
    
}

addToTimeline = (e) => {
    let melody = {};
    let m_prop = {};
    let i_prop = {};
    let cur_num = e.parentNode.getAttribute("data-num");
    let cur_melody = music_list[cur_num];

    let c = new Array(matrix_col);
    for(let i = 0; i < matrix_col; i++) {
        c[i] = new Array(matrix_row);
        for(let j = 0; j < matrix_row; j++) {
            c[i][j] = cur_melody.m_prop.matrix[i][j];
        }
    }

    m_prop.m_col = cur_melody.m_prop.m_col;
    m_prop.matrix = c;

    i_prop.i_name = cur_melody.i_prop.i_name;
    i_prop.speed = cur_melody.i_prop.speed;
    i_prop.excursion = cur_melody.i_prop.excursion;
    i_prop.force = cur_melody.i_prop.force;

    melody.music_id = timeline_list.length;
    melody.m_prop = m_prop;
    melody.i_prop = i_prop;
    melody.begin_px = 0;
    melody.color = colors[melody.music_id % colors.length];

    timeline_list.push(melody);

    // let width = calcLength(melody);
    // let height = calcWidth(melody);
    let width = "200px";
    let height  = "50px";
    let newdiv = document.createElement("div");
    newdiv.style.width = width;
    newdiv.style.height = height;
    newdiv.style.backgroundColor = melody.color;
    newdiv.setAttribute("class", "draggable");

    document.getElementsByClassName("timeline")[0].appendChild(newdiv);
}

render_timeline = () => {
    let timeline = document.getElementsByClassName("timeline")[0];
    timeline.style.width = timelineLength + "px";
    timeline.style.height = timelineWidth + "px";
}
render_timeline();

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
}

play_stellatrix_sound = () => {
    sound = make_stellatrix_sound(matrix_property, instrument_property);
    play(sound);
    is_play = 0;
}

tryPlaySound = () => {
    function doTry() {
        if (is_play === 0) {
            is_play = 1;
            setTimeout(play_stellatrix_sound, 0);
        }
    }
    setTimeout(doTry, 0);
}
