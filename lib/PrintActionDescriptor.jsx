/**
 * PrintPhotoshopActionDescriptor.jsx
 * 
 * A script that prints out the action descriptors for a specified Photoshop action
 * Uses the DescriptorInfo helper for detailed output
 */

#target photoshop
#include './DebugFileLogger.jsx'
#include './DescriptorInfo.jsx'
#include './Validations.jsx'
#include './bridgetalk/SymbolBuilder.jsx'

var g2SymbolBuilder = createSymbolBuilder();

// Initialize descriptorInfo at the global scope
var descriptorInfo = new DescriptorInfo();

/**
 * Find an action by name in the application
 * @param {String} actionName - The name of the action to find
 * @return {ActionReference} The action reference if found, null otherwise
 */
function findActionByName(actionName) {
    try {
        // Get first action set to find total number of sets
        var ref = new ActionReference();
        ref.putIndex(charIDToTypeID('ASet'), 1);
        var desc = executeActionGet(ref);
        
        // Get the total number of action sets
        var numberOfSets = desc.getInteger(charIDToTypeID('NmbC'));
        
        // Loop through all action sets
        for (var i = 1; i <= numberOfSets; i++) {
            // Get reference to current action set
            var setRef = new ActionReference();
            setRef.putIndex(charIDToTypeID('ASet'), i);
            var setDesc = executeActionGet(setRef);
            
            // Get set name
            var setName = setDesc.getString(charIDToTypeID('Nm  '));
            
            // Get number of actions in the set
            var numberOfActions = setDesc.getInteger(charIDToTypeID('NmbC'));
            
            // Loop through all actions in the set
            for (var j = 1; j <= numberOfActions; j++) {
                // Get reference to current action
                var actionRef = new ActionReference();
                actionRef.putIndex(charIDToTypeID('Actn'), j);
                actionRef.putIndex(charIDToTypeID('ASet'), i);
                var actionDesc = executeActionGet(actionRef);
                
                // Get action name
                var currentActionName = actionDesc.getString(charIDToTypeID('Nm  '));
                
                if (currentActionName === actionName) {
                    // Create a reference to the found action
                    var foundRef = new ActionReference();
                    foundRef.putName(charIDToTypeID("Actn"), actionName);
                    foundRef.putName(charIDToTypeID("ASet"), setName);
                    return foundRef;
                }
            }
        }
    } catch (e) {
        alert("Error while searching for actions: " + debugErrorFormatString(e));
    }
    
    return null;
}

/**
 * Main function that gets the descriptor for an action and prints it to file
 * @param {String} actionName - The name of the action to find
 * @param {String} outputPath - Path where to save the output file (optional)
 */
function printActionDescriptor(actionName, outputPath) {
    if (!actionName) {
        alert("Please provide an action name.");
        return;
    }
    
    // Set default output path if not provided
    outputPath = outputPath || "~/Desktop/action-descriptor.json";
    
    try {
        // Find the action
        var actionRef = findActionByName(actionName);
        if (!actionRef) {
            alert("Action '" + actionName + "' not found.");
            return;
        }
        
        // Get the action descriptor
        var actionDesc = executeActionGet(actionRef);
        
        // Use DescriptorInfo to print the descriptor details
        var params = {
            reference: true,
            extended: true,
            saveToFile: outputPath
        };
        
        var result = descriptorInfo.getProperties(actionDesc, params);
        
        // Process children if they exist
        processActionChildren(actionDesc, actionName, outputPath);
        
        alert("Action descriptor for '" + actionName + "' saved to: " + outputPath);
        
        return result;
    } catch (e) {
        alert("Error: " + debugErrorFormatString(e));
    }
}

/**
 * Process and output children of an action descriptor
 * @param {ActionDescriptor} actionDesc - The action descriptor to process
 * @param {String} actionName - The name of the action
 * @param {String} outputPath - Path where to save the output file
 */
function processActionChildren(actionDesc, actionName, outputPath) {
    try {
        // Check if the descriptor has numberOfChildren property
        DebugLogger.writeObject("NmbC => ", actionDesc.hasKey(charIDToTypeID('NmbC')));
        if (actionDesc.hasKey(charIDToTypeID('NmbC'))) {
            DebugLogger.writeObject("NmbC => ", actionDesc.getInteger(charIDToTypeID('NmbC')));
            var numberOfChildren = actionDesc.getInteger(charIDToTypeID('NmbC'));
            
            if (numberOfChildren > 0) {
                var childrenData = {
                    actionName: actionName,
                    children: []
                };
                
                // Get all children
                for (var i = 1; i <= numberOfChildren; i++) {
                    // Create a reference to the child
                    var childRef = new ActionReference();
                    childRef.putIndex(charIDToTypeID('Actn'), i); 
                    childRef.putName(charIDToTypeID('ASet'), actionName);
                    
                    try {
                        var childDesc = executeActionGet(childRef);
                        
                        // Use DescriptorInfo to get child properties
                        var childParams = {
                            reference: true,
                            extended: true,
                            saveToFile: outputPath.replace(".json", "-child-" + i + ".json")
                        };
                        
                        var childProps = descriptorInfo.getProperties(childDesc, childParams);
                        childrenData.children.push(childProps);
                    } catch (childErr) {
                        // If we can't get a specific child, just log it and continue
                        DebugLogger.write("Error getting child " + i + ": " + debugErrorFormatString(childErr));
                    }
                }
                
                // Save children data to a separate file
                var childrenFilePath = outputPath.replace(".json", "-children.json");
                var childrenFile = new File(childrenFilePath);
                childrenFile.encoding = "UTF-8";
                
                if (childrenFile.open("w")) {
                    childrenFile.write(g2SymbolBuilder.buildValue(childrenData));
                    childrenFile.close();
                    $.writeln("Children data saved to: " + childrenFilePath);
                }
            }
        }
    } catch (e) {
        $.writeln("Error processing children: " + debugErrorFormatString(e));
    }
}

/**
 * Show UI to get action name from user
 */
function showUI() {
    var dialog = new Window("dialog", "Print Action Descriptor");
    dialog.orientation = "column";
    dialog.alignChildren = ["fill", "top"];
    dialog.spacing = 10;
    dialog.margins = 16;
    
    // Action name input
    var actionGroup = dialog.add("group");
    actionGroup.orientation = "row";
    actionGroup.alignChildren = ["left", "center"];
    actionGroup.spacing = 10;
    actionGroup.add("statictext", undefined, "Action Name:");
    var actionInput = actionGroup.add("edittext", undefined, "");
    actionInput.preferredSize.width = 200;
    
    // Output path input
    var fileGroup = dialog.add("group");
    fileGroup.orientation = "row";
    fileGroup.alignChildren = ["left", "center"];
    fileGroup.spacing = 10;
    fileGroup.add("statictext", undefined, "Output Path:");
    var fileInput = fileGroup.add("edittext", undefined, "~/Desktop/action-descriptor.json");
    fileInput.preferredSize.width = 200;
    
    // Buttons
    var buttonGroup = dialog.add("group");
    buttonGroup.orientation = "row";
    buttonGroup.alignChildren = ["right", "center"];
    buttonGroup.spacing = 10;
    
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");
    var okButton = buttonGroup.add("button", undefined, "OK", {name: "ok"});
    
    // Event handlers
    cancelButton.onClick = function() {
        dialog.close();
    };
    
    okButton.onClick = function() {
        if (actionInput.text === "") {
            alert("Please enter an action name.");
            return;
        }
        
        dialog.close();
        printActionDescriptor(actionInput.text, fileInput.text);
    };
    
    dialog.show();
}

// Run the UI
showUI();