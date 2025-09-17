
/**
 * Atom Component for doing searches on the server resulting in Predictive search as it 
 * shows results from the server as you tyoe. The server component is running on 
 * java-based server 
 */
SA.SearchComp = function ()
{	
	// specify if the component contains state or not
	// TODO: This does not work for scope
	//this.stateful = true;
	
	// state variables
	this.atomObj = undefined;
	this.actionListener = undefined;
	this.selected = false;
	this.listenerComp = undefined;
	
	// remember value entered
	this.fieldValue = '';
	
	// search result HTML
	this.searchHtml = '';
	
	// CSS defined here exactly the same as css syntax but as javascript array of objects. 
	// Also these css class names are unique to this class. For example if another class has 
	// the name 'round-clear' it would be a different name because the names are distinguished 
	// based on unique class component type ids
	this.css = { 
	};
	
	/**
	 * If defined it will allow this component to create UI based on the lists provided
	 * 
	 * config: not used
	 */
	this.createUI = function ( atomObj, allConfig )
	{
		this.atomObj = atomObj;
		
		// set div.id == compId, this way you can always lookup component instance from divId
		var divId = this.compId;
		
		var valStr = '';
		if ( this.fieldValue != '' ) {
			valStr = 'value="' + this.fieldValue + '"';
		}
		
		var html =
		'<div class="col-md-10" style="padding-left:0px;">'+
		  '<div class="form-group" style="margin-bottom: 0px;" >'+
		    '<input id="'+ divId + '"' + valStr +' type="text" class="form-control" placeholder="search for something">'+
		  '</div>'+
		  '<div id="rearch-results" >' + this.searchHtml + '</div>'+
		'</div>';
						
		return html;
	}
	
	/**
	 * If defined it will allow this component to be an action listener
	 */
	this.setActionListener = function ( listenerComp )
	{
		this.listenerComp = listenerComp;
	}
	
	/**
	 * Adds an action listener
	 */
	this.showSelected = function ( selected )
	{
		this.selected = selected;
		var id = this.compId;
		
		if ( selected ) {
		    $("#" + id).addClass ( 'active' );
		}
		else {
		    $("#" + id).removeClass ( 'active' );
		}
	}
	
	/**
	 * Called when a search expression changes
	 */
	this.expressionChanged = function ( expr )
	{
		this.fieldValue = expr;
		
		// send exp (expression) msg to server
		SA.server.sendString ( "{'exp':'" + expr + "'}" );
		
		if ( expr.length == 0 ) {
			this.searchHtml = '';
			$('#rearch-results').html ('');
		}
	}
	
	this.onMessage = function ( msgObj )
	{
		// recv exp_response message
		if ( msgObj.exp_response ) {
			this.formatResults( msgObj.exp_response )
		
			// click suggest 
			$(".s-suggest").click(function( e ){
				var idx = e.target.id.substring (2);
				var item = msgObj.exp_response.cats [idx];
				
				// send suggest msg to server with pattern
				SA.server.sendString ( "{'suggest':'" + item.catsHash + "'}" );
			});
			
			// click results
			$(".s-result").click(function( e ) {
				var idx = e.target.id.substring (2);
				var item = msgObj.exp_response.results [idx];
				//console.debug ('res click:' +  e.target.id );
				if ( item && item.accessUrl ) {
					window.open(item.accessUrl, '_blank');
				}
			});
		}
		// suggest response
		else if ( msgObj.suggest_response ) {
			// if only one result, open in window
			if ( msgObj.suggest_response.results.length == 1 ) {
				var url = msgObj.suggest_response.results[0].accessUrl;
				if ( url ) {
					window.open(url, '_blank');
				}
			}
		}
	}
	
	this.formatResults = function ( respObj )
	{
		this.searchResults = respObj;
		
		var html1 = '';
		var html2 = '';
		
		var maxResults = 5;
		var count = 0;
		
		// cat paths html list
		if ( respObj.cats && respObj.cats.length > 0 ) {
			var cats = respObj.cats;
			
			html1 = '<div class="list-group">';
			for ( i=0; i<cats.length && count<maxResults; i++ ) 
			{
				html1 += '<a href="#" style="color:#3399FF;border:1px solid #EFEFEF;" class="list-group-item s-suggest" id="s-'+i+'">'+ 
					cats[i].detail  +'</a>';
				
				count++;
			} 
			html1 += '</div>';
		}
		
		// results html path
		if ( respObj.results && respObj.results.length > 0 ) {
			var results = respObj.results;

			html2 = '<div class="list-group">';
			for ( i=0; i<results.length && count<maxResults; i++ ) 
			{
				html2 += '<a href="#" style="border:1px solid #EFEFEF;" class="list-group-item s-result" id="r-'+i+'">'+ 
					results[i].detail  +'</a>';
				
				count++;
			}
			html2 += '</div>';
		}
		
		// if any html then show it, otherwise clear 
		if ( html1.length>0 || html2.length>0 ) {
			this.searchHtml = '<div class="panel panel-default">' + html1 + html2 + '</div>';		
			$('#rearch-results').html (this.searchHtml);
		}
		else {
			this.searchHtm = '';
			$('#rearch-results').html ('');
		}
	}
	
	this.getName = function()
	{
		return this.atomObj.name;
	}
	
	/**
	 * If defined it will be called after page is loaded (to give chance to initialize after the DOM
	 * is created) 
	 */
	this.postLoad = function ()
	{
		// add me as listener to get connection events
		//SA.server.setConnectionListener ( this );
		
		// compId == div.id
		var divId = this.compId;
		
		// keydown get chars types
		$('#' + divId ).on('keypress', function(e) {
			var ch = e.which;			
		});
		
		// keyup check for controls (backspace, return)
		$('#' + divId ).on('keyup', function(e) {
			
			var thisComp = SA.comps.getCompById(divId)
			if ( thisComp )
				thisComp.expressionChanged ( this.value );

			// backspace 
			if ( e.which == 8 ) {
				//console.log( 'value: ' + val +', divid: ' + divId );
			}
		});
		
	}
}
