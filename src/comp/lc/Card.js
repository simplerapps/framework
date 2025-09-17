
/**
 * Display card of information
 */
SA.Card = function ()
{	
	// specify if the component contains state or not
	// TODO: This does not work for scope
	this.stateful = true;
	
	this.actionListener = undefined;
	
	// remember value entered
	var myId = undefined;
	var myIdTb = undefined;
	var dummyCard = false;
	var atomObj = undefined;
	
	// CSS defined here exactly the same as css syntax but as javascript array of objects. Also
	// these css class names are unique to this class. For example if another class has the name 'round-clear'
	// it would be a different name because the names are distinguished based on unique class component type ids
	// stylesheets for this component
	this.css = { items: 
		[
		/* Everything else */
		{name: '@media (min-width: 481px)', items: 
			[ 
			{name:'.card', value:'margin-bottom:40px; border: 1px solid #dddddd;padding:10px;background-color:#f9f8f7' },			 
			{name:'.title', value:'font-size:160%;font-weight:bold;margin-top:4px;margin-bottom:8px;'},
			{name:'.parag', value:'font-size:120%;margin-top:4px;margin-bottom:8px;'}
			]
		},
		  
		/* Mobile sizes */
		{name: '@media (max-width: 480px)', items: 
			[
			{name:'.card', value:'margin-bottom:18px; border: 1px solid #dddddd;padding:5px;background-color:#f9f8f7' },			 
			{name:'.title', value:'font-size:130%;font-weight:bold;margin-bottom:6px;'},
			{name:'.parag', value:'font-size:100%;margin-top:4px;margin-bottom:6px;'}			
			]
		}
		]
	};
	
	/**
	 * If defined it will allow this component to create UI based on the lists provided
	 * 
	 * config: 
	 * imageUrl: url for image
	 */
	this.createUI = function ( atomObject, config )
	{
		var cardCss = SA.localCss ( this, 'card');
		var titleCss = SA.localCss ( this, 'title');
		var paragCss = SA.localCss ( this, 'parag' );

		var editMode = SA.getConfigValue ( atomObject, 'editMode', true);
		var style = atomObject.style;

		atomObj = atomObject;
		
		myId = this.compId;
		myIdTb = myId + '-tb';
		
		var retHtml = '';
		
		if (  config.dummy ) {
			
			dummyCard = true;
			var itemsToolbar = getItemsToolbar ( myId, atomObj, true );
			
			if ( editMode ) {
				retHtml += 
				'<div id="' + myId + '" class="">' +
					'<div><div style="float:left;margin-bottom:30px;" id="' + myIdTb + '">' + itemsToolbar + '</div></div>' +
				'</div>';
			}
		}
		else {
			var itemsToolbar = getItemsToolbar ( myId, atomObj, false );
			var styleStr = '';
			if ( style ) {
				styleStr = ' style="' + style + '"' ;
			}
			
			retHtml += 
			'<div id="' + myId + '"' + styleStr + ' class="' + cardCss + '" >' ;

				if ( editMode ) {
					retHtml += '<div><div style="float:right;" id="' + myIdTb + '">' + itemsToolbar + '</div></div>' ;
				}

	        	if ( config.ttitle ) {
	        		retHtml += '<p class="' + titleCss + '" >' + config.ttitle  + '</p>';
	        	}
	        	if ( config.stitle ) {
	        		retHtml += '<p class="' + paragCss + '" >' + config.stitle  + '</p>';
	        	}			
	        	if ( config.imageUrl ) {
	        		retHtml +='<img class="img-responsive" style="margin-bottom:8px" src="' + 
	        			config.imageUrl + '"></a>' ;
	        	}
				if ( config.info ) {
					retHtml += '<p>' + config.info + '</p>' ;
				}
				if ( config.lname && config.link ) {
					retHtml += '<p><a href="' + config.link +'" target="ttfaves-link">' + 
						config.lname + '</a></p>'; 
				}
			retHtml += '</div>';
		}
        	
		return retHtml;
	}
	
	/**
	 * Get toolbar
	 */
	function getItemsToolbar (myId, atomObj, newButton)
	{
		var comp = SA.comps.getCompByIdOrName ( 'items-dialog' );
		if ( comp ) {
			return comp.getItemsToolBar( myId, atomObj, newButton );
		}
	}
	
	/**
	 * If defined it will be called after page is loaded (to give chance to initialize after the DOM
	 * is created) 
	 */
	this.postLoad = function ()
	{
		$ ('#' + myIdTb ).show();
		
		/*
		// after card in DOM hide the toolbar
		$ ('#' + myIdTb ).hide();
		
		// show when enter the card, and hide when you leave
		$( '#' + myId ).mouseenter( function (event) {
			var tbhtml = getItemsToolbar (myId, !dummyCard );
			$ ('#' + myIdTb ).show();
		});
		$( '#' + myId ).mouseleave( function (event) {
			$ ('#' + myIdTb ).hide();
		});
		*/
	}
}
