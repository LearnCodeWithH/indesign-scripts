# JSON Simplified Formats

 - Simplified formats used by the functions related to layers (adjustment layers, fill layers, layer styles, layer text), contained in the modules: `jamLayers`, `jamStyles`, `jamText`, part of the [JSON Action Manager](../JSON-Action-Manager) scripting library:

    - [Blending Options Object Simplified Format](Blending-Options-Object-Simplified-Format)
    - [Document Mode Object Simplified Format](Document-Mode-Object-Simplified-Format)
    - [Layer Effects Object Simplified Format](Layer-Effects-Object-Simplified-Format)
    - [Layer Object Simplified Format](Layer-Object-Simplified-Format)
    - [Layer Text Object Simplified Format](Layer-Text-Object-Simplified-Format)

- Simplified formats used by the helper functions of the `jamHelpers` module, part of the [JSON Action Manager](../JSON-Action-Manager) scripting library:

    - [Blend Range List Simplified Format](Blend-Range-List-Simplified-Format)
    - [Color Object Simplified Format](Color-Object-Simplified-Format)
    - [Curve Point List Simplified Format](Curve-Point-List-Simplified-Format)
    - [Curves Adjustment List Simplified Format](Curves-Adjustment-List-Simplified-Format)
    - [Custom Shape Object Simplified Format](Custom-Shape-Object-Simplified-Format)
    - [Ellipse Object Simplified Format](Ellipse-Object-Simplified-Format)
    - [Gradient Object Simplified Format](Gradient-Object-Simplified-Format)
    - [Hue/Saturation Adjustment List Simplified Format](HueSaturation-Adjustment-List-Simplified-Format)
    - [Integer List Simplified Format](Integer-List-Simplified-Format)
    - [Offset Object Simplified Format](Offset-Object-Simplified-Format)
    - [Path Component List Simplified Format](Path-Component-List-Simplified-Format)
    - [Point List Simplified Format](Point-List-Simplified-Format)
    - [Point Object Simplified Format](Point-Object-Simplified-Format)
    - [Rational Point List Simplified Format](Rational-Point-List-Simplified-Format)
    - [Rectangle Object Simplified Format](Rectangle-Object-Simplified-Format)

**Notes**:

- Since the total number of parameters can be pretty high, the simplified formats used by the functions related to layers are always defined as JSON objects.

- For the sake of simplicity, consistency and compactness, the simplified formats used by the helper functions are defined as JSON arrays (*minimal* format). However, the most important simplified formats are now also available in *explicit* format, making use of more human-readable JSON objects. Besides, this new explicit format is consistent with all the simplified formats used by the functions related to layers.
