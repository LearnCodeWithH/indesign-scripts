import_pdf_as_psd_config = {
    // Modify config options here.

    // Outputs the stitched script sent to Photoshop via Bridgetalk
    write_debug_bridgetalk_script: false,

    // Export pdf pages in the supported formats
    export_psd: true,
    export_png24: true,
    export_png8: true,
    export_jpeg: true,

    // Provides the color palette size for png8 export or an "auto" value will calculate an optimal palette size
    png8_color_palette_size: "auto" // "auto" or provide integer value like 256
}