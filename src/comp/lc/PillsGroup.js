
/**
 * Create tabs from member lists that has horizontal tabs
 */
SA.PillsGroup = function ()
{
	// create new instance every time referenced in list
	this.stateful = true;
	
	// button id array to keep track of state of my buttons
	this.buttonIds = new Array ();
	this.currentTab = 0;
	
	var listenerComp;
	
	/**
	 * This method creates the UI based on the lists provided
	 * 
	 * items:
	 * All Action Atom objects in a list 
	 * 
	 * config:
	 * style:'pills'
	 * 
	 */
	this.createUI = function ( flowList, allConfig )
	{
		var actionList = flowList.items;
		
		if ( !actionList )
			return;
		
		// set div.id == compId, this way you can always lookup component instance from divId
		var divId = this.compId;
		
		// find listener
		var listener = SA.getConfigValue (flowList, 'listener', 'na' );
		if ( listener && listener!='na') {
			listenerComp = listener;
		}

		var tabsStyle = SA.getConfigValue (flowList, "style", undefined);
		var retHtml = '<ul id="' + divId +'" class="nav navbar-nav">';
		if ( tabsStyle=='pills')
			retHtml = '<ul id="' + divId +'" class="nav nav-pills">';
		
		// now add all the buttons inside
		var j = 0;
		for ( j=0; j<actionList.length; j++ ) {
			var lobj = actionList [j];
			
			if ( !lobj.ac ) {
				alert ("Invalid State: TabsHandler should have action children, for name: " + lobj.name );
				return;
			}
			
			// create ac as defined in the config{} section that was passed on to me 
			// HQA will also keep a ref of every component it creates
			var button = SA.getAtomComponent ( lobj.name, lobj.ac );	
				
			var html = button.createUI ( lobj, null );
			
			// if button implements setActionListener method, call it and asso my self with it
			if ( button.setActionListener ) 
				button.setActionListener ( this );
			
			retHtml += html;
			
			this.buttonIds [j] = button.id;
		}
		retHtml += '</ul>';
		
		// fire event to be fired after dom initialized
		SA.events.fireEvent(this.buttonIds [0] , 'click');

		return retHtml;
	}
	
	/**
	 * Select tab by index (starting with 0)
	 */
	this.selectTab = function ( tabIndex )
	{
		id = this.buttonIds [tabIndex];
		if ( id ) {
			SA.events.fireEvent(this.buttonIds [tabIndex] , 'click');
		}		
	}
	
	/**
	 * The child components call this when an action is performed by passing the "Action" object. 
	 * The component will then render its view into the DOM for the target list name (i.e. tlist.name) 
	 * which maps to the DOM element id
	 */
	this.performAction = function ( compId, actionAtom )
	{
		// un-set all other buttons
		for ( var i=0; i<this.buttonIds.length; i++ ) {
			
			var id = this.buttonIds [i];
			if ( id != compId ) {
				
				var comp = SA.comps.getCompByIdOrName ( id );
				comp.showSelected ( false );
			}
		}
		comp = SA.comps.getCompByIdOrName ( compId );
		comp.showSelected ( true );
		
		if ( actionAtom.ilist && actionAtom.tlist ) {

			// load the ilist
			var ilist = SA.getList ( actionAtom.ilist )
			
			// now load the component's target list
			var tlist = SA.getList ( actionAtom.tlist );
			
			// get the html UI from ilist
			var uiHtml = SA.listCreateUI ( this.compId, ilist );
			
			// map new ui to tlist name ( div id )
			var tdiv = $('#' + tlist.name );
			tdiv.html ( uiHtml );
		}
		
		if ( listenerComp && listenerComp.performAction) {
			listenerComp.performAction ( compId, actionAtom );
		}
	}
	
	/**
	 * Allow event to be handled  
	 */
	var lastTimeMs = 0;
	function allowEvent () 
	{
		var d = new Date();
		var newTimeMs = d.getMilliseconds();
		var allow = (newTimeMs - lastTimeMs) > 300 ;
		lastTimeMs =  newTimeMs;
		return allow;
	} 
	
	/**
	 * If defined it will be called after page is loaded (to give chance to initialize after the DOM
	 * is created)
	 */ 
	this.postLoad = function ()
	{
		/*
		var tabIdx = this.currentTab;
		id = this.buttonIds [tabIdx];
		if ( id ) {
			var comp = SA.comps.getCompById ( id );
			if ( comp && comp.triggerEvent )
				comp.triggerEvent ( 'click' );
		}
		*/
	}

}
