$(function () {
    setTimeout(checkForBannerAds, 1000);
});


function checkForBannerAds() {


    //console.log('******** Getting Banner Ads');     


    if(document.documentElement.innerHTML.indexOf("2mdn") > -1) {

        console.log('found 2mdn');

        var html = GetScript(document.documentElement.innerHTML);
        //console.log(data);


        if(document.documentElement.innerHTML.indexOf('creativeData') != -1) {
            
            console.log('creativeData found');

            var regex = new RegExp("creativeData = ({(.*)});try");
            results = regex.exec(html);
            
            var ad_data = eval("("+results[1]+")");
            //console.log(ad_data);

            var url = ad_data.exitEvents[0].destinationUrl;

            //console.log('exitEvents0 ' + url)

            if(url.indexOf('.') == -1) {
                console.log('checking for another url');
                url = ad_data.exitEvents[1].destinationUrl;
            }

            //console.log('checking primaryFiles0 ');

            var image = ad_data.primaryFiles[1].url;

            //console.log('primaryFiles0 '+image);


        }

        else if(document.documentElement.innerHTML.indexOf('dcmAdResponseConfig') != -1) {

            console.log('dcmAdResponseConfig found');

            //console.log(html);

            var regex = new RegExp("dcmAdResponseConfig = ({(.*?)});");
            results = regex.exec(html);

            //console.log(results[1]);

            var ad_data = eval("("+results[1]+")");
            //console.log(ad_data);

            var url = ad_data.backupImageClickTagUrl;

            if(url.indexOf('/https://') != -1) {
                url_exp = url.split('/https://');
                url = decodeURIComponent(url_exp[1]);
            }

            var image = ad_data.backupImageUrl;
        }
       
        

        if(url && image) {
            saveAd($('body'), url, image, '');
        }

    }

    
    $("a").each(function(){

        if(this.href.indexOf('whythisad') != -1) {
            return ;
        }

        if (this.href.indexOf('googlead') != -1
            || this.href.indexOf('doubleclick') != -1
            || this.href.indexOf('adroll') != -1
            || this.href.indexOf('rubiconproject') != -1
            || this.href.indexOf('outbrain') != -1
            || this.href.indexOf('adzerk') != -1) {

        	showStatus($(this), 'checking');

            if(url = $(this).attr('href')) {
            	showStatus($(this), 'got url', url);
            } else {
            	showStatus($(this), 'no url');
            	return;
            }


            image = GetImage($(this));
            if(image != null) {
                showStatus($(this), 'got image', image);
            }
            else {
            	showStatus($(this), 'no image');
            	return;
            }

            text = GetText($(this));
            if(text != null) {
                showStatus($(this), 'got text', text);
            }
            
            if(url && image) {
            	saveAd($(this), url, image, text);
            }
            

        }

    });
}

function GetText(element) {

    var text = element.parent().find('#text1').text()+' '+$(this).parent().find('#text2').text();

    if(text) {
        text = element.parent().find('span').text();        
    }

    return text;

}

function GetImage(element) {
    //First try to image within current div
    var image = element.find('img').first().attr('src');
    
    if(!ValidateImage(image)) {
       
        //try parent
        image = element.parent().find('img').first().attr('src');

        if(!ValidateImage(image)) {

            //try parents parent
            image = element.parent().parent().find('img').first().attr('src');

            if(!ValidateImage(image)) {
                return false;
            }
        }
    }

    return image;

}

function ValidateImage(src) {

    if(src.indexOf('adbuck') == -1 && src.indexOf('adchoices') == -1) {
        return true;
    }

    return false;

}

function GetScript(str) {
  var div = $('<div>'), tmpdiv = $('<div>'), scr, ret = '<script';

  div[0].innerHTML = str;
  scr = div.find('script');


  for ( var i = 0; i < scr[0].attributes.length; i++ ) {
    var attr = scr[0].attributes[i];

    if ( attr.value && attr.value != '' )
      ret += ' ' + attr.name + '="' + 
             tmpdiv.text(attr.value).html().replace(/"/g, '&quot;') +
             '"';
  }

  //console.log(scr.text().replace(/\r?\n|\r/g,""));

  return scr.text().replace(/\r?\n|\r/g,"");
}
