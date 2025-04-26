# JSON Action Manager

## Description

“JSON Action Manager” is an open-source scripting library for Adobe Photoshop, written in JavaScript, and licensed under [GPLv3](https://www.gnu.org/licenses/gpl.html). It allows developers to interact with the underlying Action Manager using a simpler [JSON AM Data Format](../JSON-AM-Data-Format) (please refer also to the [JSON Project Introduction](../JSON-Project-Introduction) page to get more information).

What is called “JSON Action Manager” is basically a set of interrelated modules defining global variables acting as namespaces:

- `jamActions` defines a set of functions related to decoding actions files into a format usable by scripts written with the scripting library engine.

- `jamBooks` defines a set of color books-related functions for scripts written with the scripting library engine.

- `jamColors` defines a set of color-related functions for scripts written with the scripting library engine.

- `jamEngine` defines all the methods and properties of the scripting library engine.

- `jamHelpers` defines a set of helper functions for scripts written with the scripting library engine.

- `jamJSON` defines customized methods for translating a JavaScript data structure to and from a [JSON](https://www.json.org/) text string; it can be used in scripts written with the scripting library engine, but also independently.

- `jamLayers` defines a set of functions related to layers for scripts written with the scripting library engine.

- `jamShapes` defines a set of functions related to decoding custom shapes files into a format usable by scripts written with the scripting library engine.

- `jamStyles` defines a set of functions related to layer styles for scripts written with the scripting library engine.

- `jamText` defines a set of functions related to layer text for scripts written with the scripting library engine.

- `jamUtils` defines a set of utility functions for scripts written with the scripting library engine.

**Note**: the “Namespace” and “Syntax-highlighted file” HTML pages listed below are documentation files automatically generated from their respective source files, using a special comment syntax interpreted by [jsdoc-toolkit](https://code.google.com/archive/p/jsdoc-toolkit/).

Namespace | Syntax-highlighted file | Source file | Minified source file
--------- | ----------------------- | ----------- | --------------------
[jamActions](jsDoc/symbols/jamActions.html) | [jamActions.jsxinc](jsDoc/symbols/src/jamActions.jsxinc.html) | [jamActions.jsxinc](jamActions.jsxinc) | [jamActions-min.jsxinc](minified/jamActions-min.jsxinc)
[jamBooks](jsDoc/symbols/jamBooks.html) | [jamBooks.jsxinc](jsDoc/symbols/src/jamBooks.jsxinc.html) | [jamBooks.jsxinc](jamBooks.jsxinc) | [jamBooks-min.jsxinc](minified/jamBooks-min.jsxinc)
[jamColors](jsDoc/symbols/jamColors.html) | [jamColors.jsxinc](jsDoc/symbols/src/jamColors.jsxinc.html) | [jamColors.jsxinc](jamColors.jsxinc) | [jamColors-min.jsxinc](minified/jamColors-min.jsxinc)
[jamEngine](jsDoc/symbols/jamEngine.html) | [jamEngine.jsxinc](jsDoc/symbols/src/jamEngine.jsxinc.html) | [jamEngine.jsxinc](jamEngine.jsxinc) | [jamEngine-min.jsxinc](minified/jamEngine-min.jsxinc)
[jamHelpers](jsDoc/symbols/jamHelpers.html) | [jamHelpers.jsxinc](jsDoc/symbols/src/jamHelpers.jsxinc.html) | [jamHelpers.jsxinc](jamHelpers.jsxinc) | [jamHelpers-min.jsxinc](minified/jamHelpers-min.jsxinc)
[jamJSON](jsDoc/symbols/jamJSON.html) | [jamJSON.jsxinc](jsDoc/symbols/src/jamJSON.jsxinc.html) | [jamJSON.jsxinc](jamJSON.jsxinc) | [jamJSON-min.jsxinc](minified/jamJSON-min.jsxinc)
[jamLayers](jsDoc/symbols/jamLayers.html) | [jamLayers.jsxinc](jsDoc/symbols/src/jamLayers.jsxinc.html) | [jamLayers.jsxinc](jamLayers.jsxinc) | [jamLayers-min.jsxinc](minified/jamLayers-min.jsxinc)
[jamShapes](jsDoc/symbols/jamShapes.html) | [jamShapes.jsxinc](jsDoc/symbols/src/jamShapes.jsxinc.html) | [jamShapes.jsxinc](jamShapes.jsxinc) | [jamShapes-min.jsxinc](minified/jamShapes-min.jsxinc)
[jamStyles](jsDoc/symbols/jamStyles.html) | [jamStyles.jsxinc](jsDoc/symbols/src/jamStyles.jsxinc.html) | [jamStyles.jsxinc](jamStyles.jsxinc) | [jamStyles-min.jsxinc](minified/jamStyles-min.jsxinc)
[jamText](jsDoc/symbols/jamText.html) | [jamText.jsxinc](jsDoc/symbols/src/jamText.jsxinc.html) | [jamText.jsxinc](jamText.jsxinc) | [jamText-min.jsxinc](minified/jamText-min.jsxinc)
[jamUtils](jsDoc/symbols/jamUtils.html) | [jamUtils.jsxinc](jsDoc/symbols/src/jamUtils.jsxinc.html) | [jamUtils.jsxinc](jamUtils.jsxinc) | [jamUtils-min.jsxinc](minified/jamUtils-min.jsxinc)

## Requirements

“JSON Action Manager” can be used from Adobe Photoshop CS or later. It has been successfully tested in CS and CS4 on Mac OS X, but should be platform agnostic.

## Copyright

This Software is copyright © 2011-2016 by Michel MARIANI.

## License

This Software is licensed under the [GNU General Public License (GPL) v3](http://www.gnu.org/licenses/gpl.html).

## Download

[Download Zip File](../Downloads/jsonActionManager-4.5.1.zip)

## Installation

Download the Zip file and unzip it.

Move the `JSON Action Manager` folder to your user’s Home directory.

Start using the various functions of the library in your own scripts by inserting the following lines at the beginning of each script:

```javascript
//@includepath "~/JSON Action Manager/"
//@include "jamEngine.jsxinc"
```

Depending on your needs, you may also want to add some of the following include statements:

```javascript
//@include "jamActions.jsxinc"
//@include "jamBooks.jsxinc"
//@include "jamColors.jsxinc"
//@include "jamHelpers.jsxinc"
//@include "jamJSON.jsxinc"
//@include "jamLayers.jsxinc"
//@include "jamShapes.jsxinc"
//@include "jamStyles.jsxinc"
//@include "jamText.jsxinc"
//@include "jamUtils.jsxinc"
```

Alternatively, you can directly embed the contents of the compact one-line versions of the include files located in the [minified](minified) subfolder. This is the way to go if you intend to produce stand-alone scripts, like the [Utility Scripts](../Utility-Scripts) or the [Creative Scripts](../Creative-Scripts).

Basic HTML documentation automatically generated from the source files is available in the [jsDoc](jsDoc) subfolder.
