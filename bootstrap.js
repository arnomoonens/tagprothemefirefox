const {classes: Cc, interfaces: Ci, utils: Cu} = Components;
const { devtools } = Cu.import("resource://gre/modules/devtools/Loader.jsm", {});
const { require } = devtools;
Components.utils.import("resource://gre/modules/FileUtils.jsm");
Components.utils.import("resource://gre/modules/NetUtil.jsm");
Cu.import("resource://gre/modules/Services.jsm");
Components.utils.import("resource://gre/modules/devtools/Console.jsm");
var ss = require("sdk/simple-storage");
const fileTypes = ["tiles", "splats", "flair", "speedpad", "speedpadred", "speedpadblue", "portal"];
const self = {
    aData: 0,
};

function watchWindows() {
// Wrap the callback in a function that ignores failures
    function watcher(window) {
        try {
            // Now that the window has loaded, only handle browser windows
            let {documentElement} = window.document;
            if (documentElement.getAttribute("windowtype") == "navigator:browser")
            console.log('watcher with navigator:browser');
        }
        catch(ex) {}
    }
    // Wait for the window to finish loading before running the callback
    function runOnLoad(window) {
        // Listen for one load event before checking the window type
        window.addEventListener("load", function runOnce(event) {
            window.removeEventListener("load", runOnce, false);
            myExtension.init(window);
            //window.removeEventListener("load", runOnce, false);
            watcher(window);
        }, false);
    }
    // Add functionality to existing windows
    let windows = Services.wm.getEnumerator(null);
    while (windows.hasMoreElements()) {
        // Only run the watcher immediately if the window is completely loaded
        let tehwindow = windows.getNext();
        if (tehwindow.document.readyState == "complete")
        watcher(tehwindow);
        // Wait for the window to load before continuing
        else
        runOnLoad(tehwindow);
    }
    // Watch for new browser windows opening then wait for it to load
    function windowWatcher(subject, topic) {
        if (topic == "domwindowopened")
        runOnLoad(subject);
    }
    Services.ww.registerNotification(windowWatcher);

    // Make sure to stop watching for windows if we're unloading
    unload(function() Services.ww.unregisterNotification(windowWatcher));
}
function unload(callback, container) {
// Initialize the array of unloaders on the first usage
let unloaders = unload.unloaders;
if (unloaders == null)
unloaders = unload.unloaders = [];
// Calling with no arguments runs all the unloader callbacks
if (callback == null) {
unloaders.slice().forEach(function(unloader) unloader());
unloaders.length = 0;
return;
}
// The callback is bound to the lifetime of the container if we have one
if (container != null) {
// Remove the unloader when the container unloads
container.addEventListener("unload", removeUnloader, false);
// Wrap the callback to additionally remove the unload listener
let origCallback = callback;
callback = function() {
container.removeEventListener("unload", removeUnloader, false);
origCallback();
};
}
// Wrap the callback in a function that ignores failures
function unloader() {
try {
callback();
}
catch(ex) {}
}
unloaders.push(unloader);
// Provide a way to remove the unloader
function removeUnloader() {
let index = unloaders.indexOf(unloader);
if (index != -1)
unloaders.splice(index, 1);
}
return removeUnloader;
}
/**
* Shift the window's main browser content down and right a bit
*/

var myExtension = {
    init: function(window) {
        // The event can be DOMContentLoaded, pageshow, pagehide, load or unload.
        window.addEventListener("DOMContentLoaded", this.onPageLoad, false);
    },
    onPageLoad: function(aEvent) {
        var doc = aEvent.originalTarget; // doc is document that triggered the event
        var win = doc.defaultView; // win is the window for the doc
        // test desired conditions and do something
        // if (doc.nodeName != "#document") return; // only documents
        // if (win != win.top) return; //only top window.
        // if (win.frameElement) return; // skip iframes/frames
        var url = doc.location.href;
        if (!url.match(/.*:\/\/.*\.jukejuice\.com:\d{4}\/.*/) && !url.match(/.*:\/\/tagpro-.*\.koalabeast\.com:\d{4}\/.*/)) return;
        var files, script, type, _i, _len;
    for (_i = 0, _len = fileTypes.length; _i < _len; _i++) {
      type = fileTypes[_i];
      if(ss.storage[type]) {
        try {
        doc.getElementById(type).src = ss.storage[type];
    } catch(e) {
        console.log("problem with " + type + " on " + doc.location.href);
    }}}
    script = doc.createElement("script");
    script.textContent = "(function () {(function () {try {tagpro.api.redrawBackground();} catch (e) {setTimeout(arguments.caller.callee, 100);}})()})()";
    doc.head.appendChild(script);
    return script.parentNode.removeChild(script);
    }
};

