
/**
 * Atom component for loading files
 */
SA.FileLoader = function ()
{	
	/**
	 * This method creates the UI based on the lists provided
	 * 
	 * config: fileURI for file to load
	 */
	this.createUI = function ( atomObj, allConfig )
	{
		var fileURI = SA.getConfigValue (atomObj, 'fileURI' );
		if ( !fileURI )
			return;
		
		loadFile ( fileURL, function handleData(data) {
			
		});
	}

	/**
	 * Function to load file and return the content to the data handler
	 */
	function loadFile ( fileURI, dataHandler)
	{
		$.ajax({
		    url : filePathUrl,
		    type: 'GET',
		    dataType: 'text',  
		    success : function (data) {
		        dataHandler.handleData ( data );
		    },
		    error: function (xhr,status,error) {
		    	alert ( error );
		    }
		});
	}
}
