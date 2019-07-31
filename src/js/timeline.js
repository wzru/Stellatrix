const timelineLength = 1200; //timeline长度(左右)
const timelineWidth = 150;  //timeline宽度(上下)
const maxTime = 30;         //最大乐曲时间
const instrumentCount = 5;  //乐器数量

function calcWidth(melody) {
    return timelineWidth / instrumentCount;
}

function calcLength(melody) {
    return removeSilence(melody["m_prop"]["matrix"]).length 
        * single_note_time 
        * calcDurationRate(melody["i_prop"]["speed"])
        * timelineLength
        / maxTime;
}  