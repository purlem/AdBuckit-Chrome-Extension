var url = '';
var image = '';
var text = '';

$(function () {
    setTimeout(checkForFacebookAds, 1000);
});



function checkForFacebookAds() {
    
    //console.log('******** Getting Facebook Ads');


    $(".fbUserStory").each(function(){

        if($(this).text().indexOf('Sponsored') > -1) {
            //console.log($(this).html());
            var facebook_link = $(this).find('a').eq(1).attr('href');
            
            image = $(this).find('img').eq(1).attr('src');

            text = $(this).find('._3ekx').text();
            if(text.indexOf('Learn More') > -1) text = text.substr(0, text.indexOf('Learn More'));  
            if(text.indexOf('Sign Up') > -1) text = text.substr(0, text.indexOf('Sign Up'));  
            if(text.indexOf('Download') > -1) text = text.substr(0, text.indexOf('Download'));  

            url = $(this).find('.ellipsis').text();

            if(!url) {
            	getFacebookAdvertiserUrl($(this));
            }

            saveAd($(this), url, image, text, 'facebook');

        }

    });

}

function getFacebookAdvertiserUrl(element) {

	var facebook_link = element.find('span.fwb a').attr('href');

	console.log('looking for url at');
	console.log(facebook_link);

    $.get(facebook_link, {}, function (data) {

        data.match(/u=([A-Za-z0-9.%;=-_-]*)%2F/g).forEach(function(match,index){
        	if(match.indexOf('share.here') == -1) {
        		url = decodeURIComponent(match);
        		url = url.replace('u=','');
        		console.log('found url');

        		saveAd(element, url, image, text, 'facebook');
        	}
		});

    });

}
