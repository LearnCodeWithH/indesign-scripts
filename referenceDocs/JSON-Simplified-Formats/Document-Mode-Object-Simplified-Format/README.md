# Document Mode Object Simplified Format

- Input format of `jamStyles.toDocumentModeObject`.
- Output format of `jamStyles.fromDocumentModeObject`.

Used by the following utility scripts:

- [Get Layer Style](../../Utility-Scripts/Get-Layer-Style)
- [Parse Styles File](../../Utility-Scripts/Parse-Styles-File)

## Simplified format

Defined as a JSON object:
<pre>
{
    "colorSpace": <em>colorSpace</em>,
    "depth": <em>depth</em>
}
</pre>

> *colorSpace* : [optional; `"RGBColor"` by default] string (among `"CMYKColorEnum"`, `"grayScale"`, `"labColor"`, `"RGBColor"`)
> <br>
> *depth* : [optional; 8 by default] number (8 or 16)

## Examples

```json
{
    "colorSpace": "CMYKColorEnum"
}
```

```json
{
    "colorSpace": "labColor",
    "depth": 16
}
```
