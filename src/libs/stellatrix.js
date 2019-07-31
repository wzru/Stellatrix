/*
  Modified from cadet-fronted
  (https://github.com/source-academy/cadet-frontend/blob/master/public/externalLibs/sound/soundToneMatrix.js)
*/
/*
  some constant
*/
const standard_note_name = "C4";
const standard_note = letter_name_to_midi_note(standard_note_name);
const single_note_time = 0.625;
const interleaving_frac = 3 / 4;

var $tone_matrix; // canvas container for tone matrix

var color_white = "#ffffff"; // color of the highlighted square
var color_white_2 = "#666666"; // color of the adjacent squares
var color_white_3 = "#444444"; // color of the squares that are two units from the highlighted square
var color_on = "#cccccc";
var color_off = "#333333";

// the side length of the squares in the matrix
var square_side_length = 18;

// the distance between two adjacent squares in the matrix
var distance_between_squares = 6;

// margin of the canvas
var margin_length = 20;

// the duration for playing one grid is 0.5s
var grid_duration = 0.5;
// but the duration for playing one entire sound is 1 (which means there will be reverberations)
var sound_duration = 1;

// for playing the tone matrix repeatedly in play_matrix_continuously function
var timeout_matrix;
// for coloring the matrix accordingly while it's being played
var timeout_color;

var timeout_objects = new Array();

// given the x, y coordinates of a "click" event
// return the row and column numbers of the clicked square
function x_y_to_row_column(x, y) {
  var row = Math.floor((y - margin_length) / (square_side_length + distance_between_squares));
  var column = Math.floor((x - margin_length) / (square_side_length + distance_between_squares));
  return Array(row, column);
}

// given the row number of a square, return the leftmost coordinate
function row_to_y(row) {
  return margin_length + row * (square_side_length + distance_between_squares);
}

// given the column number of a square, return the topmost coordinate
function column_to_x(column) {
  return margin_length + column * (square_side_length + distance_between_squares);
}

// return a list representing a particular row
function get_row(row) {
  return vector_to_list(matrix[row]);
}

// return a list representing a particular column
function get_column(column) {
  var result = new Array(16);
  for (var i = 15; i >= 0; i--) {
    result[i] = matrix[i][column];
  };
  return vector_to_list(result);
}

function is_on(row, column) {
  if (row < 0 || row > 15 || column < 0 || column > 15) {
    return;
  }

  return matrix[row][column];
}

// set the color of a particular square
function set_color(row, column, color) {
  if (row < 0 || row > 15 || column < 0 || column > 15) {
    return;
  }

  var ctx = $tone_matrix.getContext("2d");
  ctx.fillStyle = color;

  ctx.fillRect(column_to_x(column),
    row_to_y(row),
    square_side_length,
    square_side_length);
}

// highlight a given square
function highlight_color(row, column, color) {
  set_color(row, column, color);
}

// given the square that we are supposed to highlight, color the neighboring squares
function set_adjacent_color_1(row, column, color) {
  if (!is_on(row, column - 1)) {
    set_color(row, column - 1, color);
  }

  if (!is_on(row, column + 1)) {
    set_color(row, column + 1, color);
  }

  if (!is_on(row - 1, column)) {
    set_color(row - 1, column, color);
  }

  if (!is_on(row + 1, column)) {
    set_color(row + 1, column, color);
  }
}

// given the square that we are supposed to highlight, color the squares 2 units from it
function set_adjacent_color_2(row, column, color) {
  if (!is_on(row, column - 2)) {
    set_color(row, column - 2, color);
  }

  if (!is_on(row + 1, column - 1)) {
    set_color(row + 1, column - 1, color);
  }

  if (!is_on(row + 2, column)) {
    set_color(row + 2, column, color);
  }

  if (!is_on(row + 1, column + 1)) {
    set_color(row + 1, column + 1, color);
  }

  if (!is_on(row, column + 2)) {
    set_color(row, column + 2, color);
  }

  if (!is_on(row - 1, column + 1)) {
    set_color(row - 1, column + 1, color);
  }

  if (!is_on(row - 2, column)) {
    set_color(row - 2, column, color);
  }

  if (!is_on(row - 1, column - 1)) {
    set_color(row - 1, column - 1, color);
  }
}

