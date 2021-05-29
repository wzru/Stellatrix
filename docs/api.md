# APIs

1. `make_stellatrix_sound(matrix_property, instrument_property);`

This function receives two JSONs and returns a sound.

Then you can use `tryPlaySound(sound)` to play it.

```javascript
matrix_property = {
	"m_row"   : integer,    // default value is 12
	"m_col"   : integer,    // default value is 12
	"matrix"  : int[][] // not clicked is FALSE; from left down to right up
                        // first index is time(col), second is tone(row)
                        // range between 0 and 1
}
```

```javascript
instrument_property = {
	"i_name"   : string,  // default value is "piano"
	"speed"    : integer, // default value is 5 & range is [1, 9]
	"excusion" : integer, // default value is 0 & range is [-36, +36]
	"force"    : integer  // [ABANDONED] default value is 5 & range is [1, 9]
}
```

2. `generate_stellatrix_music(array_of_melody);`

This function receives an array of `melody` and returns a music.

Then you can use `tryPlaySound(music)` to play it.

The `melody` is a JSON.

```javascript
melody = {
    "music_id" : integer,              
    "m_prop"   : matrix_property,      
    "i_prop"   : instrument_property,
    "begin_px" : integer              // the begin position in the timeline
}
```

3. `calcLength(melody);`

The function receives a `melody`(JSON) and returns its length(in px) will be in the `timeline`.

4. `calcWidth(melody);`

The function receives a `melody`(JSON) and returns its width(in px) will be in the `timeline`.

5. `calcNote(cnt, excursion);`

The function receives the `row`(the lowest one is 0) and the `excursion` and returns the note name(`string`) that the button corresponds.