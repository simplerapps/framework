
/**
 * BannertHandler Object  
 */
SA.BannerHandler = function ()
{
	// if stateful then a new component instance is created every time it is declared in a list. 
	// Otherwise (default == false) one component inatance is used for all lists regardless of how many times
	// it is declared. If you use instance variable (or state) then stateful should set == true
	this.stateful = true;
	
	// stylesheets for this component
	this.css = { 
	};
	
    // Application UI flow definition 
    this.flow = { name:'banner-tabs', lc:'SA.TabsHandler', items: 
    	[]
    };

    // where all actions are
    var actionItems;
    var tabsHandler;
	
	/**
	 * This method creates the UI based on the lists provided
	 * 
	 * parentList:
	 * 
	 * config:
	 * name: 'imageUrl' is the URL for image for that banner
	 * 
	 * items: 
	 * list of action Atom objects
	 *  
	 */  
	this.createUI = function ( parentList, allConfig )
	{
		// Do some validation here
		var imageUrl = SA.getConfigValue ( parentList, 'imageUrl');
		if ( !imageUrl )
			return;
		
		var id = this.id;
		
		// create begin html markup
		var html =  
		'<div id="' + id + '" class="navbar navbar-default" style="background-color:#989898;border:0px;border-radius:0px;">'+
			'<div class="container col-md-8 col-md-offset-2" >'+
				'<div class="navbar-header">'+
					'<button style="margin-top:20px" type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">'+
						'<span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span>'+
					'</button>'+
					'<a id="brand-' + id  + 
						'" + class="navbar-brand" href="#" style="padding-top:14px;padding-left:10px;padding-bottom:0px">'+
						'<img src="' + imageUrl + 
						'" width="270" class="img-responsive" style="padding-right:30px;" />'+
					'</a>'+
				'</div>'+
				'<div class="navbar-collapse collapse" >' ;

		// List of action items 
		actionItems = parentList.items;
		
		// add all action items under the tab panel
		this.flow.items = actionItems;
		
		// create tabbed panel
		var tabsHtml = SA.listCreateUI ( this.compId, this.flow );
		
		// create tabs UI
		html +=  tabsHtml + '</div></div></div>';
		
		// set BannerHandler as dispatch component 
		SA.setDispatchComponent(this);

		return html;
	}
	
	/**
	 * Handle navigate page events. This event is sent by SA when a local '#!' navigation is requested
	 */
	this.handleEvent = function ( event )
	{
		//console.debug ( 'show: compId: ' + event.compIdArray );
		if ( event.id == 'navigate' ) {
			var compId =  event.compIdArray[0];
			if ( compId == 'HOME' ) {
				selectTabAtIndex (0);
				return;
			}
			
			// other than HOME
			for ( i=0; i<actionItems.length; i++ ) {
				if ( actionItems[i].ilist && actionItems[i].ilist==compId  ) {
					selectTabAtIndex ( i );
					
					// if there is more call nav child components
					if ( event.compIdArray.length > 1 ) {
						SA.events.fireEvent ( compId, event);
					} 
				}
			}
		}
	}
	
	/**
	 * Select the home tab
	 */
	function selectTabAtIndex ( tabIdx ) 
	{
		var tabsHandler = SA.lookupComponent ( 'banner-tabs' );
		tabsHandler.selectTab ( tabIdx );
	}
	
	/**
	 * If defined it will be called after page is loaded (to give chance to initialize after the DOM
	 * is created)
	 */ 
	this.postLoad = function ()
	{
		var id = this.id;
		
		$( '#brand-'+ id ).click ( function (event) {
			selectTabAtIndex ( 0 );
		});
		
		// only for mobile, hide menu on selection 
		if ( $(window).width() < 700 ) {
			// set to collapse the menu after click
			$(".navbar-nav li a").click(function(event) {
				$(".navbar-collapse").collapse('hide');
			});
		}
	}
};

