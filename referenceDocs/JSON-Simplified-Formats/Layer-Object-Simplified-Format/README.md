# Layer Object Simplified Format

- Input format of `jamLayers.toLayerObject`.
- Output format of `jamLayers.fromLayerObject`.

Used by the following creative scripts:

- [Adjustment & Fill Gallery](../../Creative-Scripts/Adjustment-Fill-Gallery)
- [Poster Effect Gallery](../../Creative-Scripts/Poster-Effect-Gallery)

## Simplified format

Defined as a JSON object:

<pre>{ "adjustmentLayer": <em>adjustmentLayer</em> }</pre>
or
<pre>{ "contentLayer": <em>contentLayer</em> }</pre>
or
<pre>{ "layer": <em>layer</em> }</pre>
or
<pre>{ "layerSection": <em>layerSection</em> }</pre>

> *adjustmentLayer* : JSON object in **Layer properties** format
> <br>
> *contentLayer* : JSON object in **Layer properties** format
> <br>
> *layer* : JSON object in **Layer properties** format
> <br>
> *layerSection* : JSON object in **Layer properties** format

## Layer properties

<pre>
{
    "name": <em>name</em>,
    "color": <em>color</em>,
    "layerLocking": <em>layerLocking</em>,
    "group": <em>group</em>,
    "mode": <em>mode</em>,
    "opacity": <em>opacity</em>,
    "fillNeutral": <em>fillNeutral</em>,
    "fillOpacity": <em>fillOpacity</em>,
    "channelRestrictions": <em>channelRestrictions</em>,
    "knockout": <em>knockout</em>,
    "blendInterior": <em>blendInterior</em>,
    "blendClipped": <em>blendClipped</em>,
    "transparencyShapesLayer": <em>transparencyShapesLayer</em>,
    "layerMaskAsGlobalMask": <em>layerMaskAsGlobalMask</em>,
    "vectorMaskAsGlobalMask": <em>vectorMaskAsGlobalMask</em>,
    "blendRange": <em>blendRange</em>,
    "type": <em>type</em>,
    "userMaskDensity": <em>userMaskDensity</em>,
    "userMaskFeather": <em>userMaskFeather</em>,
    "vectorMaskDensity": <em>vectorMaskDensity</em>,
    "vectorMaskFeather": <em>vectorMaskFeather</em>
}
</pre>

> *name* : [optional] string
> <br>
> *color* : [optional] string (among `"none"`, `"red"`, `"orange"`, `"yellowColor"`, `"green"`, `"blue"`, `"violet"`, `"gray"`)
> <br>
> *layerLocking* : [optional] JSON object in **Layer locking** format
> <br>
> *group* : [optional] boolean
> <br>
> *mode* : [optional] string (among **Blend modes**)
> <br>
> *opacity* : [optional] number (percentage; 0% to 100%)
> <br>
> *fillNeutral* : [optional] boolean
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
> <br>
> *type* : [optional] JSON object in **Layer type** format (only for `"adjustmentLayer"` or `"contentLayer"`)
> <br>
> *userMaskDensity* : [optional] number (percentage; 0% to 100%)
> <br>
> *userMaskFeather* : [optional] number (0 to 250 pixels)
> <br>
> *vectorMaskDensity* : [optional] number (percentage; 0% to 100%)
> <br>
> *vectorMaskFeather* : [optional] number (0 to 250 pixels)

### Layer locking

<pre>
{
    "protectAll": <em>protectAll</em>,
    "protectComposite": <em>protectComposite</em>,
    "protectPosition": <em>protectPosition</em>,
    "protectTransparency": <em>protectTransparency</em>
}
</pre>

> *protectAll* : [optional] boolean
> <br>
> *protectComposite* : [optional] boolean
> <br>
> *protectPosition* : [optional] boolean
> <br>
> *protectTransparency* : [optional] boolean

### Blend range

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

### Layer type

A layer type can be one of the following:

