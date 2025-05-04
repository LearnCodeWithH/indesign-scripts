# Ellipse Object Simplified Format

- Input format of `jamHelpers.toEllipseObject`.

## Simplified format

Defined as a two-element JSON array: <code>[ <em>ellipse</em>, <em>unit</em> ]</code>

> *ellipse* : four-element JSON array: <code>[ <em>left</em>, <em>top</em>, <em>right</em>, <em>bottom</em> ]</code>
> <br>
> *unit* : string (among `"distanceUnit"`, `"percentUnit"`, `"pixelsUnit"`)

> > *left* : number
> > <br>
> > *top* : number
> > <br>
> > *right* : number
> > <br>
> > *bottom* : number

## Example

```json
[ [ 10, 10, 90, 90 ], "percentUnit" ]
```

![Ellipse](images/Ellipse.png)
