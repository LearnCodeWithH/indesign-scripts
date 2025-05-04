# Rational Point List Simplified Format

- Input format of `jamHelpers.toRationalPointList`.

## Simplified format

Defined as a two-element JSON array: <code>[ <em>rationalPoints</em>, <em>unit</em> ]</code>

> *rationalPoints* : JSON array of rational points, each one being a two-element JSON array: <code>[ <em>horizontal</em>, <em>vertical</em> ]</code>
> <br>
> *unit* : string (among `"distanceUnit"`, `"percentUnit"`, `"pixelsUnit"`)

> > *horizontal* : number
> > <br>
> > *vertical* : number

## Example

```json
[
    [
        [ 0, 0 ], [ 50, 0 ], [ 50, 0 ], [ 100, 0 ],
        [ 0, 50 ], [ 33.33, 33.33 ], [ 66.67, 33.33 ], [ 100, 50 ],
        [ 0, 50 ], [ 33.33, 66.67 ], [ 66.67, 66.67 ], [ 100, 50 ],
        [ 0, 100 ], [ 50, 100 ], [ 50, 100 ], [ 100, 100 ]
    ],
    "percentUnit"
]
```
