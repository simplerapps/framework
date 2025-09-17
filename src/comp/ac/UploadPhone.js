
/**
 * Image component
 */
SA.UploadPhone = function ()
{	
	// specify if the component contains state or not
	// TODO: This does not work for scope
	this.stateful = true;
	
	var atomObj = undefined;
	
	// remember value entered
	var fieldValue = undefined;
	
	var myId = undefined;
	
	// CSS defined here exactly the same as css syntax but as javascript array of objects. Also
	// these css class names are unique to this class. For example if another class has the name 'round-clear'
	// it would be a different name because the names are distinguished based on unique class component type ids
	this.css = { items: 
		[
		/* Everything else */
		{name: '@media (min-width: 481px)', items: 
			[
			{name:'.card', value:'margin-bottom:3px; border: 1px solid #dddddd;padding:10px;background-color:#f9f8f7' },			 
			]
		},
		 
		/* Mobile sizes */
		{name: '@media (max-width: 480px)', items: 
			[
			{name:'.card', value:'margin-bottom:1px; border: 1px solid #dddddd;padding:2px;background-color:#f9f8f7' },			 
			]
		}
		]
	};
	
	/**
	 * This method creates the UI based on the lists provided
	 */
	this.createUI = function ( obj, allConfig )
	{
		myId = this.compId;
		atomObj = obj;		
		
		var placeHolder = '';
		var labelStr = '';

		// get info
		if ( atomObj.info ) {
			placeHolder = 'placeholder="' + atomObj.info + '"'; 
		}
		
		// get label
		if ( atomObj.label ) {
			labelStr = '<label class="col-md-3 control-label" for="email">'+ atomObj.label +'</label>';
		}
		
		var valStr = '';
		if ( atomObj.value ) {
			fieldValue = atomObj.value;
			valStr = 'value="' + fieldValue + '"';
		}

		var setObj = {name:'set-photo-'+myId, ac:'SA.Button', style:'font-size:90%;margin-right:5px;', 
				label:'Set photo', config:{theme:'blank'} };
		var remObj = {name:'rem-photo-'+myId, cmd:myId, ac:'SA.Button', style:'font-size:90%;', 
				label:'Remove', config:{theme:'blank'} };
		
		var setHtml = SA.listCreateUI ( myId, setObj, null, true );
		var remHtml = '';
		if ( fieldValue ) {
			remHtml = SA.listCreateUI ( myId, remObj, null, true );
		}
		 
		// get local css name (i.e. css name defined in this object)
		var cssCard = SA.localCss(this, 'card');
		
		// form created here
		var html =
		'<div id="' + myId + '" class="form-group">'+ labelStr + 
			'<div class="col-md-12">' +
				'<div class="' + cssCard + '">' +
					'<img class="img-responsive" src="res/pics/your-picture.png"></a>'+
				'</div>' +
				'<div>' + setHtml + remHtml + '</div>'+
			'</div>' +
		'</div>';
		
		return html;		
	}
	
	/**
	 * getValue() needed for FORM atom component (work with FormHandler)
	 */
	this.getValue = function ()
	{
		fieldValue = $("#" + myId).val();
		return fieldValue;
	}
	
	/**
	 * getName() needed for FORM atom component  (work with FormHandler)
	 */
	this.getName = function()
	{
		return atomObj.name;
	}
	
	/**
	 * Page just loaded this component
	 */
	this.postLoad = function ()
	{
		$( '#set-photo-'+myId).click ( function (event) {
			console.log ( 'click 1');
		});
	}	
}
