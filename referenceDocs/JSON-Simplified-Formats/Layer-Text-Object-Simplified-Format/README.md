# Layer Text Object Simplified Format

- Input format of `jamText.toLayerTextObject`.
- Output format of `jamText.fromLayerTextObject`.

Used by the following utility script:

- [Get Layer Text](../../Utility-Scripts/Get-Layer-Text)

## Simplified format

Defined as a JSON object:

<pre>
{
    "layerText": <em>layerText</em>,
    "typeUnit": <em>typeUnit</em>
}
</pre>

> *layerText* : JSON object in **Layer text** format
> <br>
> *typeUnit* : string (among **Type units**)

## Layer text

<pre>
{
    "textKey": <em>textKey</em>,
    "warp": <em>warp</em>,
    "textClickPoint": <em>textClickPoint</em>,
    "transform": <em>transform</em>,
    "textGridding": <em>textGridding</em>,
    "orientation": <em>orientation</em>,
    "antiAlias": <em>antiAlias</em>,
    "textShape": <em>textShape</em>,
    "textStyleRange": <em>textStyleRange</em>,
    "paragraphStyleRange": <em>paragraphStyleRange</em>,
    "kerningRange": <em>kerningRange</em>
}
</pre>

> *textKey* : string
> <br>
> *warp* : JSON object in **Warp** format
> <br>
> *textClickPoint* : JSON object in **Point** format (in percentage)
> <br>
> *transform* : [optional] JSON object in **Transform** format
> <br>
> *textGridding* : string (among `"none"`, `"round"`)
> <br>
> *orientation* : string (among `"horizontal"`, `"vertical"`)
> <br>
> *antiAlias* : string (among `"antiAliasNone"`, `"antiAliasSharp"`, `"antiAliasCrisp"`, `"antiAliasStrong"`, `"antiAliasSmooth"`)
> <br>
> *textShape* : JSON array of JSON objects in **Text shape** format
> <br>
> *textStyleRange* : JSON array of JSON objects in **Text style range** format
> <br>
> *paragraphStyleRange* : JSON array of JSON objects in **Paragraph style range** format
> <br>
> *kerningRange* : JSON array of JSON objects in **Kerning range** format

## Text shape

<pre>
{
    "path": <em>path</em>,
    "tRange": <em>tRange</em>,
    "textType": <em>textType</em>,
    "orientation": <em>orientation</em>,
    "transform": <em>transform</em>,
    "rowCount": <em>rowCount</em>,
    "columnCount": <em>columnCount</em>,
    "rowMajorOrder": <em>rowMajorOrder</em>,
    "rowGutter": <em>rowGutter</em>,
    "columnGutter": <em>columnGutter</em>,
    "spacing": <em>spacing</em>,
    "frameBaselineAlignment": <em>frameBaselineAlignment</em>,
    "firstBaselineMinimum": <em>firstBaselineMinimum</em>,
    "base": <em>base</em>,
    "bounds": <em>bounds</em>,
    "flip": <em>flip</em>,
    "pathTypeEffect": <em>pathTypeEffect</em>,
    "pathTypeAlignment": <em>pathTypeAlignment</em>,
    "pathTypeAlignTo": <em>pathTypeAlignTo</em>,
    "pathTypeSpacing": <em>pathTypeSpacing</em>
}
</pre>

