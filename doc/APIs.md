# APIs

`play_sound(matrix_property, instrument_property);`

This function receives two JSONs and plays an audio.

```javascript
matrix_property = {
	"m_row"   : integer,    // default value is 12
	"m_col"   : integer,    // default value is 12
	"matrix"  : boolean[][] // not clicked is FALSE; From left down to right up
}
```

```javascript
instrument_property = {
	"i_name"   : string,  // default value is "piano"
	"speed"    : integer, // default value is 5 & range is [1, 10]
	"excusion" : integer, // default value is 0 & range is [-36, +36]
	"force"    : integer  // default value is 5 & range is [1, 10]
}
```