//For settings
var observers = {
    inlineOptsDispd: {
        observe: function (aSubject, aTopic, aData) {
            if (aData == self.aData.id) {
                var doc = aSubject;
                //start the oninput changed method
                //Change all oninputchanged's of all file inputs
                for (var i = fileTypes.length - 1; i >= 0; i--) {
                    setattr = 'const {classes: Cc, interfaces: Ci, utils: Cu} = Components;';
                    setattr += 'const { devtools } = Cu.import("resource://gre/modules/devtools/Loader.jsm", {});';
                    setattr += 'const { require } = devtools;';
                    setattr += 'var ss = require("sdk/simple-storage");';
                    setattr += 'var file = new FileUtils.File(this.value);';
                    setattr += 'var contentType = Components.classes["@mozilla.org/mime;1"].getService(Components.interfaces.nsIMIMEService).getTypeFromFile(file);';
                    setattr += 'if (contentType !== "image/png") {alert("Error: we need a PNG file! The path shown may be of the file you just tried to upload, but the actual image used is from the image you uploaded previously (if any)."); return;} ';
                    setattr += 'var inputStream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);';
                    setattr += 'inputStream.init(file, 0x01, 0600, 0);';
                    setattr += 'var stream = Components.classes["@mozilla.org/binaryinputstream;1"].createInstance(Components.interfaces.nsIBinaryInputStream);';
                    setattr += 'stream.setInputStream(inputStream);';
                    setattr += 'var encoded = btoa(stream.readBytes(stream.available()));';
                    setattr += 'ss.storage.' + fileTypes[i] + ' = "data:" + contentType + ";base64," + encoded;';
                    setattr += 'console.log("file saved");';
                    doc.querySelector('setting[pref="extensions.tagprotheme@neyuh.' + fileTypes[i] + '"]').setAttribute('oninputchanged', setattr);

                    //SyntaxError: missing ) after argument list
                    setattr = 'const {classes: Cc, interfaces: Ci, utils: Cu} = Components;';
                    setattr += 'const { devtools } = Cu.import("resource://gre/modules/devtools/Loader.jsm", {});';
                    setattr += 'const { require } = devtools;';
                    setattr += 'var ss = require("sdk/simple-storage");';
                    setattr += 'Components.utils.import("resource://gre/modules/devtools/Console.jsm");';
                    setattr += 'var prefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);';
                    setattr += 'prefManager.clearUserPref("extensions.tagprotheme@neyuh.' + fileTypes[i] + '");';
                    setattr += 'var custompref = "extensions.tagprotheme@neyuh.' + fileTypes[i] + '";';
                    setattr += 'document.querySelector("setting[pref=\'extensions.tagprotheme@neyuh.' + fileTypes[i] + '\']").value = "";';
                    setattr += 'delete ss.storage.' + fileTypes[i] + ';';
                    doc.querySelector('setting[pref="extensions.tagprotheme@neyuh.' + fileTypes[i] + '.reset"]').setAttribute('onclick', setattr);
                }
                //end the oninput changed method
            }
        },
        reg: function () {
            Services.obs.addObserver(observers.inlineOptsDispd, 'addon-options-displayed', false);
        },
        unreg: function () {
            Services.obs.removeObserver(observers.inlineOptsDispd, 'addon-options-displayed');
        }
    },
    inlineOptsHid: {
        observe: function (aSubject, aTopic, aData) {},
        reg: function () {
            Services.obs.addObserver(observers.inlineOptsHid, 'addon-options-hidden', false);
        },
        unreg: function () {
            Services.obs.removeObserver(observers.inlineOptsHid, 'addon-options-hidden');
        }
    }
};
function startup(data, reason) {
    self.aData = data;
    for (var o in observers) observers[o].reg();
    watchWindows();
}
function shutdown(data, reason) {
// Clean up with unloaders when we're deactivating
if (reason != APP_SHUTDOWN)
unload();
}
function install(data, reason) {
    self.aData = data;
    for (var o in observers) observers[o].reg();
    watchWindows();
}
function uninstall(data, reason) {
    if (aReason == ADDON_UNINSTALL) {
        //this is real uninstall
        for (var i = 0; i < fileTypes.length; i++) delete ss.storage[fileTypes[i]];
    }
}