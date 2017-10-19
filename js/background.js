var parent_url = '';
var timerStart = Date.now();

chrome.tabs.onUpdated.addListener(function(tabId, changeInf, tab) {
    var UpdatedTabId = tabId;

    if(tab.url)
        parent_url = tab.url;

    chrome.tabs.query({
        active: true
    }, function(tabs) {
        
        for (var i = 0; i < tabs.length; i++) {

            var tab = tabs[i];


            if (tab.url.search("chrome://") == -1 
                && tab.url.search("adbuck.it") == -1 
                && UpdatedTabId == tab.id
                ) {

                chrome.tabs.executeScript(tab.id, {
                    allFrames: true,
                    file: "js/jquery-1.9.1.min.js",
                });

                chrome.tabs.executeScript(tab.id, {
                    allFrames: true,
                    file: "js/ads.js",
                });

                if (tab.url.search("facebook.com") == -1) {
                    chrome.tabs.executeScript(tab.id, {
                        allFrames: true,
                        file: "js/getBannerAds.js"
                    });
                }
                
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
        var load_time = Date.now()-timerStart;

        console.log('Saving ad...');
        console.log('URL '+ad_url);
        console.log('Image '+ad_image);
        console.log('Text '+ad_text);
        console.log('Source '+parent_url);
        console.log('Time' +load_time)
 
        $.post("http://adbuck.it/api/save_advertiser",
            {
                user_id: 1,
                ad_url: ad_url,
                ad_image: ad_image,
                ad_text: ad_text,
                source: parent_url,
                load_time: load_time
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