// redraw a matrix according to the current state of the matrix
function redraw_matrix() {
  for (var i = 15; i >= 0; i--) {
    for (var j = 15; j >= 0; j--) {
      if (matrix[i][j]) {
        set_color(i, j, color_on);
      } else {
        set_color(i, j, color_off);
      }
    };
  };
}

var ToneMatrix = {};

function initialise_matrix($container) {
  if (!$tone_matrix) {
    $tone_matrix = document.createElement('canvas');
    $tone_matrix.width = 420;
    $tone_matrix.height = 420;
    // the array representing the configuration of the matrix
    matrix = new Array(16);

    // the visualisation of the matrix itself
    var ctx = $tone_matrix.getContext("2d");

    // draw the initial matrix
    for (var i = 15; i >= 0; i--) {
      matrix[i] = new Array(16);
      for (var j = 15; j >= 0; j--) {
        set_color(i, j, color_off);
        matrix[i][j] = false;
      };
    };

    bind_events_to_rect($tone_matrix);
  }
  $tone_matrix.hidden = false
  $container.appendChild($tone_matrix)
}
ToneMatrix.initialise_matrix = initialise_matrix;

// bind the click events to the matrix
function bind_events_to_rect(c) {
  c.addEventListener('click', function (event) {
    // calculate the x, y coordinates of the click event
    var offset_left = $(this).offset().left;
    var offset_top = $(this).offset().top;
    var x = event.pageX - offset_left;
    var y = event.pageY - offset_top;

    // obtain the row and column numbers of the square clicked
    var row_column = x_y_to_row_column(x, y);
    var row = row_column[0];
    var column = row_column[1];

    if (row < 0 || row > 15 || column < 0 || column > 15) {
      return;
    }

    if (matrix[row][column] == undefined || !matrix[row][column]) {
      matrix[row][column] = true;
      set_color(row, column, color_on);
    } else {
      matrix[row][column] = false;
      set_color(row, column, color_off);
    }
  }, false);
}

function random_animate() {
  for (var i = 5; i >= 0; i--) {
    var row = Math.floor(Math.random() * 16);
    var column = Math.floor(Math.random() * 16);
    if (!is_on(row, column)) {
      set_color(row, column, color_white_3);
    }
  };

  for (var i = 10; i >= 0; i--) {
    var row = Math.floor(Math.random() * 16);
    var column = Math.floor(Math.random() * 16);
    if (!is_on(row, column)) {
      set_color(row, column, color_off);
    }
  };
}

function animate_column(n) {
  if (n < 0 || n > 15) {
    return;
  }

  var column = list_to_vector(get_column(n));

  for (var j = 0; j <= 15; j++) {
    if (column[j]) {
      // if a particular square is clicked, highlight itself
      // and the neighboring squares in the animation
      highlight_color(j, n, color_white);
      set_adjacent_color_1(j, n, color_white_2);
      set_adjacent_color_2(j, n, color_white_3);
    }
  };
}

function unanimate_column(n) {
  if (n < 0 || n > 15) {
    return;
  }

  var column = list_to_vector(get_column(n));

  for (var j = 0; j <= 15; j++) {
    if (column[j]) {
      highlight_color(j, n, color_on);
      set_adjacent_color_1(j, n, color_off);
      set_adjacent_color_2(j, n, color_off);
    }
  };
}

// generate a randomised matrix
function randomise_matrix() {
  var ctx = $tone_matrix.getContext("2d");
  var on; // the square in the matrix is on or off

  clear_matrix();
  // draw the randomised matrix
  for (var i = 15; i >= 0; i--) {
    for (var j = 15; j >= 0; j--) {
      on = Math.random() > 0.9;
      if (on) {
        set_color(i, j, color_on);
        matrix[i][j] = true;
      } else {
        set_color(i, j, color_off);
        matrix[i][j] = false;
      }
    };
  };
}
ToneMatrix.randomise_matrix = randomise_matrix;