- **Black & white adjustment**
- **Brightness/contrast adjustment**
- **Channel mixer adjustment**
- **Color balance adjustment**
- **Curves adjustment**
- **Exposure adjustment**
- **Gradient map adjustment**
- **Hue/saturation adjustment**
- **Invert adjustment**
- **Levels adjustment**
- **Photo filter adjustment**
- **Posterize adjustment**
- **Selective color adjustment**
- **Threshold adjustment**
- **Vibrance adjustment**
- **Gradient fill**
- **Pattern fill**
- **Solid color fill**

## Black & white adjustment

<pre>
{
    "blackAndWhite":
    {
        "red": <em>red</em>,
        "yellow": <em>yellow</em>,
        "green": <em>green</em>,
        "cyan": <em>cyan</em>,
        "blue": <em>blue</em>,
        "magenta": <em>magenta</em>,
        "useTint": <em>useTint</em>,
        "tintColor": <em>tintColor</em>,
        "using": <em>using</em>
    }
}
</pre>

> *red* : [optional] number (-200 to 300)
> <br>
> *yellow* : [optional] number (-200 to 300)
> <br>
> *green* : [optional] number (-200 to 300)
> <br>
> *cyan* : [optional] number (-200 to 300)
> <br>
> *blue* : [optional] number (-200 to 300)
> <br>
> *magenta* : [optional] number (-200 to 300)
> <br>
> *useTint* : [optional] boolean (`false` by default)
> <br>
> *tintColor* : [optional] JSON object in **Color** format (only if *useTint* is `true`)

> *using* : [optional] adjustment preset file path string (.blw)

## Brightness/contrast adjustment

<pre>
{
    "brightnessContrast":
    {
        "brightness": <em>brightness</em>,
        "contrast": <em>contrast</em>,
        "useLegacy": <em>useLegacy</em>
    }
}
</pre>

> *brightness* : [optional] number (-100 to 100 if *useLegacy* is `true` or undefined; -150 to 150 otherwise)
> <br>
> *contrast* : [optional] number (-100 to 100 if *useLegacy* is `true` or undefined; -50 to 100 otherwise)
> <br>
> *useLegacy* : [optional] boolean (`true` by default)

## Channel mixer adjustment

<pre>
{
    "channelMixer":
    {
        "red": <em>red</em>,
        "green": <em>green</em>,
        "blue": <em>blue</em>,
        "cyan": <em>cyan</em>,
        "magenta": <em>magenta</em>,
        "yellowColor": <em>yellowColor</em>,
        "black": <em>black</em>,
        "gray": <em>gray</em>,
        "monochromatic": <em>monochromatic</em>,
        "using": <em>using</em>
    }
}
</pre>

> *red* : [optional] JSON object in **Channel Matrix** format
> <br>
> *green* : [optional] JSON object in **Channel Matrix** format
> <br>
> *blue* : [optional] JSON object in **Channel Matrix** format

> *cyan* : [optional] JSON object in **Channel Matrix** format
> <br>
> *magenta* : [optional] JSON object in **Channel Matrix** format
> <br>
> *yellowColor* : [optional] JSON object in **Channel Matrix** format
> <br>
> *black* : [optional] JSON object in **Channel Matrix** format

> *gray* : [optional] JSON object in **Channel Matrix** format (only if *monochromatic* is `true`)

> *monochromatic* : [optional] boolean (`false` by default)

> *using* : [optional] adjustment preset file path string (.cha)

### Channel matrix

<pre>
{
    "red": <em>red</em>,
    "green": <em>green</em>,
    "blue": <em>blue</em>,
    "cyan": <em>cyan</em>,
    "magenta": <em>magenta</em>,
    "yellowColor": <em>yellowColor</em>,
    "black": <em>black</em>,
    "constant": <em>constant</em>
}
</pre>

> *red* : [optional] number (-200 to 200)
> <br>
> *green* : [optional] number (-200 to 200)
> <br>
> *blue* : [optional] number (-200 to 200)

