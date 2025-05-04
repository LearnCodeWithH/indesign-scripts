# Blending Options Object Simplified Format

- Input format of `jamStyles.toBlendOptionsObject`.
- Output format of `jamStyles.fromBlendOptionsObject`.

Used by the following utility scripts:

- [Get Layer Style](../../Utility-Scripts/Get-Layer-Style)
- [Parse Styles File](../../Utility-Scripts/Parse-Styles-File)

Used also by the creative script:

- [Poster Effect Gallery](../../Creative-Scripts/Poster-Effect-Gallery)

## Simplified format

Defined as a JSON object:
<pre>
{
    "mode": <em>mode</em>,
    "opacity": <em>opacity</em>,
    "fillOpacity": <em>fillOpacity</em>,
    "channelRestrictions": <em>channelRestrictions</em>,
    "knockout": <em>knockout</em>,
    "blendInterior": <em>blendInterior</em>,
    "blendClipped": <em>blendClipped</em>,
    "transparencyShapesLayer": <em>transparencyShapesLayer</em>,
    "layerMaskAsGlobalMask": <em>layerMaskAsGlobalMask</em>,
    "vectorMaskAsGlobalMask": <em>vectorMaskAsGlobalMask</em>,
    "blendRange": <em>blendRange</em>
}
</pre>

> *mode* : [optional] string (among **Blend modes**)
> <br>
> *opacity* : [optional] number (percentage; 0% to 100%)
> <br>
> *fillOpacity* : [optional] number (percentage; 0% to 100%)
> <br>
> *channelRestrictions* : [optional] JSON array of strings (among **Channels**)
> <br>
> *knockout* : [optional; `"none"` by default] string (among `"none"`, `"shallow"`, `"deep"`)
> <br>
> *blendInterior* : [optional] boolean
> <br>
> *blendClipped* : [optional; `true` by default] boolean
> <br>
> *transparencyShapesLayer* : [optional; `true` by default] boolean
> <br>
> *layerMaskAsGlobalMask* : [optional] boolean
> <br>
> *vectorMaskAsGlobalMask* : [optional] boolean
> <br>
> *blendRange* : [optional] JSON array of JSON objects in **Blend range** format

## Blend modes

- `"normal"`
- `"dissolve"`
- `"darken"`
- `"multiply"`
- `"colorBurn"`
- `"linearBurn"`
- `"darkerColor"`
- `"lighten"`
- `"screen"`
- `"colorDodge"`
- `"linearDodge"`
- `"lighterColor"`
- `"overlay"`
- `"softLight"`
- `"hardLight"`
- `"vividLight"`
- `"linearLight"`
- `"pinLight"`
- `"hardMix"`
- `"difference"`
- `"exclusion"`
- `"subtract"`
- `"divide"`
- `"hue"`
- `"saturation"`
- `"color"`
- `"luminosity"`

## Blend range

<pre>
{
    "channel": <em>channel</em>,
    "srcBlackMin": <em>srcBlackMin</em>,
    "srcBlackMax": <em>srcBlackMax</em>,
    "srcWhiteMin": <em>srcWhiteMin</em>,
    "srcWhiteMax": <em>srcWhiteMax</em>,
    "destBlackMin": <em>destBlackMin</em>,
    "destBlackMax": <em>destBlackMax</em>,
    "destWhiteMin": <em>destWhiteMin</em>,
    "destWhiteMax": <em>destWhiteMax</em>
}
</pre>

> *channel* : string (among **Channels**)
> <br>
> *srcBlackMin* : number (0 to 255)
> <br>
> *srcBlackMax* : number (0 to 255)
> <br>
> *srcWhiteMin* : number (0 to 255)
> <br>
> *srcWhiteMax* : number (0 to 255)
> <br>
> *destBlackMin* : number (0 to 255)
> <br>
> *destBlackMax* : number (0 to 255)
> <br>
> *destWhiteMin* : number (0 to 255)
> <br>
> *destWhiteMax* : number (0 to 255)

## Channels

- `"a"`
- `"b"`
- `"black"`
- `"blue"`
- `"cyan"`
- `"duotone"`
- `"gray"`
- `"green"`
- `"lightness"`
- `"magenta"`
- `"monotone"`
- `"quadtone"`
- `"red"`
- `"tritone"`
- `"yellow"`

## Default values

Whenever a blending option is not defined, a default value is always assumed, in input as well as in output.
Default values related to channels, i.e., `"channelRestrictions"` and `"blendRange"`, are specific to the document’s color space (among: CMYK, Duotone, Grayscale, Lab, RGB):

### CMYK document

![Default Blending Options (CMYK)](images/Default-Blending-Options-CMYK.png)

![Default Blending Options (CMYK) (Cyan)](images/Default-Blending-Options-CMYK-Cyan.png)

![Default Blending Options (CMYK) (Magenta)](images/Default-Blending-Options-CMYK-Magenta.png)

![Default Blending Options (CMYK) (Yellow)](images/Default-Blending-Options-CMYK-Yellow.png)