function bindMatrixButtons() {
  $("#clear-matrix").on("click", function () {
    clear_matrix();
    // stop_matrix();
    $("#play-matrix").attr("value", "Play");
  });

  // $("#play-matrix").on("click", function () {
  //     if ($(this).attr("value") == "Play") {
  //         $(this).attr("value", "Stop");
  //         play_matrix_continuously();
  //     } else {
  //         $(this).attr("value", "Play");
  //         // stop_matrix();
  //         redraw_matrix();
  //     }
  // });

  // $("#random-matrix").on("click", function () {
  //     randomise_matrix();
  // });
};
ToneMatrix.bindMatrixButtons = bindMatrixButtons;

// ********** THE FOLLOWING FUNCTIONS ARE EXPOSED TO STUDENTS **********
// return the current state of the matrix, represented by a list of lists of bits
function get_matrix() {
  if (!matrix) {
    throw new Error("Please activate the tone matrix first by clicking on the tab!")
  }
  var matrix_list = matrix.slice(0);
  var result = [];
  for (var i = 0; i <= 15; i++) {
    result[i] = vector_to_list(matrix_list[15 - i]);
  };

  return vector_to_list(result);
}

// reset the matrix to the initial state
function clear_matrix() {
  matrix = new Array(16);
  var ctx = $tone_matrix.getContext("2d");

  // draw the initial matrix
  for (var i = 15; i >= 0; i--) {
    matrix[i] = new Array(16);
    for (var j = 15; j >= 0; j--) {
      set_color(i, j, color_off);
      matrix[i][j] = false;
    };
  };
}

ToneMatrix.clear_matrix = clear_matrix;

var set_time_out_renamed = window.setTimeout;

function set_timeout(f, t) {
  var timeoutObj = set_time_out_renamed(f, t);
  timeout_objects.push(timeoutObj);
}

function clear_all_timeout() {
  for (var i = timeout_objects.length - 1; i >= 0; i--) {
    clearTimeout(timeout_objects[i]);
  };

  timeout_objects = new Array();
}

// functions from mission 14
function letter_name_to_midi_note(note) {
  // we don't consider double flat/ double sharp
  var note = note.split("");
  var res = 24; //MIDI notes for mysterious C0
  var n = note[0].toUpperCase();
  switch (n) {
    case 'D':
      res = res + 2;
      break;

    case 'E':
      res = res + 4;
      break;

    case 'F':
      res = res + 5;
      break;

    case 'G':
      res = res + 7;
      break;

    case 'A':
      res = res + 9;
      break;

    case 'B':
      res = res + 11;
      break;

    default:
      break;
  }

  if (note.length === 2) {
    res = parseInt(note[1]) * 12 + res;
  } else if (note.length === 3) {
    switch (note[1]) {
      case '#':
        res = res + 1;
        break;

      case 'b':
        res = res - 1;
        break;

      default:
        break;
    }
    res = parseInt(note[2]) * 12 + res;
  }

  return res;
}

function letter_name_to_frequency(note) {
  return midi_note_to_frequency(note_to_midi_note(note));
}

function midi_note_to_frequency(note) {
  return 8.1757989156 * Math.pow(2, (note / 12));
}

function square_sound(freq, duration) {
  function fourier_expansion_square(t) {
    var answer = 0;
    for (var i = 1; i <= fourier_expansion_level; i++) {
      answer = answer +
        Math.sin(2 * Math.PI * (2 * i - 1) * freq * t)
        /
        (2 * i - 1);
    }
    return answer;
  }
  return make_sound(t =>
    (4 / Math.PI) * fourier_expansion_square(t),
    duration);
}

function triangle_sound(freq, duration) {
  function fourier_expansion_triangle(t) {
    var answer = 0;
    for (var i = 0; i < fourier_expansion_level; i++) {
      answer = answer +
        Math.pow(-1, i) *
        Math.sin((2 * i + 1) * t * freq * Math.PI * 2)
        /
        Math.pow((2 * i + 1), 2);
    }
    return answer;
  }
  return make_sound(t =>
    (8 / Math.PI / Math.PI) * fourier_expansion_triangle(t),
    duration);
}

