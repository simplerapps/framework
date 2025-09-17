/**
 * Main entry point Object 
 */
function SimplerApps ()
{
	var COOKIE_NAME = "simplerapps";
	var COOKIE_NAME_AUTH = COOKIE_NAME + '-auth';
	var applicationConfig = { appName:'sa', hostName:'localhost:8888' };
	
	// Do not include in HTML markup
	this.htmlExclusionMap = {html:'', items:'', config:''};
	
	// UI package
	this.ui = {};  

	// String: adding some general handy prototype functions 
	String.prototype.insert = function( idx, s ) 
	{
		 var p0 = this.slice(0,idx);
		 var p1 = this.slice(idx);
		
	    return ( p0 + s + p1 );
	};

	// add string function to encodeHTML
	if (!String.prototype.encodeHtml) {
		String.prototype.encodeHtml = function () {
			return this.replace(/&/g, '&amp;')
		               .replace(/</g, '&lt;')
		               .replace(/>/g, '&gt;')
		               .replace(/"/g, '&quot;')
		               .replace(/'/g, '&apos;');
		};
	}
	
	// add string function to decodeHTML
	if (!String.prototype.decodeHtml) {
		String.prototype.decodeHtml = function () {
		    return this.replace(/&apos;/g, "'")
		               .replace(/&quot;/g, '"')
		               .replace(/&gt;/g, '>')
		               .replace(/&lt;/g, '<')
		               .replace(/&amp;/g, '&');
		};
	}
	
	/**
	 * Override the jquery .html() method to fire events when DOM changes
	 */ 
	(function( $, oldHtmlMethod ){
	    // Override the core html method in the jQuery object.
	    $.fn.html = function() {
	        // Execute the original HTML method using the
	        // augmented arguments collection.

	        var results = oldHtmlMethod.apply( this, arguments );

	        // get components part of this html (by dev ids). Assume arguments[0] == html string
	        var html = arguments [0];
	        
	        // if has replace method
	        if (html && html.replace ) {
	        
		        // call all child components of rendered HTML
		        callChildComponents ( html );
	    	}
	        
	        return results;
	    };
	})( jQuery, jQuery.fn.html );
	
	/**
	 * Override the jquery.append() method to fire events when DOM changes
	 */ 
	(function( $, oldAppendMethod ){
	    // Override the core html method in the jQuery object.
	    $.fn.append = function() {
	        // Execute the original HTML method using the
	        // augmented arguments collection.

	        var results = oldAppendMethod.apply( this, arguments );

	        if ( typeof arguments[0] == 'string' ) {
	        	// call all child components of rendered HTML
	        	callChildComponents ( arguments [0] );
	        }
	        else if ( typeof arguments[0] == 'object' ) {
	        	// TODO: may be causing issues with JQM
	        	callChildComponents ( arguments [0].html() );
	        }

	        return results;
	    };
	})( jQuery, jQuery.fn.append );
		
	/**
	 * Call all child components of rendered HTML
	 */
	function callChildComponents ( html )
	{
        var comps = SA.comps.getCompsByIdsFromHtml ( html );
		
		 // Action components first, call page loaded (after inserting into dom)
        for ( i=0; i<comps.length; i++ ) {
        	var c = comps[i];
        	if ( c.postLoad  && c.setActionListener ) {
        		c.postLoad();        		
        	}
        }
        
        // List components next, call page loaded (after inserting into dom)
        for ( i=0; i<comps.length; i++ ) {
        	var c = comps[i];
        	if ( c.postLoad  && !c.setActionListener ) {
        		c.postLoad();
        	}
        }		
	}
	
	/**
	 * PUBLIC
	 * 
	 * Entry Level that loads the user application 
	 */
	this.loadComponent = function ( divName, compObjName, configObj )
	{
		// create main obj instance
		var compObj = SA.loader.getComponent ( '_main', compObjName, true ); 

		// load all global includes files from main app into DOM
		//SA.loadInclues ( compObj.includes );
		
		// load the global css list into the DOM
		SA.loadCssIntoDom ( '', compObj.css );
		
		if ( !compObj.flow ) {
			compObj.flow = {};
		}
		
		// if passed configObj add to comp object
		if ( configObj ) {
			compObj.config = configObj;
		}
		
		// gen code
		//var html = SA.loader.callAllCreateUI ( 0, compObj.flow );
		if ( !compObj.createUI ) {
			alert ( "Invalid State: component should define createUI method" );
			return;
		}
		var html = compObj.createUI ( compObj, {});
		
		// Assume a div with the name passed on the page. Get the ui html into the page 
		$('#' + divName).html ( html );
		
		// See if there is a landing page (only if dispatch component is set)
		if ( dispatchComponent ) {
			var compIds = compIdsFromUrl ( window.location.href );
			if ( compIds && compIds.length>0 ) {
				SA.events.fireEvent (dispatchComponent.compId, {id:'navigate', compIdArray:compIds} )
			}
		}
	}
	
	/**
	 * Window hash changed event, route to correct component
	window.onhashchange = function( event ) 
	{
	};
	*/
	
	/**
	 * History changed event
	 */
	window.onpopstate = function(event) 
	{
	    //console.log ("popstate, location: " + document.location + ", state: " + event.state);
	    //console.log ("   hash: " + window.location.hash );
	    
		if ( dispatchComponent ) {
			var compIds = compIdsFromUrl ( window.location.hash );
			if ( compIds && compIds.length>0 ) {
				SA.events.fireEvent (dispatchComponent.compId, {id:'navigate', compIdArray:compIds} )
			}
			else {
				// go home == root == HOME
				SA.events.fireEvent (dispatchComponent.compId, {id:'navigate',  compIdArray:['HOME']} )
			}
		}
	};
	
	/**
	 * Sets dispatch component in the SA. This component should be able to handleEvent (click) to show
	 * different components  
	 */
	var dispatchComponent = undefined;
	this.setDispatchComponent = function ( dc )
	{
		dispatchComponent = dc;
	}
	
	/**
	 * Parse url and return comp path
	 */
	function compIdsFromUrl ( url ) 
	{
		var idx = url.indexOf ('#!/');
		if ( idx >= 0  ) {
			var path = url.substring (idx + 3);
			return path.split ('/');
		}
	}
	
	/**
	 * PUBLIC
	 * 
	 * Fire an event to component name or Id
	 */
	this.fireEvent = function ( compNameOrId, event )
	{
		SA.events.fireEvent ( compNameOrId, event );
	}
	
	/**
	 * Load a JS file in the DOM by passing a URL (relative or absolute)
	 */
	this.loadInclues = function ( incList )
	{
		/*
		if ( !incList || !incList.items) 
			return;
		
		for ( i=0; i<incList.items.length; i++ ) {
			var inc = incList.items [i];
			
			var fileref = document.createElement ('script');
			fileref.setAttribute ("type","text/javascript");
			fileref.setAttribute ("src", inc.value );
		}
		*/
	}
	
	/**
	 * General method for dynamically executing functions
	 */
	this.execFunction = function (packageName, functionName /*, args */)
	{
		//var extraArgsArray = Array.prototype.slice.call(arguments, 3);
		var context = window;
		var namespaces = packageName.split(".");
		for(var i = 0; i < namespaces.length; i++) {
			context = context[namespaces[i]];
		}
		try {
			return context[functionName].apply(this);
		}
		catch ( err ) {
			alert ( 'Invalid State: Error in: "' + packageName + '.' + functionName + '". Reason: ' + err );
		}
	}
	
	/**
	 * This method will be used to create UI for child list buy calling all the createUI on the components in 
	 * the list after it consolidate its parent's configurations  
	 * 
	 * Optionally pass associated component id with childList
	 * 
	 * Optionally you can pass showAll == true to ignore all hidden attributes and force process and show all lists
	 * default == false
	 */
	this.listCreateUI = function ( listCompId, list, parentConfig, showAll )
	{
		if ( showAll == undefined ) {
			showAll = true;
		}
		return SA.loader.callAllCreateUI ( listCompId, list, parentConfig, showAll );
	}

	/**
	 * PUBLIC
	 * 
	 * Same as listCreateUI:
     * This method will be used to create UI for child list buy calling all the createUI on the components in 
	 * the list after it consolidate its parent's configurations  
	 * 
	 * Optionally pass associated component id with childList
	 * 
	 * Optionally you can pass showAll == true to ignore all hidden attributes and force process and show all lists
	 * default == false
	 */ 
	this.createUI = function ( listCompId, atomObj, parentConfig, showAll )
	{
		if ( showAll == undefined ) {
			showAll = true;
		}
		return SA.loader.callAllCreateUI ( listCompId, atomObj, parentConfig, showAll );
	}
	
	/**
	 * Inject style inside the div tag before adding it to the DOM. Note if the style attribute already exists 
	 * then it will append the style to it, otherwise it will create a new style attribute
	 */
	this.injectStyle = function ( divHtml, style )
	{
		if ( divHtml ) { 
			var i0 = divHtml.indexOf ( 'style="' );
			if ( i0 >= 0 ) {
				var i1 = divHtml.indexOf ( '"', i0+7);
				
				if ( i1 > 0 ) {
					divHtml = divHtml.insert (i1, ';'+style); 
				}
			}
			else {
				i0 = divHtml.indexOf ( '<div' );
				if ( i0 >= 0 ) {
					var styleDesc = ' style="' + style + '"';
					divHtml = divHtml.insert (4, styleDesc);
				}
			}
		}
		return divHtml;
	}
	
	/**
	 * Inject class inside the div tag before adding it to the DOM. Note if the class attribute already exists 
	 * then it will append the class to it, otherwise it will create a new class attribute
	 */
	this.injectClass = function ( divHtml, cls )
	{
		if ( divHtml ) { 
			var i0 = divHtml.indexOf ( 'class="' );
			if ( i0 >= 0 ) {
				var i1 = divHtml.indexOf ( '"', i0+7);
				
				if ( i1 > 0 ) {
					divHtml = divHtml.insert (i1, ' '+cls); 
				}
			}
			else {
				i0 = divHtml.indexOf ( '<div' );
				if ( i0 >= 0 ) {
					var classDesc = ' class="' + cls + '"';
					divHtml = divHtml.insert (4, classDesc);
				}
			}
		}
		return divHtml;
	}

	/**
	 * Merge and return config into newConfig objects
	 */
	this.mergeConfig = function ( newConfig, config )
	{
		if ( !newConfig ) newConfig = {};
		
		// merge config into newConfig object (if config exist)
		if ( config ) {
			newConfig = $.extend(newConfig, config);
		}
		return newConfig;
	}
	
	/**
	 * Returns the Atom Component object associated with object class name
	 * 
	 * NOTE: If defined this.stateful == true in component, then a new instance is returned for every call,  
	 * otherwise the same instance will be returned 
	 */
	this.getAtomComponent = function ( userCompName, compClassName )
	{
		return SA.loader.getComponent ( userCompName, compClassName, false );
	}

	/**
	 * Returns the List Component object associated with object class name. Note the following:
	 * 
	 * 1- If list name already has a component, the same instance is returned
	 * 2- If list name does not a new component will be created and returned
	 * 3- If defined this.stateful == true in component, then a new instance is returned in (2) above, 
	 * otherwise the same instance will be returned in (1) and (2) 
	 * 
	 */
	this.getListComponent = function ( listName, compClassName )
	{
		return SA.loader.getComponent ( listName, compClassName, true );
	}
	
	/**
	 * PUBLIC
	 * 
	 * If the userGivenName exists then the same already created component is returned, 
	 * otherwise, it will create a new component instance and return it. 
	 * Creates a component object and return
	 */
	this.createComponent = function ( userGivenName, compObjectName )
	{
		return SA.loader.getComponent ( userGivenName, compObjectName, true );
	}
	
	/**
	 * PUBLIC
	 * 
	 * Simply looks up a component by component id (compId) or unique userGivenName if exists it will
	 * return it. 
	 */
	this.lookupComponent = function ( compIdOrName )
	{
		return SA.comps.getCompByIdOrName ( compIdOrName );
	}
	
	/**
	 * getCompByIdOrName Method that routs to component registry 
	 */
	this.getCompByIdOrName = function ( compIdOrName )
	{
		return SA.comps.getCompByIdOrName ( compIdOrName );
	}
	
	/**
	 * getList Method that routs to component registry 
	 */
	this.getList = function ( listName )
	{
		return SA.comps.getList ( listName );
	}
	
	/**
	 * Find list item's array object by name 
	 */
	this.getListItemByName = function ( list, itemsName )
	{
		var items = list.items;
		if ( items ) {
			for ( var i=0; i<items.length; i++ ) {
				var ob = items [i];
				if ( ob && ob.name==itemsName )
					return ob;
			}
		}
		return undefined;
	}

	/**
	 * Same as getConfigValue
	 */
	this.getConfig = function ( atomObj, name, defValue )
	{
		return SA.getConfigValue (atomObj, name, defValue);
	}

	/**
	 * Gets passed parameter val in flowList (params object). 
	 * If not there and there is a default value it is returned
	 */
	this.getConfigValue = function ( flowList, name, defValue )
	{
		var ret = defValue;
		var config = flowList.config;
		if ( config ) {
			var val = config [ name ];
			if ( val != undefined ) {
				ret = val;
			}
		}
		return ret;
	}
	
	/**
	 * Add flow list B as sublist to flow list A
	 */
	this.addSublist = function ( flowListA, subListB )
	{
		if ( !flowListA.items )
			flowListA.items = new Array();
		
		flowListA.items.push ( subListB );
		return flowListA;
	}
	
	/**
	 * Creates a HTML tag from flowObj. Keep in mind:
	 * 
	 * 1- The html css class name will be set to local name automatically (if global == false or undefined). 
	 *    Local class name = cls + '-' + compTypeId
	 * 2- The html id is set == compObj.compId of passed component
	 * 3- If flowObj.config.hidden==true then the div will not have any attributes
	 */
	this.createHtmlBegin = function ( flowObj, forceShow )
	{
		// default is div if no html is specified 
		if ( !flowObj.html )
			flowObj.html = 'div';
		
		var ret = '<' + flowObj.html;
		
		// Get id, and if not there make name == id
		if ( !flowObj.id ) {
			if ( flowObj.name ) {
				flowObj.id = flowObj.name;
			}
		}
		
		var hidden = this.listHidden(flowObj, forceShow);
		
		// if not hidden add other attributes 
		if ( !hidden ) {
			/*
			if ( cssName )
				ret += ' ' + 'class="' + cssName + '"';
			
			if ( flowObj.style )
				ret += ' ' + 'style="' + flowObj.style + '"';
			*/
			// carry all properties forward in the html element
			for ( var key in flowObj ) {
				var val =  flowObj [key];
				if ( !val ) {
					continue;
				}
				var kin = this.htmlExclusionMap [key]
				if ( kin != undefined ) {
					continue;
				}
				
				if ( key.indexOf ('data_') == 0 ) {
					key = 'data-' + key.substring (5);
				}

				ret += " " + key + "='" + val + "'";
			}
			
		}
		ret += '>';
		return ret;
	}

	/**
	 * Return true if list supposed to be hidden
	 */
	this.listHidden = function ( flowObj, forceShow)
	{
		var hidden = flowObj.config && flowObj.config.hidden==true && forceShow!=true;
		return hidden;
	}
	
	/**
	 * Creates the end of HTML Element tag (such as </div>, </p>, etc.)
	 */
	this.createHtmlEnd = function ( flowObj )
	{
		if ( flowObj.value ) {
			return flowObj.value + '</' + flowObj.html + '>';
		}
		else if (flowObj.html) {
			return '</' + flowObj.html + '>';
		}
		return ''; 
	}
	
	/**
	 * Convert class name to local css class name (i.e. css class name locally defined inside the object), 
	 * otherwise it will be considered global
	 */
	this.localCss = function ( compObj, clsName )
	{
		var id = compObj.compTypeId;
		if ( id ) {
			clsName = (id > 1 )? clsName + '-' + id : clsName;
		}
		else {
			alert ("Invalid State: cannot find local css class name '" + 
					clsName + "' in component.");
		}
		return clsName;
	}
	
	/**
	 * Loads the defined cssList into the DOM 
	 */
	this.loadCssIntoDom = function ( compId, cssList )
	{
		if ( !cssList || !cssList.items) 
			return;

		var cssClasses = '';
		var cssNamesObj = {};

		cssClasses = loadCssList(compId, cssClasses, cssNamesObj, cssList);
		
		//console.log ( cssClasses );
		
		// set all locally defined CSS classes
		SA.comps.setComponentCssNames(compId, cssNamesObj);
		
		addCssToDOM ( cssClasses );		
	}
	
	/**
	 * Loads the css list declaration into the DOM ( which translates to div id )
	 */
	function loadCssList ( compId, cssClasses, cssNamesObj, cssList )
	{
		var cssItems = cssList.items;
		// if a list of items
		if ( cssItems != undefined  ) {
			if ( cssItems.length > 0 ) {
				var subcssClasses = '';
				var i = 0;
				for ( i=0; i<cssItems.length; i++ ) {

					// call a child css node
					subcssClasses = loadCssList(compId, subcssClasses, cssNamesObj, cssItems [i] )
				}
				if ( cssList.name )
					cssClasses += cssList.name + '{' + subcssClasses + '} ';
				else 
					cssClasses += subcssClasses;
			}
		}
		// if a leaf 
		else {
			var nameSuffix = '';
			if ( compId && compId > 0 ) {
				nameSuffix = '-' + compId;
			}
			var j = 0;
			var names = '';
			var namesArr = cssList.name.split (' ');
			for ( j=0; j<namesArr.length; j++ ) {
				if ( namesArr[j].length > 0 ) {
					// if real class names (starts with '.' then convert to local names), otherwise leave alone
					clname = namesArr[j][0]=='.'? namesArr[j]+nameSuffix+' ' : namesArr[j] + ' ';
					names += clname;
					
					// add all names to obj 
					cssNamesObj [clname.trim()] = '';
				}
			}
			cssClasses += names + '{ ' + cssList.value + ' } ';
		}
		return cssClasses;
	}

	/**
	 * Adds CSS classes string to the dom
	 */
	function addCssToDOM ( css )
	{
	    var styleTag = document.getElementsByTagName('style')[0];
	    var originalStyles = '';
	    if (! styleTag){
	        styleTag = document.createElement('style');
	        styleTag.type = 'text/css';
	        document.getElementsByTagName('head')[0].appendChild(styleTag);
	    } else {
	        originalStyles = styleTag.innerHTML;
	    }
	    styleTag.innerHTML = originalStyles + css;
	}
	
	// keep cached auth object arround
	var cachedAuthObj = undefined;
	
	/**
	 * PUBLIC:
	 * Sets the data stored for this app 
	 */
	this.setAppData = function ( name, value )
	{
		var key = COOKIE_NAME + '-' + applicationConfig.appName + '-' + name;
		SA.utils.setStorage( key, value);
	}
	
	/**
	 * PUBLIC:
	 * Gets the data stored for this app
	 */
	this.getAppData = function ( name )
	{
		var key = COOKIE_NAME + '-' + applicationConfig.appName + '-' + name;
		return SA.utils.getStorage( key);
	}
	
	/**
	 * Delete app data entry 
	 */
	this.deleteAppData = function ( name )
	{
		var key = COOKIE_NAME + '-' + applicationConfig.appName + '-' + name;
		SA.utils.removeStorage( key );
	}
	
	/**
	 * PUBLIC
	 * 
	 * Sets a user auth object in application
	 */
	this.setUserAuth = function ( authObj )
	{
		if ( authObj.status != 'OK')
			return;
		
		// note: jsessionid comes back with response object 
		// DO NO RELY ON COOKIES

		// keep auth object arround
		cachedAuthObj = authObj;
		
		// stringify session info
		var strSession = JSON.stringify ( authObj );
		
		//alert ( 'set storage 3: ' + strSession );

		// store in storage (not cookie)
		SA.utils.setStorage( COOKIE_NAME_AUTH, strSession);
	}
	
	/**
	 * PUBLIC
	 * 
	 * Gets user auth object if any exists
	 */
	this.getUserAuth = function ()
	{
		if ( cachedAuthObj ) {
			return cachedAuthObj;
		}
		
		var value = SA.utils.getStorage( COOKIE_NAME_AUTH );
		//alert ( 'get storage value: ' + value );
		
		if ( value && value.length>0 ) {
			cachedAuthObj = jQuery.parseJSON( value );
			return cachedAuthObj;
		} 
		return undefined;
	}
	
	/**
	 * PUBLIC
	 * 
	 * Delete user auth cookie
	 */
	this.deleteUserAuth = function ()
	{
		if ( cachedAuthObj ) {
			cachedAuthObj = undefined;  
		}
		SA.utils.removeStorage( COOKIE_NAME_AUTH );
		SA.utils.deleteCookie ( "JSESSIONID" );
	}
	
	/**
	 * Sets config object of the application 
	 */
	this.setAppConfig = function ( appConf )
	{
		if ( appConf ) {
			if ( appConf.appName && appConf.appName.length>0 ) {
				applicationConfig.appName = appConf.appName;
				COOKIE_NAME_AUTH = COOKIE_NAME + '-' + applicationConfig.appName + '-auth';
			}
			if ( appConf.hostName && appConf.hostName.length> 0  ) {
				applicationConfig.hostName = appConf.hostName;
				SA.server.setMyHostName ( applicationConfig.hostName );
			}
		}
	}
	
	/**
	 * Trick to reload the browser with local Hash URL (does not go to the server)
	 */
	this.localUrl = function ( event )
	{
		SA.utils.localUrl (event);
	}
	
}

// Create an instance of the SA main object
var SA = new SimplerApps();
