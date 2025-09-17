
/**
 * Button Action component
 */
SA.CodeFormatter = function ()
{	
	// specify if the component contains state or not
	this.stateful = false;
	
	/**
	 * Define RWD for source formatting where font shrinks for small screens 
	 */
	this.css = { items: 
		[
		/* Everything else */
		{name: '@media (min-width: 481px)', items: 
			[
			{name:'.srcFmt', value:'font-size:85%;'}
			]
		},
		 
		/* Mobile sizes */
		{name: '@media (max-width: 480px)', items: 
			[
			{name:'.srcFmt', value:'font-size:65%;'}
			]
		}
		]
	};
	
	/**
	 * If defined it will allow this component to create UI based on the lists provided
	 * 
	 * config: fileURI is the local file URI to load
	 * 
	 */
	this.createUI = function ( flowList, allConfig )
	{
		var html = '';
		
		var localCss = SA.localCss (this, 'srcFmt' );
		
		var fileURI = SA.getConfigValue (flowList, 'fileURI' );
		if ( !fileURI )
			return;

		var content = this.loadFile ( fileURI );

		html += '<pre class="' + localCss + ' prettyprint languague-css">';
		
		html += content;
		
		html += '</pre>';
		return html;
	}
	
	/**
	 * Load a file from server 
	 */
	this.loadFile = function ( filePathUrl )
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
            	alert ( error );
            }
        });		
		return content;
	}
	
}