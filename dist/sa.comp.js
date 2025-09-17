
/**
 * Button Action Atom component. Action atoms components cause code execution in the system. Can thought off as the 
 * Mini Catalyst Controllers that alter the system's state. The acton button operates as the following:
 * 
 */
SA.BtnCircle = function ()
{	
	// specify if the component contains state or not
	this.stateful = false;

	// create a button delegate
	var button = new SA.Button();
	
	var myId = undefined;
	
	// CSS defined here exactly the same as css syntax but as javascript array of objects. Also
	// these css class names are unique to this class. For example if another class has the name 'round-clear'
	// it would be a different name because the names are distinguished based on unique class component type ids
	this.css = { items:
		[
		/* Everything else */
		{name: '@media (min-width: 481px)', items: 
			[
			{name:'.round', value:'display:block;width:15px;height:15px;border: 1px solid #f5f5f5;'+
				'border-radius: 50%;box-shadow: 0 0 1px gray;float:left;'},
			{name:'.round:hover', value:'background: #F0F0F0;' },
			{name:'.selected', value:'background: #F0F0F0;'}
			]
		},
		 
		/* Mobile sizes */
		{name: '@media (max-width: 480px)', items: 
			[
			{name:'.round', value:'display:block;width:10px;height:10px;border: 1px solid #f5f5f5;'+
				'border-radius: 50%;background: #ffffff;'+
				'box-shadow: 0 0 1px gray;float:left;'},
			{name:'.round:hover', value:'background: #262626;' },
			{name:'.selected', value:'background: #F0F0F0;'}
			]
		}		 
		]			
	};
	
	/**
	 * If defined it will allow this component to create UI based on the lists provided
	 * 
	 * config:
	 */
	this.createUI = function ( atomObj, allConfig )
	{
		var label = atomObj.label;
		if ( !label )
			label = 'none';

		myId = this.compId;
		if ( atomObj.name ) {
			myId = atomObj.name;
		}
		
		var cls1 = SA.localCss ( this, "round");
		var cls2 = SA.localCss ( this, "round:hover");
		
		var html = 
		'<a id="' +myId + '" href="#" class=" btnCircle '+ cls1 + ' ' + cls2 + '"></a>';
		return html;
	}
	
	this.getName = function()
	{
		return button.getName();
	}
	
	/**
	 * If defined it will allow this component to be an action listener
	 */
	this.setActionListener = function ( listenerComp )
	{
		button.setActionListener (listenerComp);
	}
	
	/**
	 * Adds an action listener
	 */
	this.select = function ( select, id )
	{
		var selCls = SA.localCss ( this, "selected");
		var $id = $ ('#'+id ); 
		var hasCls = $id.hasClass ( selCls );
		
		if ( select ) {
			if ( ! hasCls ) {
				$id.addClass ( selCls ); 
			}
		}
		else {
			if ( hasCls ) {
				$id.removeClass ( selCls ); 
			}
		}
	}
	
	/**
	 * Fire event to this action (click button, etc.)
	 */
	this.triggerEvent = function ( eventName )
	{
		button.triggerEvent ( eventName );
	}
	
	/**
	 * If defined it will be called after page is loaded (to give chance to initialize after the DOM
	 * is created) 
	 */
	this.postLoad = function ()
	{
		button.postLoad();
	}
}
;
/**
 * Button Action Atom component. Action atoms components cause code execution in the system. Can thought off as the 
 * Mini Catalyst Controllers that alter the system's state. The acton button operates as the following:
 * 
 */
SA.Button = function ()
{	
	// specify if the component contains state or not
	this.stateful = false;
	
	// state variables
	this.actionListener = undefined;
	this.selected = false;

	var myAtomObj = undefined;
	var listenerComp = undefined;
	var divId = undefined;

	// CSS defined here for button component
	this.css = {
	}; 
	
	/**
	 * If defined it will allow this component to create UI based on the lists provided
	 * 
	 * config: 
	 * type: link, button, block   (create a link, default is button. Block is used for toolbars)
	 * theme: blank, color  (default color)
	 * 
	 */
	this.createUI = function ( atomObj, allConfig )
	{
		lastTimeStamp = 0;
		myAtomObj = atomObj;
		
		var type = SA.getConfigValue (atomObj, 'type', 'button');
		var linkStyle = ( type == 'link' );
		var blockStyle = ( type == 'block' );
		
		var listener = SA.getConfigValue (atomObj, 'listener', 'na' );
		if ( listener && listener!='na') {
			listenerComp = listener;
		}
		
		var theme = SA.getConfigValue (atomObj, 'theme', 'color');
		var thcls = ( theme == 'blank' )? 'btn-default' : 'btn-warning';
		
		var label = atomObj.label;
		if ( !label ) {
			label = 'No Label';
		}
		var tooltip = '';
		if ( atomObj.info ) {
			tooltip = 'title="' + atomObj.info + '"';
		}
		
		var style = '';
		if ( atomObj.style ) {
			style = atomObj.style;
		}
		
		// set div.id == compId (or name if exists), this way you can always lookup component instance from divId
		divId = this.compId;
		if ( atomObj.name )
			divId = atomObj.name;
		
		var turl = (atomObj.ilist)? '#!/' + atomObj.ilist : '#';

		// hidden button
		if ( SA.getConfig ( atomObj, 'hidden' ) == true ) {
			style += ';display:none';
		}  
		
		var retHtml = '';		
		
		if ( linkStyle ) {
			style = (style=='')? 'float:left;padding:8px;' : style;
			
			retHtml = '<div style=""' + tooltip + '><a id="' + divId + 
			'" href="#" style="' + style + '">'+ label +'</a></div>';
		}
		else if ( blockStyle ) {
			style = (style=='')? 'color:#E0E0E0;' : style;
			retHtml = '<li id="' + divId + '">' + 
				'<a style="' +style + '" href="' + turl + '">'+ 
				label +'</a></li>';
		}
		else {
			style = (style=='')? 'margin-right:8px;' : style;
			
			//retHtml = 
			//'<button class="btn btn-lg btn-warning">'+
				//'<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> Loading...'+
			//'</button>';
			
			var spanId = divId + '-span';
			
			retHtml = 
			'<a href="' + turl +'" role="button" id="' + divId + '" ' + tooltip + ' style="' + style + 
			'" class="btn ' + thcls + '">' + '<span id="' + spanId + '" class=""></span>' + ' '+
			label + '</a>';
			/*
			'<button id="' + divId + '" ' + tooltip + ' style="' + style + 
				'" class="btn ' + thcls + '">'+
				'<span id="' + spanId + '" class=""></span>' + ' '+
			label+'</button>'
			*/ 
		}
		return retHtml;
	}
	
	this.setWaiting = function ( isWaiting ) 
	{
		if ( isWaiting ) {
			$ ('#' + divId+'-span').addClass ( 
					'glyphicon glyphicon-refresh glyphicon-refresh-animate' );
		}
        else {
            $ ('#' + divId+'-span').removeClass ( 
            		'glyphicon glyphicon-refresh glyphicon-refresh-animate' );
        }
	}
	
	this.getName = function()
	{
		return this.atomObj.name;
	}
	
	/**
	 * If defined it will allow this component to be an action listener
	 */
	this.setActionListener = function ( listener )
	{
		listenerComp = listener;
	}
	
	/**
	 * Adds an action listener
	 */
	this.showSelected = function ( selected )
	{
		this.selected = selected;
		var id = this.id;
		
		if ( selected ) {
		    $("#" + id).addClass ( 'active' );
		}
		else {
		    $("#" + id).removeClass ( 'active' );
		}
	}
	
	/**
	 * Fire event to this action (click button, etc.)
	 */
	this.triggerEvent = function ( eventName )
	{
		var id = this.id;
		var select = $( "#" + id );
		if ( select )
			select.trigger( eventName );
	}
	
	/**
	 * If defined it will be called after page is loaded (to give chance to initialize after the DOM
	 * is created) 
	 */
	this.postLoad = function ()
	{
		//var atomObj = this.atomObj;
		var divId = this.id;		// id can be compId or name (if provided)
		var compId = this.compId;	// compId
		var myComp = this;
		var lastTimeStamp = 0;
		
		var vdiv = $("#" + divId);
		
		$('body').on('click', "#" + divId, function (e) {
			
			e.preventDefault();

			if ( !allowEvent (e) ) return;
			
		    // if compId set in tlist, fire local link
		    if ( myAtomObj.tlist && myAtomObj.tlist.indexOf ('#compId:')==0 ) {
		    	// fire a click event to that component
		    	SA.events.fireEvent( myAtomObj.tlist.substring(8), 'click');
		    	return;
		    }
			// get div.id as compId
			var compId = divId;
			
		    // fire event
		    if ( listenerComp ) {
		    	listenerComp.performAction ( compId, myAtomObj, myComp );
		    }
		    
		    //check for ilist and tlist. If found, add the ilist as tlist child
		    if ( myAtomObj.tlist ) {		    	
				// load the ilist
				var ilist = SA.comps.getList ( myAtomObj.ilist )
				
				// now load the component's target list
				var tlist = SA.comps.getList ( myAtomObj.tlist );
				
				var html = '';
				
				// no list component at tlist just render ilist into div
				if ( !tlist.lc ) {
					html = SA.listCreateUI ( this.compId, ilist );
					if ( html )
						$('#' + tlist.name ).html ( html );
				}
				else {
					if ( ilist ) {
						if ( !tlist.items ) 
							tlist.items = new Array();
						
						tlist.items.push ( ilist );
					}
					// now render the tlist with ilist as its child (if exists) 
					var html = SA.listCreateUI ( compId, tlist );
					if ( html ) 	// if return value, set it
						tdiv.html ( html );
				}
		    }
		    
		    // show that is component is selected (no need to do this for button)
		    //thisComp.showSelected ( compId, true);
		});
		
		/**
		 * Returns true if the event is allowed to be processed
		 */
		function allowEvent ( e )
		{
			var allow ;
			if ( e.timeStamp==0 || lastTimeStamp==0 ) {
				allow = true;
			}
			else {
				allow = (e.timeStamp != lastTimeStamp) || (lastTimeStamp > e.timeStamp);
			}
			lastTimeStamp = e.timeStamp;
			return allow;
		}
	}

}
;
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
	
};
/**
 * Text Area component
 */
