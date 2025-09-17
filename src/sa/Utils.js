
/**
 * HQAPPS misc utils
 */
function Utils()
{
	this.setStorage = function ( name, value ) {
		window.localStorage.setItem(name, value);
	}
	
	this.getStorage = function ( name ) {
		return window.localStorage.getItem ( name );
	}
	
	this.removeStorage = function ( name ) {
		window.localStorage.removeItem( name );
	}

	// COOKIES Should not be used for PhoneGap / Mobile 
	this.setCookie = function (cname, cvalue, exdays) {
	    var d = new Date();
	    d.setTime(d.getTime() + (exdays*24*60*60*1000));
	    var expires = "expires="+d.toUTCString();
	    document.cookie = cname + "=" + cvalue + "; " + expires;
	}
	
	this.getCookie = function (cname) {
	    var name = cname + "=";
	    var ca = document.cookie.split(';');
	    for(var i=0; i<ca.length; i++) {
	        var c = ca[i];
	        while (c.charAt(0)==' ') c = c.substring(1);
	        if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
	    }
	    return "";
	}
	
	this.deleteCookie = function ( cname ) {
		var expires = "expires=Thu, 01 Jan 1970 00:00:00 UTC";
	    document.cookie = cname + "=" + "; " + expires;
	}
	
	/// DEVICE TYPE
	
    var deviceType = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iPad" : 
    	(navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iPhone" : 
    		(navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : 
    			(navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "Browser";
    
    var mobileDevice = ! (deviceType == 'Browser');

    this.getDeviceType = function ()
    {
    	return deviceType;
    }
    
    this.isMobileDevice = function ()
    {
    	return mobileDevice;
    }
	
	/// PHOTO STUFF
    
    /**
     * Get photo based on device type
     */
    this.getPhoto = function () 
    {
    	if ( deviceType == 'Browser' ) {
    		
    	}
    	else {
    		this.phoneUseExistingPhoto();
    	}
    }
	
	/**
	 * PHONE: Get photo from source
	 */
	this.phoneUseExistingPhoto = function ( e ) 
	{
		capturePhonePhoto (Camera.PictureSourceType.SAVEDPHOTOALBUM);
	}
	this.phoneTakePhoto = function ( e ) {
		capturePhonePhoto(Camera.PictureSourceType.CAMERA);
	}	
	function capturePhonePhoto (sourceType) 
	{
		navigator.camera.getPicture(this.onCaptureSuccess, this.onCaptureFail, {
		    destinationType: Camera.DestinationType.FILE_URI,
		    sourceType: sourceType,
		    correctOrientation: true
		  });
	}
	
	
	/// List manipulation stuff
	
	this.mergeList = function ( listObj, dataObj ) 
	{
		var items = listObj.items;
		if ( items && items.length > 0 ) {
			
			var j = 0;
			for ( j=0; j<items.length; j++ ) {
				var obj = items [j];
				
				// if atom
				if ( obj.name ) {
					var val = dataObj [ obj.name ];
					if ( val ) {
						obj.value = val;
					}
					else {
						obj.value = '';
					}
				}
			}
		}
		
		// merge config objects
		if ( !listObj.config ) listObj.config = {};
		if ( !dataObj.config ) dataObj.config = {};
		jQuery.extend( listObj.config, dataObj.config );
	}
	
	///
	/// BASE 64 encode
	///
	
	var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	this.encode64 = function (input) 
	{
	    var output = "";
	    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
	    var i = 0;

	    input = encodeUtf8(input);

	    while (i < input.length) {

	        chr1 = input.charCodeAt(i++);
	        chr2 = input.charCodeAt(i++);
	        chr3 = input.charCodeAt(i++);

	        enc1 = chr1 >> 2;
	        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
	        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
	        enc4 = chr3 & 63;

	        if (isNaN(chr2)) {
	            enc3 = enc4 = 64;
	        } else if (isNaN(chr3)) {
	            enc4 = 64;
	        }

	        output = output + _keyStr.charAt(enc1) + _keyStr.charAt(enc2) + 
	        	_keyStr.charAt(enc3) + _keyStr.charAt(enc4);

	    }
	    return output;
	}
	
	function encodeUtf8 (string) 
	{
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
	}

	// Trick to reload the browser with local Hash URL (does not go to the server)
	this.localUrl = function (e)
	{
		window.location = e.href;
		window.location.reload (true);
	}
}

// Create an instance of resources manager
SA.utils = new Utils();
