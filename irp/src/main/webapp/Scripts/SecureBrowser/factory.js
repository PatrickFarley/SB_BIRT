﻿/*
This is the entry point for setting up the secure browser.
*/

TDS = window.TDS || {};
TDS.SecureBrowser = TDS.SecureBrowser || {};

(function(SB) {

    var sbImpl = null;

    function initialize() {

        // setup the sb api
    	 if (Util.Browser.isCertified()) {
             sbImpl = new TDS.SecureBrowser.Certified();
         }
    	 else if (Util.Browser.isSecure()) {
            if (Util.Browser.isIOS()) {
                sbImpl = new TDS.SecureBrowser.Mobile.iOS();
            } else if (Util.Browser.isAndroid()) {
                sbImpl = new TDS.SecureBrowser.Mobile.Android();
            } else {
                sbImpl = new TDS.SecureBrowser.Firefox();
            }
        } else if (Util.Browser.isChromeOS()) {
            // HACK! currently, the TDS.BrowserInfo is not available at this point in the code
            // So, isSecure() shows up false even if our secure extension is installed.
            sbImpl = new TDS.SecureBrowser.Chrome();
        }else{
        	sbImpl = new TDS.SecureBrowser.Base();
        }

        if(sbImpl!=null)
        	sbImpl.initialize();
    }

    // expose init
    SB.initialize = initialize;

    // get the secure browser core implementation api (returns base if none exist)
    SB.getImplementation = function() {
        return sbImpl;
    };

})(TDS.SecureBrowser);