SA.EnumField = function () 
{	
	// specify if the component contains state or not
	// TODO: This does not work for scope
	this.stateful = true;
	
	this.actionListener = undefined;
	this.atomObj = undefined;
	
	// remember value entered
	var fieldValue = '';
	var divId = undefined;
	var idsArray = new Array ();
	var clickCls = undefined;
	
	// CSS defined here exactly the same as css syntax but as javascript array of objects. Also
	// these css class names are unique to this class. For example if another class has the name 'round-clear'
	// it would be a different name because the names are distinguished based on unique class component type ids
	this.css = { items: 
		[
		/* Everything else 
		{name: '@media (min-width: 481px)', items: 
			[
			]
		},
		 
		// Mobile sizes 
		{name: '@media (max-width: 480px)', items: 
			[
			]
		},
		*/
		]
	};
	
	/**
	 * If defined it will allow this component to create UI based on the lists provided
	 * 
	 * config: 
	 * type: 'password', 'text'
	 * 
	 * child list: atom fields:
	 * info: info inside field
	 * label: label outside field
	 */
	this.createUI = function ( atomObj, config )
	{
		this.atomObj = atomObj;		
		divId = this.compId;
		
		var placeHolder = '';
		
		var type = SA.getConfigValue (atomObj, 'type', 'text');
		var typeStr = 'type="' + type + '"';
		var labelStr = '';

		// get info
		if ( atomObj.info ) {
			placeHolder = 'placeholder="' + atomObj.info + '"'; 
		}
		
		// get label
		if ( atomObj.label ) {
			labelStr = '<label class="col-md-3 control-label" for="email">'+ atomObj.label +'</label>';
		}
		
		var values = atomObj.values;
		if ( !values || values.length == 0 ) {
			alert ( "Invalid State: expected 'values' array with name value objects");
		}
		
		fieldValue = atomObj.value;
		if ( !fieldValue ) {
			fieldValue = '';
		}
		// class to handle click event
		clickCls = makeId ( 'clkgrp');
		
		// UI created here (Remember! use id will allow the pageLoaded notification)
		var html =
		'<div id="'+ divId + '" class="form-group" >'+
		  '<div class="col-md-12">' + 
			'<div class="btn-group">';
			
		for ( i=0; i<values.length; i++ ) {
			var valObj = values [i];
			var cls = (valObj.name==fieldValue || valObj.value==fieldValue)? 'active' : '';
			cls += ' ' +clickCls;
			
			var id = makeId(valObj.name);
			idsArray.push ( id )
			html += '<button type="button" class="btn btn-default ' + cls + '" id="' + id + '">' + 
				valObj.value + '</button>';
		}
		html += '</div></div></div>';  
		
		// get local css name (i.e. css name defined in this object)
		//var cssName = SA.localCss(this, 'round-clear');
		
		return html;
	}
	
	/**
	 * Make id from divId + idVal
	 */
	function makeId ( idVal )
	{
		return idVal + '-' + divId ;
	}
	
	/**
	 * getValue() needed for FORM atom component (work with FormHandler)
	 */
	this.getValue = function ()
	{
		return fieldValue;
	}
	
	/**
	 * getName() needed for FORM atom component  (work with FormHandler)
	 */
	this.getName = function()
	{
		return this.atomObj.name;
	}
	
	/**
	 * If defined it will be called after page is loaded (to give chance to initialize after the DOM
	 * is created) 
	 */
	this.postLoad = function ()
	{
		// handler to the click group class
		$('.' + clickCls).click ( function() {
			fieldValue = $(this).attr ( "id" ); 
		    $(this).addClass ( 'active' );
		    deSelectIds ( fieldValue );
		});
	}
	
	/**
	 * Go through list and make one id active
	 */
	function deSelectIds ( butId )
	{
		for ( i=0; i<idsArray.length; i++ ) {
			if ( idsArray[i] != butId ) {
				var $id = $( '#'+ idsArray[i] );
				if ( $id.hasClass ('active'))
					$id.removeClass ( 'active' );				
			}
		}
	}
}

;
/**
 * Atom component for loading files
 */
SA.FileLoader = function ()
{	
	/**
	 * This method creates the UI based on the lists provided
	 * 
	 * config: fileURI for file to load
	 */
	this.createUI = function ( atomObj, allConfig )
	{
		var fileURI = SA.getConfigValue (atomObj, 'fileURI' );
		if ( !fileURI )
			return;
		
		loadFile ( fileURL, function handleData(data) {
			
		});
	}

	/**
	 * Function to load file and return the content to the data handler
	 */
	function loadFile ( fileURI, dataHandler)
	{
		$.ajax({
		    url : filePathUrl,
		    type: 'GET',
		    dataType: 'text',  
		    success : function (data) {
		        dataHandler.handleData ( data );
		    },
		    error: function (xhr,status,error) {
		    	alert ( error );
		    }
		});
	}
}
;
/**
 * Image component
 */
SA.Image = function ()
{	
	/**
	 * This method creates the UI based on the lists provided
	 */
	this.createUI = function ( atomObj, allConfig )
	{
		var imageUrl = allConfig.imageUrl;

		if ( !imageUrl )
			return;
		
		var widthStr = '';
		//if ( allConfig.width )
			//widthStr = 'width=' + allConfig.width;
		
		var classes = "img-responsive";
		
		//var div = '<div class="row">' +
			//'<div class="col-md-1">';
		
		var divBegin = SA.createHtmlBegin ( atomObj );
		
		return divBegin + '<img src="' + imageUrl + '"' + widthStr + 'class="' + classes + '"' + 
			'/></div>';
	}
}
;
/**
 * Login component 
 */
SA.LoginComp = function ()
{	
	var defLoginLabel = 'Sign In';
	
	/**
	 * This method creates the UI based on the lists provided
	 */
	this.createUI = function ( atomObj, allConfig )
	{
		var loginLabel = SA.getConfigValue ( atomObj, 'label', defLoginLabel);
		
		if ( isLoggedIn() ) {
			return 'Sign out';			
		}
		else {
			return loginLabel;
		}
	}	
	
	function isLoggedIn ()
	{
		var auth = SA.getUserAuth ();
		if ( auth && auth.status == 'OK' )
			return true;
		return false;
	}
}
;
/**
 * Message component for displaying messages in the UI 
 */
SA.Message = function ()
{
	// local css classes
	this.css = { items: 
		[
		{name: '.errmsg', value: 'padding:0px;font-weight:normal;color:#FF9900;font-size:120%;' },
		{name: '.okmsg', value: 'padding:0px;font-weight:normal;color:#00CC00;font-size:120%;' }		
		]
	};
	
    var cssErrMsg = undefined;
    var cssOkMsg = undefined;
    var myId = undefined;
	
	/**
	 * This method creates the UI based on the lists provided
	 */
	this.createUI = function ( atomObj, allConfig )
	{
		myId = atomObj.name;
		
		cssErrMsg = SA.localCss (this, 'errmsg');
		cssOkMsg = SA.localCss (this, 'okmsg');
		
		return '<div class="' + cssErrMsg + '" id="' + myId + '" ></div>'; 
	}	
	
	/**
	 * show message method called from ouside object
	 */
	this.showMessage = function ( msg, success )
	{
		var $div = $( '#'+myId );
		
		if ( !success ) {
			$( $div ).removeClass ( cssOkMsg );
			$( $div ).addClass ( cssErrMsg );			
			$( $div ).html (  msg );
		}
		else {
			$( $div ).removeClass ( cssErrMsg );
			$( $div ).addClass ( cssOkMsg );			
			$( $div ).html (  msg );			
		}
	}
}
;
/**
 * SandBox handler component
 */
