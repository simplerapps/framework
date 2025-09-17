
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