function sawtooth_sound(freq, duration) {
  function fourier_expansion_sawtooth(t) {
    var answer = 0;
    for (var i = 1; i <= fourier_expansion_level; i++) {
      answer = answer + Math.sin(2 * Math.PI * i * freq * t) / i;
    }
    return answer;
  }
  return make_sound(t =>
    (1 / 2) - (1 / Math.PI) * fourier_expansion_sawtooth(t),
    duration);
}

function exponential_decay(decay_period) {
  return function (t) {
    if ((t > decay_period) || (t < 0)) {
      return undefined;
    } else {
      var halflife = decay_period / 8;
      var lambda = Math.log(2) / halflife;
      return Math.pow(Math.E, -lambda * t);
    }
  }
}

/**
 * Returns an envelope: a function from sound to sound.
 * When the envelope is applied to a sound, it returns
 * a new sound that results from applying ADSR to
 * the given sound. The Attack duration, Sustain duration and
 * Release duration are given in the first, second and fourth
 * arguments in seconds, and the Sustain level is given in 
 * the third argument as a fraction between 0 and 1.
 * @param {number} attack_time - duration of attack phase in seconds
 * @param {number} decay_time - duration of decay phase in seconds
 * @param {number} sustain_level - sustain level between 0 and 1
 * @param {number} release_time - duration of release phase in seconds
 * @returns {function} envelope: function from sound to sound
 */
function adsr(attack_time, decay_time, sustain_level, release_time, force_rate = 1.0) {
  const result =
    //return 
    sound => {
      var wave = get_wave(sound);
      var duration = get_duration(sound);
      return make_sound(x => {
        if (x < attack_time) {
          return wave(x) * (x / attack_time);
        } else if (x < attack_time + decay_time) {
          return ((1 - sustain_level) * (exponential_decay(decay_time))(x - attack_time) + sustain_level) * wave(x);
        } else if (x < duration - release_time) {
          return wave(x) * sustain_level;
        } else if (x <= duration) {
          return wave(x) * sustain_level * (exponential_decay(release_time))(x - (duration - release_time));
        } else {
          return 0;
        }
      }, duration);
    };
  return result;
  //return sound => { return make_sound(x => get_wave(result(sound))(x) * force_rate, get_duration(sound)); };
}

// waveform is a function that accepts freq, dur and returns sound
/**
 * Returns a sound that results from applying a list of envelopes
 * to a given wave form. The wave form should be a sound generator that
 * takes a frequency and a duration as arguments and produces a
 * sound with the given frequency and duration. Each evelope is
 * applied to a harmonic: the first harmonic has the given frequency,
 * the second has twice the frequency, the third three times the
 * frequency etc.
 * @param {function} waveform - function from frequency and duration to sound
 * @param {number} base_frequency - frequency of the first harmonic
 * @param {number} duration - duration of the produced sound, in seconds
 * @param {list_of_envelope} envelopes - each a function from sound to sound
 * @returns {sound} resulting sound
 */
function stacking_adsr(waveform, base_frequency, duration, envelopes) {
  function zip(lst, n) {
    if (is_null(lst)) {
      return lst;
    } else {
      return pair(pair(n, head(lst)), zip(tail(lst), n + 1));
    }
  }

  return simultaneously(accumulate(
    (x, y) => pair((tail(x))
      (waveform(base_frequency * head(x), duration))
      , y)
    , null
    , zip(envelopes, 1)));
}

// instruments for students

/**
 * returns a sound that is reminiscent of a trombone, playing
 * a given note for a given <CODE>duration</CODE> of seconds
 * @param {number} note - midi note
 * @param {number} duration - duration in seconds
 * @returns {function} <CODE>stop</CODE> to stop recording, 
 */
function trombone(note, duration) {
  return stacking_adsr(square_sound, midi_note_to_frequency(note), duration,
    list(adsr(0.4, 0, 1, 0),
      adsr(0.6472, 1.2, 0, 0)));
}