> *path* : [optional] JSON object in **Path** format
> <br>
> *tRange* : [optional; only if *textType* is `"onACurve"`] JSON object in **T-range** format
> <br>
> *textType* : string (among `"point"`, `"box"`, `"onACurve"`)
> <br>
> *orientation* : string (among `"horizontal"`, `"vertical"`)
> <br>
> *transform* : JSON object in **Transform** format
> <br>
> *rowCount* : number
> <br>
> *columnCount* : number
> <br>
> *rowMajorOrder* : boolean
> <br>
> *rowGutter* : number
> <br>
> *columnGutter* : number
> <br>
> *spacing* : number
> <br>
> *frameBaselineAlignment* : string (among `"alignByAscent"`, `"alignByMinimumValue"`, `"alignByCapHeight"`, `"alignByLeading"`, `"alignByXHeight"`)
> <br>
> *firstBaselineMinimum* : number
> <br>
> *base* : [optional; only if *textType* is `"point"`] JSON object in **Point** format
> <br>
> *bounds* : [optional; only if *textType* is `"box"`] JSON object in **Rectangle** format
> <br>
> *flip* : [optional; only if *textType* is `"onACurve"`] boolean
> <br>
> *pathTypeEffect* : [optional; only if *textType* is `"onACurve"`] string (among `"rainbowEffect"`, `"skewEffect"`, `"3DRibbonEffect"`, `"stairStepEffect"`, `"gravityEffect"`)
> <br>
> *pathTypeAlignment* : [optional; only if *textType* is `"onACurve"`] string (among `"baselineAlignment"`, `"ascenderAlignment"`, `"descenderAlignment"`, `"centerAlignment"`)
> <br>
> *pathTypeAlignTo* : [optional; only if *textType* is `"onACurve"`] string (among `"toPathTop"`, `"toPathBottom"`, `"toPathCenter"`)
> <br>
> *pathTypeSpacing* : [optional; only if *textType* is `"onACurve"`] number

## Text style range

<pre>
{
    "from": <em>from</em>,
    "to": <em>to</em>,
    "textStyle": <em>textStyle</em>
}
</pre>

> *from* : number
> <br>
> *to* : number
> <br>
> *textStyle* : JSON object in **Text style** format

## Text style

<pre>
{
    "fontPostScriptName": <em>fontPostScriptName</em>,
    "fontName": <em>fontName</em>,
    "fontStyleName": <em>fontStyleName</em>,
    "fontScript": <em>fontScript</em>,
    "fontTechnology": <em>fontTechnology</em>,
    "size": <em>size</em>,
    "horizontalScale": <em>horizontalScale</em>,
    "verticalScale": <em>verticalScale</em>,
    "syntheticBold": <em>syntheticBold</em>,
    "syntheticItalic": <em>syntheticItalic</em>,
    "autoLeading": <em>autoLeading</em>,
    "leading": <em>leading</em>,
    "tracking": <em>tracking</em>,
    "baselineShift": <em>baselineShift</em>,
    "characterRotation": <em>characterRotation</em>,
    "autoKern": <em>autoKern</em>,
    "fontCaps": <em>fontCaps</em>,
    "baseline": <em>baseline</em>,
    "otbaseline": <em>otbaseline</em>,
    "strikethrough": <em>strikethrough</em>,
    "underline": <em>underline</em>,
    "underlineOffset": <em>underlineOffset</em>,
    "ligature": <em>ligature</em>,
    "altligature": <em>altligature</em>,
    "contextualLigatures": <em>contextualLigatures</em>,
    "alternateLigatures": <em>alternateLigatures</em>,
    "oldStyle": <em>oldStyle</em>,
    "fractions": <em>fractions</em>,
    "ordinals": <em>ordinals</em>,
    "swash": <em>swash</em>,
    "titling": <em>titling</em>,
    "connectionForms": <em>connectionForms</em>,
    "stylisticAlternates": <em>stylisticAlternates</em>,
    "ornaments": <em>ornaments</em>,
    "figureStyle": <em>figureStyle</em>,
    "proportionalMetrics": <em>proportionalMetrics</em>,
    "kana": <em>kana</em>,
    "italics": <em>italics</em>,
    "ruby": <em>ruby</em>,
    "baselineDirection": <em>baselineDirection</em>,
    "textLanguage": <em>textLanguage</em>,
    "japaneseAlternate": <em>japaneseAlternate</em>,
    "mojiZume": <em>mojiZume</em>,
    "gridAlignment": <em>gridAlignment</em>,
    "enableWariChu": <em>enableWariChu</em>,
    "wariChuCount": <em>wariChuCount</em>,
    "wariChuLineGap": <em>wariChuLineGap</em>,
    "wariChuScale": <em>wariChuScale</em>,
    "wariChuWidow": <em>wariChuWidow</em>,
    "wariChuOrphan": <em>wariChuOrphan</em>,
    "wariChuJustification": <em>wariChuJustification</em>,
    "tcyUpDown": <em>tcyUpDown</em>,
    "tcyLeftRight": <em>tcyLeftRight</em>,
    "leftAki": <em>leftAki</em>,
    "rightAki": <em>rightAki</em>,
    "jiDori": <em>jiDori</em>,
    "noBreak": <em>noBreak</em>,
    "color": <em>color</em>,
    "strokeColor": <em>strokeColor</em>,
    "fill": <em>fill</em>,
    "stroke": <em>stroke</em>,
    "fillFirst": <em>fillFirst</em>,
    "fillOverPrint": <em>fillOverPrint</em>,
    "strokeOverPrint": <em>strokeOverPrint</em>,
    "lineCap": <em>lineCap</em>,
    "lineJoin": <em>lineJoin</em>,
    "lineWidth": <em>lineWidth</em>,
    "miterLimit": <em>miterLimit</em>,
    "lineDashoffset": <em>lineDashoffset</em>
}
</pre>

