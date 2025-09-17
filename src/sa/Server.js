/**
 * Create events handler object for HQ APPS framework
 */
function Server () 
{
	var hostname = "http://localhost:8888";
	
	/**
	 * set my app urls
	 */
	this.setMyHostName = function ( myHostName ) 
	{
		hostname = myHostName;
	}
	
	/**
	 * Return my host name
	 */
	this.getMyHostName = function ()
	{
		return hostname;
	}
	 
	/**
	 * Helper AJAX post method
	 */
	this.set = function ( rsUrl, obj, successFn )
	{
		rsUrl = hostname + rsUrl;
		
		// append session to url
		rsUrl = addSession ( rsUrl, obj, false );
		
		var jsonStr = JSON.stringify(obj);

		$.ajax({
			type: getSaveOper(obj),
			url: rsUrl,	
			data: jsonStr,
			success: successFn
		});
	}
	
	/**
	 * Helper AJAX post form method 
	 */
	this.postForm = function ( rsUrl, formData, successFn )
	{
		rsUrl = hostname + rsUrl;
		
		// append session to url
		rsUrl = addSession ( rsUrl, formData, true );
				
		$.ajax({
			type: "post",
			url: rsUrl,	
			data: formData,
			success: successFn,
			cache: false,
	        contentType: false,
	        processData: false
		});
	}
	
	/**
	 * Helper AJAX post form method 
	 */
	this.putForm = function ( rsUrl, formData, successFn )
	{
		rsUrl = hostname + rsUrl;
		
		// append session to url
		rsUrl = addSession ( rsUrl, formData, true );
		
		$.ajax({
			type: "put",
			url: rsUrl,	
			data: formData,
			success: successFn,
			cache: false,
	        contentType: false,
	        processData: false
		});
	}

	
	/**
	 * Helper AJAX get method
	 */
	this.get = function ( rsUrl, obj, successFn )
	{
		rsUrl = hostname + rsUrl;
		
		// append session to url
		rsUrl = addSession ( rsUrl, obj, false );

		// create all name + values on url line
		rsUrl += '?';
		for(var key in obj) {
			rsUrl += ( key + '=' + obj[key] + '&' );
		}
		rsUtl = rsUrl.substring (0, rsUrl.length-1);
		
		// issue get call
		$.ajax({
			type: "get",
			url: rsUrl,	
			success: successFn
		});
	}
	
	/**
	 * Helper AJAX delete method
	 */
	this.del = function ( rsUrl, obj, successFn )
	{
		rsUrl = hostname + rsUrl;
		
		// append session to url
		rsUrl = addSession ( rsUrl, obj, false );		

		// create all name + values on url line
		rsUrl += '?';
		for(var key in obj) {
			rsUrl += ( key + '=' + obj[key] + '&' );
		}
		rsUtl = rsUrl.substring (0, rsUrl.length-1);
		
		// issue get call
		$.ajax({
			type: "delete",
			url: rsUrl,	
			success: successFn
		});
	}
	
	/**
	 * Create media URL
	 */
	this.getMediaUrl = function ( mediaId )
	{
		return hostname + '/media/' + mediaId;
	}

	/**
	 * Gets opers if POST or PUT based on id
	 */
	function getSaveOper ( obj )
	{
		if ( obj.id && obj.id>0 ) {
			return "put";
		}
		return "post";
	}
	
	// Add session to URL 
	function addSession ( url, obj, isForm )
	{
		var authObj = SA.getUserAuth();
		if ( authObj ) {
			var session = authObj.jsessionid;

			if ( session && session.length>0 ) {
				url += ';jsessionid=' + session;
			}
			
			var loginToken = authObj.respData.loginToken;
			if ( loginToken && loginToken.length>0 ) {
				if ( isForm == true )
					obj.append ('loginToken', loginToken );
				else 
					obj.loginToken = loginToken;
			}
		}
		return url;
	}

}

// create on instance of the Server resource handler object
SA.server = new Server();