/**
 * returns a sound that is reminiscent of a piano, playing
 * a given note for a given <CODE>duration</CODE> of seconds
 * @param {number} note - midi note
 * @param {number} duration - duration in seconds
 * @returns {function} <CODE>stop</CODE> to stop recording, 
 */
function piano(note, duration) {
  return stacking_adsr(triangle_sound, midi_note_to_frequency(note), duration,
    list(adsr(0, 1.03, 0, 0),
      adsr(0, 0.64, 0, 0),
      adsr(0, 0.4, 0, 0)));
}

/**
 * returns a sound that is reminiscent of a bell, playing
 * a given note for a given <CODE>duration</CODE> of seconds
 * @param {number} note - midi note
 * @param {number} duration - duration in seconds
 * @returns {function} <CODE>stop</CODE> to stop recording, 
 */
function bell(note, duration) {
  return stacking_adsr(square_sound, midi_note_to_frequency(note), duration,
    list(adsr(0, 1.2, 0, 0),
      adsr(0, 1.3236, 0, 0),
      adsr(0, 1.5236, 0, 0),
      adsr(0, 1.8142, 0, 0)));
}

/**
 * returns a sound that is reminiscent of a violin, playing
 * a given note for a given <CODE>duration</CODE> of seconds
 * @param {number} note - midi note
 * @param {number} duration - duration in seconds
 * @returns {function} <CODE>stop</CODE> to stop recording, 
 */
function violin(note, duration) {
  return stacking_adsr(sawtooth_sound, midi_note_to_frequency(note), duration,
    list(adsr(0.7, 0, 1, 0.3),
      adsr(0.7, 0, 1, 0.3),
      adsr(0.9, 0, 1, 0.3),
      adsr(0.9, 0, 1, 0.3)));
}

/**
 * returns a sound that is reminiscent of a cello, playing
 * a given note for a given <CODE>duration</CODE> of seconds
 * @param {number} note - midi note
 * @param {number} duration - duration in seconds
 * @returns {function} <CODE>stop</CODE> to stop recording, 
 */
function cello(note, duration) {
  return stacking_adsr(square_sound, midi_note_to_frequency(note), duration,
    list(adsr(0.1, 0, 1, 0.2),
      adsr(0.1, 0, 1, 0.3),
      adsr(0, 0, 0.2, 0.3)));
}

// function noise_sound(duration) {
//   return make_sound(t => Math.random() * 2 - 1, duration);
// }

// function drum(note, duration) {
//   return adsr(0.005, 0.495, 0, 0)(sine_sound(note, duration));
// }

function string_to_list_of_numbers(string) {
  var array_of_numbers = string.split("");
  return map(function (x) {
    return parseInt(x);
  }, vector_to_list(array_of_numbers));
}

function stellatrix_adsr(standard_time, attack_time, decay_time, sustain_level, release_time, force_rate = 1.0) {
  const scale_rate = single_note_time / standard_time;
  return adsr(attack_time * scale_rate, decay_time * scale_rate, sustain_level, release_time * scale_rate);
}

function stellatrix_trombone(note, duration, force_rate = 1.0) {
  return stacking_adsr(square_sound, midi_note_to_frequency(note), duration,
    list(adsr(0.4, 0, 1, 0, force_rate),
      adsr(0.6472, 1.2, 0, 0, force_rate)));
}

function stellatrix_piano(note, duration, force_rate = 1.0) {
  return stacking_adsr(triangle_sound, midi_note_to_frequency(note), duration,
    list(adsr(0, 1.03, 0, 0, force_rate),
      adsr(0, 0.64, 0, 0, force_rate),
      adsr(0, 0.4, 0, 0, force_rate)));
}

function stellatrix_bell(note, duration, force_rate = 1.0) {
  return stacking_adsr(square_sound, midi_note_to_frequency(note), duration,
    list(adsr(0, 1.2, 0, 0, force_rate),
      adsr(0, 1.3236, 0, 0, force_rate),
      adsr(0, 1.5236, 0, 0, force_rate),
      adsr(0, 1.8142, 0, 0, force_rate)));
}