SA.SandBox = function () 
{	
	var myId;
	var myName;
	var contentCode;
	
	this.createUI = function ( atomObj, config )
	{
		myId = this.compId;
		myName = atomObj.name;
		
		contentCode = SA.getConfig ( atomObj, 'content' );
		
		var srcUrl = SA.getConfig (atomObj, 'indexUrl' );
		
		var html = '<iframe style="width:100%; height:100%; border:0px;" src="' +srcUrl + 
			'" id="' + myId + '"></iframe>';
		
		return html;
	}
	
	/**
	 * If defined it will be called after page is loaded (to give chance to initialize after the DOM
	 * i	s created) 
	 */
	this.postLoad = function ()
	{
		$('#' + myId).load(function() {
			var iframe = document.getElementById( myId );
			var script = newScriptEl ( iframe, contentCode);	
			iframe.contentWindow.document.body.appendChild(script);			
		});
	}
	
	/**
	 * Create script element inside the frame
	 */
	function newScriptEl ( iframe, scriptCode )
	{
		var script = iframe.contentWindow.document.createElement("script");
		script.type = "text/javascript";
		script.innerHTML = scriptCode;
		return script;
	}
}

;
/**
 * Text Area component
 */
SA.TextArea = function ()
{	
	// specify if the component contains state or not
	// TODO: This does not work for scope
	this.stateful = true;
	
	this.actionListener = undefined;
	this.atomObj = undefined;
	
	// remember value entered
	var fieldValue = '';
	
	// CSS defined here exactly the same as css syntax but as javascript array of objects. Also
	// these css class names are unique to this class. For example if another class has the name 'round-clear'
	// it would be a different name because the names are distinguished based on unique class component type ids
	this.css = { 
	};
	
	/**
	 * If defined it will allow this component to create UI based on the lists provided
	 * 
	 * config: 
	 * rows: number of rows
	 * cols: number of columns 
	 */
	this.createUI = function ( atomObj, config )
	{
		this.atomObj = atomObj;
		
		var divId = this.compId;
		
		var rows = SA.getConfigValue ( atomObj, 'rows', 3);
		var cols = SA.getConfigValue ( atomObj, 'cols', -1 );
		var placeHolder = '';
		
		if ( atomObj.info ) {
			var reqtext = '';
			//if ( atomObj.required ) 
				//reqtext = ' (required)';
			placeHolder = ' placeholder="' + atomObj.info + reqtext + '"'; 
		}

		// get label
		var labelStr = '';
		if ( atomObj.label ) {
			labelStr = '<label class="col-md-3 control-label" for="email">'+ atomObj.label +'</label>';
		}
		
		fieldValue = atomObj.value;
		var valStr = '';		
		if ( fieldValue && fieldValue != '' ) {
			valStr = fieldValue;
		}		
		else {
			fieldValue = '';
		}
		
		var html =
		'<div class="form-group" >'+ labelStr +   
			'<div class="col-md-12">' +
		  		'<textarea style="font-size:110%;" class="form-control" rows="' + rows + '" id="' + 
		  			divId + '" ' + placeHolder +' >' + fieldValue + '</textarea>' +
		  	'</div>' +
		'</div>';
		
		/*
		var html =
		'<div class="form-group">'+
			//'<label class="col-md-3 control-label" for="name">'+ 'Enter text:' +'</label>' +
			'<div class="col-md-12">' +
				'<textarea class="" ' + 
				'id="' + divId + '" rows="' + rows + '"' +colsStr + placeHolder +'>' + 
				fieldValue + '</textarea>' + 
			//'</div>' + 
		'</div>';
		*/
		
		// get local css name (i.e. css name defined in this object)
		//var cssName = SA.localCss(this, 'round-clear');
		
		return html;
	}
	
	this.getValue = function ()
	{
		fieldValue = $("#" + this.compId).val();
		return fieldValue;
	}
	
	this.getName = function()
	{
		return this.atomObj.name;
	}
}
;
/**
 * Text Area component
 */
SA.TextField = function () 
{	
	// specify if the component contains state or not
	// TODO: This does not work for scope
	this.stateful = true;
	
	this.actionListener = undefined;
	this.atomObj = undefined;
	
	// remember value entered
	var fieldValue = '';
	
	// CSS defined here exactly the same as css syntax but as javascript array of objects. Also
	// these css class names are unique to this class. For example if another class has the name 'round-clear'
	// it would be a different name because the names are distinguished based on unique class component type ids
	this.css = {
	};
	
	/**
	 * If defined it will allow this component to create UI based on the lists provided
	 * 
	 * config: 
	 * type: 'password', 'text'
	 * 
	 * child list: atom fields:
	 * info: info inside field
	 * label: label outside field
	 */
	this.createUI = function ( atomObj, config )
	{
		this.atomObj = atomObj;		
		var divId = this.compId;
		
		var placeHolder = '';
		
		var type = SA.getConfigValue (atomObj, 'type', 'text');
		var typeStr = 'type="' + type + '"';
		var labelStr = '';

		// get info
		if ( atomObj.info ) {
			var reqtext = '';
			//if ( atomObj.required ) 
				//reqtext = ' *';
			placeHolder = 'placeholder="' + atomObj.info + reqtext + '"'; 
		}
		
		// get label
		if ( atomObj.label ) {
			labelStr = '<label class="col-md-3 control-label" for="email">'+ atomObj.label +'</label>';
		}
		
		fieldValue = atomObj.value;
		var valStr = '';		
		if ( fieldValue && fieldValue != '' ) {
			valStr = 'value="' + fieldValue + '" ';
		}
		
		// form created here
		var html =
		'<div class="form-group">'+ labelStr + 
			'<div class="col-md-12">' +
		  		'<input '+ typeStr + ' style="font-size:110%;" class="form-control" id="' + 
		  			divId + '" ' + valStr + placeHolder +' />' +
		  	'</div>' +
		'</div>';
		
		// get local css name (i.e. css name defined in this object)
		//var cssName = SA.localCss(this, 'round-clear');
		
		return html;
	}
	
	/**
	 * getValue() needed for FORM atom component (work with FormHandler)
	 */
	this.getValue = function ()
	{
		fieldValue = $("#" + this.compId).val();
		return fieldValue;
	}
	
	/**
	 * getName() needed for FORM atom component  (work with FormHandler)
	 */
	this.getName = function()
	{
		return this.atomObj.name;
	}	
}
;
/**
 * Text Area component
 */
