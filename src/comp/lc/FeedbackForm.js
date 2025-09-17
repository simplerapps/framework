
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

