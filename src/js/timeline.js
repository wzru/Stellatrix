const timelineLength = 600;
const timelineWidth = 200;
const maxTime = 30;
const instrumentCount = 5;

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