SA.UploadBrowser = function () 
{	
	// specify if the component contains state or not
	// TODO: This does not work for scope
	this.stateful = true;

	// remember value entered
	var atomObj = undefined;
	var imgFile = undefined;
	var myId = undefined;
	
	// what to show as default picture
	var defaultPicUrl = 'res/pics/your-picture.png';
	
	// CSS defined here exactly the same as css syntax but as javascript array of objects. Also
	// these css class names are unique to this class. For example if another class has the name 'round-clear'
	// it would be a different name because the names are distinguished based on unique class component type ids
	this.css = { items: 
		[
		/* Everything else */
		{name: '@media (min-width: 481px)', items: 
			[
			{name:'.card', value:'margin-bottom:3px; border: 1px solid #dddddd;padding:0px;background-color:#f9f8f7' },			 
			]
		},
		 
		/* Mobile sizes */
		{name: '@media (max-width: 480px)', items: 
			[
			{name:'.card', value:'margin-bottom:1px; border: 1px solid #dddddd;padding:0px;background-color:#f9f8f7' },			 
			]
		}
		]
	};
	
	/**
	 * If defined it will allow this component to create UI based on the lists provided
	 * 
	 * config: 
	 * type: 'password', 'text'
	 * 
	 * child list: atom fields:
	 * info: info inside field
	 * label: label outside field
	 */
	this.createUI = function ( obj, config )
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
		
		// EDIT OP: assume the picture URL is in value 
		if ( atomObj.value && atomObj.value.length>0 ) {
			defaultPicUrl = atomObj.value;
			// reset values
			atomObj.value = undefined;	
			imgFle = undefined;
		}
		else {
			defaultPicUrl = 'res/pics/your-picture.png'
		}
		
		var setObj = {name:'set-photo-'+myId, ac:'SA.Button', style:'font-size:90%;margin-right:5px;', 
				label:'Set photo', config:{theme:'blank'} };
		var remObj = {name:'rem-photo-'+myId, cmd:myId, ac:'SA.Button', style:'font-size:90%;', 
				label:'Remove', config:{theme:'blank'} };
		
		var setHtml = SA.listCreateUI ( myId, setObj, null, true );
		setHtml = SA.injectClass ( setHtml, 'needsclick');
		
		var remHtml = SA.listCreateUI ( myId, remObj, null, true );
		 
		// get local css name (i.e. css name defined in this object)
		var cssCard = SA.localCss(this, 'card');
		
		var html =
		'<div id="' + myId + '" class="form-group">'+ labelStr + 
			'<div class="col-md-12">' +
				'<div class="' + cssCard + '">' +
					'<img id="edit-card-prev" class="img-responsive" src="' + defaultPicUrl + '">'+
				'</div>' +
				'<div>' + setHtml + 
					'<input type="file" id="file-' + myId + '" style="display:none" />' +
					remHtml + 
				'</div>'+
			'</div>' +
		'</div>';
		
		return html;		
	}
	
	/**
	 * getValue() needed for FORM atom component (work with FormHandler)
	 */
	this.getValue = function ()
	{
		return imgFile;
	}
	
	/**
	 * getName() needed for FORM atom component  (work with FormHandler)
	 */
	this.getName = function()
	{
		return atomObj.name
	}
	
	/**
	 * Page just loaded this component
	 */
	this.postLoad = function ()
	{
		var $setPhoto = $( '#set-photo-'+myId);
		var $remPhoto = $( '#rem-photo-'+myId);		
		var $upload = $( '#file-'+myId );
		
		disableRemButton ( true );
		
		// set photo click event 
		$setPhoto.click ( function (event) {
			//alert ( 'click :' + event );
			$upload.trigger('click');
		});
		
		// click on remove
		$remPhoto.click (function (event) {
			clearImage ();
		});
		
		// upload photo changed event (when file is opened)
		$upload.change ( function (e) {
			e.preventDefault();

			imgFile = this.files[0],
			reader = new FileReader();
			reader.onload = function (event) {
				setPreviewImg ( event.target.result );
			};
			reader.readAsDataURL(imgFile);
			disableRemButton (false);
			return false;
		});
	}
	
	function clearImage ()
	{
		imgFile = undefined;
		disableRemButton ( true );
		setPreviewImg ( undefined );
		$( '#file-'+myId ).val ( '' );
	}
	
	/**
	 * Enable / disable rem button
	 */
	function disableRemButton ( enable ) {
		$('#rem-photo-'+myId).prop ('disabled', enable);
	}
	
	/**
	 * Set img source to new image
	 */
	function setPreviewImg ( newImageSrc ) {
		if ( !newImageSrc ) {
			$('#edit-card-prev').attr ('src', defaultPicUrl);	
		}
		else {
			$('#edit-card-prev').attr ('src', newImageSrc );
		}
	}
}
;
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
;
/**
 * Variable component
 */
SA.Variable = function ()
{	
	var atom = undefined;
	
	/**
	 * This method creates the UI based on the lists provided
	 */
	this.createUI = function ( atomObj, allConfig )
	{
		atom = atomObj;
		return '';
	}
	
	this.getName = function ()
	{
		return atom.name;
	}
	
	this.getValue = function ()
	{
		return atom.value;
	}
	
	this.setValue = function (val)
	{
		atom.value = val;
	}
}
;
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

;
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
;
/**
 * Panel to contain multiple display Cards
 */
SA.CardPanel = function ()
{	
	// specify if the component contains state or not
	// TODO: This does not work for scope
	this.stateful = true;
	
	this.css = { items: 
		[
		/* Everything else */
		{name: '@media (min-width: 481px)', items:   
			[
			{name:'.title', value:'font-size:250%' }			 
			]
		},
		 
		/* Mobile sizes */
		{name: '@media (max-width: 480px)', items: 
			[
			{name:'.title', value:'font-size:180%' }	 
			]
		}
		]
	};
	
	/**
	 * If defined it will allow this component to create UI based on the lists provided
	 * 
	 * items:
	 * All children are expected to be Card atom components
	 */
	this.createUI = function ( listObj, config )
	{
		var divId = this.compId;
		
		if ( !listObj.items )
			return undefined;
		
		var cardsList = listObj.items;
		if ( listObj.items.length < 10 ) {
			listObj.items.push ( {lc:'SA.Card', 
				config:{
					dummy: true,
					listId: config.id  
				} } 
			);
		}
		
		var cssTitle = SA.localCss (this, 'title');

		var title = SA.getConfigValue ( listObj, 'title', 'No Title !!');
		var desc = SA.getConfigValue ( listObj, 'desc', ' ');
		var editMode = SA.getConfigValue ( listObj, 'editMode', true);
		
		var retHtml = 
		'<div class="container-fluid" style="padding:10px">' + 
			'<div class="row" >'+
				'<div class="container col-md-8 col-md-offset-2" >'+
					'<div class="">'+
						'<p style="margin-top:0px" class="'+ cssTitle + '" >' + title + '</p>'+
						'<p style="margin-bottom:20px">' + desc + '</p>'+
					'</div>'+
				'</div>'+  
			'</div>'+
			'<div class="row">'+
      	  		'<div class="container col-md-8 col-md-offset-2" >'+
      	  			'<div >';
		
		var i = 0;
		for ( i=0; i<cardsList.length; i++ ) {
			
			var lobj = cardsList [i];
			
			// if not atom component (i.e. html, lc, etc; just render and continue)
			if ( !lobj.ac ) {
				lobj.config.editMode = editMode;
				retHtml += SA.listCreateUI ( lobj.compId, lobj, undefined, true );  
				continue;
			}
			
			// get atom comp
			var atomComp = SA.getAtomComponent ( lobj.name, lobj.ac );
			
			// get html
			var html = atomComp.createUI ( lobj, null );
			
			retHtml += html;
		}
		
		retHtml += '</div></div></div></div>';	
		
		// test sharing
		/*
		retHtml += '<button onclick="window.plugins.socialsharing.share(\'Message only\')">message only</button>';
		retHtml += '<br><br><br>';
		*/
		
		return retHtml;
	}	
}
;
/**
 * Button Action component
 */
SA.Carousel = function ()
{	
	// specify if the component contains state or not
	this.stateful = true;
	
	// store obj-based templ here
	this.htmlTempl = undefined;
	
	var myId = undefined;
	var innerDivId = undefined; 
	var listener = undefined;
	var numberItems = 0;
		
	/**
	 * If defined it will allow this component to create UI based on the lists provided
	 * 
	 * config: 
	 * 
	 * 
	 * flow: expect child lists of slides
	 */
	this.createUI = function ( flowList, allConfig )
	{
		// the id is set by the system (either compId or name)
		myId = this.compId;
		if ( flowList.name ) {
			myId = flowList.name;
		}

		var html = 
		'<div id="' + myId + '" class="carousel slide" data-ride="carousel">';

		// The circle controls  
		/*
		html += '<ol class="carousel-indicators">' ;
		for ( i=0; i<flowList.items.length; i++ ) {
			if ( i==0 )
				html += '<li data-target="#' + myId + '" data-slide-to="' + i + '" class="active"></li>';
			else 
				html += '<li data-target="#' + myId + '" data-slide-to="' + i + '"></li>';				
		}
		html += '</ol>' ;
		*/

		innerDivId = 'ci-' + myId;
		
		// content slides
		html += '<div id="' + innerDivId + '" class="carousel-inner">';
		
		for ( j=0; j<flowList.items.length; j++  ) {
			
			// single carousel page
			var ttlist = flowList.items[j];
			var listHtml = SA.listCreateUI ( this.compId, ttlist );
			var listId = 'page-' + ttlist.config.id;
			
			if ( j == 0 ) 
				html += '<div id="' + listId + '" class="item active">' + listHtml + '</div>';
			else 
				html += '<div id="' + listId + '" class="item">' + listHtml + '</div>';
		}
		html += '</div>';
		
		// get number of items
		numberItems = flowList.items.length;
		
		// right and left arrows controls
		
		if ( flowList.items.length > 1 ) {
			/*
			html += '<a class="carousel-control left" href="#' + myId + '" data-slide="prev">'; 
			html +=    '<span class="glyphicon glyphicon-chevron-left"></span>';
			html += '</a>' ;
			html += '<a class="carousel-control right" href="#' + myId + '" data-slide="next">' ; 
			html +=    '<span class="glyphicon glyphicon-chevron-right"></span>' ;
			html += '</a>'
			*/
		}
		
		html += '</div>' ;

		return html;
	}
	
	/**
	 * Add new page to the end
	 */
	this.addPage = function ( uniqueId, pageHtml )
	{
		var activeCls = numberItems==0? ' active': ''; 
		var html = '<div id="page-' + uniqueId + '" class="item' + activeCls + '">' + pageHtml + '</html>';
		$('#'+innerDivId).append ( html );
		numberItems++;
	}
	
	/**
	 * Remove a page (need to select previous page)
	 */
	this.delPage = function ( uniqueId )
	{
		var sel = $('#page-' + uniqueId);
		sel.remove();
		numberItems--;
	}
	
	/**
	 * Reset content of a page with pageId and new html
	 */
	this.resetPage = function ( pageId, newHtml )
	{
		$('#page-' + pageId).html ( newHtml );
	}
	
	/**
	 * Go to next page
	 */
	this.nextPage = function ()
	{
		$('#'+myId).carousel( 'next' );
	}
	
	/**
	 * Goto prev page
	 */
	this.prevPage = function ()
	{
		$('#'+myId).carousel( 'prev' );
	}
	
	/**
	 * Show the specific page by idx
	 */
	this.showPage = function ( idx )
	{
		if ( idx<0 || idx >= numberItems) {
			idx = numberItems -1;
		}
		$('#'+myId).carousel( idx );
	}
	
	/**
	 * Set a carousel listener
	 */
	this.setListener = function ( l ) 
	{
		listener = l;
	}
	
	/**
	 * If defined it will be called after page is loaded (to give chance to initialize after the DOM
	 * is created) 
	 */
	this.postLoad = function ()
	{
		$('#' + myId ).carousel({
			//interval: 12000000
			interval:false
		});
		
		$('#' + myId ).on('slid.bs.carousel', function (e) {
			var index = $( '.active', e.target).index ();
			//console.log ( 'slide to: ' + index );
			
			// pass slide event to listener
			if ( listener && listener.slideEvent ) {
				listener.slideEvent ( index );
			}
		});
	}
}
;
/**
 * Atom Component for doing searches on the server resulting in Predictive search as it 
 * shows results from the server as you tyoe. The server component is running on 
 * java-based server 
 */
