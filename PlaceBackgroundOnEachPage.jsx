//PlaceBackgroundOnEachPage.jsx
//An InDesign JavaScript
//Most up to date versions can always be found at: https://github.com/LearnCodeWithH/indesign-scripts/

// Function to open a file selection dialog and return selected files
function selectFiles() {
    var fileTypes = "*.jpg;*.jpeg;*.png;*.gif;*.eps;*.psd;*.ai"; // File types to filter (image, PSD, AI)
    return File.openDialog("Select files to place", fileTypes, true);
}

// Function to check if the document has enough pages to place all selected files
function ensurePageCount(doc, page_count_needed) {
    var pages_created = 0;
    while (doc.pages.length < page_count_needed) {
        doc.pages.add(LocationOptions.AT_END);
        pages_created = pages_created + 1;
    }
    return pages_created;
}

// Main script
try {
    var files = selectFiles(); // Open file selection dialog
    if (files.length === 0) {
        alert("No files selected. Exiting script.");
        exit();
    }

    var doc = app.activeDocument;
    var page_count_needed = files.length; // Number of pages needed

    var pages_created = ensurePageCount(doc, page_count_needed); // Ensure enough pages in the document

    var active_layer = doc.activeLayer; // Get the active layer

    // Loop through each file and place it on a new page
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var page_number = i; // Use 0-based index for page number

        var page = doc.pages[page_number]; // Get the page to place the file

        // Place the file on the page
        page.place(file, [0,0], active_layer)[0];
    }

    if (pages_created > 0) {
        alert("Created " + pages_created + " additional page(s) and placed " + files.length + " total file(s)");
    } else {
        alert("Placed " + files.length + " total file(s)");
    }
    
} catch (e) {
    alert("Error: " + e.message);
}
