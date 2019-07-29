# APIs

`make_stellatrix_sound(matrix_property, instrument_property);`

This function receives two JSONs and returns an sound.

Then you can use `play(sound)` to play it.

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
	"force"    : integer  // [NOW ABANDONED] default value is 5 & range is [1, 9]
}
```