function stellatrix_violin(note, duration, force_rate = 1.0) {
  return stacking_adsr(sawtooth_sound, midi_note_to_frequency(note), duration,
    list(stellatrix_adsr(1.5, 0.7, 0, 1, 0.3, force_rate),
      stellatrix_adsr(1.5, 0.7, 0, 1, 0.3, force_rate),
      stellatrix_adsr(1.5, 0.9, 0, 1, 0.3, force_rate),
      stellatrix_adsr(1.5, 0.9, 0, 1, 0.3, force_rate)));
}

function stellatrix_cello(note, duration, force_rate = 1.0) {
  return stacking_adsr(square_sound, midi_note_to_frequency(note), duration,
    list(adsr(0.1, 0, 1, 0.2, force_rate),
      adsr(0.1, 0, 1, 0.3, force_rate),
      adsr(0, 0, 0.2, 0.3, force_rate)));
}

function make_unit_sound(i_name, note, duration, force_rate) {
  function find_instrument(i_name) {
    if (i_name === "trombone") {
      return stellatrix_trombone;
    }
    else if (i_name === "bell") {
      return stellatrix_bell;
    }
    else if (i_name === "cello") {
      return stellatrix_cello;
    }
    else if (i_name === "violin") {
      return stellatrix_violin;
    }
    else return stellatrix_piano;
  }
  return find_instrument(i_name)(note, duration, force_rate);
}

//remove the front and the end silence sound
function removeSilence(matrix) {
  function isAll0(arr) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] !== 0) return false;
    }
    return true;
  }
  while (matrix.length > 0 && isAll0(matrix[0])) matrix.shift();
  while (matrix.length > 0 && isAll0(matrix[matrix.length - 1])) matrix.pop();
  return matrix;
}


//calculate the TRUE note that the button stands
function calcNote(standard_note_name, cnt, excursion) {
  const curScale = 4;
  const curLetter = 0;//means 'C' or 'Do'
  const letter_to_number = {
    'C': 0,
    'D': 1,
    'E': 2,
    'F': 3,
    'G': 4,
    'A': 5,
    'B': 6,
  };
  const number_to_letter = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const scale = curScale + Math.floor((cnt + excursion) / 7);
  const number = curLetter + (cnt + excursion - Math.floor((cnt + excursion) / 7) * 7);
  return letter_name_to_midi_note(number_to_letter[number] + (scale + ''));
}

function calcDurationRate(speed) {
  return 5 / speed;
}

function make_stellatrix_sound(matrix_property, instrument_property) {
  let matrix = [...matrix_property["matrix"]];
  const list_2d = vector_to_list(removeSilence(matrix));
  const excursion = instrument_property["excursion"];
  const i_name = instrument_property["i_name"];
  const duration_rate = calcDurationRate(instrument_property["speed"]);
  const force_rate = instrument_property["force"] / 5;
  function boolean_vector_to_sound(ba) {//处理第二维
    const lst = vector_to_list(ba);
    function iter(result, rest, cnt) {
      if (rest.length === 0) {
        return result;
      }
      else {
        if (head(rest) === 1) {
          const tmp = pair(make_unit_sound(i_name,
            calcNote(standard_note, cnt, excursion),
            single_note_time * duration_rate,
            force_rate),
            result);
          return iter(tmp, tail(rest), cnt + 1);
        }
        else {
          const tmp = pair(silence_sound(single_note_time * duration_rate), result);
          return iter(tmp, tail(rest), cnt + 1);
        }
      }
    }
    return simultaneously(iter(null, lst, 0));
  }
  function iter(result, rest) {//处理第一维
    if (rest.length === 0) {
      return result;
    }
    else {
      const tmp = pair(boolean_vector_to_sound(head(rest)), result);
      return iter(tmp, tail(rest));
    }
  }
  return interleavingly(reverse(iter(null, list_2d)), interleaving_frac);
}