
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