SA.CodeTester = function ()
{	
	var myId, compId;
	var editor, codeCss, ncodeCss, frameCss, plainCss;
	var contentId;
	var codeData, indexHtml, bodyIdx;
	var codeDiv;
	var comp1File, indexFile, infoFile;
	var mobileDevice;
	var codeFromLastEditor;
	var height;
	var compStyle;
	
	// CSS defined here exactly the same as css syntax specific to this component namespace
	this.css = { items: 
		[
		{name:'.code-frame', value: 'border: 3px solid #F0F0F0;' },
		{name:'.code-css', value:'width:95%; height:300px; margin:10px;font-size:80%;' },
		{name:'.ncode-css', value:'width:95%; height:300px; margin:10px;overflow:scroll;' },
		{name:'.code-plain', 
			value:'width:95%; height:300px; margin:10px;overflow:scroll;font-size:90%;font-family:monospace;border:3px' }		
		]
	};
	
	// create buttons bar
	var buttonsList = { lc:'SA.PillsGroup', config:{style:'pills', listener:this}, items: 
			[
			{ac:'SA.Button', cmd:'edit', style:'border:0px;border-radius:0px;margin-right:4px;', 
				label:'HelloWorld', config:{theme:'blank' } },
			{ac:'SA.Button', cmd:'run', style:'border:0px;border-radius:0px;margin-right:4px;', 
				label:'Output', config:{theme:'blank' } },
			{ac:'SA.Button', cmd:'info', style:'border:0px;border-radius:0px;margin-right:4px;', 
				label:'Information', config:{theme:'blank' } }			 
			]
	};
	
	/**
	 * If defined it will allow this component to create UI based on the lists provided
	 * 
	 * config: not used
	 */
	this.createUI = function ( atomObj, allConfig )
	{
		mobileDevice = SA.utils.isMobileDevice();
		
		// set div.id == compId, this way you can always lookup component instance from divId
		myId = this.id;
		compId = this.compId;
		contentId = 'content-' + compId;
		
		comp1File = SA.getConfig ( atomObj, 'comp1');
		indexFile = SA.getConfig ( atomObj, 'index');
		infoFile = SA.getConfig ( atomObj, 'info');
		height = SA.getConfig ( atomObj, 'height' );
		
		frameCss = SA.localCss (this, 'code-frame');
		codeCss = SA.localCss (this, 'code-css');		
		ncodeCss = SA.localCss (this, 'ncode-css' );
		plainCss = SA.localCss (this, 'code-plain' );
		
		compStyle = '';
		if ( height ) {
			compStyle = 'height:' + height + 'px;';
		}
		
		var html = 
		
		getButtonsHtml () + 
					
		'<div id="' + contentId + '" class="' + frameCss + '" >' + 
			getCodeDiv () + 
		'</div>' ;
		
		return html;
	}
	
	/**
	 * Perform action
	 */
	this.performAction = function ( compId, atomObj )
	{
		if (  atomObj.cmd == 'edit' ) {
			showContent ( getCodeDiv ()  );
		}
		else if (  atomObj.cmd == 'run' ) {
			saveCodeFromEditor ();	
			showContent ( generateOutputHtml() );
		}
		else if (  atomObj.cmd == 'info' ) {
			saveCodeFromEditor ();			
			showContent (  getInfoHtml() );
		}
	}
	
	/**
	 * Show content panel 
	 */
	function showContent ( html ) 
	{
		$('#' + contentId).html ( html );
	}
	
	function getInfoHtml () 
	{
		var html = loadFile ( infoFile ); 
		var retHtml = '<div class="' + ncodeCss  + '" style="' + compStyle + '">' + html + '</div>';
		
		// encode back to html
		codeData = codeData.encodeHtml();
		
		return retHtml;
	}
	
	/**
	 * Generate output
	 */
	function generateOutputHtml () 
	{
		// Merge code with index.html
		var scriptCode = codeData;

		scriptCode += 
		'\n$(document).ready(function() {' +  
		  	'SA.loadComponent ( "demo-page", "HelloWorld" );' +  
		'}); ' ;
		
		var frameName = 'codeFrame-' + myId;
		
		var sbAtom = { name:frameName, ac:'SA.SandBox',
				config:{content:scriptCode, indexUrl:indexFile} };
		
		// gets or create new component
		var sandBox = SA.getAtomComponent ( sbAtom.name, sbAtom.ac );	
		var html = sandBox.createUI ( sbAtom, null );
		
		var retHtml = '<div class="' + ncodeCss + '" style="' + compStyle + '">' + html + '</div>';
		
		// encode back to html
		codeData = codeData.encodeHtml();
		return retHtml;
	}
	
	/**
	 * get Buttons html
	 */
	function getButtonsHtml ()
	{
		return SA.listCreateUI ( compId, buttonsList );
	}
	
	/**
	 * Save a copy of code from editor
	 */
	function saveCodeFromEditor ()
	{
		if ( mobileDevice ) {
			var $sel = $('#'+myId);
			if ( $sel.length > 0 ) {
				codeFromLastEditor = $('#'+myId).val();
			}
			codeData = codeFromLastEditor;
		}
		else {
			codeData = editor.getSession().getValue();
		}
	}
	
	/**
	 * Gets code div
	 */
	function getCodeDiv () 
	{
		if ( !codeData ) {
			// load code data only once (otherwise it should be a copy of what is in 
			// the edit panel
			codeData = loadFile ( comp1File );
			codeData = codeData.encodeHtml();
		}

		var codeId = myId;
		var divHtml = '';
		var rows = 10;
		if ( height ) {
			rows = 14;
		}
		if ( mobileDevice ) {
			divHtml = 
			'<textarea class="' + plainCss + '" style=""  rows="' + rows + '" id="' + codeId + '" >' + 
			codeData + '</textarea>'
		} 
		else {
			divHtml = 
			'<div class="' + codeCss + '" style="' + compStyle + '" id="' + codeId + '" >' + codeData + '</div>' ;
		}
		return divHtml;
	}
	
	/**
	 * Load a file from server 
	 */
	function loadFile ( filePathUrl )
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
		
	/**
	 * If defined it will be called after page is loaded (to give chance to initialize after the DOM
	 * is created) 
	 */
	this.postLoad = function ( id )
	{
		if ( !mobileDevice ) {
		
			editor = ace.edit ( myId );
			editor.setTheme("ace/theme/tomorrow");
			editor.getSession().setMode("ace/mode/javascript");
			editor.renderer.setShowGutter(false);
			
			editor.getSession().on('change', function(e) {
				//console.log ( 'edited code ')
			});
			
			// for Google formatting
			prettyPrint();
		}
	}
}

