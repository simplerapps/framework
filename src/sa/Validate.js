
/**
 * HQAPPS Validation manager
 */
function Validate ()
{
	// possible return values
	var RET_OK = 0;
	var RET_EMPTY = 1;
	var RET_INVALID = 2;
	
	// pattern to define valid email address
	var patEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ ;

	// used if no validator defined  
	var defaultVaidtor = {
		maxWidth: 60,
		validate: function ( value ) 
		{ 
			var ret = RET_EMPTY;
			if ( value ) {
				if ( value != '' && value.length > 0 ) {
					ret = RET_OK;
				}
			}
			return ret;
		}
	}
	
	/**
	 * pattern table validation registry
	 */
	var patternTable = {
			
		email : {
			maxWidth: 150,
			validate: function ( value ) 
			{
				var ret = RET_EMPTY;
				if ( value ) {
					if ( value != '' && value.length > 0 ) {
						ret = patEmail.test (value)? RET_OK : RET_INVALID;
					}
				}
				return ret;
			}
		}	
	};
	
	/**
	 * Eval data object against a flowList
	 */
	this.evalObj = function ( atomList, dataObj )
	{
		for ( i=0; i<atomList.length; i++ ) {
			var atom = atomList [i];
			if ( atom.name ) {
				var val = dataObj [ atom.name ];
				
				var ret = this.eval ( atom.pattern, val );
				if ( ret != RET_OK ) { 
					var label = getLabel (atom);
					
					if ( ret == RET_EMPTY ) {
						if ( atom.required ) {
							// if word required there, remove
							var idx = label.indexOf (' (required)' );
							if ( idx>0 ) {
								label = label.substring (0, idx) + label.substring(idx+11);
							}
							return 'Field "' + label + '" cannot be empty!';
						}
					}
					else {
						return "'" + label + "' is invalid!";
					}
				} 
			}
		}
		return '';
	}
	
	/**
	 * Validate function that works against registered validators
	 * return true if the value is valid 
	 */
	this.eval = function ( pname, value  )
	{
		var vobj = this.getPattern ( pname );
		return vobj.validate ( value );
	}
	
	/**
	 * Get validation pattern for pattern name (such as 'email' )
	 */
	this.getPattern = function ( pname )
	{
		if ( !pname ) pname = '';
		var vobj = patternTable [ pname ];
		if ( vobj )
			return vobj;
		else 
			return defaultVaidtor;
	}
	
	/**
	 * Get label from atom
	 */
	function getLabel ( atom )
	{
		if ( atom.label )
			return atom.label;
		if ( atom.info )
			return atom.info;
		return atom.name;
	}
	
}

// Create an instance of components manager
SA.validate = new Validate();
