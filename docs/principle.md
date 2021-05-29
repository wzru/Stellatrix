# Principle

## 0.About

- `Source`: a family of languages, designed for the textbook, [Structure and Interpretation of Computer Programs, JavaScript Adaptation](https://sicp.comp.nus.edu.sg/) (SICP JS).

We import some basic libraries about sound in `Sounce` and create more functions to build our musical creation application.

+ `functional programming`: In [computer science](https://en.wikipedia.org/wiki/Computer_science), **functional programming** is a [programming paradigm](https://en.wikipedia.org/wiki/Programming_paradigm)—a style of building the structure and elements of [computer programs](https://en.wikipedia.org/wiki/Computer_program)—that treats [computation](https://en.wikipedia.org/wiki/Computation) as the evaluation of [mathematical functions](https://en.wikipedia.org/wiki/Function_(mathematics)) and avoids changing-[state](https://en.wikipedia.org/wiki/Program_state) and [mutable](https://en.wikipedia.org/wiki/Immutable_object) data.

We implement our sound-creating algorithm in `functional programming`.

+ `Source Academy`: The *Source Academy* is a computer-mediated learning environment for studying the structure and interpretation of computer programs. The National University of Singapore uses the Source Academy for teaching Programming Methodology to freshmen Computer Science students in the course [CS1101S](https://www.comp.nus.edu.sg/~cs1101s).

We plan to integrate our application into the `Source Academy`.

## 1.What basic function we used

We use the following function from `Source` to build our application.

### make_sound()

`make_sound(wave(), duration)`// to make a sound, where wave() is the function from `time` to `amplitude`. This function is implemented in `Source`.

### play()

`play(sound)` will play a sound in browser.

`simultaneously(list_of_sounds)` is to play a list of sounds **together**.

`consecutively(list_of_sounds)` is to play a list of sounds **one by one**.

### adsr()

`adsr(attack_time, decay_time, sustain_level, release_time)`//to receive a sound and return a `sound`.

In [sound](https://en.wikipedia.org/wiki/Sound) and [music](https://en.wikipedia.org/wiki/Music), an **envelope** describes how a sound changes over time. Envelope normally relates to the [amplitude](https://en.wikipedia.org/wiki/Amplitude) (volume), but it may also involve elements such as [filters](https://en.wikipedia.org/wiki/Voltage-controlled_filter) (frequencies) or [pitch](https://en.wikipedia.org/wiki/Pitch_(music)).[*citation needed*] For example, a [piano](https://en.wikipedia.org/wiki/Piano) key, when struck and held, creates a near-immediate initial sound which gradually decreases in volume to zero. **Envelope generators** are common features of [synthesizers](https://en.wikipedia.org/wiki/Synthesizer), [samplers](https://en.wikipedia.org/wiki/Sampler_(musical_instrument)), and other [electronic musical instruments](https://en.wikipedia.org/wiki/Electronic_musical_instrument).

The most common kind of envelope generator has four stages: **attack**, **decay**, **sustain**, and **release**(**ADSR**).

- **Attack** is the time taken for initial run-up of level from nil to peak, beginning when the key is pressed.
- **Decay** is the time taken for the subsequent run down from the attack level to the designated sustain level.
- **Sustain** is the level during the main sequence of the sound's duration, until the key is released.
- **Release** is the time taken for the level to decay from the sustain level to zero after the key is released.

While, attack, decay, and release refer to time, sustain refers to level.

### stacking_adsr()

```javascript
stacking_adsr(waveform, base_frequency, duration, envelopes);
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
```

### instrument()

We can use stacking_adsr to build different instrument tones.

e.g:

```javascript
function piano(note, duration) {
  return stacking_adsr(triangle_sound, midi_note_to_frequency(note), duration,
   list(adsr(0, 1.03, 0, 0),
      adsr(0, 0.64, 0, 0),
      adsr(0, 0.4, 0, 0)));
}
```

## 2.What we can do

+ Hit the tiles to make music
+ Combine your own melodic creations
+ Experiment with various instruments

## 3.How we did

### interleavingly()

`interleavingly(list_of_sounds, frac)` is to insert one music to another music in the proportion of a giving fraction. We did this to make music more pleasant.

### make_stellatrix_sound()

`make_stellatrix_sound(matrix_property, instrument_property)` is to receive user’s input and returns the sound

### fronted interact

We design a webpage to interact with users so that it is easy to use.

## 4. What we overcome

+ Build the front end in `native JavaScript`
+ Design a simple way to interact with users to create various music
+ Implement the back end algorithm of sound-create
+ Implement the `timeline` part which need the mouse-drag function

## 5. What we will challenge

+ to make more wonderful sound is really hard using `adsr`
+ to speed up the program(now it’s efficiency is not very satisfactory)
+ to make a more friendly and pretty **user interface**
+ to transfer the project into `Typescript` to integrate it into `Source Academy`
+ to add more instrument in

## 6. What we gained

+ We learn to work in team.

  We use Git and GitHub to work together.

+ We mastered the principle and pearl of `functional programming`. 

  In `functional programming`, the variable is **immutable**. **(We do not change the state, just create new.**) Multi-threads don’t share their state. So we can avoid **race condition** and make more **concurrent computing** to speed up.

+ `Abstraction` matters most in Computer Science. 

  **The codility decides the lower limit while the abstraction decides the upper limit in the project.**

+ Simple is better. 

  Simple interface can make more users use your application more easily.

  More features don’t mean better certainly.

