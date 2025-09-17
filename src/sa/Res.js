
/**
 * HQAPPS resources manager
 */
function Res()
{
	var stringValues = {};
	var resPath = 'res/str/';
	
	/**
	 * Resolve a resource expression name. 
	 * 
	 * Expression format: TYPE:resName.key  (only supported types are STR)
	 * 
	 * Examples:
	 * STR:faq.title1
	 * STR:faq.title3
	 * STR:faq.desc1
	 */
	this.setResPath = function ( path )
	{
		resPath = path;
	}
		
	/**
	 * Resolve a resource expression name. 
	 * 
	 * Expression format: TYPE:resName.key  (only supported types are STR)
	 * 
	 * Examples:
	 * STR:faq.title1
	 * STR:faq.title3
	 * STR:faq.desc1
	 */
	this.getValue = function ( resExp )
	{
		if ( resExp.indexOf ('STR:') < 0 ) {
			return resExp;
		}
		var i0 = resExp.indexOf ('.', 4);
		if ( i0 > 0 ) {
			return this.getStrValue ( resExp.substring (4, i0), resExp.substring (i0+1) );
		}
		return resExp;
	}
	
	/**
	 * Gets a resource value from resName and key. 
	 * Note that the resource name if just the resource file name that resides in res/str/resName. The file is assumed 
	 * to have the 'html' extension.  
	 */
	this.getStrValue = function ( resFileName, key, lang)  
	{
		var val = stringValues [ resFileName + '.' + key];  
		if ( val == undefined ) {
			loadResources ( resFileName );
		}
		return stringValues [ resFileName + '.' + key]; 
	}
	
	// Internal functions
	
	/**
	 * Load string resources from file name (only name without path) 
	 */
	function loadResources ( resFileName )
	{
		var content = loadFile ( resPath + resFileName + '.html' );
		if ( !content || content.length==0 ) {
			console.log ( "Invalid State: cannot load resource from file: " + resFileName );
		}

		var i0 = content.indexOf ( '<!--KEY:');
		var i1=0;

		while ( true ) {
			if ( i0 >= 0 ) {
				i0 += 8;	// skip <!--KEY:
				i1 = content.indexOf ('-->', i0);
				if ( i1 > 0 ) {
					var key = content.substring ( i0, i1 );
					
					i0 = i1 + 3;
					i1 = content.indexOf ( '<!--KEY:', i0 );
					if ( i1 > 0 ) {
						var val = content.substring (i0, i1);
						
						// add a new string resource
						stringValues [ resFileName + '.' + key.trim() ] = val.trim();
						
						i0 = i1;
						continue;
					}
					else {
						var val = content.substring (i0);
						
						// add a new string resource
						stringValues [ resFileName + '.' + key.trim() ] = val.trim();						
					}
				}
			}
			break;
		}
	}
	
	/**
	 * Loads a file from local repository  
	 */
	function loadFile  ( filePathUrl )
	{
		var content = '';
		$.ajax({
            url : filePathUrl,
            type: 'GET',
            dataType: 'text',  
			async: false,
            success : function (data) {
                content = data;
            },
            error: function (xhr,status,error) {
            	//console.log ( "Cannot load resource file: " + filePathUrl + ", cause: " +  error);
            }
        });	
		return content;
	}
	
}

// Create an instance of resources manager
SA.res = new Res();
