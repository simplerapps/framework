
/**
 * Image component
 */
SA.Image = function ()
{	
	/**
	 * This method creates the UI based on the lists provided
	 */
	this.createUI = function ( atomObj, allConfig )
	{
		var imageUrl = allConfig.imageUrl;

		if ( !imageUrl )
			return;
		
		var widthStr = '';
		//if ( allConfig.width )
			//widthStr = 'width=' + allConfig.width;
		
		var classes = "img-responsive";
		
		//var div = '<div class="row">' +
			//'<div class="col-md-1">';
		
		var divBegin = SA.createHtmlBegin ( atomObj );
		
		return divBegin + '<img src="' + imageUrl + '"' + widthStr + 'class="' + classes + '"' + 
			'/></div>';
	}
}
