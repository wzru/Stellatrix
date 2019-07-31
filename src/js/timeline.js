const timelineLength = 1200; //px, timeline长度(左右)
const timelineWidth = 150;  //px, timeline宽度(上下)
const maxTime = 30;         //最大乐曲时间
const instrumentCount = 5;  //乐器数量

function calcWidth(melody) {
    return timelineWidth / instrumentCount;
}

function calcLength(melody) {
    const noteCount = removeSilence(melody["m_prop"]["matrix"]).length;
    return (single_note_time
        + (noteCount - 1)
        * interleaving_frac
        * single_note_time)
        * calcDurationRate(melody["i_prop"]["speed"])
        * timelineLength
        / maxTime;
}

function calcDuration(melody) {
    return single_note_time
        + (melody["m_prop"]["matrix"].length - 1)
        * single_note_time
        * interleaving_frac;
}

function generate_stellatrix_music(array_of_melody) {
    let dt = array_of_melody[0]["begin_px"] / timelineLength * maxTime;
    for (let i = 0; i < array_of_melody.length; i++) {
        array_of_melody[i]["duration"] = calcDuration(array_of_melody[i]);
        array_of_melody[i]["start_time"] = array_of_melody[i]["begin_px"] / timelineLength * maxTime - dt;
        if (i === 0) {
            array_of_melody[0]["end_time"] = array_of_melody[0]["duration"];
        }
        else {
            array_of_melody[i]["end_time"] = array_of_melody[i - 1]["end_time"] + array_of_melody[i]["duration"];
        }
    }
    function cmp(m1, m2) {
        if (m1["begin_px"] !== m2["begin_px"]) {
            return m1["begin_px"] < m2["begin_px"];
        }
        else return m1["duration"] < m2["duration"];
    }
    array_of_melody.sort(cmp);
    array_of_melody[0]["end_time"] = array_of_melody[0]["duration"];
    for (let i = 1; i < array_of_melody.length; i++) {
        array_of_melody[i]["end_time"] = array_of_melody[i]["start_time"] + array_of_melody[i]["duration"];
    }
    function merge(s1, s2, d) {
        const w1 = get_wave(s1), w2 = get_wave(s2);
        const d2 = get_duration(s2);
        return make_sound(
            t => (t <= d) ? w1(t)
                : w1(t) + w2(t - d),
            d + d2
        );
    }
    function add_sinlence(s, d) {
        const w1 = get_wave(s1);
        const d1 = get_duration(s1);
        return make_sound(
            t => (t <= d1) ? w1(t)
                : 0,
            d1 + d
        );
    }
    let result = make_stellatrix_sound(array_of_melody[0]["m_prop"], array_of_melody[0]["i_prop"]);
    let time = array_of_melody[0]["end_time"];
    for (let i = 1; i < array_of_melody.length; i++) {
        if (array_of_melody[i]["start_time"] > time) {
            result = merge(add_sinlence(result, array_of_melody[i]["start_time"] - time),
                make_stellatrix_sound(array_of_melody[i]["m_prop"], array_of_melody[i]["i_prop"]),
                array_of_melody[i]["start_time"]);
            // let tmp = make_sound(
            //     t => (t <= time) ? get_wave(result)(t)
            //         : (t <= array_of_melody[i]["start_time"])
            //             ? 0
            //             : get_wave(make_stellatrix_sound(array_of_melody[i]["m_prop"], array_of_melody[i]["i_prop"]))(t - array_of_melody[i]["start_time"]),
            //     array_of_melody[i]["end_time"]
            // );
            // result = tmp;
        }
        else {
            result = merge(result, make_stellatrix_sound(array_of_melody[i]["m_prop"], array_of_melody[i]["i_prop"]), array_of_melody[i]["start_time"]);
            // let tmp = make_sound(
            //     t => (t <= array_of_melody[i]["start_time"]) ? get_wave(result)(t)
            //         : get_wave(result)(t)
            //         + get_wave(make_stellatrix_sound(array_of_melody[i]["m_prop"], array_of_melody[i]["i_prop"]))(t - array_of_melody[i]["start_time"]),
            //     array_of_melody[i]["end_time"]
            // );
            // result = tmp;
        }
        time = array_of_melody[i]["end_time"];
    }
    return result;
}