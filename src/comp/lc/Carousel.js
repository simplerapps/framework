
/**
 * Button Action component
 */
SA.Carousel = function ()
{	
	// specify if the component contains state or not
	this.stateful = true;
	
	// store obj-based templ here
	this.htmlTempl = undefined;
	
	var myId = undefined;
	var innerDivId = undefined; 
	var listener = undefined;
	var numberItems = 0;
		
	/**
	 * If defined it will allow this component to create UI based on the lists provided
	 * 
	 * config: 
	 * 
	 * 
	 * flow: expect child lists of slides
	 */
	this.createUI = function ( flowList, allConfig )
	{
		// the id is set by the system (either compId or name)
		myId = this.compId;
		if ( flowList.name ) {
			myId = flowList.name;
		}

		var html = 
		'<div id="' + myId + '" class="carousel slide" data-ride="carousel">';

		// The circle controls  
		/*
		html += '<ol class="carousel-indicators">' ;
		for ( i=0; i<flowList.items.length; i++ ) {
			if ( i==0 )
				html += '<li data-target="#' + myId + '" data-slide-to="' + i + '" class="active"></li>';
			else 
				html += '<li data-target="#' + myId + '" data-slide-to="' + i + '"></li>';				
		}
		html += '</ol>' ;
		*/

		innerDivId = 'ci-' + myId;
		
		// content slides
		html += '<div id="' + innerDivId + '" class="carousel-inner">';
		
		for ( j=0; j<flowList.items.length; j++  ) {
			
			// single carousel page
			var ttlist = flowList.items[j];
			var listHtml = SA.listCreateUI ( this.compId, ttlist );
			var listId = 'page-' + ttlist.config.id;
			
			if ( j == 0 ) 
				html += '<div id="' + listId + '" class="item active">' + listHtml + '</div>';
			else 
				html += '<div id="' + listId + '" class="item">' + listHtml + '</div>';
		}
		html += '</div>';
		
		// get number of items
		numberItems = flowList.items.length;
		
		// right and left arrows controls
		
		if ( flowList.items.length > 1 ) {
			/*
			html += '<a class="carousel-control left" href="#' + myId + '" data-slide="prev">'; 
			html +=    '<span class="glyphicon glyphicon-chevron-left"></span>';
			html += '</a>' ;
			html += '<a class="carousel-control right" href="#' + myId + '" data-slide="next">' ; 
			html +=    '<span class="glyphicon glyphicon-chevron-right"></span>' ;
			html += '</a>'
			*/
		}
		
		html += '</div>' ;

		return html;
	}
	
	/**
	 * Add new page to the end
	 */
	this.addPage = function ( uniqueId, pageHtml )
	{
		var activeCls = numberItems==0? ' active': ''; 
		var html = '<div id="page-' + uniqueId + '" class="item' + activeCls + '">' + pageHtml + '</html>';
		$('#'+innerDivId).append ( html );
		numberItems++;
	}
	
	/**
	 * Remove a page (need to select previous page)
	 */
	this.delPage = function ( uniqueId )
	{
		var sel = $('#page-' + uniqueId);
		sel.remove();
		numberItems--;
	}
	
	/**
	 * Reset content of a page with pageId and new html
	 */
	this.resetPage = function ( pageId, newHtml )
	{
		$('#page-' + pageId).html ( newHtml );
	}
	
	/**
	 * Go to next page
	 */
	this.nextPage = function ()
	{
		$('#'+myId).carousel( 'next' );
	}
	
	/**
	 * Goto prev page
	 */
	this.prevPage = function ()
	{
		$('#'+myId).carousel( 'prev' );
	}
	
	/**
	 * Show the specific page by idx
	 */
	this.showPage = function ( idx )
	{
		if ( idx<0 || idx >= numberItems) {
			idx = numberItems -1;
		}
		$('#'+myId).carousel( idx );
	}
	
	/**
	 * Set a carousel listener
	 */
	this.setListener = function ( l ) 
	{
		listener = l;
	}
	
	/**
	 * If defined it will be called after page is loaded (to give chance to initialize after the DOM
	 * is created) 
	 */
	this.postLoad = function ()
	{
		$('#' + myId ).carousel({
			//interval: 12000000
			interval:false
		});
		
		$('#' + myId ).on('slid.bs.carousel', function (e) {
			var index = $( '.active', e.target).index ();
			//console.log ( 'slide to: ' + index );
			
			// pass slide event to listener
			if ( listener && listener.slideEvent ) {
				listener.slideEvent ( index );
			}
		});
	}
}
