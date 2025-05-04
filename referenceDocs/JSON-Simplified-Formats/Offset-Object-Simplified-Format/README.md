# Offset Object Simplified Format

- Input format of `jamHelpers.toOffsetObject`.

## Simplified format

Defined as a two-element JSON array: <code>[ <em>offset</em>, <em>unit</em> ]</code>

> *offset* : two-element JSON array: <code>[ <em>horizontal</em>, <em>vertical</em> ]</code>
> <br>
> *unit* : string (among `"distanceUnit"`, `"percentUnit"`, `"pixelsUnit"`)

> > *horizontal* : number
> > <br>
> > *vertical* : number

## Example

```json
[ [ 50, 50 ], "percentUnit" ]
```