;
/**
 * Component that collapses the sections defined by the sub-lists 
 */
SA.Collapsible = function ()
{
	// create new instance every time referenced in list
	this.stateful = false;
	
	this.flow = { 
	};
	
	/**
	 * This method creates the UI based on the lists provided
	 * 
	 * items:
	 * 
	 * config:
	 * 
	 */
	this.createUI = function ( flowList, allConfig )
	{
		if ( !flowList.items || flowList.items.length==0 ) {
			return '';
		}
		
		var html = '';
		html += '<div class="panel-group" id="accordion">';
		
		for ( i=0; i<flowList.items.length; i++ ) {
			var item = flowList.items [i];
			
			var content = SA.listCreateUI ( this.compId, item );
			var id = 'coll-' + this.id + '-' + i;
			
			html += '<div class="panel panel-default">';
			html +=     '<div class="panel-heading">';
			html +=       '<h4 class="panel-title">';
			html +=       '<a data-toggle="collapse" data-parent="#accordion" href="#' + id + '">';
			html +=          item.label;
			html +=       '</a>';
			html +=       '</h4>';
			html +=     '</div>';
			html +=     '<div id="' + id + '" class="panel-collapse collapse">';
			html +=        '<div class="panel-body">';
			html +=           content; 
			html +=        '</div>';
			html +=     '</div>';
			html += '</div>';			
		}
		  
		html += '</div>';
			
		return html;
		
		
	}
	
	function loadFile ( filePathUrl, dataHandler )
	{
		var content = '';
		$.ajax({
            url : filePathUrl,
            type: 'GET',
            dataType: 'text',  
            success : function (data) {
                content = data;
            },
            error: function (xhr,status,error) {
            	alert ( error );
            }
        });		
	}	
	
}
;/**
 * Button Action component
 */
SA.Dialog = function ()
{	
	// specify if the component contains state or not
	this.stateful = true;
	
	// store obj-based templ here
	this.htmlTempl = undefined;
	
	this.css = { items: 
		[
			/* Everything else */
			{name: '@media (min-width: 481px)', items: 
				[
				{name:'.dlg', value:'width:520px;position:absolute; '+
					'top:5%;left:45%;margin-top:-30px;margin-left:-200px;padding:20px;' }
				//{name:'.arrow', value:"position:absolute;left:50%;width:50px;margin-left:-180px;" }
				]
			},
			 
			/* Mobile sizes */
			{name: '@media (max-width: 480px)', items:
				[
				{name:'.dlg', value:'width:345px;position:absolute; '+
					'top:5%;left:49%;margin-top:-30px;margin-left:-170px;padding:20px;' }
				//{name:'.arrow', value:"position:absolute;left:55%;width:50px;margin-left:-170px;" }
				]
			}			
		]
	};	
	
	var dlgId = undefined; 
	var pageId = undefined;
	var isPageStyle = undefined;
	var myFlowList = undefined;
	var dlgFormComp = undefined;
	
	/**
	 * If defined it will allow this component to create UI based on the lists provided
	 * 
	 * flow: Optional expect child list of content of dialog
	 * 
	 */
	this.createUI = function ( flowList, allConfig )
	{
		var pageConfig = SA.getConfigValue ( flowList, 'pageStyle', false );
		
		// get is page style (full page or dialog)
		var isMobile = SA.utils.isMobileDevice();
		isPageStyle = pageConfig && isMobile;
		
		// The dlgId initialized in DOM, if already there simply show it ( If NOT in DOM create one)
		if ( dlgId ) {
			return '';
		}
		
		// initialize dlgId
		dlgId = this.compId;
		pageId = dlgId + '-page';
		
		myFlowList = flowList;
		
		// fihure out title
		var title = flowList.label;
		if ( !title ) {
			title = 'No title provided in label field';
		}
		
		// content stored here
		var content = '';
		if ( flowList.items &&  flowList.items.length>0 ) {
			content = SA.listCreateUI ( this.compId, flowList.items[0], {'pageStyle':isPageStyle} );
		}
		
		// local css cls
		var ldlgcss = SA.localCss (this, 'dlg');
		//var larrow = SA.localCss (this, 'arrow');

		var retHtml = '<div class="modal fade" id="'+ dlgId + '" tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true">'+
		//'<img src="res/img/arrow-left.png" class="' +larrow +'" >' +
	
		'<div class="modal-dialog ' + ldlgcss + '" >' +
			'<div id="' + pageId + '" class="modal-content">' +
				'<div class="modal-body" style="height:100%;width:100%;" >'+
					content +  
				'</div>'+
			'</div>'+
		  '</div>'+
	    '</div>';

		// Create an element with id == flowList.name ( or eq divElementId )
		$("#page").append("<div id='" + flowList.name + "'></div>" );

		// Now append the dlg html inside the div set the html value
		$( "#"+flowList.name ).html ( retHtml );

		return undefined;
	}
	
	/**
	 * Make dialog and contents wait for processing
	 */
	this.setWaiting = function ( isWaiting )
	{
		 var form = getDialogForm();
		 if ( form ) {
			 form.setWaiting ( isWaiting );
		 }
	}
	
	/**
	 * Show and hide dialog
	 */
	this.showDialog = function ( show, title, bannerName  )
	{
		if ( isPageStyle ) {
			var appBanner = SA.getCompByIdOrName ( bannerName );
			if ( show ) 
				appBanner.showNextPage ( title, $('#'+pageId).html() );
			else
				appBanner.showPrevious ();
		}
		else {
			if ( show ) 
				$('#'+dlgId).modal({ show: show  });
			else 
				$('#'+dlgId).modal('hide');
		}
	}
	
	/**
	 * Update the form with new one (used for edit mode)
	 */
	this.updateForm = function ( valuesObj )  
	{
		 var form = getDialogForm();
		 if ( form ) {
			 form.updateForm ( valuesObj )
		 }
	}
	
	/**
	 * Show and hide form element
	 */
	this.showElement = function ( name, show)
	{ 
		 var form = getDialogForm();
		 if ( form ) {
			 form.showElement ( name, show );
		 }
	}
	
	/**
	 * Gets the underlaying dialog form 
	 */
	function getDialogForm ()
	{
		if ( !dlgFormComp ) {
			 var formName = myFlowList.items[0].name;
			 dlgFormComp = SA.comps.getCompByIdOrName(formName);
		}
		return dlgFormComp;
	}
	
	/**
	 * If defined it will be called after page is loaded (to give chance to initialize after the DOM
	 * is created) 
	 */
	this.postLoad = function ()
	{ 
	}
}
;
/**
 * Simplq Object 
 */
SA.FeedbackForm = function ()
{
    // Feedback data model definition. 
    this.model = { items: 
    	[ 
    	 {name:'feedback', label:'Feedback', items: 
    		 [
    		  {ac:'SA.Id', name:'id', label:'Id', vpat:'sys' },
    		  {ac:'SA.Name', name:'name', label:'Name', vpat:'req' },
    		  {ac:'SA.Email', name:'email', label:'Email', vpat:'req' },
    		  {ac:'SA.Comment', name:'comment', label:'Comment', vpat:'req' }
    		  ]}    		  
         ]
    };
	
	/**
	 * My view for home page
	 */
	this.flow = { items: 
		[
		 {html:'div', items:
			 [
			 {html:'div', style:'padding-top:5px' },
			 {name:'hqa.feedback', lc:'SA.FormHandler', config:{listener:this}, items: 
				 [
				 {name:'indexContent', ac:'SA.TextArea', config:{rows:6} },
				 {name:'indexCmd', ac:'SA.Button', label:'Index Data', config:{style:'default'} }
				 ]
			 }
			 ]
		 }
		]
	};
	
	/**
	 * This method creates the UI based on the lists provided
	 * 
	 * param name: imageUrl
	 * param name: ilists
	 *  
	 */
	this.createUI = function ( flowList, config )
	{
		var html = SA.listCreateUI ( this.compId, this.flow, config );
		
		html += SA.createHtmlEnd (this.flow);
		return html;
	}  
	
	/**
	 * Notify when form is submitted
	 */
	this.notifySubmit = function (formobjectList )
	{
		//console.log ( 'form submitted: ' + JSON.stringify (formobjectList) );
		var indexData = formobjectList [0].indexContent;
		
		// send response
		var payload = '';

		// if invalid json then assume a string
		try {
			payload = JSON.parse(indexData);
		}
		catch ( err ) {
			payload = indexData;
		}
		
		var respObj = {};
		respObj.index = payload;
		
		//console.log ( 'Submit index data: ' + indexData );
		SA.server.sendString ( JSON.stringify (respObj) );
	}
}

;
/**
 * Create data entry form handler
 */
