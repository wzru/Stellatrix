const PPS = 90; // pai per second
const qnt = 60 / PPS; //quarter note time
const ent = qnt / 2; // eighth note time
const qntt = qnt / 3;

const faded_r1m = {
    "matrix": [
        [0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 1]
    ],
    "m_col": 4,
    "m_row": 7
};

const faded_r2m = {
    "matrix": [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 0]
    ],
    "m_col": 4,
    "m_row": 12
};

const faded_r3m = {
    "matrix": [
        [0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 1]
    ],
    "m_col": 4,
    "m_row": 7
};

const faded_r4m = {
    "matrix": [
        [0, 0, 0, 1],
        [0, 0, 0, 1],
        [0, 0, 0, 1],
        [0, 0, 1, 0]
    ],
    "m_col": 4,
    "m_row": 4
};

const faded_r5m = {
    "matrix": [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 1, 0],
        [0, 0, 1, 0, 1, 0],
        [0, 0, 0, 0, 1, 0],
        [0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 1, 0],
        [0, 0, 1, 0, 0, 1],
    ],
    "m_col": 4,
    "m_row": 6
};

const faded_r6m = {
    "matrix": [
        [0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 1],
        [0, 0, 0, 1, 0, 0],
        [0, 0, 0, 1, 0, 0],
        [1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 1]
    ],
    "m_col": 4,
    "m_row": 6
};

const faded_r7m = {
    "matrix": [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 1]
    ],
    "m_col": 4,
    "m_row": 6
};

const faded_r8m = {
    "matrix": [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 1]
    ],
    "m_col": 4,
    "m_row": 6
};

const faded_r5i = {
    "i_name": "violin",
    "speed": 5,
    "excursion": +7
}

const faded_r6_7i = {
    "i_name": "violin",
    "speed": 5,
    "excursion": +6
}

const faded_r1_4i = {
    "i_name": "violin",
    "speed": 5,
    "excursion": 0
}

function playFaded() {
    play(consecutively(list(
        make_stellatrix_sound(faded_r1m, faded_r1_4i),
        make_stellatrix_sound(faded_r2m, faded_r1_4i),
        make_stellatrix_sound(faded_r3m, faded_r1_4i),
        make_stellatrix_sound(faded_r4m, faded_r1_4i),
        make_stellatrix_sound(faded_r5m, faded_r5i),
        make_stellatrix_sound(faded_r6m, faded_r6_7i),
        make_stellatrix_sound(faded_r7m, faded_r6_7i)
    )));
}

// function playDemoMusic() {
//     setTimeout(playFaded(), 0);
// }