> *cyan* : [optional] number (-200 to 200)
> <br>
> *magenta* : [optional] number (-200 to 200)
> <br>
> *yellowColor* : [optional] number (-200 to 200)
> <br>
> *black* : [optional] number (-200 to 200)

> *constant* : [optional] number (-200 to 200)

## Color balance adjustment

<pre>
{
    "colorBalance":
    {
        "shadowLevels": <em>shadowLevels</em>,
        "midtoneLevels": <em>midtoneLevels</em>,
        "highlightLevels": <em>highlightLevels</em>,
        "preserveLuminosity": <em>preserveLuminosity</em>
    }
}
</pre>

> *shadowLevels* : [optional] JSON array of numbers (-100 to 100)
> <br>
> *midtoneLevels* : [optional] JSON array of numbers (-100 to 100)
> <br>
> *highlightLevels* : [optional] JSON array of numbers (-100 to 100)
> <br>
> *preserveLuminosity* : [optional] boolean

## Curves adjustment

<pre>
{
    "curves":
    {
        "adjustment": <em>adjustment</em>,
        "using": <em>using</em>
    }
}
</pre>

> *adjustment* : [optional] JSON array of JSON objects in **Curves adjustment component** format

> *using* : [optional] adjustment preset file path string (.acv or .amp)

### Curves adjustment component

either:
<pre>
{
    "channel": <em>channel</em>,
    "curve": <em>curve</em>
}
</pre>
or:
<pre>
{
    "channel": <em>channel</em>,
    "mapping": <em>mapping</em>
}
</pre>

> *channel* : string (among **Channels**)

> *curve* : [optional] JSON array of JSON objects in **Point** format
> <br>
> *mapping* : [optional] JSON array of 256 numbers (0 to 255)

## Exposure adjustment

<pre>
{
    "exposure":
    {
        "exposure": <em>exposure</em>,
        "offset": <em>offset</em>,
        "gammaCorrection": <em>gammaCorrection</em>,
        "using": <em>using</em>
    }
}
</pre>

> *exposure* : [optional] number (-20.0 to 20.0; 0.0 by default)
> <br>
> *offset* : [optional] number (-0.5 to 0.5; 0.0 by default)
> <br>
> *gammaCorrection* : [optional] number (0.01 to 9.99; 1.0 by default)

> *using* : [optional] adjustment preset file path string (.eap)

## Gradient map adjustment

<pre>
{
    "gradientMapClass":
    {
        "gradient": <em>gradient</em>,
        "dither": <em>dither</em>,
        "reverse": <em>reverse</em>
    }
}
</pre>

> *gradient* : JSON object in **Gradient** format
> <br>
> *dither* : [optional] boolean (`false` by default)
> <br>
> *reverse* : [optional] boolean (`false` by default)

## Hue/saturation adjustment

<pre>
{
    "hueSaturation":
    {
        "adjustment": <em>adjustment</em>,
        "colorize": <em>colorize</em>,
        "using": <em>using</em>
    }
}
</pre>

> *adjustment* : [optional] JSON array of JSON objects in **Hue/saturation adjustment component** format
> <br>
> *colorize* : [optional] boolean (`false` by default)

> *using* : [optional] adjustment preset file path string (.ahu)

### Hue/saturation adjustment component

<pre>
{
    "hue": <em>hue</em>,
    "saturation": <em>saturation</em>,
    "lightness": <em>lightness</em>
}
</pre>
or:
<pre>
{
    "channel": <em>channel</em>,
    "hue": <em>hue</em>,
    "saturation": <em>saturation</em>,
    "lightness": <em>lightness</em>
}
</pre>
or:
<pre>
{
    "localRange": <em>localRange</em>,
    "beginRamp": <em>beginRamp</em>,
    "beginSustain": <em>beginSustain</em>,
    "endSustain": <em>endSustain</em>,
    "endRamp": <em>endRamp</em>,
    "hue": <em>hue</em>,
    "saturation": <em>saturation</em>,
    "lightness": <em>lightness</em>
}
</pre>