SA.FormHandler = function ()
{
	// create new instance every time referenced in list
	this.stateful = true;
	
	// form listener
	var formListener ;
	
	// components in this form
	var compsList = new Array ();
	
	// define my form id
	var myId ;
	
	// my current flow list
	var myFlowList;
	
	// local css names
	var formCss ;
	var headerCss;
	
	// my comp
	var thisComp ;
	var title ;
	var pageStyle ;
	
	// comp trigger action
	var triggeringComp ;
	
	this.css = { items: 
		[
			/* Everything else */
			{name: '@media (min-width: 481px)', items: 
				[
				{name:'.header', value:'padding:0px;font-size:135%;margin:0 0 0 0;'},				 
				{name:'.form', value:'width:90%;padding:15px;font-size:110%;'}				 
				]
			},
			 
			/* Mobile sizes */
			{name: '@media (max-width: 480px)', items: 
				[
				{name:'.header', value:'padding:0px;font-size:130%;margin:0 0 0 0;'},			 				 
				{name:'.form', value:'width:90%;padding-top:5px;padding-bottom:10px;font-size:85%;'}
				]
			}
		]
	};	
	
	/**
	 * This method creates the UI based on the lists provided
	 * 
	 * items:
	 * All Action Atom objects in a list will be placed in form
	 * html elements will be static elements on form
	 * 
	 * config:
	 * listener: the listener component
	 * title: login form title
	 * 
	 */
	this.createUI = function ( flowList, allConfig )
	{
		myFlowList = flowList;
		thisComp = this;
		formListener = SA.getConfigValue ( flowList, 'listener' );
		
		if ( !flowList.items )
			return;
		
		// get form ID
		myId = this.compId;
		if ( flowList.name ) {
			myId = flowList.name;
		}
		
		// local form css
		formCss = SA.localCss ( this, 'form' );
		headerCss = SA.localCss ( this, 'header' );
		
		// page style ?
		pageStyle = SA.getConfigValue ( flowList, 'pageStyle', false );
		
		// col-md-8 col-md-offset-2
		
		var retHtml;
		if ( pageStyle ) {
			retHtml =
			'<div id="' + myId + '" class="container col-md-8 col-md-offset-2" >'  +
				createFormUI ( flowList ) + 
			'</div>';
		}
		else {
			retHtml =
			'<div id="' + myId + '" class="container ' + formCss + '" >'  +
				createFormUI ( flowList ) + 
			'</div>';
		}
		return retHtml;
	}
	
	/**
	 * Updates form data
	 */
	this.updateForm = function ( dataObj )
	{
		// merge my data list + data obj
		SA.utils.mergeList(myFlowList, dataObj);
		var retHtml = createFormUI ( myFlowList );
		
		// update ui
		$( '#' + myId ).html (retHtml);
	}
	
	/**
	 * Creates form UI 
	 */
	function createFormUI ( flowList )
	{
		compsList = new Array ();
		var atomList = flowList.items;

		// set div.id == compId, this way you can always lookup component instance from divId
		var divId = this.compId;
		title = SA.getConfigValue ( flowList, 'title', 'Form Title Goes Here' );
		
		var titleLine = '';
		if ( !pageStyle ) {
			titleLine = 
			'<div class="panel-heading" style="border-bottom:0px;">' + 
				'<p class="' + headerCss + '" >' + title + '</p>' + 
			'</div>' ;
		}
		
		var retHtml = 
		'<div class="panel panel-default" style="margin-bottom:0px;border-width:0px;">' +		
			titleLine +			 		
			'<div style="padding-top:10px" />' +
			'<div class="row">' +
				'<div class="col-md-12">' +
			  	    '<div>' + 
					   '<form class="form-horizontal" action="" method="post">' ;
				  		   //'<div style="padding-bottom:15px;" />' ;
				  
		// now add all the buttons inside
		var j = 0;
		for ( j=0; j<atomList.length; j++ ) {
			var lobj = atomList [j];
			
			// if not atom component, just render  
			if ( !lobj.ac ) {
				retHtml += SA.listCreateUI ( lobj.compId, lobj, undefined, true );
				continue;
			}
			
			// get atom comp
			var atomComp = SA.getAtomComponent ( lobj.name, lobj.ac );
			compsList.push ( atomComp );
			
			// if button implements setActionListener method, call it and asso my self with it
			if ( atomComp.setActionListener ) 
				atomComp.setActionListener ( thisComp );
				
			// get html
			var html = atomComp.createUI ( lobj, null );
			
			retHtml += html;
		}
		retHtml += '</form></div></div></div></div>';

		return retHtml;
	}
	
	/**
	 * show / hide form element
	 */
	this.showElement= function ( elementName, show ) 
	{
		if ( !show ) {
			$ ('#' + elementName).hide ();
		}
		else { 
			$ ('#' + elementName).show ();
		}
	}
	
	/**
	 * Component that gets notified about form events
	 */
	this.addFormListener = function ( listener )
	{
		formListener = listener;
	}
	
	/**
	 * Set or reset waiting (when action is being perform)
	 */
	this.setWaiting = function ( isWaiting )
	{
		if ( triggeringComp && triggeringComp.setWaiting ) {
			triggeringComp.setWaiting ( isWaiting );
		}
		if ( isWaiting) {
			$('#' + myId).find(':input').prop('disabled', true);
		}
		else {
			$('#' + myId).find(':input').prop('disabled', false);
		}
	}
	
	/**
	 * The child components call this when an action is performed (i.e. key press)
	 */
	this.performAction = function ( compId, actionAtom, actionComp )
	{
		//console.log ( "action performed ");
		
		// notify form listener 
		if ( formListener ) {
			if ( formListener.notifySubmit ) {
				triggeringComp = actionComp;
				
				// get data objects from form
				var dataObj = this.getFormData( compsList );

				// pass to listener
				formListener.notifySubmit (actionAtom, myFlowList.items, dataObj );
			}
		}
	}
	
	/**
	 * Gets form data from all child components 
	 */
	this.getFormData = function ( compsList )
	{
		var data = {};
		
		for (i=0; i<compsList.length; i++ ) {
			
			var c = compsList [i];
			// component need a name to be placed on form
			if ( c.getName && c.getValue ) {
				var name = c.getName();
				var value = c.getValue();
				if ( value && value != '' ) {
					data [ name ] = value ;
				}
			}
		}
		return data;
	}
	
	/**
	 * If defined it will be called after page is loaded (to give chance to initialize after the DOM
	 * is created)
	 */ 
	this.postLoad = function ()
	{
	}
}
;
/**
 * Button Action component
 */
SA.HSlider = function ()
{	
	// specify if the component contains state or not
	this.stateful = true;
	
	// local vars
	var myId ;
	var localCss;
	var numberItems;
	var lastPageId;
	
	this.css = { items: 
		[
        /* Everything else */
        {name: '@media (min-width: 481px)', items: 
            [
            {name:'.my-gallery', value:'margin-left:0px;margin-right:0px;' }
            ]  
        },

        /* Mobile sizes */
        {name: '@media (max-width: 480px)', items: 
            [
            {name:'.my-gallery', value:'margin-left:0px;margin-right:0px;' }
            ]
        }		 
		]
	};	
		
	/**
	 * If defined it will allow this component to create UI based on the lists provided
	 * 
	 * config: 
	 * flow: expect child lists of slides
	 */
	this.createUI = function ( flowList, allConfig )
	{
		// the id is set by the system (either compId or name)
		myId = this.compId;
		
		localCss = SA.localCss ( this, 'my-gallery');
		
		var html = 
		'<div id="' +myId + '" class="' + localCss + '">';
		
		numberItems = 0;
		
		if ( flowList.items ) {
			for ( j=0; j<flowList.items.length; j++  ) {  
			
				// single carousel page
				var ttlist = flowList.items[j];
				var listHtml = SA.listCreateUI ( this.compId, ttlist );
				lastPageId = 'page-' + ttlist.config.id;
				
				html += '<div id="' + lastPageId + '" >' + listHtml + '</div>';
			}
			numberItems = flowList.items.length;
		}
		html += '</div>' ;
		
		return html;
	}	
	
	/**
	 * Add new page to the end
	 */
	this.addPage = function ( uniqueId, pageHtml )
	{
		// Add a slide
		//var html = '<div id="page-' + uniqueId + '" class="slick-side slick-active" >' + pageHtml + '</html>';
		var html = '<div id="page-' + uniqueId + '" >' + pageHtml + '</html>';
		var $comp = $( '.'+localCss );
		//$comp.slick ( {infinite: true} );
		
		//$('.your-element').slick('slickAdd',
		$comp.slick ( 'slickAdd', html );
		//$comp.find ( ".slick-track" ).append ( html );
		$comp.slick ( 'slickGoTo', numberItems );
		
		numberItems++;
	}
	
	/**
	 * Remove a page (need to select previous page)
	 */
	this.delPage = function ( uniqueId )
	{
		var sel = $('#page-' + uniqueId);
		sel.remove();
		numberItems--;
	}
	
	/**
	 * Reset content of a page with pageId and new html
	 */
	this.resetPage = function ( pageId, newHtml )
	{
		$('#page-' + pageId).html ( newHtml );
	}
	
	/**
	 * Go to next page
	 */
	this.nextPage = function ()
	{
		$('#'+myId).carousel( 'next' );
	}
	
	/**
	 * Goto prev page
	 */
	this.prevPage = function ()
	{
		$('#'+myId).carousel( 'prev' );
	}
	
	/**
	 * Show the specific page by idx
	 */
	this.showPage = function ( idx )
	{
		if ( idx<0 || idx >= numberItems) {
			idx = numberItems -1;
		}
		// TODO: Show page
	}
	
	/**
	 * Set a carousel listener
	 */
	this.setListener = function ( l ) 
	{
		listener = l;
	}
	
	/**
	 * If defined it will be called after page is loaded (to give chance to initialize after the DOM
	 * is created) 
	 */
	this.postLoad = function ()
	{
		$('.'+localCss).slick ({
			infinite: false,
			touchThreshold: 5,
			arrows: false,
			mobileFirst: true,
			respondTo: 'min'
        });

		var lastIndex = -1;
		$('.'+localCss).on('afterChange', function(slider,slide) {
			// pass slide event to listener
			var index = slide.currentSlide;
			if ( listener && listener.slideEvent ) {
				if ( index != lastIndex ) {
					listener.slideEvent ( index );
					lastIndex = index;
				}
			}
		});
	}
}
;
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
;
/**
 * Atom Component for doing searches on the server resulting in Predictive search as it 
 * shows results from the server as you tyoe. The server component is running on 
 * java-based server 
 */
