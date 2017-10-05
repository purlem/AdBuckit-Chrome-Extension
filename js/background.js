chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
    var UpdatedTabId = tabId;
    chrome.tabs.query({
        active: true
    }, function(tabs) {
        var tab = tabs[0];
        if (tab.url.search("chrome://") == -1 
            && tab.url.search("adbuck.it") == -1 
            && UpdatedTabId == tab.id) {

            chrome.tabs.executeScript(tab.id, {
                allFrames: true,
                file: "js/jquery-1.9.1.min.js",
            });

            chrome.tabs.executeScript(tab.id, {
                allFrames: true,
                file: "js/ads.js",
            });

            if (tab.url.search("facebook.com") == -1 ) {
                chrome.tabs.executeScript(tab.id, {
                    allFrames: true,
                    file: "js/getBannerAds.js"
                });
            }

            
            
        }
    });
});
 
//Send Ads to AdBuckit
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action == "saveAd") {
 
        var ad_url = request.url;
        var ad_image = encodeURI(request.image);
        var ad_text = request.text;
        var source = encodeURI(request.source);
 
        console.log('Saving ad...');
        console.log('URL '+ad_url);
        console.log('Image '+ad_image);
        console.log('Text '+ad_text);
        console.log('Source '+source);
 
        $.post("http://adbuck.it/api/save_advertiser",
            {
                user_id: 1,
                ad_url: ad_url,
                ad_image: ad_image,
                ad_text: ad_text,
                source: source
            }
        ).fail(function() {
            sendResponse({message: "missed it"})
        })
        .done(function( data ) {
            console.log( data );
            sendResponse({message: "got it"})
        });
 
 
    }
});