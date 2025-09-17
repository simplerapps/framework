
/**
 * HQAPPS components manager
 */
function Comps ()
{
	// All components map (by comp id)
	this._componentRegistry = {};
	
	// All lists registry (by list name)
	this._listRegistry = {};
	
	// comp lookup by compObjName
	this._compKeyByObjName = {};

	// comp lookup by comp name
	this._compKeyByCompName = {};

	// max comp id
	this._maxComponentId = 0;
	
	/**
	 * Put list in registry
	 */
	this.putList = function ( listObj )
	{
		if ( listObj.name ) 
			this._listRegistry [listObj.name] = listObj;
	}
	
	/**
	 * Get list from registry
	 */
	this.getList = function ( name )
	{
		return this._listRegistry [ name ];
	}
		
	/**
	 * Return component array after extracting the ids from html and looking up the components
	 */
	this.getCompsByIdsFromHtml = function ( html )
	{
		var compArray = Array ();
		var i = 0;
		var j = 0;
		var ownerId = undefined;
		var id = '';
		
		if ( html ) { 
			// convert html to use '"' as standard no single "'" strings 
			html = html.replace(/'/g , '"');
			
			// now get all other ids
			while ( true ) {
				j = html.indexOf ( 'id="', i );
				if ( j < 0 ) {
					break;
				}
				j += 4;
				i = html.indexOf ( '"', j );
				id = html.substring (j, i);
	
				// lookup component by id (or name) and add to array
				var comp = this.getCompByIdOrName ( id );
				if ( comp != undefined ) {
					compArray.push (comp);
				}
				i++;
			}
		}
		return compArray;
	}
	
	/**
	 * Gets all components map
	 */
	this.getComponentMap = function ()
	{
		return this._componentRegistry;
	}
	
	/**
	 * Set list of css class names for the component
	 */
	this.setComponentCssNames = function ( compTypeId, cssNamesObj )
	{
		var obj = this._componentRegistry [compTypeId];
		if ( obj && obj.flow ) {
			//obj.cssNames = cssNamesObj;
			// fix all local refs.
			fixLocalNames(compTypeId, obj.flow, cssNamesObj);
		}
	}
	
	/**
	 * Local function to fix all local ref to css classes
	 */
	function fixLocalNames ( compTypeId, flowObj, cssNamesObj)
	{
		var nameSuffix = '-' + compTypeId; 
		
		var clname = '';
		var clnameLocal = '';
		var clnameList = '';
		var j, i;
		
		if ( flowObj.class ) {
			var namesArr = flowObj.class.split (' ');
			for ( j=0; j<namesArr.length; j++ ) {
				if ( namesArr[j].length > 0 ) {
					clname = namesArr[j];
					clnameLocal = clname + nameSuffix;
					
					// if declared locally (assume local)
					if ( cssNamesObj ['.'+clnameLocal] != undefined )
						clnameList += clnameLocal + ' ';
					else 
						clnameList += clname + ' ';
				}
			}
			flowObj.class = clnameList.trim();
		}
		
		// now recurse to fix children
		if ( flowObj.items ) {
			for (i=0; i<flowObj.items.length; i++ ) {
				fixLocalNames (compTypeId, flowObj.items[i], cssNamesObj );
			}
		}
	}
	
	/**
	 * Adds a component by object name and object instance
	 * 
	 * compObjName:  name of comp object (such as App.Home)
	 * compObj:      the actual object
	 * userCompName: optional user component name  (home)
	 * 
	 */
	this.addComponent = function (compObjName, compObj, userCompName)
	{
		var id = this._genNewId();
		var typeId = id;
		
		var typeId = this._compKeyByObjName [ compObjName ];
		if ( !typeId ) {
			typeId = id;
		}
		compObj.compObjName = compObjName;
		compObj.compTypeId = typeId;
		compObj.compId = id;
		
		// set component object id
		if ( userCompName )
			compObj.id = userCompName;
		else 
			compObj.id = id;
		
		// add comp by id
		this._componentRegistry [id] = compObj;
		
		// add comp idx by obj name
		if ( typeId == id ) {
			this._compKeyByObjName [ compObjName ] = typeId;
		}
		
		// add comp idx by comp name
		if ( userCompName ) {
			this._compKeyByCompName [ userCompName ] = id;
		}
	}

	/**
	 * Lookup component by id
	 */
	this.getCompByIdOrName = function ( compId )
	{
		if ( isNaN( compId) )
			return this.getCompByName ( compId );
		else
			return this._componentRegistry [ compId ];
	}
	
	/**
	 * Lookup component by id
	 */
	this.getCompById = function ( compId )
	{
		return this._componentRegistry [ compId ];
	}
	
	/**
	 * Get component by compObjName only one per object name (i.e. object class name)
	 */
	this.getCompByObjName = function ( compObjName )
	{
		var idx = this._compKeyByObjName [ compObjName ];
		if ( idx )
			return this._componentRegistry [idx];
		return undefined;
	}
	
	/**
	 * Gets component by user-defined component name
	 */
	this.getCompByName = function ( userCompName )
	{
		var idx = this._compKeyByCompName [ userCompName ];
		if ( idx )
			return this._componentRegistry [idx];
		return undefined;
	}
	
	// gen new ID
	this._genNewId = function ()
	{
		return ++this._maxComponentId;
	}
}

// Create an instance of components manager
SA.comps = new Comps();