SA.SearchComp = function ()
{	
	// specify if the component contains state or not
	// TODO: This does not work for scope
	//this.stateful = true;
	
	// state variables
	this.atomObj = undefined;
	this.actionListener = undefined;
	this.selected = false;
	this.listenerComp = undefined;
	
	// remember value entered
	this.fieldValue = '';
	
	// search result HTML
	this.searchHtml = '';
	
	// CSS defined here exactly the same as css syntax but as javascript array of objects. 
	// Also these css class names are unique to this class. For example if another class has 
	// the name 'round-clear' it would be a different name because the names are distinguished 
	// based on unique class component type ids
	this.css = { 
	};
	
	/**
	 * If defined it will allow this component to create UI based on the lists provided
	 * 
	 * config: not used
	 */
	this.createUI = function ( atomObj, allConfig )
	{
		this.atomObj = atomObj;
		
		// set div.id == compId, this way you can always lookup component instance from divId
		var divId = this.compId;
		
		var valStr = '';
		if ( this.fieldValue != '' ) {
			valStr = 'value="' + this.fieldValue + '"';
		}
		
		var html =
		'<div class="col-md-10" style="padding-left:0px;">'+
		  '<div class="form-group" style="margin-bottom: 0px;" >'+
		    '<input id="'+ divId + '"' + valStr +' type="text" class="form-control" placeholder="search for something">'+
		  '</div>'+
		  '<div id="rearch-results" >' + this.searchHtml + '</div>'+
		'</div>';
						
		return html;
	}
	
	/**
	 * If defined it will allow this component to be an action listener
	 */
	this.setActionListener = function ( listenerComp )
	{
		this.listenerComp = listenerComp;
	}
	
	/**
	 * Adds an action listener
	 */
	this.showSelected = function ( selected )
	{
		this.selected = selected;
		var id = this.compId;
		
		if ( selected ) {
		    $("#" + id).addClass ( 'active' );
		}
		else {
		    $("#" + id).removeClass ( 'active' );
		}
	}
	
	/**
	 * Called when a search expression changes
	 */
	this.expressionChanged = function ( expr )
	{
		this.fieldValue = expr;
		
		// send exp (expression) msg to server
		SA.server.sendString ( "{'exp':'" + expr + "'}" );
		
		if ( expr.length == 0 ) {
			this.searchHtml = '';
			$('#rearch-results').html ('');
		}
	}
	
	this.onMessage = function ( msgObj )
	{
		// recv exp_response message
		if ( msgObj.exp_response ) {
			this.formatResults( msgObj.exp_response )
		
			// click suggest 
			$(".s-suggest").click(function( e ){
				var idx = e.target.id.substring (2);
				var item = msgObj.exp_response.cats [idx];
				
				// send suggest msg to server with pattern
				SA.server.sendString ( "{'suggest':'" + item.catsHash + "'}" );
			});
			
			// click results
			$(".s-result").click(function( e ) {
				var idx = e.target.id.substring (2);
				var item = msgObj.exp_response.results [idx];
				//console.debug ('res click:' +  e.target.id );
				if ( item && item.accessUrl ) {
					window.open(item.accessUrl, '_blank');
				}
			});
		}
		// suggest response
		else if ( msgObj.suggest_response ) {
			// if only one result, open in window
			if ( msgObj.suggest_response.results.length == 1 ) {
				var url = msgObj.suggest_response.results[0].accessUrl;
				if ( url ) {
					window.open(url, '_blank');
				}
			}
		}
	}
	
	this.formatResults = function ( respObj )
	{
		this.searchResults = respObj;
		
		var html1 = '';
		var html2 = '';
		
		var maxResults = 5;
		var count = 0;
		
		// cat paths html list
		if ( respObj.cats && respObj.cats.length > 0 ) {
			var cats = respObj.cats;
			
			html1 = '<div class="list-group">';
			for ( i=0; i<cats.length && count<maxResults; i++ ) 
			{
				html1 += '<a href="#" style="color:#3399FF;border:1px solid #EFEFEF;" class="list-group-item s-suggest" id="s-'+i+'">'+ 
					cats[i].detail  +'</a>';
				
				count++;
			} 
			html1 += '</div>';
		}
		
		// results html path
		if ( respObj.results && respObj.results.length > 0 ) {
			var results = respObj.results;

			html2 = '<div class="list-group">';
			for ( i=0; i<results.length && count<maxResults; i++ ) 
			{
				html2 += '<a href="#" style="border:1px solid #EFEFEF;" class="list-group-item s-result" id="r-'+i+'">'+ 
					results[i].detail  +'</a>';
				
				count++;
			}
			html2 += '</div>';
		}
		
		// if any html then show it, otherwise clear 
		if ( html1.length>0 || html2.length>0 ) {
			this.searchHtml = '<div class="panel panel-default">' + html1 + html2 + '</div>';		
			$('#rearch-results').html (this.searchHtml);
		}
		else {
			this.searchHtm = '';
			$('#rearch-results').html ('');
		}
	}
	
	this.getName = function()
	{
		return this.atomObj.name;
	}
	
	/**
	 * If defined it will be called after page is loaded (to give chance to initialize after the DOM
	 * is created) 
	 */
	this.postLoad = function ()
	{
		// add me as listener to get connection events
		//SA.server.setConnectionListener ( this );
		
		// compId == div.id
		var divId = this.compId;
		
		// keydown get chars types
		$('#' + divId ).on('keypress', function(e) {
			var ch = e.which;			
		});
		
		// keyup check for controls (backspace, return)
		$('#' + divId ).on('keyup', function(e) {
			
			var thisComp = SA.comps.getCompById(divId)
			if ( thisComp )
				thisComp.expressionChanged ( this.value );

			// backspace 
			if ( e.which == 8 ) {
				//console.log( 'value: ' + val +', divid: ' + divId );
			}
		});
		
	}
}
;
/**
 * Create tabs from member lists that has horizontal tabs
 */
SA.TabsHandler = function ()
{
	// create new instance every time referenced in list
	this.stateful = true;
	
	// button id array to keep track of state of my buttons
	this.buttonIds = new Array ();
	this.currentTab = 0;
	
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

		// load the ilist
		var ilist = SA.getList ( actionAtom.ilist )
		
		// now load the component's target list
		var tlist = SA.getList ( actionAtom.tlist );
		
		// get the html UI from ilist
		var uiHtml = SA.listCreateUI ( this.compId, ilist );
		
		// map new ui to tlist name ( div id )
		var tdiv = $('#' + tlist.name );
		tdiv.html ( uiHtml );
		
		// history
		//console.log ( 'push state: ' + '#!/' + actionAtom.ilist);
		// TODO: We need to enable this
		//history.pushState ( actionAtom.ilist, undefined, '#!/' + actionAtom.ilist );  
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
