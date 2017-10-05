AdLinks = [];

function showStatus(element, status, description) {
    element.append('<div style="font-family:arial; font-size:14px; position: absolute;left: 0px;top: 0px; background-color:#304358; color:white; padding:5px; width: 110px;text-align:left;text-transform:uppercase;"><a style="color:white;text-decoration:none" href="http://adbuck.it/home" target="_blank"> <img src="http://adbuck.it/images/logo_white.png" height="15" border="0" style="padding-right:10px;" />'+status+'</a></div>');
    if(description) console.log(status+': '+description);
}

function saveAd(element, url, image, text, source) {

    console.log('URL: '+url);
    console.log('Image: '+image);
    console.log('Text: '+text);

    if(AdLinks.indexOf(url) == -1) {
        AdLinks.push(url);

        showStatus(element, 'got it');
        
        chrome.runtime.sendMessage({
            action: "saveAd",
            image: encodeURI(image),
            url: encodeURI(url),
            text: text,
            source: encodeURI(source)
        }, function(response) {
          console.log(response);
        });

    }
    
}
