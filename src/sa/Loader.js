
/**
 * HQAPPS Loader that bootstraps the application 
 */
function Loader ()
{
	/**
	 * This method creates the UI based on the lists provided
	 * 
	 * Note: The config passed in the parentList at this point. If childList is passed, the it is processed
	 * after merged with parent list
	 */
	this.callAllCreateUI = function ( ownerId, list, parentConfig, showAll )
	{
		var result = '';
		if ( parentConfig ) {
			list.config = SA.mergeConfig ( list.config, parentConfig);
		}
		// Attach scope component id to list (if not there)
		if ( list.oid == undefined ) {
			list.oid = ownerId;
		}
		return this.processCreateUI(list, list.config, result, showAll);
	}
	
	/**
	 * Internal method for processing the list UI
	 */ 
	this.processCreateUI = function ( flowList, config, result, showAll )
	{
		// I18N: Resolve string value resources (for now label)
		if ( flowList.label ) {
			flowList.label = SA.res.getValue (flowList.label);
		}
		if ( flowList.value ) {
			flowList.value = SA.res.getValue ( flowList.value );
		}
		
		// a LIST: if there is no 'ac' type then it is a LIST
		if ( !flowList.ac ) {
			
			var forceShow = showAll && showAll==true;
			
			// add list to registry
			SA.comps.putList ( flowList );
			
			// If there is a custom handler, call it
			if ( this.flowHasCustomHandler (flowList) ) {
				var handlerHtml = this.callHandler( flowList, config, forceShow );
				return handlerHtml;
			}
			// If there are members
			else if ( flowList.items )  {
				var html = SA.createHtmlBegin ( flowList, forceShow );

				var itemsOutput = '';
				itemsOutput += html;
				
				// check if list should be hidden
				var hidden = SA.listHidden (flowList, forceShow) ;
				
				// process items list
				var i = 0;
				for ( i = 0; !hidden && i<flowList.items.length; i++ ) {
					
					var obj = flowList.items [ i ];
					
					// attach owner comp id
					obj.oid = flowList.oid;
					
					// process member flow Object
					var handlerUI = this.processCreateUI ( obj, config, result );
					if ( handlerUI ) {
						itemsOutput += handlerUI;
					}
				}
				itemsOutput += SA.createHtmlEnd ( flowList );
				
				// add all items output to result;
				result += itemsOutput;

				return itemsOutput;
			}
			else {
				return SA.createHtmlBegin (flowList, undefined, undefined) + 
					SA.createHtmlEnd (flowList);
			}
		}
		// an ATOM: create UI with object with 'ac' property (atom component)
		else { 
			var compHtml = this.callAtomComp ( flowList, flowList.ac, config )
			return compHtml;
		}
		return result;
	}
	
	/**
	 * getComponentClass (i.e. function) definition based on passed full object class name
	 * @param compClassName
	 * @returns
	 */
	this.getComponentClass = function (compClassName) 
	{
	    var nameParts = compClassName.split('.');
	    var nameLength = nameParts.length;
	    var scope = window;

	    for (var i=0; i<nameLength; ++i) {
	        scope = scope[nameParts[i]];
	    }
	    if ( scope == undefined ) {
	    	alert ("Invalid State: Undefined object: " + compClassName );
	    }
	    // compClassName to define component signature compClassName and id
	    //scope.prototype.compClassName = compClassName;
	    //scope.prototype.compClassId = SA.getComponentId ( compClassName );
	    return scope;
	}
	
	
	this.flowHasCustomHandler = function ( listObj )
	{
		var handler = listObj.lc; 
		return handler && handler.length>0 && handler != 'SA.loader';
	}
	
	this.callAtomComp = function ( atomObj, compName, config )
	{
		// create comp
		var atomComp = this.getComponent ( atomObj.name, atomObj.ac, false );
		
		// get new config merged
		var newConfig = SA.mergeConfig (atomObj.config, config)
		
		// create UI and return it
		return atomComp.createUI ( atomObj, newConfig );
	}
	
	this.callHandler = function ( flowList, config, forceShow )
	{
		// the component is looked up and / or registered here
		var listComp = this.getComponent ( flowList.name, flowList.lc, true );
		
		// merge config??
		
		// if hidden, do not call createUI (however, still create component and register the list by name)
		if ( flowList.config && flowList.config.hidden && forceShow!=true ) {
			//return SA.createHtmlBegin (flowList, undefined, undefined) +  SA.createHtmlEnd (flowList);
			return '';
		}
		else {
			return listComp.createUI ( flowList, config );
		}
	}
	
	function getHiddenListPanel ( flowList, hidden )
	{
		var div = '';
		if ( flowList.name ) {
			return '<div id="' + flowList.name + '" />';
		}
		else {
			return '';
		}
	}
	
	/**
	 * Gets the list handler component or atom component. Not that component name is optional
	 */
	this.getComponent = function ( compName, compObjectName, isList )  
	{
		// get object in lists map
		var handlerObj = SA.comps.getCompByName( compName );
		
		// if comp is not already mapped by list name
		if ( !handlerObj ) {
			
			handlerObj = SA.comps.getCompByObjName [ compObjectName ];
			// if seen component before
			if ( handlerObj ) {
				
				// create new object (if stateful)
				if ( handlerObj.stateful ) {
					var handlerObjClass = this.getComponentClass ( compObjectName );
					handlerObj = new handlerObjClass();
					
					// only add list comp by name to registry
					SA.comps.addComponent ( compObjectName, handlerObj, compName);
				}
			}
			else { // new component  
				// instantiate object
				var handlerObjClass = this.getComponentClass ( compObjectName );
				handlerObj = new handlerObjClass();
			
				// only add list comp by name to registry
				SA.comps.addComponent ( compObjectName, handlerObj, compName);
				
				// load comp specific css list into the DOM (based on component id)
				// _main component will have global CSS defined
				if ( compName != '_main' )
					SA.loadCssIntoDom ( handlerObj.compTypeId, handlerObj.css );			
				
				// if there is a model definition (array of models), add to registry
				if ( handlerObj.model && handlerObj.model.items ) {
					for ( i=0; i<handlerObj.model.items.length; i++ ) {
						var modList = handlerObj.model.items[i];
						SA.comps.putList( modList );	
					}
				}
			}
		}
		return handlerObj;
	}
	
	/**
	 * Handles action
	 */
	this.handleAction = function ( action )
	{
		
	}
}

// Create an instance of the DefaultHandler (or loader)
SA.loader = new Loader();