![Default Blending Options (CMYK) (Black)](images/Default-Blending-Options-CMYK-Black.png)

```json
{
    "mode": "normal",
    "opacity": 100,
    "fillOpacity": 100,
    "channelRestrictions":
    [
        "cyan",
        "magenta",
        "yellow",
        "black"
    ],
    "knockout": "none",
    "blendInterior": false,
    "blendClipped": true,
    "transparencyShapesLayer": true,
    "layerMaskAsGlobalMask": false,
    "vectorMaskAsGlobalMask": false,
    "blendRange":
    [
        {
            "channel": "gray",
            "srcBlackMin": 0,
            "srcBlackMax": 0,
            "srcWhiteMin": 255,
            "srcWhiteMax": 255,
            "destBlackMin": 0,
            "destBlackMax": 0,
            "destWhiteMin": 255,
            "destWhiteMax": 255
        },
        {
            "channel": "cyan",
            "srcBlackMin": 0,
            "srcBlackMax": 0,
            "srcWhiteMin": 255,
            "srcWhiteMax": 255,
            "destBlackMin": 0,
            "destBlackMax": 0,
            "destWhiteMin": 255,
            "destWhiteMax": 255
        },
        {
            "channel": "magenta",
            "srcBlackMin": 0,
            "srcBlackMax": 0,
            "srcWhiteMin": 255,
            "srcWhiteMax": 255,
            "destBlackMin": 0,
            "destBlackMax": 0,
            "destWhiteMin": 255,
            "destWhiteMax": 255
        },
        {
            "channel": "yellow",
            "srcBlackMin": 0,
            "srcBlackMax": 0,
            "srcWhiteMin": 255,
            "srcWhiteMax": 255,
            "destBlackMin": 0,
            "destBlackMax": 0,
            "destWhiteMin": 255,
            "destWhiteMax": 255
        },
        {
            "channel": "black",
            "srcBlackMin": 0,
            "srcBlackMax": 0,
            "srcWhiteMin": 255,
            "srcWhiteMax": 255,
            "destBlackMin": 0,
            "destBlackMax": 0,
            "destWhiteMin": 255,
            "destWhiteMax": 255
        }
    ]
}
```

### Duotone document

![Default Blending Options (Duotone)](images/Default-Blending-Options-Duotone.png)

```json
{
    "mode": "normal",
    "opacity": 100,
    "fillOpacity": 100,
    "channelRestrictions":
    [
        "black"
    ],
    "knockout": "none",
    "blendInterior": false,
    "blendClipped": true,
    "transparencyShapesLayer": true,
    "layerMaskAsGlobalMask": false,
    "vectorMaskAsGlobalMask": false,
    "blendRange":
    [
        {
            "channel": "black",
            "srcBlackMin": 0,
            "srcBlackMax": 0,
            "srcWhiteMin": 255,
            "srcWhiteMax": 255,
            "destBlackMin": 0,
            "destBlackMax": 0,
            "destWhiteMin": 255,
            "destWhiteMax": 255
        }
    ]
}
```

### Grayscale document

![Default Blending Options (Grayscale)](images/Default-Blending-Options-Grayscale.png)

```json
{
    "mode": "normal",
    "opacity": 100,
    "fillOpacity": 100,
    "channelRestrictions":
    [
        "black"
    ],
    "knockout": "none",
    "blendInterior": false,
    "blendClipped": true,
    "transparencyShapesLayer": true,
    "layerMaskAsGlobalMask": false,
    "vectorMaskAsGlobalMask": false,
    "blendRange":
    [
        {
            "channel": "black",
            "srcBlackMin": 0,
            "srcBlackMax": 0,
            "srcWhiteMin": 255,
            "srcWhiteMax": 255,
            "destBlackMin": 0,
            "destBlackMax": 0,
            "destWhiteMin": 255,
            "destWhiteMax": 255
        }
    ]
}
```

### Lab document

![Default Blending Options (Lab)](images/Default-Blending-Options-Lab.png)

![Default Blending Options (Lab) (A)](images/Default-Blending-Options-Lab-A.png)

![Default Blending Options (Lab) (B)](images/Default-Blending-Options-Lab-B.png)

```json
{
    "mode": "normal",
    "opacity": 100,
    "fillOpacity": 100,
    "channelRestrictions":
    [
        "lightness",
        "a",
        "b"
    ],
    "knockout": "none",
    "blendInterior": false,
    "blendClipped": true,
    "transparencyShapesLayer": true,
    "layerMaskAsGlobalMask": false,
    "vectorMaskAsGlobalMask": false,
    "blendRange":
    [
        {
            "channel": "lightness",
            "srcBlackMin": 0,
            "srcBlackMax": 0,
            "srcWhiteMin": 255,
            "srcWhiteMax": 255,
            "destBlackMin": 0,
            "destBlackMax": 0,
            "destWhiteMin": 255,
            "destWhiteMax": 255
        },
        {
            "channel": "a",
            "srcBlackMin": 0,
            "srcBlackMax": 0,
            "srcWhiteMin": 255,
            "srcWhiteMax": 255,
            "destBlackMin": 0,
            "destBlackMax": 0,
            "destWhiteMin": 255,
            "destWhiteMax": 255
        },
        {
            "channel": "b",
            "srcBlackMin": 0,
            "srcBlackMax": 0,
            "srcWhiteMin": 255,
            "srcWhiteMax": 255,
            "destBlackMin": 0,
            "destBlackMax": 0,
            "destWhiteMin": 255,
            "destWhiteMax": 255
        }
    ]
}
```

