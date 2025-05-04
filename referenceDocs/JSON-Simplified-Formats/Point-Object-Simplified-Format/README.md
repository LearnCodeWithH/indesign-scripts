# Point Object Simplified Format

- Input format of `jamHelpers.toPointObject`.

## Simplified format

Defined as a two-element JSON array: <code>[ <em>point</em>, <em>unit</em> ]</code>

> *point* : two-element JSON array: <code>[ <em>horizontal</em>, <em>vertical</em> ]</code>
> <br>
> *unit* : string (among `"distanceUnit"`, `"percentUnit"`, `"pixelsUnit"`)

> > *horizontal* : number
> > <br>
> > *vertical* : number

## Example

```json
[ [ 20, 10 ], "pixelsUnit" ]
```
