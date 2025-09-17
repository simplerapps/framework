
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