### RGB document

![Default Blending Options (RGB)](images/Default-Blending-Options-RGB.png)

![Default Blending Options (RGB) (Red)](images/Default-Blending-Options-RGB-Red.png)

![Default Blending Options (RGB) (Green)](images/Default-Blending-Options-RGB-Green.png)

![Default Blending Options (RGB) (Blue)](images/Default-Blending-Options-RGB-Blue.png)

```json
{
    "mode": "normal",
    "opacity": 100,
    "fillOpacity": 100,
    "channelRestrictions":
    [
        "red",
        "green",
        "blue"
    ],
    "knockout": "none",
    "blendInterior": false,
    "blendClipped": true,
    "transparencyShapesLayer": true,
    "layerMaskAsGlobalMask": false,
    "vectorMaskAsGlobalMask": false,
    "blendRange":
    [
        {
            "channel": "gray",
            "srcBlackMin": 0,
            "srcBlackMax": 0,
            "srcWhiteMin": 255,
            "srcWhiteMax": 255,
            "destBlackMin": 0,
            "destBlackMax": 0,
            "destWhiteMin": 255,
            "destWhiteMax": 255
        },
        {
            "channel": "red",
            "srcBlackMin": 0,
            "srcBlackMax": 0,
            "srcWhiteMin": 255,
            "srcWhiteMax": 255,
            "destBlackMin": 0,
            "destBlackMax": 0,
            "destWhiteMin": 255,
            "destWhiteMax": 255
        },
        {
            "channel": "green",
            "srcBlackMin": 0,
            "srcBlackMax": 0,
            "srcWhiteMin": 255,
            "srcWhiteMax": 255,
            "destBlackMin": 0,
            "destBlackMax": 0,
            "destWhiteMin": 255,
            "destWhiteMax": 255
        },
        {
            "channel": "blue",
            "srcBlackMin": 0,
            "srcBlackMax": 0,
            "srcWhiteMin": 255,
            "srcWhiteMax": 255,
            "destBlackMin": 0,
            "destBlackMax": 0,
            "destWhiteMin": 255,
            "destWhiteMax": 255
        }
    ]
}
```

## Examples

```json
{
    "fillOpacity": 70,
    "blendInterior": true
}
```

![Blending Options Example 1](images/Blending-Options-Example-1.png)

```json
{
    "mode": "colorDodge",
    "opacity": 75,
    "fillOpacity": 50,
    "channelRestrictions":
    [
        "red",
        "blue"
    ],
    "knockout": "shallow",
    "blendInterior": true,
    "blendClipped": false,
    "transparencyShapesLayer": false,
    "layerMaskAsGlobalMask": true,
    "vectorMaskAsGlobalMask": true,
    "blendRange":
    [
        {
            "channel": "gray",
            "srcBlackMin": 10,
            "srcBlackMax": 20,
            "srcWhiteMin": 255,
            "srcWhiteMax": 255,
            "destBlackMin": 0,
            "destBlackMax": 0,
            "destWhiteMin": 235,
            "destWhiteMax": 245
        },
        {
            "channel": "red",
            "srcBlackMin": 80,
            "srcBlackMax": 80,
            "srcWhiteMin": 255,
            "srcWhiteMax": 255,
            "destBlackMin": 0,
            "destBlackMax": 0,
            "destWhiteMin": 255,
            "destWhiteMax": 255
        },
        {
            "channel": "green",
            "srcBlackMin": 0,
            "srcBlackMax": 0,
            "srcWhiteMin": 255,
            "srcWhiteMax": 255,
            "destBlackMin": 0,
            "destBlackMax": 0,
            "destWhiteMin": 160,
            "destWhiteMax": 255
        },
        {
            "channel": "blue",
            "srcBlackMin": 0,
            "srcBlackMax": 0,
            "srcWhiteMin": 255,
            "srcWhiteMax": 255,
            "destBlackMin": 80,
            "destBlackMax": 80,
            "destWhiteMin": 255,
            "destWhiteMax": 255
        }
    ]
}
```

![Blending Options Example 2 (Gray)](images/Blending-Options-Example-2-Gray.png)

![Blending Options Example 2 (Red)](images/Blending-Options-Example-2-Red.png)

![Blending Options Example 2 (Green)](images/Blending-Options-Example-2-Green.png)

![Blending Options Example 2 (Blue)](images/Blending-Options-Example-2-Blue.png)