> *hue* : number (-180 to 180, or 0 to 360 if *colorize* is `true`)
> <br>
> *saturation* : number (-100 to 100, or 0 to 100 if *colorize* is `true`)
> <br>
> *lightness* : number (-100 to 100)

> *channel* : [optional] string (`"composite"`; only if *colorize* is `true`)

> *localRange* : [optional] number (1 for reds, 2 for yellows, 3 for greens, 4 for cyans, 5 for blues, 6 for magentas)
> <br>
> *beginRamp* : [optional] number (0 to 360)
> <br>
> *beginSustain* : [optional] number (0 to 360)
> <br>
> *endSustain* : [optional] number (0 to 360)
> <br>
> *endRamp* : [optional] number (0 to 360)

## Invert adjustment

<pre>
{
    "invert": null
}
</pre>

## Levels adjustment

<pre>
{
    "levels":
    {
        "adjustment": <em>adjustment</em>,
        "using": <em>using</em>
    }
}
</pre>

> *adjustment* : [optional] JSON array of JSON objects in **Levels adjustment component** format

> *using* : [optional] adjustment preset file path string (.alv)

### Levels adjustment component

<pre>
{
    "channel": <em>channel</em>,
    "input": <em>input</em>,
    "gamma": <em>gamma</em>,
    "output": <em>output</em>,
    "auto": <em>output</em>,
    "autoContrast": <em>output</em>,
    "autoNeutrals": <em>autoNeutrals</em>,
    "autoBlackWhite": <em>autoBlackWhite</em>,
    "blackClip": <em>blackClip</em>,
    "whiteClip": <em>whiteClip</em>
}
</pre>

> *channel* : string (among **Channels**)

> *input* : [optional] JSON array of 2 numbers (0 to 255; [ 0, 255 ] by default)
> <br>
> *gamma* : [optional] number (0.01 to 9.99; 1.0 by default)
> <br>
> *output* : [optional] JSON array of 2 numbers (0 to 255; [ 0, 255 ] by default)

> *auto* : [optional] boolean
> <br>
> *autoContrast* : [optional] boolean
> <br>
> *autoNeutrals* : [optional] boolean
> <br>
> *autoBlackWhite* : [optional] boolean
> <br>
> *blackClip* : [optional] number (0.0 to 9.99; 0.1 by default)
> <br>
> *whiteClip* : [optional] number (0.0 to 9.99; 0.1 by default)

## Photo filter adjustment

<pre>
{
    "photoFilter":
    {
        "color": <em>color</em>,
        "density": <em>density</em>,
        "preserveLuminosity": <em>preserveLuminosity</em>
    }
}
</pre>

> *color* : JSON object in **Color** format
> <br>
> *density* : [optional] number (1% to 100%; 25% by default)
> <br>
> *preserveLuminosity* : [optional] boolean (`true` by default)

## Posterize adjustment

<pre>
{
    "posterize":
    {
        "levels": <em>levels</em>
    }
}
</pre>

> *levels* : [optional] number (2 to 255; 4 by default)

## Selective color adjustment

<pre>
{
    "selectiveColor":
    {
        "colorCorrection": <em>colorCorrection</em>,
        "method": <em>method</em>,
        "using": <em>using</em>
    }
}
</pre>

> *colorCorrection* : [optional] JSON array of JSON objects in **Color correction** format
> <br>
> *method* : [optional] string (either `"absolute"` or `"relative"`; `"relative"` by default)

> *using* : [optional] adjustment preset file path string (.asv)

### Color correction

<pre>
{
    "colors": <em>colors</em>,
    "cyan": <em>cyan</em>,
    "magenta": <em>magenta</em>,
    "yellowColor": <em>yellowColor</em>,
    "black": <em>black</em>
}
</pre>

