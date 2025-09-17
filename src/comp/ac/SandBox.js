
/**
 * SandBox handler component
 */
SA.SandBox = function () 
{	
	var myId;
	var myName;
	var contentCode;
	
	this.createUI = function ( atomObj, config )
	{
		myId = this.compId;
		myName = atomObj.name;
		
		contentCode = SA.getConfig ( atomObj, 'content' );
		
		var srcUrl = SA.getConfig (atomObj, 'indexUrl' );
		
		var html = '<iframe style="width:100%; height:100%; border:0px;" src="' +srcUrl + 
			'" id="' + myId + '"></iframe>';
		
		return html;
	}
	
	/**
	 * If defined it will be called after page is loaded (to give chance to initialize after the DOM
	 * i	s created) 
	 */
	this.postLoad = function ()
	{
		$('#' + myId).load(function() {
			var iframe = document.getElementById( myId );
			var script = newScriptEl ( iframe, contentCode);	
			iframe.contentWindow.document.body.appendChild(script);			
		});
	}
	
	/**
	 * Create script element inside the frame
	 */
	function newScriptEl ( iframe, scriptCode )
	{
		var script = iframe.contentWindow.document.createElement("script");
		script.type = "text/javascript";
		script.innerHTML = scriptCode;
		return script;
	}
}