> *fontPostScriptName* : string
> <br>
> *fontName* : string
> <br>
> *fontStyleName* : string
> <br>
> *fontScript* : number
> <br>
> *fontTechnology* : number
> <br>
> *size* : number
> <br>
> *horizontalScale* : number
> <br>
> *verticalScale* : number
> <br>
> *syntheticBold* : boolean
> <br>
> *syntheticItalic* : boolean
> <br>
> *autoLeading* : boolean
> <br>
> *leading* : [optional; only if *autoLeading* is `false`] number
> <br>
> *tracking* : number
> <br>
> *baselineShift* : number
> <br>
> *characterRotation* : number
> <br>
> *autoKern* : string (among `"metricsKern"`, `"opticalKern"`, `"manual"`)
> <br>
> *fontCaps* : string (among `"normal"`, `"allCaps"`, `"smallCaps"`)
> <br>
> *baseline* : string (among `"normal`", `"superScript"`, `"subScript"`)
> <br>
> *otbaseline* : string (among `"normal"`, …)
> <br>
> *strikethrough* : string (among `"strikethroughOff"`, `"xHeightStrikethroughOn"`, `"eMBoxStrikethroughOn"`)
> <br>
> *underline* : string (among `"underlineOff"`, `"underlineOnLeftInVertical"`, `"underlineOnRightInVertical"`, `"verticalUnderlineLeft"`, `"verticalUnderlineRight"`)
> <br>
> *underlineOffset* : number
> <br>
> *ligature* : boolean
> <br>
> *altligature* : boolean
> <br>
> *contextualLigatures* : boolean
> <br>
> *alternateLigatures* : boolean
> <br>
> *oldStyle* : boolean
> <br>
> *fractions* : boolean
> <br>
> *ordinals* : boolean
> <br>
> *swash* : boolean
> <br>
> *titling* : boolean
> <br>
> *connectionForms* : boolean
> <br>
> *stylisticAlternates* : boolean
> <br>
> *ornaments* : boolean
> <br>
> *figureStyle* : string (among `"normal"`, …)
> <br>
> *proportionalMetrics* : boolean
> <br>
> *kana* : boolean
> <br>
> *italics* : boolean
> <br>
> *ruby* : boolean
> <br>
> *baselineDirection* : string (among `"rotated"`, `"cross"`, …)
> <br>
> *textLanguage* : string (among `"englishLanguage"`, `"ukenglishLanguage"`, `"canadianEnglishLanguage"`, `"finnishLanguage"`, `"standardFrenchLanguage"`, `"canadianFrenchLanguage"`, `"standardGermanLanguage"`, `"germanLanguageReformed1996"`, `"oldGermanLanguage"`, `"swissGermanLanguage"`, `"swissGermanLanguageOldRules"`, `"italianLanguage"`, `"bokmalNorwegianLanguage"`, `"nynorskNorwegianLanguage"`, `"standardPortugueseLanguage"`, `"brazilianPortugueseLanguage"`, `"spanishLanguage"`, `"swedishLanguage"`, `"dutchLanguage"`, `"oldDutchLanguage"`, `"danishLanguage"`, `"catalanLanguage"`, `"russianLanguage"`, `"ukrainianLanguage"`, `"bulgarianLanguage"`, `"serbianLanguage"`, `"czechLanguage"`, `"polishLanguage"`, `"romanianLanguage"`, `"ukranianLanguage"`, `"greekLanguage"`, `"turkishLanguage"`, `"icelandicLanguage"`, `"hungarianLanguage"`, `"slovakLanguage"`, `"slovenianLanguage"`, `"croatianLanguage"`, `"latvianLanguage"`, `"lithuanianLanguage"`, `"estonianLanguage"`, `"chineseLanguage"`, `"japaneseLanguage"`)
> <br>
> *japaneseAlternate* : string (among `"defaultForm"`, `"JIS78Form"`, `"expertForm"`, `"traditionalForm"`)
> <br>
> *mojiZume* : number
> <br>
> *gridAlignment* : string (among `"roman"`, `"icfbottom"`, `"icftop"`)
> <br>
> *enableWariChu* : boolean
> <br>
> *wariChuCount* : number
> <br>
> *wariChuLineGap* : number
> <br>
> *wariChuScale* : number
> <br>
> *wariChuWidow* : number
> <br>
> *wariChuOrphan* : number
> <br>
> *wariChuJustification* : string (among `"wariChuLeftJustify"`, `"wariChuRightJustify"`, `"wariChuCenterJustify"`, `"wariChuFullJustifyLastLineLeft"`, `"wariChuFullJustifyLastLineRight"`, `"wariChuFullJustifyLastLineCenter"`, `"wariChuFullJustifyLastLineFull"`, `"wariChuAutoJustify"`)
> <br>
> *tcyUpDown* : number
> <br>
> *tcyLeftRight* : number
> <br>
> *leftAki* : number
> <br>
> *rightAki* : number
> <br>
> *jiDori* : number
> <br>
> *noBreak* : boolean
> <br>
> *color* : JSON object in **Color** format
> <br>
> *strokeColor* : JSON object in **Color** format
> <br>
> *fill* : boolean
> <br>
> *stroke* : boolean
> <br>
> *fillFirst* : boolean
> <br>
> *fillOverPrint* : boolean
> <br>
> *strokeOverPrint* : boolean
> <br>
> *lineCap* : string (among `"buttCap"`, `"roundCap"`, `"squareCap"`)
> <br>
> *lineJoin* : string (among `"miterJoin"`, `"roundJoin"`, `"bevelJoin"`)
> <br>
> *lineWidth* : number
> <br>
> *miterLimit* : number
> <br>
> *lineDashoffset* : number

## Paragraph style range

<pre>
{
    "from": <em>from</em>,
    "to": <em>to</em>,
    "paragraphStyle": <em>paragraphStyle</em>
}
</pre>

> *from* : number
> <br>
> *to* : number
> <br>
> *paragraphStyle* : JSON object in **Paragraph style** format

## Paragraph style

<pre>
{
    "alignment": <em>alignment</em>,
    "firstLineIndent": <em>firstLineIndent</em>,
    "startIndent": <em>startIndent</em>,
    "endIndent": <em>endIndent</em>,
    "spaceBefore": <em>spaceBefore</em>,
    "spaceAfter": <em>spaceAfter</em>,
    "dropCapMultiplier": <em>dropCapMultiplier</em>,
    "autoLeadingPercentage": <em>autoLeadingPercentage</em>,
    "leadingType": <em>leadingType</em>,
    "hyphenate": <em>hyphenate</em>,
    "hyphenateWordSize": <em>hyphenateWordSize</em>,
    "hyphenatePreLength": <em>hyphenatePreLength</em>,
    "hyphenatePostLength": <em>hyphenatePostLength</em>,
    "hyphenateLimit": <em>hyphenateLimit</em>,
    "hyphenationZone": <em>hyphenationZone</em>,
    "hyphenateCapitalized": <em>hyphenateCapitalized</em>,
    "hyphenationPreference": <em>hyphenationPreference</em>,
    "justificationWordMinimum": <em>justificationWordMinimum</em>,
    "justificationWordDesired": <em>justificationWordDesired</em>,
    "justificationWordMaximum": <em>justificationWordMaximum</em>,
    "justificationLetterMinimum": <em>justificationLetterMinimum</em>,
    "justificationLetterDesired": <em>justificationLetterDesired</em>,
    "justificationLetterMaximum": <em>justificationLetterMaximum</em>,
    "justificationGlyphMinimum": <em>justificationGlyphMinimum</em>,
    "justificationGlyphDesired": <em>justificationGlyphDesired</em>,
    "justificationGlyphMaximum": <em>justificationGlyphMaximum</em>,
    "singleWordJustification": <em>singleWordJustification</em>,
    "hangingRoman": <em>hangingRoman</em>,
    "autoTCY": <em>autoTCY</em>,
    "keepTogether": <em>keepTogether</em>,
    "burasagari": <em>burasagari</em>,
    "preferredKinsokuOrder": <em>preferredKinsokuOrder</em>,
    "kurikaeshiMojiShori": <em>kurikaeshiMojiShori</em>,
    "kinsokuSetName": <em>kinsokuSetName</em>,
    "mojiKumiName": <em>mojiKumiName</em>,
    "textEveryLineComposer": <em>textEveryLineComposer</em>,
    "defaultTabWidth": <em>defaultTabWidth</em>,
    "defaultStyle": <em>defaultStyle</em>
}
</pre>

> *alignment* : string (among `"left"`, `"center"`, `"right"`, `"justifyLeft"`, `"justifyCenter"`, `"justifyRight"`, `"justifyAll"`)
> <br>
> *firstLineIndent* : number
> <br>
> *startIndent* : number
> <br>
> *endIndent* : number
> <br>
> *spaceBefore* : number
> <br>
> *spaceAfter* : number
> <br>
> *dropCapMultiplier* : number
> <br>
> *autoLeadingPercentage* : number
> <br>
> *leadingType* : string (among `"leadingAbove"`, `"leadingBelow"`)
> <br>
> *hyphenate* : boolean
> <br>
> *hyphenateWordSize* : number
> <br>
> *hyphenatePreLength* : number
> <br>
> *hyphenatePostLength* : number
> <br>
> *hyphenateLimit* : number
> <br>
> *hyphenationZone* : number
> <br>
> *hyphenateCapitalized* : boolean
> <br>
> *hyphenationPreference* : number
> <br>
> *justificationWordMinimum* : number
> <br>
> *justificationWordDesired* : number
> <br>
> *justificationWordMaximum* : number
> <br>
> *justificationLetterMinimum* : number
> <br>
> *justificationLetterDesired* : number
> <br>
> *justificationLetterMaximum* : number
> <br>
> *justificationGlyphMinimum* : number
> <br>
> *justificationGlyphDesired* : number
> <br>
> *justificationGlyphMaximum* : number
> <br>
> *singleWordJustification* : string (among `"justifyAll"`, …)
> <br>
> *hangingRoman* : boolean
> <br>
> *autoTCY* : number
> <br>
> *keepTogether* : boolean
> <br>
> *burasagari* : string (among `"burasagariNone"`, `"burasagariStandard"`, `"burasagariStrong"`)
> <br>
> *preferredKinsokuOrder* : string (among `"pushIn"`, `"pushOutFirst"`, `"pushOut"`)
> <br>
> *kurikaeshiMojiShori* : boolean
> <br>
> *kinsokuSetName* : string (among `"None"`, `"Soft"`, `"Hard"`)
> <br>
> *mojiKumiName* : [optional] string (among `"Photoshop6MojiKumiSet1"`, `"Photoshop6MojiKumiSet2"`, `"Photoshop6MojiKumiSet3"`, `"Photoshop6MojiKumiSet4"`)
> <br>
> *textEveryLineComposer* : boolean
> <br>
> *defaultTabWidth* : number
> <br>
> *defaultStyle* : JSON object in **Text style** format

## Kerning range

<pre>
{
    "from": <em>from</em>,
    "to": <em>to</em>,
    "kerning": <em>kerning</em>
}
</pre>

> *from* : number
> <br>
> *to* : number
> <br>
> *kerning* : number

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

## Path

<pre>
{
    "pathComponents": <em>pathComponents</em>,
    "unit": <em>unit</em>
}
</pre>

> *pathComponents* : JSON array of JSON objects in **Path component** format
> <br>
> *unit* : string (among **Graphics units**)

## Path component

<pre>
{
    "shapeOperation": <em>shapeOperation</em>,
    "subpathListKey": <em>subpathListKey</em>,
    "windingFill": <em>windingFill</em>
}
</pre>

> *shapeOperation* : string (among `"add"`, `"intersect"`, `"subtract"`, `"xor"`)
> <br>
> *subpathListKey* : JSON array of JSON objects in **Subpath** format
> <br>
> *windingFill* : boolean (optional, `false` by default)

## Subpath

<pre>
{
    "points": <em>points</em>,
    "closedSubpath": <em>closedSubpath</em>
}
</pre>

> *points* : JSON array of JSON objects in **Path point** format
> <br>
> *closedSubpath* : boolean (optional, `false` by default)

## Path point

<pre>
{
    "anchor": <em>anchor</em>,
    "forward": <em>forward</em>,
    "backward": <em>backward</em>,
    "smooth": <em>smooth</em>
}
</pre>

> *anchor* : JSON object in **Point** format
> <br>
> *forward* : [optional] JSON object in **Point** format
> <br>
> *backward* : [optional] JSON object in **Point** format
> <br>
> *smooth* : [optional] boolean

## Point

<pre>
{
    "horizontal": <em>horizontal</em>,
    "vertical": <em>vertical</em>
}
</pre>

> *horizontal*: number
> <br>
> *vertical*: number

## Rectangle

<pre>
{
    "top": top,
    "left": left,
    "bottom": bottom,
    "right": right
}
</pre>

> *top* : number
> <br>
> *left* : number
> <br>
> *bottom* : number
> <br>
> *right* : number

## T-range

<pre>
{
    "start": <em>start</em>,
    "end": <em>end</em>
}
</pre>

> *start* : number
> <br>
> *end* : number

## Transform

<pre>
{
    "xx": <em>xx</em>,
    "xy": <em>xy</em>,
    "yx": <em>yx</em>,
    "yy": <em>yy</em>,
    "tx": <em>tx</em>,
    "ty": <em>ty</em>
}
</pre>

> *xx* : number
> <br>
> *xy* : number
> <br>
> *yx* : number
> <br>
> *yy* : number
> <br>
> *tx* : number
> <br>
> *ty* : number

## Warp

<pre>
{
    "warpStyle": <em>warpStyle</em>,
    "warpValue": <em>warpValue</em>,
    "warpPerspective": <em>warpPerspective</em>,
    "warpPerspectiveOther": <em>warpPerspectiveOther</em>,
    "warpRotate": <em>warpRotate</em>
}
</pre>

> *warpStyle* : string (among `"warpNone"`, `"warpArc"`, `"warpArcLower"`, `"warpArcUpper"`, `"warpArch"`, `"warpBulge"`, `"warpShellLower"`, `"warpShellUpper"`, `"warpFlag"`, `"warpWave"`, `"warpFish"`, `"warpRise"`, `"warpFisheye"`, `"warpInflate"`, `"warpSqueeze"`, `"warpTwist"`)
> <br>
> *warpValue* : number
> <br>
> *warpPerspective* : number
> <br>
> *warpPerspectiveOther* : number
> <br>
> *warpRotate* : string (among `"horizontal"`, `"vertical"`)

## Type units

Common unit used for text measurement (*rowGutter*, *columnGutter*, *spacing*, *firstBaselineMinimum*, *size*, *leading*, *baselineShift*, *underlineOffset*, *lineWidth*, *miterLimit*, *firstLineIndent*, *startIndent*, *endIndent*, *spaceBefore*, *spaceAfter*):

- `"pixelsUnit"`
- `"pointsUnit"`
- `"millimetersUnit"`

## Graphics units

Common unit of the text shape’s path components (*horizontal* and *vertical* coordinates of *anchor*, *forward*, *backward* points) used for text along a path or text inside a path:

- `"pixelsUnit"`
- `"distanceUnit"`
- `"percentUnit"`