> *colors* : string (among `"reds"`, `"yellows"`, `"greens"`, `"cyans"`, `"blues"`, `"magentas"`, `"whites"`, `"neutrals"`, `"blacks"`)
> <br>
> *cyan* : [optional] number (-100% to 100%; 0% by default)
> <br>
> *magenta* : [optional] number (-100% to 100%; 0% by default)
> <br>
> *yellowColor* : [optional] number (-100% to 100%; 0% by default)
> <br>
> *black* : [optional] number (-100% to 100%; 0% by default)

## Threshold adjustment

<pre>
{
    "thresholdClassEvent":
    {
        "level": <em>level</em>
    }
}
</pre>

> *level* : [optional] number (1 to 255; 128 by default)

## Vibrance adjustment

<pre>
{
    "vibrance":
    {
        "vibrance": <em>vibrance</em>,
        "saturation": <em>saturation</em>
    }
}
</pre>

> *vibrance* : [optional] number (-100 to 100; 0 by default)
> <br>
> *saturation* : [optional] number (-100 to 100; 0 by default)

## Gradient fill

<pre>
{
    "gradientLayer":
    {
        "gradient": <em>gradient</em>,
        "type": <em>type</em>,
        "angle": <em>angle</em>,
        "scale": <em>scale</em>,
        "reverse": <em>reverse</em>,
        "dither": <em>dither</em>,
        "align": <em>align</em>,
        "offset": <em>offset</em>
    }
}
</pre>

> *gradient* : JSON object in **Gradient** format
> <br>
> *type* : [optional] string (among `"linear"`, `"radial"`, `"angle"`, `"reflected"`, `"diamond"`)
> <br>
> *angle* : [optional] number (-180° to 180°)
> <br>
> *scale* : [optional] number (percentage; 10% to 150%)
> <br>
> *reverse* : [optional] boolean (`false` by default)
> <br>
> *dither* : [optional] boolean (`false` by default)
> <br>
> *align* : [optional] boolean (`true` by default)
> <br>
> *offset* : [optional] JSON object in **Point** format

## Pattern fill

<pre>
{
    "patternLayer":
    {
        "pattern": <em>pattern</em>,
        "scale": <em>scale</em>,
        "align": <em>align</em>,
        "phase": <em>phase</em>
    }
}
</pre>

> *pattern* : JSON object in **Pattern** format
> <br>
> *scale* : [optional] number (percentage; 1% to 1000%; 100% by default)
> <br>
> *align* : [optional] boolean (`true` by default)
> <br>
> *phase* : [optional] JSON object in **Point** format

## Solid color fill

<pre>
{
    "solidColorLayer":
    {
        "color": <em>color</em>
    }
}
</pre>

> *color* : JSON object in **Color** format

## Color

A color can be one of the following:

- **Book color**
- **CMYK color**
- **Grayscale**
- **HSB color**
- **Lab color**
- **RGB color**

### Book color

<pre>
{
    "book": <em>book</em>,
    "name": <em>name</em>,
    "bookID": <em>bookID</em>,
    "bookKey": <em>bookKey</em>
}
</pre>
or
<pre>
{
    "book": <em>book</em>,
    "name": <em>name</em>
}
</pre>
or
<pre>
{
    "bookID": <em>bookID</em>,
    "bookKey": <em>bookKey</em>
}
</pre>

> *book* : string
> <br>
> *name* : string
> <br>
> *bookID* : number
> <br>
> *bookKey* : string

### CMYK color

<pre>
{
    "cyan": <em>cyan</em>,
    "magenta": <em>magenta</em>,
    "yellowColor": <em>yellowColor</em>,
    "black": <em>black</em>
}
</pre>

> *cyan* : number (percentage; 0% to 100%)
> <br>
> *magenta* : number (percentage; 0% to 100%)
> <br>
> *yellowColor* : number (percentage; 0% to 100%)
> <br>
> *black* : number (percentage; 0% to 100%)

### Grayscale

<pre>
{
    "gray": <em>gray</em>
}
</pre>

> *gray* : number (percentage; 0% to 100%)

### HSB color

<pre>
{
    "hue": <em>hue</em>,
    "saturation": <em>saturation</em>,
    "brightness": <em>brightness</em>
}
</pre>

> *hue* : number (0° to 360°)
> <br>
> *saturation* : number (percentage; 0% to 100%)
> <br>
> *brightness* : number (percentage; 0% to 100%)

### Lab color

<pre>
{
    "luminance": <em>luminance</em>,
    "a": <em>a</em>,
    "b": <em>b</em>
}
</pre>

> *luminance* : number (0 to 100)
> <br>
> *a* : number (-128 to 127)
> <br>
> *b* : number (-128 to 127)

### RGB color

<pre>
{
    "red": <em>red</em>,
    "green": <em>green</em>,
    "blue": <em>blue</em>
}
</pre>

> *red* : number (0 to 255)
> <br>
> *green* : number (0 to 255)
> <br>
> *blue* : number (0 to 255)

## Gradient

A gradient can be either a **Solid gradient** or a **Noise gradient**.

### Solid gradient

<pre>
{
    "name": <em>name</em>,
    "gradientForm": "customStops",
    "interpolation": <em>interpolation</em>,
    "colors": <em>colors</em>,
    "transparency": <em>transparency</em>
}
</pre>

> *name* : string (gradient name) or `null` (in input)
> <br>
> *interpolation* : number (0 to 4096)
> <br>
> *colors* : JSON array of JSON objects in **Color stop** format
> <br>
> *transparency* : JSON array of JSON objects in **Transparency stop** format

#### Color stop

<pre>
{
    "location": <em>location</em>,
    "midpoint": <em>midpoint</em>,
    "type": <em>type</em>,
    "color": <em>color</em>
}
</pre>

> *location* : number (0 to 4096)
> <br>
> *midpoint* : number (percentage; 0% to 100%)
> <br>
> *type* : string (among `"foregroundColor"`, `"backgroundColor"`, `"userStop"`)
> <br>
> *color* : [optional; only if *type* is `"userStop"`] JSON object in **Color** format

#### Transparency stop

<pre>
{
    "location": <em>location</em>,
    "midpoint": <em>midpoint</em>,
    "opacity": <em>opacity</em>
}
</pre>

> *location* : number (0 to 4096)
> <br>
> *midpoint* : number (percentage: 0% to 100%)
> <br>
> *opacity* : number (percentage: 0% to 100%) 

### Noise gradient

<pre>
{
    "name": <em>name</em>,
    "gradientForm": "colorNoise",
    "smoothness": <em>smoothness</em>,
    "colorSpace": <em>colorSpace</em>,
    "minimum": <em>minimum</em>,
    "maximum": <em>maximum</em>,
    "vectorColor": <em>vectorColor</em>,
    "showTransparency": <em>showTransparency</em>,
    "randomSeed": <em>randomSeed</em>
}
</pre>

> *name* : string (gradient name) or `null` (in input)
> <br>
> *smoothness* : number (0 to 4096)
> <br>
> *colorSpace* : string (among `"RGBColor"`, `"HSBColorEnum"`, `"labColor"`)
> <br>
> *minimum* : JSON array of 4 numbers, i.e., three color components (0 to 100) + transparency (0)
> <br>
> *maximum* : JSON array of 4 numbers, i.e., three color components (0 to 100) + transparency (100)
> <br>
> *vectorColor* : boolean
> <br>
> *showTransparency* : boolean
> <br>
> *randomSeed* : number

## Pattern

<pre>
{
    "name": <em>name</em>,
    "ID": <em>ID</em>
}
</pre>

> *name* : string
> <br>
> *ID* : string ([UUID](https://en.wikipedia.org/wiki/UUID))

## Point

<pre>
{
    "horizontal": <em>horizontal</em>,
    "vertical": <em>vertical</em>
}
</pre>

> *horizontal* : number
> <br>
> *vertical* : number

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
